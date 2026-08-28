import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Mail,
  Handshake,
  ShieldCheck,
  Sparkles,
  Building2,
  LineChart,
  Layers,
  Megaphone,
  Users,
  Clock,
  Globe2,
  FileText,
  Phone,
  BookOpen,
  Briefcase,
  Calculator,
  TrendingUp,
  AlertTriangle,
  Download,
  Code2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { notifySubmission } from "@/lib/notify";
import logoBestInRome from "@/assets/partners/Best_in_Rome_tour_transparent.png";
import logoAvenza from "@/assets/partners/avenzatour_png_6.png";
import logoEpicRoma from "@/assets/partners/Epic_ROma.jpg";
import logoPremium from "@/assets/partners/Primium.jpg";
import logoSrCity from "@/assets/partners/S_R_CITY.jpg";
import logoHelloItalia from "@/assets/partners/web-logo-horizontal.png";

const SITE_URL = "https://backofficepartners-eu.lovable.app";
const PAGE_TITLE = "OTA & Bókun Back Office Support for Travel Agencies";
const PAGE_DESCRIPTION =
  "Back office and OTA support for travel agencies, tour operators and DMCs: GetYourGuide, Viator and Booking.com listing management, Bókun setup, channel manager audits, PMS operations and custom travel software. Per-service pricing, invoice billing.";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "OTA management, Bókun setup, GetYourGuide listing optimisation, Viator listing management, Booking.com extranet support, channel manager audit, travel agency back office, tour operator outsourcing, DMC operations support, property management software support, custom travel software",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:site_name", content: "Travel BackOffice Partners" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfessionalService",
              "@id": SITE_URL + "/#organization",
              name: "Travel BackOffice Partners",
              url: SITE_URL + "/",
              email: "contact@backofficepartners.eu",
              description: PAGE_DESCRIPTION,
              areaServed: "Worldwide",
              serviceType: [
                "OTA platform management",
                "Bókun and channel manager setup",
                "Channel manager audit",
                "Property management software operations",
                "Travel marketing",
                "Custom travel software development",
              ],
              knowsAbout: [
                "Bókun",
                "GetYourGuide",
                "Viator",
                "Booking.com",
                "Expedia",
                "Airbnb Experiences",
                "channel managers",
                "property management systems",
              ],
            },
            {
              "@type": "WebSite",
              "@id": SITE_URL + "/#website",
              url: SITE_URL + "/",
              name: "Travel BackOffice Partners",
              publisher: { "@id": SITE_URL + "/#organization" },
            },
          ],
        }),
      },
    ],
  }),
});


const CONTACT_EMAIL = "contact@backofficepartners.eu";
const CAREERS_EMAIL = CONTACT_EMAIL;
const SERVICE_PDF = "/travel-backoffice-partners-services.pdf";

const TECH_PARTNERS = [
  { name: "Best in Rome Tour", logo: logoBestInRome },
  { name: "Avenza Tour", logo: logoAvenza },
];

const SUPPORT_CLIENTS = [
  { name: "Epic Roma", logo: logoEpicRoma },
  { name: "Premium CityTour", logo: logoPremium },
  { name: "SR City Tours", logo: logoSrCity },
  { name: "Hello Italia Tour", logo: logoHelloItalia },
];

const REQUEST_TOPICS = [
  "OTA platform management",
  "Property management software",
  "Channel manager audit",
  "Specialist travel marketing",
  "Custom software development",
  "General question / other",
];

/* ---------------- Data ---------------- */

type Service = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tag: string;
  summary: string;
  bullets: string[];
  price: string;
  priceNote: string;
};

const SERVICES: Service[] = [
  {
    id: "ota",
    icon: Globe2,
    title: "OTA Platform Management",
    tag: "Viator · GetYourGuide · Booking · Airbnb · Expedia · Tiqets · Civitatis",
    summary:
      "We create, manage and optimize your listings across every OTA — content, pricing, availability, reviews and customer replies handled by a real human team.",
    bullets: [
      "New listing creation & full account setup",
      "Content, photos, pricing & availability optimization",
      "Customer messages, review replies & dispute handling",
      "Partner & account manager relationship handling",
      "Weekly performance report",
    ],
    price: "from €349 / month",
    priceNote: "per platform · one-time setup €199",
  },
  {
    id: "pms",
    icon: Building2,
    title: "Property Management Software",
    tag: "Bókun · Cloudbeds · Hostaway · Guesty · Lodgify",
    summary:
      "Full operation of your PMS — from setup to daily reservations, rate plans, guest flows and integrations that keep your calendar in sync everywhere.",
    bullets: [
      "PMS setup, migration & configuration",
      "Reservations, rate plans & inventory management",
      "Guest communication & pre-arrival flows",
      "Third-party integrations (payments, locks, CRM)",
      "Client & partner account management",
    ],
    price: "from €449 / month",
    priceNote: "per property · setup from €299",
  },
  {
    id: "audit",
    icon: Layers,
    title: "Channel Manager Audit",
    tag: "SiteMinder · RateGain · STAAH · MyAllocator · Rentals United",
    summary:
      "A deep, human audit of your channel manager mappings, rate parity, restrictions and connections — we find the leaks that quietly cost you bookings.",
    bullets: [
      "Full channel mapping & rate parity audit",
      "Overbooking & sync error diagnostics",
      "Restrictions, derived rates & LOS review",
      "Prioritized fix list with owner & ETA",
      "Optional 30-day implementation support",
    ],
    price: "€599 one-time",
    priceNote: "delivered in 5 business days",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Specialist Travel Marketing",
    tag: "For tour operators, boutique hotels & vacation rentals",
    summary:
      "Marketing built specifically for travel — SEO, meta ads, email flows and OTA ranking work that speaks the language of guests and operators.",
    bullets: [
      "Travel-focused SEO & content",
      "Google & Meta ads for tours and stays",
      "Email & guest re-engagement flows",
      "OTA ranking & conversion optimization",
      "Monthly strategy call + reporting",
    ],
    price: "from €699 / month",
    priceNote: "scoped per channel",
  },
  {
    id: "software",
    icon: Code2,
    title: "Custom Software Development",
    tag: "Internal tools built around your operation",
    summary:
      "When off-the-shelf platforms stop fitting your operation, we build the missing piece — dashboards, integrations and automations designed around how your company actually works.",
    bullets: [
      "Booking dashboards, manifests & dispatch tools",
      "API integrations between OTAs, PMS and your website",
      "Automated reporting & reconciliation",
      "Website booking widgets & landing pages",
      "Maintenance and support retainer",
    ],
    price: "quoted per scope",
    priceNote: "fixed-price milestones · invoice billing",
  },
];


