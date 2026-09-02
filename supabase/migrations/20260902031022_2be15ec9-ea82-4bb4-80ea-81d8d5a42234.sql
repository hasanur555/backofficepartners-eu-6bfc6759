CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- First signed-in user can claim admin while no admin exists yet.
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(auth.uid(), 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE TABLE public.site_prices (
  id text PRIMARY KEY,
  "group" text NOT NULL,
  label text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_prices TO anon;
GRANT SELECT, UPDATE ON public.site_prices TO authenticated;
GRANT ALL ON public.site_prices TO service_role;
ALTER TABLE public.site_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prices are public" ON public.site_prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update prices" ON public.site_prices FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER site_prices_updated_at BEFORE UPDATE ON public.site_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_prices (id, "group", label, amount, unit, sort_order) VALUES
  ('svc_ota_monthly',   'Service cards', 'OTA Platform Management — monthly', 349, '/ month per platform', 10),
  ('svc_ota_setup',     'Service cards', 'OTA Platform Management — one-time setup', 199, 'one-time', 11),
  ('svc_pms_monthly',   'Service cards', 'Property Management Software — monthly', 449, '/ month per property', 20),
  ('svc_pms_setup',     'Service cards', 'Property Management Software — setup from', 299, 'one-time', 21),
  ('svc_audit',         'Service cards', 'Channel Manager Audit', 599, 'one-time', 30),
  ('svc_marketing',     'Service cards', 'Specialist Travel Marketing — monthly', 699, '/ month', 40),
  ('tier_starter',      'Retainer tiers', 'Starter — up to 1,000 bookings/mo', 1499, '/ month', 10),
  ('tier_growth',       'Retainer tiers', 'Growth — 1,001 to 3,000 bookings/mo', 2999, '/ month', 20),
  ('tier_scale',        'Retainer tiers', 'Scale — 3,001+ enterprise', 4999, '/ month', 30),
  ('mod_a',             'Retainer modules', 'Module A — Customer support & conversations', 0, '/ month', 10),
  ('mod_b',             'Retainer modules', 'Module B — Real-time ticket procurement', 150, '/ month', 20),
  ('mod_c',             'Retainer modules', 'Module C — OTA channel & listing management', 200, '/ month', 30),
  ('mod_d',             'Retainer modules', 'Module D — Website widgets & tech stack maintenance', 250, '/ month', 40),
  ('sa_seo',            'Standalone projects', 'Listing SEO optimization', 350, 'per listing', 10),
  ('sa_bokun',          'Standalone projects', 'Bókun full setup', 650, 'flat setup', 20),
  ('sa_fast',           'Standalone projects', 'OTA fast approval setup', 250, 'per product upload', 30),
  ('sa_rescue',         'Standalone projects', 'Previous listing audit & rescue', 450, 'flat', 40),
  ('discount_low_season','Discounts', 'Low season discount', 50, 'off every estimate (0 = disabled)', 10);