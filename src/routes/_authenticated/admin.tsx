import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ShieldCheck, LogOut, Save, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Price admin — Travel BackOffice Partners" },
      { name: "description", content: "Edit the service, retainer and project prices shown on the Travel BackOffice Partners website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Price admin — Travel BackOffice Partners" },
      { property: "og:description", content: "Edit website prices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type PriceRow = {
  id: string;
  group: string;
  label: string;
  amount: number;
  unit: string;
  sort_order: number;
  updated_at: string;
};

const GROUP_ACCENT: Record<string, string> = {
  "Service cards": "var(--emerald)",
  "Retainer tiers": "var(--teal-glow)",
  "Retainer modules": "var(--sky)",
  "Standalone projects": "var(--violet)",
  Discounts: "var(--amber)",
};

function AdminPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    setEmail(u.user?.email ?? "");
    // First signed-in user becomes admin; afterwards simply reports admin status.
    const { data: claimed } = await supabase.rpc("claim_first_admin");
    setIsAdmin(Boolean(claimed));
    const { data, error } = await supabase
      .from("site_prices")
      .select("*")
      .order("group")
      .order("sort_order");
    if (error) toast.error(error.message);
    const list = (data ?? []).map((r) => ({ ...r, amount: Number(r.amount) })) as PriceRow[];
    setRows(list);
    setDraft(Object.fromEntries(list.map((r) => [r.id, String(r.amount)])));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const groups = useMemo(() => {
    const order = ["Service cards", "Retainer tiers", "Retainer modules", "Standalone projects", "Discounts"];
    const m = new Map<string, PriceRow[]>();
    for (const r of rows) m.set(r.group, [...(m.get(r.group) ?? []), r]);
    return [...m.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  }, [rows]);

  const changed = rows.filter((r) => Number(draft[r.id]) !== r.amount && draft[r.id] !== "");

  const save = async () => {
    if (changed.length === 0) return;
    for (const r of changed) {
      const v = Number(draft[r.id]);
      if (!Number.isFinite(v) || v < 0) return toast.error(`Invalid amount for “${r.label}”`);
    }
    setSaving(true);
    const results = await Promise.all(
      changed.map((r) => supabase.from("site_prices").update({ amount: Number(draft[r.id]) }).eq("id", r.id)),
    );
    setSaving(false);
    const failed = results.find((x) => x.error);
    if (failed?.error) return toast.error(failed.error.message);
    toast.success(`${changed.length} price${changed.length > 1 ? "s" : ""} updated — live on the website now.`);
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen text-foreground">
      <Toaster />
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 font-display font-bold">
            <ShieldCheck className="h-5 w-5 text-[var(--teal-glow)]" />
            Price admin
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{email}</span>
            <Link to="/" className="hover:underline underline-offset-4">View site</Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Website prices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Amounts are in EUR. Changes appear on the public site immediately after saving.
          </p>
        </div>

        {isAdmin === false && (
          <Card className="glass border-[var(--rose)]/40">
            <CardContent className="py-4 text-sm">
              Your account is signed in but is not an administrator. Prices are read-only for you.
            </CardContent>
          </Card>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading prices…</p>
        ) : (
          groups.map(([group, list]) => {
            const accent = GROUP_ACCENT[group] ?? "var(--teal-glow)";
            return (
              <Card key={group} className="glass" style={{ borderColor: `color-mix(in oklab, ${accent} 35%, transparent)` }}>
                <CardHeader>
                  <CardTitle className="font-display text-lg" style={{ color: accent }}>{group}</CardTitle>
                  <CardDescription>
                    {group === "Discounts" ? "Set to 0 to hide the low-season offer." : "Shown on the website and used in the configurator."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-white/5">
                  {list.map((r) => {
                    const dirty = Number(draft[r.id]) !== r.amount && draft[r.id] !== "";
                    return (
                      <div key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-medium">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.unit}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">€</span>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="decimal"
                            disabled={!isAdmin}
                            value={draft[r.id] ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [r.id]: e.target.value }))}
                            className="w-32 text-right tabular-nums"
                            style={dirty ? { borderColor: accent } : undefined}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })
        )}

        {isAdmin && !loading && (
          <div className="sticky bottom-4 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={changed.length === 0 || saving}
              onClick={() => setDraft(Object.fromEntries(rows.map((r) => [r.id, String(r.amount)])))}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button className="btn-teal" disabled={changed.length === 0 || saving} onClick={save}>
              <Save className="h-4 w-4 mr-1" /> {saving ? "Saving…" : `Save ${changed.length || ""} change${changed.length === 1 ? "" : "s"}`}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
