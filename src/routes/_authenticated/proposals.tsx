import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ProposalDocument } from "@/components/ProposalDocument";
import {
  ACCOUNT_CREATION_FEE, COMPLEX_FEE_MAX, COMPLEX_FEE_MIN, COUPONS, OTA_PLATFORMS, SERVICE_CATALOG, STANDARD_PRODUCT_FEE,
  computeTotals, emptyProposal, lineTotal, money, uid, type ProposalData,
} from "@/lib/proposal";
import { Copy, FileText, Pencil, Plus, Printer, Save, Trash2, FilePlus2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/proposals")({
  component: Builder,
  head: () => ({
    meta: [
      { title: "Invoice & Proposal Builder — Travel BackOffice Partners" },
      { name: "description", content: "Build client invoices and proposals from the service catalog." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Invoice & Proposal Builder" },
      { property: "og:description", content: "Build client invoices and proposals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Saved = { id: string; slug: string; title: string; updated_at: string };

function Builder() {
  const [d, setD] = useState<ProposalData>(emptyProposal);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [current, setCurrent] = useState<{ id: string; slug: string } | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [ota, setOta] = useState<Record<string, { on: boolean; products: number; fee: number; account: boolean; sync: boolean }>>(
    Object.fromEntries(OTA_PLATFORMS.map((p) => [p.key, { on: false, products: 1, fee: p.complex ? COMPLEX_FEE_MIN : STANDARD_PRODUCT_FEE, account: false, sync: false }])),
  );
  const [syncFee, setSyncFee] = useState(100);
  const [custom, setCustom] = useState({ name: "", description: "", rate: "", qty: "1" });
  const t = computeTotals(d);

  const loadList = async () => {
    const { data } = await supabase.from("proposals").select("id, slug, title, updated_at").order("updated_at", { ascending: false }).limit(30);
    setSaved((data ?? []) as Saved[]);
  };
  useEffect(() => { loadList(); }, []);

  const set = <K extends keyof ProposalData>(k: K, v: ProposalData[K]) => setD((p) => ({ ...p, [k]: v }));
  const addItems = (items: ProposalData["items"]) => setD((p) => ({ ...p, items: [...p.items, ...items] }));

  const addOta = () => {
    const items: ProposalData["items"] = [];
    for (const p of OTA_PLATFORMS) {
      const o = ota[p.key];
      if (!o.on) continue;
      items.push({ id: uid(), name: `${p.name} product setup`, description: p.complex ? "Complex / localized platform" : "Standard platform", rate: o.fee, qty: o.products, unit: "/product" });
      if (o.account) items.push({ id: uid(), name: `${p.name} account creation`, description: "Supplier account opening", rate: ACCOUNT_CREATION_FEE, qty: 1, unit: "flat" });
      if (o.sync) items.push({ id: uid(), name: `${p.name} Bokun / channel manager live sync`, description: "Live calendar & availability sync", rate: syncFee, qty: 1, unit: "flat" });
    }
    if (!items.length) return toast.error("Select at least one platform");
    addItems(items);
    toast.success(`${items.length} line(s) added`);
  };

  const addCustom = () => {
    const rate = Number(custom.rate), qty = Number(custom.qty);
    if (!custom.name.trim() || !Number.isFinite(rate) || rate < 0 || !(qty > 0)) return toast.error("Enter name, rate and quantity");
    addItems([{ id: uid(), name: custom.name.trim(), description: custom.description.trim(), rate, qty }]);
    setCustom({ name: "", description: "", rate: "", qty: "1" });
  };

  const save = async () => {
    const title = `${d.number} · ${d.client.company || d.client.name || "Untitled"}`;
    const payload = { title, data: d as never };
    const res = current
      ? await supabase.from("proposals").update(payload).eq("id", current.id).select("id, slug").single()
      : await supabase.from("proposals").insert(payload).select("id, slug").single();
    if (res.error) return toast.error(res.error.message);
    setCurrent(res.data);
    toast.success("Saved");
    loadList();
    return res.data;
  };

  const copyLink = async () => {
    const r = current ?? (await save());
    if (!r) return;
    const link = `${window.location.origin}/p/${r.slug}`;
    await navigator.clipboard.writeText(link);
    toast.success("Public link copied");
  };

  const open = async (id: string) => {
    const { data } = await supabase.from("proposals").select("id, slug, data").eq("id", id).single();
    if (!data) return;
    setD({ ...emptyProposal(), ...(data.data as unknown as ProposalData) });
    setCurrent({ id: data.id, slug: data.slug });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this proposal?")) return;
    await supabase.from("proposals").delete().eq("id", id);
    if (current?.id === id) { setCurrent(null); setD(emptyProposal()); }
    loadList();
  };

  return (
    <div className="min-h-screen text-foreground">
      <Toaster />
      <header className="no-print sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2 font-display font-bold"><FileText className="h-5 w-5 text-[var(--teal-glow)]" /> Invoice & Proposal Builder</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-white/10 p-0.5">
              <button onClick={() => setView("edit")} className={`rounded-md px-3 py-1 text-xs ${view === "edit" ? "bg-[var(--teal)] text-primary-foreground" : ""}`}><Pencil className="inline h-3 w-3 mr-1" />Edit Builder</button>
              <button onClick={() => setView("preview")} className={`rounded-md px-3 py-1 text-xs ${view === "preview" ? "bg-[var(--teal)] text-primary-foreground" : ""}`}><FileText className="inline h-3 w-3 mr-1" />Printable View</button>
            </div>
            <Button size="sm" variant="outline" onClick={() => { setCurrent(null); setD(emptyProposal()); }}><FilePlus2 className="h-3.5 w-3.5 mr-1" />New</Button>
            <Button size="sm" variant="outline" onClick={save}><Save className="h-3.5 w-3.5 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={copyLink}><Copy className="h-3.5 w-3.5 mr-1" />Copy Public Link</Button>
            <Button size="sm" onClick={() => { setView("preview"); setTimeout(() => window.print(), 100); }}><Printer className="h-3.5 w-3.5 mr-1" />PDF Export</Button>
            <Link to="/admin" className="text-xs text-muted-foreground hover:underline">Prices</Link>
          </div>
        </div>
      </header>

      {view === "preview" ? (
        <main className="mx-auto max-w-4xl px-4 py-8"><ProposalDocument data={d} /></main>
      ) : (
        <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Panel title="Document & client" accent="var(--sky)">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Type">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={d.mode} onChange={(e) => set("mode", e.target.value as ProposalData["mode"])}>
                    <option value="proposal">Proposal</option><option value="invoice">Invoice</option>
                  </select>
                </Field>
                <Field label="Number"><Input value={d.number} onChange={(e) => set("number", e.target.value)} /></Field>
                <Field label="Currency">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={d.currency} onChange={(e) => set("currency", e.target.value as ProposalData["currency"])}>
                    <option value="EUR">€ EUR</option><option value="USD">$ USD</option>
                  </select>
                </Field>
                {(["name", "company", "email", "country", "whatsapp"] as const).map((k) => (
                  <Field key={k} label={k === "whatsapp" ? "WhatsApp" : `Client ${k}`}>
                    <Input value={d.client[k]} onChange={(e) => set("client", { ...d.client, [k]: e.target.value })} />
                  </Field>
                ))}
              </div>
            </Panel>

            <Panel title="A · Service catalog" accent="var(--teal-glow)">
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_CATALOG.map((s) => (
                  <button key={s.key} onClick={() => addItems(s.lines.map((l) => ({ id: uid(), name: `${s.name}${s.lines.length > 1 ? ` — ${l.label}` : ""}`, description: s.description, rate: l.rate, qty: 1, unit: l.unit })))}
                    className="rounded-xl border border-white/10 p-3 text-left transition hover:border-[var(--teal-glow)]">
                    <div className="flex items-center justify-between font-semibold">{s.name}<Plus className="h-4 w-4 text-[var(--teal-glow)]" /></div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                    <div className="mt-1 text-xs text-[var(--emerald)]">{s.lines.map((l) => (l.rate ? `${money(l.rate, d.currency)} ${l.unit}` : "Custom quote")).join(" · ")}</div>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="B · OTA channel integration" accent="var(--violet)">
              <div className="space-y-2">
                {OTA_PLATFORMS.map((p) => {
                  const o = ota[p.key];
                  const up = (patch: Partial<typeof o>) => setOta((s) => ({ ...s, [p.key]: { ...o, ...patch } }));
                  return (
                    <div key={p.key} className={`flex flex-wrap items-center gap-3 rounded-lg border p-2 text-sm ${o.on ? "border-[var(--violet)]/60" : "border-white/10"}`}>
                      <label className="flex w-36 items-center gap-2 font-medium"><input type="checkbox" checked={o.on} onChange={(e) => up({ on: e.target.checked })} />{p.name}</label>
                      <label className="flex items-center gap-1 text-xs">Products<Input type="number" min={1} className="h-8 w-16" value={o.products} onChange={(e) => up({ products: Math.max(1, Number(e.target.value)) })} /></label>
                      <label className="flex items-center gap-1 text-xs">Fee/product
                        {p.complex
                          ? <Input type="number" min={COMPLEX_FEE_MIN} max={COMPLEX_FEE_MAX} className="h-8 w-20" value={o.fee} onChange={(e) => up({ fee: Math.min(COMPLEX_FEE_MAX, Math.max(COMPLEX_FEE_MIN, Number(e.target.value))) })} />
                          : <span className="font-semibold">{money(o.fee, d.currency)}</span>}
                      </label>
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={o.account} onChange={(e) => up({ account: e.target.checked })} />Account creation +{ACCOUNT_CREATION_FEE}</label>
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={o.sync} onChange={(e) => up({ sync: e.target.checked })} />Bokun live sync</label>
                    </div>
                  );
                })}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">Live sync fee per platform<Input type="number" min={0} className="h-8 w-20" value={syncFee} onChange={(e) => setSyncFee(Math.max(0, Number(e.target.value)))} /></label>
                  <Button size="sm" onClick={addOta}><Plus className="h-3.5 w-3.5 mr-1" />Add OTA lines</Button>
                </div>
                <p className="text-xs text-muted-foreground">Complex platforms (Trip.com, Klook, Rakuten): {COMPLEX_FEE_MIN}–{COMPLEX_FEE_MAX} per product.</p>
              </div>
            </Panel>

            <Panel title="C · Custom line" accent="var(--amber)">
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_100px_80px_auto]">
                <Input placeholder="Service name" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
                <Input placeholder="Description" value={custom.description} onChange={(e) => setCustom({ ...custom, description: e.target.value })} />
                <Input placeholder="Rate" type="number" value={custom.rate} onChange={(e) => setCustom({ ...custom, rate: e.target.value })} />
                <Input placeholder="Qty" type="number" value={custom.qty} onChange={(e) => setCustom({ ...custom, qty: e.target.value })} />
                <Button onClick={addCustom}><Plus className="h-4 w-4" /></Button>
              </div>
            </Panel>

            <Panel title="Line items" accent="var(--emerald)">
              {d.items.length === 0 ? <p className="text-sm text-muted-foreground">Nothing added yet.</p> : (
                <div className="space-y-2">
                  {d.items.map((i, idx) => (
                    <div key={i.id} className="grid items-center gap-2 sm:grid-cols-[1fr_100px_70px_100px_auto]">
                      <Input value={i.name} onChange={(e) => { const items = [...d.items]; items[idx] = { ...i, name: e.target.value }; set("items", items); }} />
                      <Input type="number" value={i.rate} onChange={(e) => { const items = [...d.items]; items[idx] = { ...i, rate: Number(e.target.value) }; set("items", items); }} />
                      <Input type="number" value={i.qty} onChange={(e) => { const items = [...d.items]; items[idx] = { ...i, qty: Number(e.target.value) }; set("items", items); }} />
                      <div className="text-right text-sm font-medium">{money(lineTotal(i), d.currency)}</div>
                      <Button variant="ghost" size="icon" onClick={() => set("items", d.items.filter((x) => x.id !== i.id))}><Trash2 className="h-4 w-4 text-[var(--rose)]" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Payment, terms & notes" accent="var(--rose)">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Issue date"><Input type="date" value={d.issueDate} onChange={(e) => set("issueDate", e.target.value)} /></Field>
                <Field label="Due date"><Input type="date" value={d.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
                <Field label="Payment terms">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={d.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)}>
                    {["Due on receipt", "Net 7", "Net 14", "Net 30", "50% upfront / 50% on delivery"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={d.payment.bank} onChange={(e) => set("payment", { ...d.payment, bank: e.target.checked })} />Bank transfer (Revolut / IBAN)</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={d.payment.ebl} onChange={(e) => set("payment", { ...d.payment, ebl: e.target.checked })} />EBL Freelancer Suite</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={d.payment.paypal} onChange={(e) => set("payment", { ...d.payment, paypal: e.target.checked })} />PayPal</label>
              </div>
              <textarea className="mt-3 min-h-20 w-full rounded-md border border-input bg-background p-2 text-sm" placeholder="Bank / IBAN / PayPal details shown on the document" value={d.payment.details} onChange={(e) => set("payment", { ...d.payment, details: e.target.value })} />
              <textarea className="mt-2 min-h-16 w-full rounded-md border border-input bg-background p-2 text-sm" placeholder="Extra notes (optional)" value={d.notes} onChange={(e) => set("notes", e.target.value)} />
            </Panel>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <Panel title="Discount & coupon" accent="var(--rose)">
              <div className="flex gap-2">
                <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={d.discount.type} onChange={(e) => set("discount", { ...d.discount, type: e.target.value as "flat" | "percent" })}>
                  <option value="flat">Flat</option><option value="percent">%</option>
                </select>
                <Input type="number" min={0} value={d.discount.value} onChange={(e) => set("discount", { ...d.discount, value: Number(e.target.value) })} />
              </div>
              <Input className="mt-2 uppercase" placeholder="Coupon code" value={d.coupon} onChange={(e) => set("coupon", e.target.value)} />
              {d.coupon && <p className={`mt-1 text-xs ${t.couponValid ? "text-[var(--emerald)]" : "text-[var(--rose)]"}`}>{t.couponValid ? `Applied: ${COUPONS[d.coupon.trim().toUpperCase()].label}` : "Unknown code"}</p>}
              <p className="mt-1 text-[11px] text-muted-foreground">Codes: {Object.keys(COUPONS).join(", ")}</p>
              <div className="mt-4 space-y-1 border-t border-white/10 pt-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(t.subtotal, d.currency)}</span></div>
                <div className="flex justify-between text-[var(--rose)]"><span>Discount applied</span><span>− {money(t.discountTotal, d.currency)}</span></div>
                <div className="flex justify-between pt-1 text-lg font-bold"><span>Total payable</span><span className="text-[var(--emerald)]">{money(t.total, d.currency)}</span></div>
              </div>
            </Panel>
            <Panel title="Saved documents" accent="var(--sky)">
              {saved.length === 0 ? <p className="text-xs text-muted-foreground">None yet.</p> : (
                <ul className="space-y-1 text-sm">
                  {saved.map((s) => (
                    <li key={s.id} className={`flex items-center justify-between gap-2 rounded px-2 py-1 ${current?.id === s.id ? "bg-white/5" : ""}`}>
                      <button className="truncate text-left hover:underline" onClick={() => open(s.id)}>{s.title}</button>
                      <button onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </aside>
        </main>
      )}
    </div>
  );
}

function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-card p-5" style={{ borderTop: `2px solid ${accent}` }}>
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-muted-foreground"><span className="mb-1 block capitalize">{label}</span>{children}</label>;
}
