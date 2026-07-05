# NextPay Website — project rules

## ⚠️ DEPLOYMENT TOPOLOGY & BRANCHES — READ FIRST
This ONE repo (`DMarsocci8/nextpay-website`) powers TWO sites from TWO branches. Do not confuse them:

- **`main` branch → Vercel → `www.nextpaypos.com`** — the public marketing site. Plain HTML pages at repo root.
- **`hub` branch → Cloudflare Pages project `nextpay-hub` → `hub.nextpaypos.com`** — the internal **Sales Hub** for the sales team. **Cloudflare's production branch is `hub`, NOT `main`.** To change the Sales Hub, work on `hub` (branch off `hub`, PR into `hub`).

Consequences:
- Sales Hub pages are files named `Sales Hub - <Name>.html`, served at **flat, lowercase, top-level clean URLs** via `_redirects` — NO `/SalesHub/` prefix (e.g. `/businesscard` → `/Sales%20Hub%20-%20Business%20Card.html` as a 200 rewrite; home is `/saleshub` and bare `/`). For every new hub page add a canonical `/<slug> → /Sales%20Hub%20-%20<Name>.html 200` rewrite, add the page to the `404.html` router MAP (both `<slug>` and `saleshub<slug>` keys → `/<slug>`), and, if it belongs in the nav, to `js/hub-nav.js`. Old `/SalesHub/<Page>` links 301 to the flat form for back-compat; internal links use the flat `/slug`.
- Hub page shell: `.hub-bar` (nav) + `.pg-head` (breadcrumb/H1) + content + `.hub-foot`; loads `/css/nextpay.css` + `/css/hub-sections.css` and `/js/hub-nav.js`. The **"Browse the hub" mega-dropdown groups (Learn/Pitch/Quote/Submit/Build/Grow) are defined in `js/hub-nav.js`** — add new hub pages to the right group there. The home page (`Sales Hub.html`) has the **"Start here — your sales workflow"** stepper.
- **Shared rep profile:** personalizable tools read/write `localStorage['np_rep_profile']` = `{name,title,cell,email}` so a rep types their details once and every asset (Business Card, Flyers, Proposal Builder, Email Signature) auto-fills. New personalizable tools MUST reuse this key.
- The old **Agent Portal** (`/agent-portal`, `Agent Portal.html`, on `main`) is a legacy internal page being **retired in favor of the Sales Hub**. Don't add new internal tooling there.
- **Persistence:** the only durable store is GitHub — commit + push. The exec container is ephemeral. Keep this section accurate on BOTH `main` and `hub`.