const WHY_US = [
  { icon: Users, title: "Real humans, not bots", body: "Every reply, mapping and review response is written by a trained travel operations specialist — not an AI script." },
  { icon: Clock, title: "Under-2-hour response SLA", body: "During coverage hours we respond to guests, partners and OTAs in under 2 hours — the #1 driver of ranking on Viator, GYG and Booking." },
  { icon: ShieldCheck, title: "Margin-safe operations", body: "We protect your commissions, rate parity and refund exposure. Every action is logged and auditable." },
  { icon: LineChart, title: "Measured, not promised", body: "Weekly scorecard: response time, conversion, review score, overbooking risk and revenue impact." },
  { icon: Handshake, title: "Partnership model available", body: "For growing brands we offer revenue-share and long-term partnership tiers instead of pure retainers." },
  { icon: FileText, title: "Simple invoice billing", body: "No card on file, no gateways. After a short discovery call we send a clean invoice — pay by bank transfer." },
];

const METRICS = [
  { label: "Gross Volume Sequenced", value: "€1,852,584" },
  { label: "Error-Free Reservations", value: "31,403" },
  { label: "Travelers Dispatched", value: "83,368" },
  { label: "Client Gross Margin", value: "91.91%" },
];

const BRANDS = [
  { name: "Parent Account Portfolio", tag: "High-volume operator", products: 46, bookings: "33,527", passengers: "89,231" },
  { name: "Boutique Sub-Brand", tag: "Luxury / private", products: 12, bookings: "209", passengers: "598" },
  { name: "Transfer Group B", tag: "B2B ground transit", products: 15, bookings: "2,332", passengers: "6,732" },
];

const HUMAN_VS_AI = [
  { topic: "Review replies", human: "Contextual, references the actual booking log & guide", ai: "Generic template, flagged by OTA algorithms" },
  { topic: "OTA ranking impact", human: "Boosts placement via genuine engagement signals", ai: "De-ranked as automated / low-quality profile" },
  { topic: "Complex guest questions", human: "Coordinates with on-site guides for accurate answers", ai: "Hallucinates or defers, guest churns" },
  { topic: "Refunds & disputes", human: "Protects margin with audit trail & policy nuance", ai: "Auto-approves or auto-rejects, revenue leaks" },
  { topic: "Listing iteration", human: "Weekly updates from real traveler friction data", ai: "Static — never learns from real complaints" },
];

const GAPS = [
  { label: "Guest messages left > 2h unanswered", pct: 62, tone: "rose" },
  { label: "Overbookings from bad channel sync", pct: 41, tone: "rose" },
  { label: "Listings missing age-tier pricing", pct: 57, tone: "rose" },
  { label: "Ranking uplift after human reply migration", pct: 34, tone: "emerald" },
  { label: "Margin protected via cancellation shielding", pct: 28, tone: "emerald" },
];

const INCLUDED = [
  "Native OTA extranets (Viator, GYG, Tiqets, Civitatis, Airbnb Experiences)",
  "Shared business inboxes (Google Workspace, Microsoft 365)",
  "Official WhatsApp Business channels",
  "Voice support staffing on your VOIP lines",
];
const EXCLUDED = [
  "Third-party CRM licenses (Zendesk, Freshdesk, Salesforce)",
  "VOIP telephony subscriptions or phone hardware",
  "Reselling of calling credits",
  "Software the client must own directly",
];

/* Configurator data */
const TIERS = [
  { id: "starter", label: "Starter — up to 1,000 bookings/mo", price: 1499 },
  { id: "growth", label: "Growth — 1,001 to 3,000 bookings/mo", price: 2999 },
  { id: "scale", label: "Scale — 3,001+ enterprise", price: 4999 },
];
const COVERAGE = [
  { id: "std", label: "Standard business hours (09:00–18:00)", mult: 1.0 },
  { id: "weekend", label: "Weekend-only support", mult: 0.75 },
  { id: "night", label: "Night shift monitoring", mult: 1.15 },
  { id: "247", label: "Full 24/7 coverage", mult: 1.4 },
];
const MODULES = [
  { id: "a", label: "Module A — Customer support & conversations", price: 0, note: "Baseline included" },
  { id: "b", label: "Module B — Real-time ticket procurement", price: 150 },
  { id: "c", label: "Module C — OTA channel & listing management", price: 200 },
  { id: "d", label: "Module D — Website widgets & tech stack maintenance", price: 250 },
];
const STANDALONE = [
  { id: "seo", label: "Listing SEO optimization", price: 350, unit: "per listing" },
  { id: "bokun", label: "Bókun full setup", price: 650, unit: "flat setup" },
  { id: "fast", label: "OTA fast approval setup", price: 250, unit: "per product upload" },
  { id: "rescue", label: "Previous listing audit & rescue", price: 450, unit: "flat" },
];

