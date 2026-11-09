export type Currency = "EUR" | "USD";

export type LineItem = {
  id: string;
  name: string;
  description: string;
  rate: number;
  qty: number;
  unit?: string;
};

export type ProposalData = {
  mode: "proposal" | "invoice";
  number: string;
  currency: Currency;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  client: { name: string; company: string; email: string; country: string; whatsapp: string };
  items: LineItem[];
  discount: { type: "flat" | "percent"; value: number };
  coupon: string;
  payment: { bank: boolean; ebl: boolean; paypal: boolean; details: string };
  notes: string;
};

export const PROVIDER = {
  brand: "Travel Backoffice Partners / Avenza",
  name: "Hasanur Rony",
  title: "Business Problem Solver & Technical Operations Specialist",
  freelancerId: "F126767202233",
  email: "contact@backofficepartners.eu",
  bio: "Specialized backoffice and technical operations manager for travel agencies, hotels, and tour operators. Expert in OTA distribution, Bokun calendar sync, rate parity audits, and booking engine automation.",
  portfolio: [
    { url: "https://bestinrometour.com", label: "OTA & Custom Web Platform Setup" },
    { url: "https://backofficepartners.eu", label: "Technical Support & Operational Management" },
  ],
};

export const OTA_DISCLAIMER =
  "Account approvals, verification timelines, and live listing status on third-party OTA platforms are subject to client submission of complete business registration documents and platform policy compliance.";

export type CatalogItem = { key: string; name: string; description: string; lines: { label: string; rate: number; unit: string }[] };

export const SERVICE_CATALOG: CatalogItem[] = [
  { key: "cm_audit", name: "Channel Manager Audit", description: "Full channel mapping, rate parity audit, sync error diagnostics, 30-day support.", lines: [{ label: "One-time", rate: 250, unit: "one-time" }] },
  { key: "marketing", name: "Specialist Travel Marketing", description: "SEO, Meta ads, email automation, OTA conversion optimization.", lines: [{ label: "Monthly", rate: 699, unit: "/month" }] },
  { key: "property", name: "Property Setup", description: "Property channel configuration & PMS setup.", lines: [{ label: "Setup", rate: 299, unit: "setup" }, { label: "Monthly", rate: 200, unit: "/month" }] },
  { key: "platform", name: "Platform Setup", description: "Basic OTA channel integration & mapping.", lines: [{ label: "Setup", rate: 199, unit: "setup" }, { label: "Monthly", rate: 250, unit: "/month" }] },
  { key: "custom", name: "Custom Software Development", description: "Custom scope & custom quote.", lines: [{ label: "Custom quote", rate: 0, unit: "quote" }] },
];

export type OtaPlatform = { key: string; name: string; complex: boolean };
export const OTA_PLATFORMS: OtaPlatform[] = [
  { key: "viator", name: "Viator", complex: false },
  { key: "gyg", name: "GetYourGuide", complex: false },
  { key: "klook", name: "Klook", complex: true },
  { key: "trip", name: "Trip.com", complex: true },
  { key: "rakuten", name: "Rakuten", complex: true },
  { key: "expedia", name: "Expedia", complex: false },
];
export const STANDARD_PRODUCT_FEE = 50;
export const COMPLEX_FEE_MIN = 75;
export const COMPLEX_FEE_MAX = 120;
export const ACCOUNT_CREATION_FEE = 75;

export const COUPONS: Record<string, { type: "flat" | "percent"; value: number; label: string }> = {
  OTA2026: { type: "percent", value: 10, label: "10% off" },
  FIRSTCLIENT: { type: "flat", value: 50, label: "50 off" },
};

export function lineTotal(i: LineItem) {
  return Math.max(0, i.rate) * Math.max(0, i.qty);
}

export function computeTotals(d: Pick<ProposalData, "items" | "discount" | "coupon">) {
  const subtotal = d.items.reduce((s, i) => s + lineTotal(i), 0);
  const manual = d.discount.type === "percent" ? (subtotal * Math.min(100, Math.max(0, d.discount.value))) / 100 : Math.max(0, d.discount.value);
  const c = COUPONS[d.coupon.trim().toUpperCase()];
  const afterManual = Math.max(0, subtotal - manual);
  const couponAmt = c ? (c.type === "percent" ? (afterManual * c.value) / 100 : c.value) : 0;
  const discountTotal = Math.min(subtotal, manual + couponAmt);
  return { subtotal, manual: Math.min(subtotal, manual), couponAmt: Math.min(afterManual, couponAmt), couponValid: !!c, discountTotal, total: subtotal - discountTotal };
}

export function money(n: number, c: Currency) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(n);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyProposal(): ProposalData {
  const today = new Date();
  const due = new Date(today.getTime() + 7 * 864e5);
  const iso = (x: Date) => x.toISOString().slice(0, 10);
  return {
    mode: "proposal",
    number: `TBP-${today.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    currency: "EUR",
    issueDate: iso(today),
    dueDate: iso(due),
    paymentTerms: "Net 7",
    client: { name: "", company: "", email: "", country: "", whatsapp: "" },
    items: [],
    discount: { type: "flat", value: 0 },
    coupon: "",
    payment: { bank: true, ebl: false, paypal: false, details: "" },
    notes: "",
  };
}
