import { createContext, useContext } from "react";

/** Price map: id -> amount in EUR. Keys match rows in the `site_prices` table. */
export type PriceMap = Record<string, number>;

export const DEFAULT_PRICES: PriceMap = {
  svc_ota_monthly: 349,
  svc_ota_setup: 199,
  svc_pms_monthly: 449,
  svc_pms_setup: 299,
  svc_audit: 599,
  svc_marketing: 699,
  tier_starter: 1499,
  tier_growth: 2999,
  tier_scale: 4999,
  mod_a: 0,
  mod_b: 150,
  mod_c: 200,
  mod_d: 250,
  sa_seo: 350,
  sa_bokun: 650,
  sa_fast: 250,
  sa_rescue: 450,
  discount_low_season: 50,
};

export const PricesContext = createContext<PriceMap>(DEFAULT_PRICES);

/** Returns a lookup function `p(id)` with defaults as fallback. */
export function usePrices() {
  const map = useContext(PricesContext);
  return (id: string): number => {
    const v = map[id];
    return typeof v === "number" && Number.isFinite(v) ? v : (DEFAULT_PRICES[id] ?? 0);
  };
}

export const eur = (n: number) => `€${Math.round(n).toLocaleString("en-IE")}`;