/* Articles — SEO-targeted operational content (Bókun, GetYourGuide, Viator, OTA, channel manager) */
const ARTICLES = [
  {
    id: "art1",
    title: "Bókun setup & optimization: the complete configuration checklist",
    excerpt:
      "Bókun booking software setup, resource pools, departure rules, and OTA distribution — a practical guide for tour operators.",
    body: `Bókun is the reservation engine most modern tour and activity operators build on. But a default Bókun setup leaks margin from day one. This checklist covers the configuration that actually protects revenue.

1. Resource & Capacity Modeling
Every product departure must bind to a resource pool with hard seat limits, guide roster shifts, and B2B ticket allotments. Without this, Bókun's availability logic treats unlimited capacity as normal — and overbookings start in week one.

2. Departure Rules & Cutoff Windows
Set automated booking cutoff windows (e.g. 24h for walking tours, 2h for skip-the-line monument tickets) so last-minute spikes never break on-site coordination.

3. Pricing Matrix Completeness
Full age-tier configuration (adult, youth, child, infant), transparent group logic, and identical rate parity across every channel. This is what keeps an account healthy.

4. OTA Distribution Connections
Connect Bókun to Viator, GetYourGuide, Tiqets, and your own booking widget through a single inventory source. One update closes out every channel at once.

We run full Bókun setup engagements — resource mapping, pricing, policy automation, and OTA connections — so operators go live without the first-month margin leak.`,
  },
  {
    id: "art2",
    title: "How to rank on GetYourGuide & Viator: OTA listing SEO that works",
    excerpt:
      "GetYourGuide ranking, Viator placement, OTA listing optimization, and the signals that move tour operators to Page 1.",
    body: `Ranking on GetYourGuide and Viator is not luck. These platforms run ranking algorithms that reward measurable operator behavior. Here are the signals that move you up.

1. Inquiry Response Latency
OTA crawlers monitor response speed down to the minute. Replying to pre-booking messages within 15 minutes delivers an immediate organic lift. Slow responses tell the system a listing cannot handle volume, and rankings drop.

2. Pricing Parity & Conversion Velocity
Every optimized listing carries identical rate parity across public channels, full age-tier pricing, and clean group logic. Listings with higher booking conversion velocity get pushed up.

3. Visual Content CTR Drivers
Click-Through Rate directly influences placement. Listings must sequence high-resolution imagery around meeting points, inclusions, and experience milestones. The first three photos do most of the ranking work.

4. Review Velocity & Recency
A steady stream of recent reviews signals active, healthy operations. A human operations team monitoring inbound queues continuously is the fastest way to hold Page 1 visibility on both platforms.`,
  },
  {
    id: "art3",
    title: "Channel manager audit: stopping double-bookings and rate leaks",
    excerpt:
      "Channel manager integration, Bókun inventory sync, and how to make overbookings mathematically impossible.",
    body: `Overbookings are the silent margin killer on every distribution network. Eliminating them requires an engineering approach to your channel manager setup.

1. Resource Dependency Mapping
Inside Bókun, physical assets are absolute boundary conditions. Every product departure links to a shared resource pool with exact seat limits, guide roster shifts, and B2B ticket allotments.

2. Live API Inventory Closures
When a booking lands via GetYourGuide, the API instantly notifies the reservation engine, which reduces slots in the master pool and fires close-out commands across Viator, Tiqets, and your website widget simultaneously.

3. Rate Parity Enforcement
A channel manager audit checks that the same price, the same currency, and the same cancellation terms appear on every connected OTA. Mismatches cause both ranking penalties and guest disputes.

4. Cutoff Window Safeguards
Automated booking cutoff windows prevent last-minute traffic spikes from breaking on-site coordination. We audit these parameters daily as part of retainer coverage.`,
  },
  {
    id: "art4",
    title: "OTA management for tour operators: what it really takes",
    excerpt:
      "OTA account management, Viator and GetYourGuide operations, listing health, and the daily workflow that keeps rankings stable.",
    body: `Running an OTA presence is operational work, not a one-time setup. Operators who treat it as a "set and forget" channel lose ranking within weeks. Here is what daily OTA management actually involves.

1. Listing Health Monitoring
Every active listing is checked for availability gaps, broken images, price mismatches, and policy drift. A single stale field can trigger a ranking drop.

2. Message Queue Coverage
OTA inbox messages from Viator, GetYourGuide, and Tiqets must be answered within the platform's response window. Delayed replies compound — each one drags your account health score down.

3. Booking & Fulfillment Sync
Every confirmed booking flows into the reservation engine, closes inventory across channels, and triggers the guide manifest. Gaps in this sync cause the overbookings that wreck account health.

4. Performance Reporting
Weekly OTA performance reports — conversion rate, response time, cancellation rate, and review velocity — tell you exactly where ranking is about to slip. We produce these for every retainer client.`,
  },
  {
    id: "art5",
    title: "Preventing double-bookings: capacity locks that actually work",
    excerpt:
      "Bókun resource pools, GetYourGuide and Viator inventory sync, and the safeguards that stop overbookings for tour operators.",
    body: `Double-bookings don't come from bad luck — they come from unbounded availability. Here is the setup that makes them mathematically impossible.

1. Hard Capacity Per Departure
Every departure has a fixed seat count tied to a real resource — a vehicle, a guide shift, or a B2B ticket allotment. Bókun must reject any booking that exceeds it.

2. Real-Time Multi-Channel Sync
When a booking lands on GetYourGuide, Viator, or your own widget, all channels see the updated pool within seconds. A channel manager that polls on a delay is the most common overbooking cause.

3. Cutoff & Buffer Windows
Set a booking cutoff (e.g. 12h before departure) and a small inventory buffer so last-minute walk-ups never exceed what the team can fulfill.

4. Daily Audit
We audit capacity settings, sold-out departures, and failed close-outs every day. Overbookings stop being possible once the system is watched.`,
  },
  {
    id: "art6",
    title: "Cancellation shielding & chargeback defense for travel operators",
    excerpt:
      "Museum ticket liability, Bókun cancellation policy automation, and building chargeback evidence packages that win disputes.",
    body: `Cancellations quietly drain cash flow when systems are misconfigured. Seasonal margin protection requires a strict workflow.

1. Museum Entry Ticket Liability
Operators holding B2B contracts for the Vatican, Colosseum, or Louvre buy non-refundable entry tickets in advance. Cancellations outside terms mean immediate loss.

2. Automating Bókun Policy Enforcement
The reservation system must run dynamic cancellation cutoffs — locking modifications before non-refundable monument windows close. This is configured per product, not globally.

3. Chargeback Evidence Packages
When guests initiate credit-card disputes through GetYourGuide or Viator, we assemble timestamped check-in vouchers, manifest histories, and native OTA message strings. This refutes fraud claims and protects gross margin.

4. Refund Reconciliation
Every refund is matched to the original OTA commission, payment processor fee, and supplier cost so the books stay clean and margin is tracked accurately.`,
  },
];

