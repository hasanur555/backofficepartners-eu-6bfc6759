# Travel Yield Hub

Build a premium, high-converting single-page B2B website for "Travel BackOffice Partners & Global Growth Hub". 

DESIGN AESTHETICS & COLORS:
- Theme: Ultra-modern, alive, dark-mode corporate design.
- Base Background: Deep Space Slate Navy (#0b1329).
- Primary Accent: Neon Teal (#0d9488) for buttons, active state highlights, and focus borders.
- Secondary Accent: Vibrant Emerald Green (#10b981) for positive metrics, savings, and SLA trust indicators.
- Warning Accent: Coral Pink/Rose (#f43f5e) for highlighting industry leakage metrics and manual vs. bot comparisons.
- Typography: Use "Outfit" (Sans-Serif) for display headers/stats and "Plus Jakarta Sans" for readable paragraphs and bullet specs.

WEBSITE SECTION HIERARCHY & TEXT:

1. GLOBAL NAVIGATION HEADER:
   - Left Brand: Logo icon with text "TRAVEL BACKOFFICE PARTNERS".
   - Links: Why Human-First, Lacunes & Gaps, Performance Record, One-Time Solutions, Dhaka Careers, Insights Hub.
   - CTA Button: Glowing teal button labeled "Build Setup Plan" scrolling to the calculator.

2. HERO PITCH BANNER:
   - Badge: "OUTSOURCED TRAVEL OPERATIONS & YIELD ARCHITECTURE".
   - Title: "We become your external travel operations department."
   - Paragraph: "Managing bookings, live OTA distribution channels, detailed customer communications, and central Bókun technology infrastructures. We replace generic automated algorithms with experienced, live operators who protect your margins."
   - CTAs: Primary button "Build Modular Retainer Plan" and secondary outline button "Why Real Humans Outperform AI".
   - Side Display Card: Large translucent card showing transaction volume: "$1,852,584.55 Gross Volume Mapped" and trust metrics "31,403 Res Synced", "83,368 Pax Served", "91.91% Margin Guarded".

3. "HUMAN-FIRST" VS "AI BOT" COMPARISON MATRIX:
   - Heading: "Why Rigid Automation and AI Auto-Responses Kill Your Travel Listings"
   - Body: Explain that every traveler's review has a "soul" (a distinct story/question). Generic AI templates make guests feel disconnected and get penalized by OTA algorithms. Show two columns comparing the "AI Automation Pitfall" (de-ranking, unmonitored connections) and the "BackOffice Human Advantage" (syncing directly with front desk/guides over WhatsApp/email to provide authentic answers).

4. LACUNES & CRITICAL GAP DATA ANALYSIS:
   - Heading: "The Hidden Gaps Costing Tour Companies Millions"
   - Underneath: Show an interactive, visual HTML/CSS-styled progress bar chart demonstrating these average leaks:
     * Inquiry Response Delay Drop: 40% Booking Drop (for replies over 15 minutes)
     * Unmapped Inventory Overbookings: Up to $5,000 Annual Loss
     * Cancellation Leakage: Up to $8,000 Annual Loss
     * Our Solution: System capacity locks, SLA-driven human check-ins, and 0% overbooking rate.

5. GLOBAL JV PARTNERSHIP PROSPECTUS (DUAL-MODE MODEL):
   - Toggle button: Let users switch between "Client Retainer Calculator" and "Dhaka Hub Cost Simulator".
   - Retainer Calculator: Computes monthly rate based on selected Tier (Starter, Growth, Scale), Coverage hours (Business, Weekend-only, Night-shift, or Full 24/7), and Checked modular add-ons (Reservations support, Ticket procurement, OTA SEO listing setup, Tech Maintenance).
   - Dhaka Hub Cost Simulator: Replicate image_7dfef9.png. Give BDT sliders for rent (Mirpur BDT 40k, Uttara BDT 50k, Dhanmondi BDT 60k), Support Agent salaries, Dev/Marketing budgets, and Redirected Rome Tour budget. Dynamically compute total OPEX in BDT and USD (using 1 USD = 117 BDT rate), CAPEX setup, and Investor Break-Even Timeline.
   - Form Inputs: Include fields for "TripAdvisor/Viator Listing URL (Optional)" and " Roster Notes/Requirements" so they can easily leave their info.
   - Mailto Action: Generate a dynamic proposal summary in a textarea and link a submit button to pre-populate an email to "partnerships@travelbackoffice.com".

6. KNOWLEDGE HUB & SEO ARTICLES:
   - Grid of 3 professional, keyword-rich B2B travel-industry articles with dynamic modals:
     1. "How to Optimize Viator Listings for Page 1 Placements" (SEO Algorithms)
     2. "Preventing Inbound Double-Bookings with Advanced Capacity Locks" (Bókun config)
     3. "Safeguarding Tour Margins Against High-Volume Holiday Cancellations" (Yield Management)

7. DHAKA REMOTE CAREER ONBOARDING HUB:
   - Header: "Apply as a BackOffice Operations Partner"
   - A beautiful form for local Dhaka freelancers to submit Name, Email, Role (Bókun Architect, OTA Manager, Support, Procurement), Experience (1-2 years, 3-5 years, 5+ years), Portfolio URL, and Bio.
   - Form Submission: Defer the page reload on submit and send an AJAX request directly via a static mail form handler (like formsubmit.co) to hasanur.ed@tourgeeky.com.

8. B2B STANDARDS FOOTER:
   - Clean dark-slate footer displaying "SLA-Driven Dispatch", "Corporate Account Parity", and "Channel Manager Audit" badges.
   - Professional contact routing to: partnerships@travelbackoffice.com.


Part 2: Step-by-Step Hosting & Deployment Guide

This section explains how to host your single-page interactive portal for free today, and how to scale to custom professional hosting when you have the budget.

Option A: Free Hosting on Google Sites (Zero Setup Cost)

Since you already have a Google Workspace account, Google Sites is the fastest way to get online immediately.

Go to sites.google.com and create a new site.

In the right sidebar, click Insert -> Embed -> Choose Embed code (the < > tab).

Paste your complete, compiled index.html file into the box and click Insert.

Drag the blue corners of the embedded container to make it stretch across the full width and length of your page layout. This removes double scrollbars.

In Google Sites settings, go to Custom Domains and link your professional domain (e.g., travelbackoffice.com) for free.

Option B: Free Developer-Grade Hosting (Fastest, Highly Professional)

If you want your website to load instantly with maximum SEO performance, bypass Google Sites and host the raw index.html file directly using these free platforms. They automatically provide free SSL certificates (HTTPS) and let you bind custom domains.

Vercel (Highly Recommended): 1. Go to vercel.com and sign up for a free account.
2. Put your index.html file in a folder.
3. Drag and drop the folder directly into the Vercel dashboard.
4. Under Project Settings -> Domains, add your custom domain.

GitHub Pages:

Create a free GitHub account and make a repository named yourname.github.io.

Upload your index.html file there.

Enable GitHub Pages in repository Settings.

Option C: Paid Premium Hosting (Wix, Framer, Webflow)

If you generated your design using an AI website builder's visual interface and don't want to use raw HTML:

Framer ($15–$20/mo): Best for absolute visual pixel-perfection. It lets you publish directly from the canvas design tool with one click.

Webflow ($14–$29/mo): Best for enterprise-grade SEO and complex database structures.

Part 3: Professional Masked Email Setup

To protect your personal mailbox while presenting an ultra-credible enterprise image to CEOs, configure professional email aliases.

How to use: hasanur.ed@tourgeeky.com

Go to your Google Workspace Admin Console (admin.google.com) using your tourgeeky.com credentials.

Navigate to Users -> Click on your user profile -> Go to Alternate email addresses (email aliases).

Add a new professional alias: partnerships@travelbackoffice.com (if you own that domain) or partnerships@tourgeeky.com.

In your Gmail settings -> Accounts, add this email under "Send mail as" so you can reply to clients directly as your company's executive onboarding address.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://backofficepartners-eu.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d39d7195-f94f-48e8-b6ed-1ebcad33a5cb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
