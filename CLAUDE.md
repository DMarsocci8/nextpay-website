# NextPay Website — project rules

- I am building **new/updated pages only** as standalone HTML in this project. Do NOT modify or redesign the user's existing live pages.
- **Preserve all existing pages** the user already has, including the **Merchant Rewards** page — these stay exactly as-is. My work is purely additive.
- Scope of this engagement: image- and option-heavy **Industry** pages (with a recommended POS / Terminal / Gateway / Invoicing stack + comparisons) and the **category "full hardware stack" pages**: POS Systems, Credit Card Terminals, Online Gateways, Invoicing.
- Brand: deep navy `#0C1B2A` + teal `#14A18C` (bright teal `#1FC2A6` for logotype/accents), Plus Jakarta Sans, rounded pill buttons & cards. Shared styles in `css/nextpay.css`, compare engine in `js/nextpay.js`.
- Images are user-supplied via `<image-slot>` drag-and-drop placeholders (user has a logo/photo library). Pages must live at project root for slot persistence.

## Products in scope
- **POS:** Chively (its own POS, written through Solutions in Payments / Luqra — NOT NextPay house, NOT Next2Pay; owner corrected 2026-07-27), Square, Clover, SkyTab by Shift4, Quantic, Korona, NRS, DejaPay Pro
- **Gateways:** FluidPay, NMI, Luqra, Valor, Authorize.net, iPOSPays
- **Terminals:** PAX Mobile line, Dejavoo (P Line, QD line), Square Mobile, Square Handheld, Clover Flex, Clover Go, Shift4 terminals, Valor VL
- **Invoicing:** FieldPulse, Field Work, LQPay, QuickBooks integrations (more coming soon)

## Pricing sources (verified — do not re-flag without checking these)
- **PAYS:** payspos.com/pos-system-cost/ — Starter $59 / Growth $79 / Enterprise $99 per month. Screenshot receipt in repo: `PAYSPos Software pricing.jpg`. Confirmed by owner 2026-07.
- **Quantic:** `docs/quantic-monthly.pdf` + `docs/quantic-hardware.pdf` (Unified Pricing V5, referral) — Pro $60 first/$50 addl, Enterprise $90/$80.
- **Korona:** Core $59 / Retail $79 / Plus $99 per register (hub Proposal Builder sheet).
- **Shift4 / SkyTab:** official SkyTab pricing sheet (owner-provided 2026-07) — base bundle $29.99, Air $29.99, Mobile $20, KDS $29.99, Bump Bar $9.99, PIN pad $9.99, Label Printer $19.99, Scale $39.99, Lighthouse $20, Gift Cards $25, Workforce $35; one-time: cash drawer $129, till $25, split cable $25. 30-day trial then 36-month agreement (owner corrected 2026-07-27; was previously noted as 30-month).
- **SumUp:** sumup pages on this site (POS Lite & Solo $499, POS $799 + $99/mo plan, Terminal $249, Solo $54, Connect Plus $199 / Pro $289).
- **NextLink:** INTERNAL ONLY — never publish on the public site. Trial $599/mo/seat (3-mo term), annual $749, month-to-month $999, enterprise 10+ custom. Lives on the hub `/pricing` page only.

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
- Statement Upload.html + Merchant Rewards.html specialist forms deliver via FormSubmit to **dom@nextpaypos.com**, CC **payments@nextpaypos.com,alexander@nextpaypos.com**. The dom@ endpoint is already activated (no activation step needed).
- Statement Upload uses a NATIVE multipart POST to formsubmit.co (NOT the /ajax/ endpoint — AJAX silently drops file attachments; verified live 2026-07). The statement file posts as `name="attachment"` and arrives as a real email attachment (verified live). FormSubmit caps attachments at 10MB — enforced client-side. Config (`_subject`, `_cc`, `_template`, `_captcha=false`, `_honey`) lives in hidden inputs; `_next` redirects back to the page with `?sent=1&first=<name>`, which renders the on-brand success screen. Do NOT convert this form back to fetch/AJAX.
- FormSubmit only delivers from a real web server (not the preview sandbox).
- If forms ever need to work/test inside preview, switch to Web3Forms (needs an access key from web3forms.com).

## Cloudflare Access ops (Sales Hub logins)
- Hub login sessions, login logs, the daily agent-login-digest Worker, and login-page branding are documented in `docs/cloudflare-access-ops.md`.
