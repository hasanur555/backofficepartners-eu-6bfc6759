import { computeTotals, lineTotal, money, OTA_DISCLAIMER, PROVIDER, type ProposalData } from "@/lib/proposal";

export function ProposalDocument({ data }: { data: ProposalData }) {
  const t = computeTotals(data);
  const c = data.currency;
  const label = data.mode === "invoice" ? "Invoice" : "Proposal";
  return (
    <article className="proposal-doc rounded-2xl border border-white/10 bg-card p-6 sm:p-10 text-sm text-foreground">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
        <div className="max-w-md">
          <div className="font-display text-xl font-bold text-[var(--teal-glow)]">{PROVIDER.brand}</div>
          <div className="mt-2 font-semibold">{PROVIDER.name}</div>
          <div className="text-muted-foreground">{PROVIDER.title}</div>
          <div className="text-xs text-muted-foreground mt-1">Freelancer ID Card No: {PROVIDER.freelancerId}</div>
          <div className="text-xs text-muted-foreground">{PROVIDER.email}</div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{PROVIDER.bio}</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold uppercase tracking-wide">{label}</div>
          <div className="mt-1 text-muted-foreground">#{data.number}</div>
          <div className="mt-3 text-xs">Issued: {data.issueDate}</div>
          <div className="text-xs">Due: <span className="text-[var(--emerald)] font-semibold">{data.dueDate}</span></div>
          <div className="text-xs text-muted-foreground">Terms: {data.paymentTerms}</div>
        </div>
      </header>

      <section className="grid gap-6 border-b border-white/10 py-6 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--sky)]">Billed to</div>
          <div className="mt-2 font-semibold">{data.client.name || "—"}</div>
          <div>{data.client.company}</div>
          <div className="text-muted-foreground">{data.client.email}</div>
          <div className="text-muted-foreground">{data.client.country}</div>
          {data.client.whatsapp && <div className="text-muted-foreground">WhatsApp: {data.client.whatsapp}</div>}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--sky)]">Portfolio & past projects</div>
          <ul className="mt-2 space-y-1">
            {PROVIDER.portfolio.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-[var(--teal-glow)] hover:underline">{p.url.replace("https://", "")}</a>
                <span className="text-muted-foreground"> — {p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <table className="w-full mt-6 text-left">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground">
          <tr className="border-b border-white/10">
            <th className="py-2">Service</th><th className="py-2 text-right">Rate</th><th className="py-2 text-right">Qty</th><th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No items yet</td></tr>}
          {data.items.map((i) => (
            <tr key={i.id} className="border-b border-white/5 align-top">
              <td className="py-3 pr-4"><div className="font-medium">{i.name}</div>{i.description && <div className="text-xs text-muted-foreground">{i.description}</div>}</td>
              <td className="py-3 text-right whitespace-nowrap">{i.rate === 0 ? "Quote" : money(i.rate, c)}{i.unit ? <span className="text-xs text-muted-foreground"> {i.unit}</span> : null}</td>
              <td className="py-3 text-right">{i.qty}</td>
              <td className="py-3 text-right font-medium">{money(lineTotal(i), c)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 ml-auto max-w-xs space-y-1">
        <Row k="Subtotal" v={money(t.subtotal, c)} />
        {t.manual > 0 && <Row k="Discount" v={`− ${money(t.manual, c)}`} accent="var(--rose)" />}
        {t.couponAmt > 0 && <Row k={`Coupon ${data.coupon.toUpperCase()}`} v={`− ${money(t.couponAmt, c)}`} accent="var(--rose)" />}
        <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold">
          <span>Total payable</span><span className="text-[var(--emerald)]">{money(t.total, c)}</span>
        </div>
      </div>

      <section className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--amber)]">Payment details</div>
          <ul className="mt-2 space-y-1">
            {data.payment.bank && <li>International Bank Transfer (Revolut / IBAN)</li>}
            {data.payment.ebl && <li>EBL Freelancer Suite</li>}
            {data.payment.paypal && <li>PayPal</li>}
          </ul>
          {data.payment.details && <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-muted-foreground">{data.payment.details}</pre>}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--amber)]">Terms & disclaimer</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{OTA_DISCLAIMER}</p>
          {data.notes && <p className="mt-2 text-xs whitespace-pre-wrap">{data.notes}</p>}
        </div>
      </section>
    </article>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return <div className="flex justify-between" style={accent ? { color: accent } : undefined}><span>{k}</span><span>{v}</span></div>;
}