### Email signature builder (Sales Hub)
`Sales Hub - Email Signature.html` at `/emailsignature` — reps personalize name/phone/email, pick Classic/Stacked/Banner, copy a Gmail-ready signature. Locked for everyone: title **Payment & Rewards Specialist**, company, tagline, Quiz/Rewards/NextLink links. **Exec personalization:** the shared **`js/exec-profile.js`** exposes `NPExec.detect()`, which reads the logged-in email from the **`functions/whoami.js`** Cloudflare Pages Function (server-side, via Access's `Cf-Access-Authenticated-User-Email` header / JWT — the browser-side `/cdn-cgi/access/get-identity` errors on this Access config, kept only as a fallback). Both the **Email Signature** and **Business Card** makers call it: known execs get their details pre-filled and a **title toggle** between their exec title and Payment & Rewards Specialist (their own selected first); everyone else gets the plain builder locked to Payment & Rewards Specialist. The `EXECS` map lives ONLY in `js/exec-profile.js` (currently Dom = Co-Founder & CEO via `dom@nextpaypos.com` + `dmarsocci@gmail.com`; Alexander = CFO via `alexander@nextpaypos.com`). One person can have several login emails — add a key per address. Add `?whoami=1` to `/emailsignature` or `/businesscard` to print the exact Access email (handy for mapping a new exec). The Business Card agent title is Payment & Rewards Specialist (was "Relationship Manager"). Hard email rules: **link the logo by URL, never base64** (Gmail caps signatures at ~10k chars); wrap in a **forced-white card** + use the **plated logos** (`assets/logos/nextpay-signature-plated.png`, `nextlink-plated.png` — mark on a baked-in white plate) so it survives dark-mode Gmail. Table layout + inline styles only.

- I am building **new/updated pages only** as standalone HTML in this project. Do NOT modify or redesign the user's existing live pages.
- **Preserve all existing pages** the user already has, including the **Merchant Rewards** page — these stay exactly as-is. My work is purely additive.
- Scope of this engagement: image- and option-heavy **Industry** pages (with a recommended POS / Terminal / Gateway / Invoicing stack + comparisons) and the **category "full hardware stack" pages**: POS Systems, Credit Card Terminals, Online Gateways, Invoicing.
- Brand: deep navy `#0C1B2A` + teal `#14A18C` (bright teal `#1FC2A6` for logotype/accents), Plus Jakarta Sans, rounded pill buttons & cards. Shared styles in `css/nextpay.css`, compare engine in `js/nextpay.js`.
- Images are user-supplied via `<image-slot>` drag-and-drop placeholders (user has a logo/photo library). Pages must live at project root for slot persistence.

## Products in scope
- **POS:** NextPay (Chively), Square, Clover, Shift4 Dine (was SkyTab), Quantic, Korona, NRS, DejaPay Pro
- **Gateways:** FluidPay, NMI, Luqra, Valor, Authorize.net, iPOSPays
- **Terminals:** PAX Mobile line, Dejavoo (P Line, QD line), Square Mobile, Square Handheld, Clover Flex, Clover Go, Shift4 terminals, Valor VL
- **Invoicing:** FieldPulse, Field Work, LQPay, QuickBooks integrations (more coming soon)

## Canonical nav (matches user's live site — keep identical on every page)
- **Logo:** assets/logos/nextpay.png (real NextPay logo, in white rounded box)
- **Solutions** mega (3 cols): ACCEPT PAYMENTS [POS Systems, Credit Card Terminals, Online Payments, Invoicing & Recurring Billing, Integrations] · RUN YOUR BUSINESS [Payroll & Workers Comp, HR & Compliance, Fee Programs, Chargeback Protection] · GROW YOUR BUSINESS [Client Automation Outreach, Business Financing, Business Brokerage, Merchant Rewards]
- **Industries** mega (4 cols w/ photo headers): RETAIL [Boutique & Clothing, Convenience & Grocery, Liquor Stores, Jewelry Stores, Specialty Retail] · SERVICES [Auto Repair & Automotive, Salons & Spas, Home Services, Fitness & Gyms, Professional Services, Cleaning Services] · FOOD & BEVERAGE [Fine Dining, Pizzerias, Food Trucks, Bars & Nightclubs, QSR Cafes & Coffee Shops, Bakeries Delis & Markets] · HEALTHCARE & MEDICAL [Vision Care, Dental, Chiropractic & PT, Dermatology, Mental Health, Wellness Centers]. Footer: "View All Industries →" + "High Risk & Specialty"
- Then: Pricing, Why NextPay, Resources · right side: Contact, Take the Quiz (teal pill)

## Brand logos available (assets/logos/)
- nextpay.png (full color, navy text — use on light bg)
- chively-white.png (WHITE — needs dark backing)
- korona.png (color — works on light)
- dejavoo-white.webp (WHITE/reversed — needs dark backing)
- More coming from user.

## Real product images
- For brand hardware with public catalogs (e.g. PAX), hotlink official transparent PNGs via image-slot `src=` (verified working). PAX A920 Pro: https://www.pax.us/wp-content/uploads/2025/05/A920Pro_angled_left_appscreen-.png ; A920MAX, A77, A800, A6630, A6650, D195 also available on pax.us.

## Forms (lead capture)
- Statement Upload.html + Merchant Rewards.html specialist form POST via FormSubmit AJAX to **dom@nextpaypos.com**, CC **payments@nextpaypos.com,alexander@nextpaypos.com**.
- FormSubmit only delivers from a real web server (not the preview sandbox). First real submission from the live site sends a one-time activation link to dom@ — must be clicked once. Uploaded statement FILE is not relayed (only a filename note); real file handling waits for backend.
- If forms ever need to work/test inside preview, switch to Web3Forms (needs an access key from web3forms.com).