/* Careers */
const CAREER_ROLES = ["Bókun Architect", "OTA Channel Manager", "Guest Support Agent", "Procurement Operator"];
const CAREER_YEARS = ["1–2 years", "3–5 years", "5+ senior lead"];

/* ---------------- Component ---------------- */

function Home() {
  return (
    <div className="min-h-screen text-foreground">
      <AnnouncementBar />
      <Header />
      <Hero />
      <MetricsBoard />
      <BrandMatrix />
      <PartnerLogos />
      <WhyUsMatrix />
      <Services />
      <ScopeMatrix />
      <Research />
      <Configurator />
      <ArticlesHub />
      <WhyUs />
      <RequestService />
      <Partnership />
      <Booking />
      <Careers />
      <Footer />
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-[var(--teal)]/15 border-b border-[var(--teal-glow)]/30 text-center text-xs py-2 px-4 text-[color:var(--teal-glow)]">
      <Sparkles className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
      Active Operations Peak: Now onboarding selected global tour operators and DMCs for late seasonal coverage.
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--teal-glow)] pulse-dot" />
          TRAVEL BACKOFFICE PARTNERS
        </a>
        <nav className="hidden gap-5 text-sm text-muted-foreground lg:flex">
          <a href="#why-us" className="hover:text-foreground">Why us</a>
          <a href="#stats" className="hover:text-foreground">Stats</a>
          <a href="#services" className="hover:text-foreground">Services</a>
          <a href="#configurator" className="hover:text-foreground">Configurator</a>
          <a href="#articles" className="hover:text-foreground">Articles</a>
          <a href="#careers" className="hover:text-foreground">Careers</a>
        </nav>
        <a href="#configurator" className="hidden md:inline-flex btn-teal rounded-md px-4 py-2 text-sm font-semibold">
          Build plan
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-noise opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[var(--teal-glow)]" />
            Outsourced travel operations · run by humans
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
            We become your external{" "}
            <span className="bg-gradient-to-r from-[var(--teal-glow)] to-[var(--emerald)] bg-clip-text text-transparent">
              travel operations
            </span>{" "}
            department.
          </h1>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            Managing reservations, live OTA distribution channels, detailed customer communications, and central Bókun systems while your team focuses on scaling experiences. Fully integrated into your existing infrastructure with zero high-cost software fees.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#configurator" className="btn-teal rounded-md px-5 py-3 text-sm font-semibold inline-flex items-center gap-2">
              Build your custom retainer plan <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#why-us" className="btn-outline-teal rounded-md px-5 py-3 text-sm font-semibold">
              Why real humans outperform AI
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No card required · Invoice after the call · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricsBoard() {
  return (
    <section id="stats" className="mx-auto max-w-6xl px-5 pb-10">
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="font-display text-2xl font-bold text-[var(--teal-glow)] md:text-3xl">{m.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandMatrix() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading
        eyebrow="Performance split"
        title="Managing multi-brand portfolios at scale"
        subtitle="Real numbers from parent accounts with distinct sub-brands running under one operations desk."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {BRANDS.map((b) => (
          <div key={b.name} className="glass rounded-xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{b.tag}</div>
            <h3 className="mt-1 font-display text-lg font-semibold">{b.name}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Active products</span><span className="font-semibold">{b.products}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bookings</span><span className="font-semibold">{b.bookings}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Passengers dispatched</span><span className="font-semibold text-[var(--emerald)]">{b.passengers}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUsMatrix() {
  return (
    <section id="why-us" className="border-y border-white/5 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Human-first framework"
          title="Why rigid automation & AI auto-responses kill your listings"
          subtitle="Every traveler review has a soul. Guests spot generic AI replies instantly — and OTA algorithms are engineered to de-rank automated profiles in favor of genuine engagement."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-white/[0.03] text-xs uppercase tracking-widest text-muted-foreground">
            <div className="p-4">Scenario</div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-white/10 text-[var(--emerald)]">Human ops (us)</div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-white/10 text-[var(--rose)]">Generic AI bots</div>
          </div>
          {HUMAN_VS_AI.map((row, i) => (
            <div key={row.topic} className={`grid grid-cols-1 md:grid-cols-3 text-sm ${i % 2 ? "bg-white/[0.015]" : ""}`}>
              <div className="p-4 font-semibold border-t border-white/10">{row.topic}</div>
              <div className="p-4 border-t md:border-l border-white/10 flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--emerald)] mt-0.5" /><span>{row.human}</span></div>
              <div className="p-4 border-t md:border-l border-white/10 flex gap-2 text-muted-foreground"><XCircle className="h-4 w-4 flex-shrink-0 text-[var(--rose)] mt-0.5" /><span>{row.ai}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="Services"
        title="What we do for you"
        subtitle="Pick a single service or bundle several. Every engagement starts with a short discovery call so we can scope the work honestly."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {SERVICES.map((s) => <ServiceCard key={s.id} s={s} />)}
      </div>
    </section>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const Icon = s.icon;
  return (
    <Card className="glass border-white/10 transition hover:border-[var(--teal-glow)]/40">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--teal)]/15 text-[var(--teal-glow)]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">{s.title}</CardTitle>
            <CardDescription className="mt-0.5 text-xs">{s.tag}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{s.summary}</p>
        <ul className="space-y-2 text-sm">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--emerald)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <div className="font-display text-2xl font-bold text-[var(--teal-glow)]">{s.price}</div>
            <div className="text-xs text-muted-foreground">{s.priceNote}</div>
          </div>
          <a href="#configurator" className="btn-outline-teal inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold">
            Configure <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeMatrix() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[var(--emerald)]">
            <CheckCircle2 className="h-5 w-5" />
            <div className="text-xs uppercase tracking-widest">Included in standard scope</div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {INCLUDED.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--emerald)] mt-0.5" /><span>{x}</span></li>)}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[var(--rose)]">
            <XCircle className="h-5 w-5" />
            <div className="text-xs uppercase tracking-widest">Explicitly out of scope</div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {EXCLUDED.map((x) => <li key={x} className="flex gap-2"><XCircle className="h-4 w-4 flex-shrink-0 text-[var(--rose)] mt-0.5" /><span>{x}</span></li>)}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground border-t border-white/10 pt-3">
            <strong className="text-foreground">Software rule:</strong> if you need voice support, you supply the VOIP lines (Aircall, RingCentral). We supply the expert manpower to staff them.
          </p>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="Industry research"
        title="Where operators quietly leak revenue"
        subtitle="Aggregated from audits we ran across tour operators, DMCs and boutique hotels in the last 12 months."
      />
      <div className="mt-10 grid gap-4">
        {GAPS.map((g) => {
          const color = g.tone === "rose" ? "var(--rose)" : "var(--emerald)";
          const Icon = g.tone === "rose" ? AlertTriangle : TrendingUp;
          return (
            <div key={g.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span>{g.label}</span>
                </div>
                <span className="font-display font-bold" style={{ color }}>{g.pct}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Configurator ---------------- */

function Configurator() {
  const [mode, setMode] = useState<"retainer" | "standalone">("retainer");
  const [tierId, setTierId] = useState(TIERS[0].id);
  const [coverageId, setCoverageId] = useState(COVERAGE[0].id);
  const [moduleIds, setModuleIds] = useState<string[]>(["a"]);
  const [standaloneIds, setStandaloneIds] = useState<string[]>([]);
  const [clientUrl, setClientUrl] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  const tier = TIERS.find((t) => t.id === tierId)!;
  const coverage = COVERAGE.find((c) => c.id === coverageId)!;
  const modules = MODULES.filter((m) => moduleIds.includes(m.id));
  const standalones = STANDALONE.filter((s) => standaloneIds.includes(s.id));

  const subtotal = useMemo(() => {
    if (mode === "retainer") {
      const base = tier.price * coverage.mult;
      const add = modules.reduce((s, m) => s + m.price, 0);
      return Math.round(base + add);
    }
    return standalones.reduce((s, x) => s + x.price, 0);
  }, [mode, tier, coverage, modules, standalones]);

  const discount = subtotal > 0 ? Math.min(LOW_SEASON_DISCOUNT, subtotal) : 0;
  const total = subtotal - discount;


  const proposal = useMemo(() => {
    const lines = [
      "B2B BUSINESS INQUIRY: OPERATIONAL ESTIMATE",
      "--------------------------------------------------",
      "To: Travel BackOffice Partners Onboarding",
      "From: Interested Tour & Activity Operator",
      "",
      "OPERATIONAL SETUP PLAN:",
      `• Configuration Type: ${mode === "retainer" ? "Custom Retainer" : "Standalone Project"}`,
      `• Booking Volume Limit: ${mode === "retainer" ? tier.label : "Standalone tasks (see below)"}`,
      `• Coverage Schedule: ${mode === "retainer" ? coverage.label : "One-time project"}`,
      `• Configured Price Estimate: €${total.toLocaleString()}${mode === "retainer" ? " / month" : " one-time"}`,
      "",
      "SELECTED SERVICE CONFIGURATION:",
      ...(mode === "retainer"
        ? modules.map((m) => ` • ${m.label} — €${m.price}/mo`)
        : standalones.map((s) => ` • ${s.label} — €${s.price} (${s.unit})`)),
      "",
      "CLIENT ASSETS & SPECIFICATION:",
      `• Listing/Product Link: ${clientUrl || "-"}`,
      `• Special Requirements / Roster Notes: ${clientNotes || "-"}`,
      "",
      "We would like to book our initial 10-minute operational audit to review our reservation parameters. Please reply with scheduling availability.",
    ];
    return lines.join("\n");
  }, [mode, tier, coverage, modules, standalones, total, clientUrl, clientNotes]);

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("B2B operational estimate — discovery call request")}&body=${encodeURIComponent(proposal)}`;

  const toggleModule = (id: string) =>
    setModuleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleStandalone = (id: string) =>
    setStandaloneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section id="configurator" className="border-y border-white/5 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Configurator"
          title="Build your custom operational plan"
          subtitle="Two modes: monthly retainer or standalone project. Live pricing, and a copy-ready proposal you can email us."
        />

        <div className="mt-8 inline-flex rounded-full border border-white/10 bg-black/20 p-1">
          {[
            { id: "retainer" as const, label: "Monthly retainer" },
            { id: "standalone" as const, label: "Standalone project" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === t.id ? "bg-[var(--teal)] text-[#04121a]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
          {/* Input panel */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Calculator className="h-5 w-5 text-[var(--teal-glow)]" /> Configure
              </CardTitle>
              <CardDescription>Adjust filters — the estimate updates instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {mode === "retainer" ? (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest">Booking volume tier</label>
                    <div className="mt-2 grid gap-2">
                      {TIERS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTierId(t.id)}
                          className={`flex justify-between rounded-lg border p-3 text-left text-sm transition ${
                            tierId === t.id ? "border-[var(--teal-glow)] bg-[var(--teal)]/15" : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <span>{t.label}</span>
                          <span className="font-semibold text-[var(--teal-glow)]">€{t.price.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest">Coverage schedule</label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {COVERAGE.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCoverageId(c.id)}
                          className={`flex justify-between rounded-lg border p-3 text-left text-xs transition ${
                            coverageId === c.id ? "border-[var(--teal-glow)] bg-[var(--teal)]/15" : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <span>{c.label}</span>
                          <span className="font-semibold text-[var(--emerald)]">×{c.mult}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest">Add-on modules</label>
                    <div className="mt-2 space-y-2">
                      {MODULES.map((m) => (
                        <label key={m.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm cursor-pointer hover:border-white/20">
                          <Checkbox checked={moduleIds.includes(m.id)} onCheckedChange={() => toggleModule(m.id)} className="mt-0.5" />
                          <div className="flex-1">
                            <div>{m.label}</div>
                            {m.note && <div className="text-xs text-muted-foreground">{m.note}</div>}
                          </div>
                          <div className="font-semibold text-[var(--teal-glow)]">{m.price === 0 ? "€0" : `€${m.price}/mo`}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">One-time projects</label>
                  <div className="mt-2 space-y-2">
                    {STANDALONE.map((s) => (
                      <label key={s.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm cursor-pointer hover:border-white/20">
                        <Checkbox checked={standaloneIds.includes(s.id)} onCheckedChange={() => toggleStandalone(s.id)} className="mt-0.5" />
                        <div className="flex-1">
                          <div>{s.label}</div>
                          <div className="text-xs text-muted-foreground">{s.unit}</div>
                        </div>
                        <div className="font-semibold text-[var(--teal-glow)]">€{s.price}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-3 border-t border-white/10 pt-4">
                <div>
                  <label className="text-xs text-muted-foreground">Listing / product link (optional)</label>
                  <Input id="client-url" value={clientUrl} onChange={(e) => setClientUrl(e.target.value)} placeholder="https://viator.com/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Special requirements / roster notes</label>
                  <Textarea id="client-notes" value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} rows={3} placeholder="Peak season, languages, anything unusual…" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output panel */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <FileText className="h-5 w-5 text-[var(--teal-glow)]" /> Live estimate & proposal
              </CardTitle>
              <CardDescription>Copy this or send it directly to us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-[var(--teal-glow)]/40 bg-[var(--teal)]/10 p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Estimated total</div>
                <div className="font-display text-4xl font-bold text-[var(--teal-glow)]">
                  €{total.toLocaleString()}
                  <span className="ml-2 text-sm text-muted-foreground font-sans">{mode === "retainer" ? "/ month" : "one-time"}</span>
                </div>
              </div>
              <Textarea readOnly value={proposal} rows={14} className="font-mono text-xs" />
              <div className="flex flex-wrap gap-3">
                <Button asChild className="btn-teal">
                  <a href={mailto}>Compile proposal & request call <ArrowRight className="h-4 w-4" /></a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(proposal)}
                  className="btn-outline-teal"
                >
                  Copy proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Articles ---------------- */

function ArticlesHub() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ARTICLES.find((a) => a.id === openId) || null;
  return (
    <section
      id="articles"
      className="relative border-y border-[var(--emerald)]/15 bg-[color:var(--emerald)]/[0.04] py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 grid-noise opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Knowledge base & SEO guides"
          title="Operational insights for Bókun, GetYourGuide & OTA operators"
          subtitle="Practical guides on Bókun setup, OTA listing SEO, channel manager audits, and double-booking prevention — written by the people who run these systems every day."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <button
              key={a.id}
              onClick={() => setOpenId(a.id)}
              className="glass rounded-xl p-5 text-left transition hover:border-[var(--teal-glow)]/50 hover:-translate-y-0.5"
            >
              <BookOpen className="h-5 w-5 text-[var(--teal-glow)]" />
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--teal-glow)]">
                Read guide <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>
        <Dialog open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
          <DialogContent className="max-w-2xl bg-[#0b1329] border-white/10">
            {open && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{open.title}</DialogTitle>
                  <DialogDescription>{open.excerpt}</DialogDescription>
                </DialogHeader>
                <div className="mt-2 max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                  {open.body}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

/* ---------------- Why us cards + Partnership + Booking + Careers ---------------- */

function WhyUs() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Why us" title="The logic behind hiring a back-office partner" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {WHY_US.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.title} className="glass rounded-xl p-5">
                <Icon className="h-5 w-5 text-[var(--teal-glow)]" />
                <h3 className="mt-3 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Partnership() {
  return (
    <section id="partnership" className="mx-auto max-w-6xl px-5 py-20">
      <div className="glass grid gap-8 rounded-2xl p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Handshake className="h-3.5 w-3.5 text-[var(--teal-glow)]" />
            Partnership program
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Grow with us — not just buy from us.</h2>
          <p className="mt-3 text-muted-foreground">
            For agencies, tech vendors and travel brands we offer a long-term partnership track: revenue share, white-label back-office, referral fees and joint case studies.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--emerald)]" /> White-label OTA & PMS operations</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--emerald)]" /> Referral fee up to 15% recurring</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--emerald)]" /> Joint go-to-market for PMS vendors</li>
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <a href="#book" className="btn-teal rounded-md px-5 py-3 text-center text-sm font-semibold">Talk about partnership</a>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Partnership%20enquiry`} className="btn-outline-teal rounded-md px-5 py-3 text-center text-sm font-semibold">Email partnerships team</a>
          <div className="mt-2 text-xs text-muted-foreground text-center">{CONTACT_EMAIL}</div>
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("10:00");
  const [service, setService] = useState<string>(SERVICES[0].title);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const disabled = !date || !name || !email;

  const mailtoHref = useMemo(() => {
    const subject = `Discovery call request — ${service}`;
    const body = [
      `Hi Travel BackOffice Partners team,`, ``,
      `I'd like to book a short discovery call.`, ``,
      `Name: ${name}`, `Company: ${company || "-"}`, `Email: ${email}`,
      `Service of interest: ${service}`,
      `Preferred date: ${date ? date.toDateString() : "-"}`,
      `Preferred time: ${time} (my local time)`, ``,
      `Notes:`, notes || "-",
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [name, company, email, service, date, time, notes]);

  return (
    <section id="book" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading eyebrow="Book a call" title="Pick a time — we'll take it from there" subtitle="20-minute discovery call. If we're a fit, we send a scoped proposal and a clean invoice. No cards, no gateway. Bank transfer only." />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg"><CalendarIcon className="h-5 w-5 text-[var(--teal-glow)]" /> Date & time</CardTitle>
            <CardDescription>Times shown in your local timezone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-black/20 p-2">
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => { const t = new Date(); t.setHours(0,0,0,0); return d < t || d.getDay() === 0; }} className="mx-auto" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Time slot</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {times.map((t) => (
                  <button key={t} type="button" onClick={() => setTime(t)}
                    className={`rounded-md border px-2 py-2 text-xs font-medium transition ${time === t ? "border-[var(--teal-glow)] bg-[var(--teal)]/20 text-foreground" : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg"><Mail className="h-5 w-5 text-[var(--teal-glow)]" /> Your details</CardTitle>
            <CardDescription>We reply within one business day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Service of interest</label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                {SERVICES.map((s) => <option key={s.id} value={s.title} className="bg-[#0b1329]">{s.title}</option>)}
                <option value="Partnership" className="bg-[#0b1329]">Partnership enquiry</option>
                <option value="Other" className="bg-[#0b1329]">Other / not sure yet</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="text-xs text-muted-foreground">Full name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></div>
              <div><label className="text-xs text-muted-foreground">Company</label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" /></div>
            </div>
            <div><label className="text-xs text-muted-foreground">Work email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></div>
            <div><label className="text-xs text-muted-foreground">Notes (optional)</label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What platforms do you use?" rows={4} /></div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild disabled={disabled} className="btn-teal"><a href={disabled ? "#book" : mailtoHref}>Send booking request <ArrowRight className="h-4 w-4" /></a></Button>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" /> {CONTACT_EMAIL}</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Careers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(CAREER_ROLES[0]);
  const [years, setYears] = useState(CAREER_YEARS[0]);
  const [portfolio, setPortfolio] = useState("");
  const [bio, setBio] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Valid business email required.");
    if (bio.trim().length < 50) return setError("Track record must be at least 50 characters.");
    if (portfolio && !/^https?:\/\//i.test(portfolio)) return setError("Portfolio must be a full URL.");
    setSubmitted(true);
    void notifySubmission(`Freelancer application — ${role}`, {
      Name: name, Email: email, Role: role, Experience: years, Portfolio: portfolio || "-", "Track record": bio,
    });
    // fire-and-forget email link
    const body = `Name: ${name}\nEmail: ${email}\nRole: ${role}\nExperience: ${years}\nPortfolio: ${portfolio || "-"}\n\nTrack record:\n${bio}`;
    window.location.href = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Freelancer application — ${role}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="careers" className="border-t border-white/5 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-4xl px-5">
        <SectionHeading eyebrow="Careers" title="Join our remote operations bench" subtitle="We're hiring elite travel-ops freelancers — Bókun architects, OTA channel managers, guest support agents and procurement operators." />
        {submitted ? (
          <div id="apply-success" className="mt-10 glass rounded-2xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--emerald)]" />
            <h3 className="mt-3 font-display text-2xl font-bold">Application received</h3>
            <p className="mt-2 text-sm text-muted-foreground">Thanks {name.split(" ")[0]}. If your track record matches an active opening we'll be in touch within 5 business days.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 glass rounded-2xl p-6 md:p-8 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="apply-name" className="text-xs text-muted-foreground">Full legal name *</label>
                <Input id="apply-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="apply-email" className="text-xs text-muted-foreground">Business email *</label>
                <Input id="apply-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="apply-role" className="text-xs text-muted-foreground">Core strength *</label>
                <select id="apply-role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                  {CAREER_ROLES.map((r) => <option key={r} value={r} className="bg-[#0b1329]">{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="apply-years" className="text-xs text-muted-foreground">Experience *</label>
                <select id="apply-years" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                  {CAREER_YEARS.map((r) => <option key={r} value={r} className="bg-[#0b1329]">{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="apply-portfolio" className="text-xs text-muted-foreground">Portfolio / LinkedIn URL</label>
              <Input id="apply-portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://" />
            </div>
            <div>
              <label htmlFor="apply-bio" className="text-xs text-muted-foreground">System track record * (min 50 chars)</label>
              <Textarea id="apply-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} placeholder="Which OTAs and PMS have you operated? What volumes? Notable wins?" />
            </div>
            {error && <div className="text-sm text-[var(--rose)]">{error}</div>}
            <div className="flex items-center gap-3">
              <Button type="submit" className="btn-teal"><Briefcase className="h-4 w-4" /> Submit application</Button>
              <span className="text-xs text-muted-foreground">Sent to {CAREERS_EMAIL}</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function PartnerLogos() {
  return (
    <section id="partners" className="border-y border-white/5 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Partners & clients"
          title="Technology and online operational support"
          subtitle="We solve OTA and tourism operators' platform problems — and build custom software around each company's workflow."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Technology partners</h3>
            <p className="mt-1 text-xs text-muted-foreground">Joint technology and platform delivery.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {TECH_PARTNERS.map((p) => (
                <div key={p.name} className="flex h-24 items-center justify-center rounded-xl bg-white/90 p-4">
                  <img src={p.logo} alt={`${p.name} logo`} loading="lazy" className="max-h-16 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Digital operational support</h3>
            <p className="mt-1 text-xs text-muted-foreground">A selection of brands taking back-office support from us — not the full list.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {SUPPORT_CLIENTS.map((p) => (
                <div key={p.name} className="flex h-24 items-center justify-center rounded-xl bg-white/90 p-4">
                  <img src={p.logo} alt={`${p.name} logo`} loading="lazy" className="max-h-16 w-auto object-contain" />
                </div>
              ))}
              <div className="col-span-2 flex h-16 items-center justify-center rounded-xl border border-dashed border-white/15 px-4 text-center text-xs font-medium text-muted-foreground">
                + more tour operators, DMCs and city-tour brands across Europe (names under NDA)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href={SERVICE_PDF} download className="btn-outline-teal inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold">
            <Download className="h-4 w-4" /> Download service catalogue (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

function RequestService() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(REQUEST_TOPICS[0]);
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!company.trim()) return setError("Company name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Valid business email required.");
    if (details.trim().length < 20) return setError("Please describe your request (min 20 characters).");
    setSent(true);
    void notifySubmission(`Service request — ${topic}`, {
      Company: company, Email: email, Topic: topic, Details: details,
    });
  };

  return (
    <section id="request" className="mx-auto max-w-4xl px-5 py-20">
      <SectionHeading
        eyebrow="Request a service"
        title="Tell us what you need"
        subtitle="Any query — platform setup, audit, marketing or custom software. We reply with scope and a fixed price, then invoice after a short meeting."
      />
      {sent ? (
        <div className="mt-10 glass rounded-2xl p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--emerald)]" />
          <h3 className="mt-3 font-display text-2xl font-bold">Request received</h3>
          <p className="mt-2 text-sm text-muted-foreground">We'll respond from {CONTACT_EMAIL} within one business day.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 glass rounded-2xl p-6 md:p-8 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="req-company" className="text-xs text-muted-foreground">Company *</label>
              <Input id="req-company" value={company} onChange={(e) => setCompany(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="req-email" className="text-xs text-muted-foreground">Business email *</label>
              <Input id="req-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="req-topic" className="text-xs text-muted-foreground">What do you need? *</label>
            <select id="req-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
              {REQUEST_TOPICS.map((t) => <option key={t} value={t} className="bg-[#0b1329]">{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="req-details" className="text-xs text-muted-foreground">Details / query *</label>
            <Textarea id="req-details" value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder="Platforms in use, volumes, deadlines, and what you want solved." />
          </div>
          {error && <div className="text-sm text-[var(--rose)]">{error}</div>}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="btn-teal"><MessageSquare className="h-4 w-4" /> Send request</Button>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Service%20request`} className="text-xs text-muted-foreground underline">or email {CONTACT_EMAIL}</a>
          </div>
        </form>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold">Travel BackOffice Partners</div>
          <p className="mt-2 text-sm text-muted-foreground">Outsourced OTA, PMS and channel operations for tour operators, boutique hotels and vacation rentals.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold text-foreground">Contact</div>
          <div className="mt-2 flex items-center gap-2"><Mail className="h-4 w-4" /> {CONTACT_EMAIL}</div>
          <div className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4" /> Reply within 1 business day</div>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold text-foreground">Billing</div>
          <p className="mt-2">Invoice-based. Bank transfer. No card gateway. Proposals sent after a short discovery call.</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Travel BackOffice Partners. All rights reserved.
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--teal-glow)]">{eyebrow}</div>
      <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
    </div>
  );
}
