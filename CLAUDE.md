# NextPay Website — project rules

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
- FormSubmit only delivers from a real web server (not the preview sandbox). First real submission from the live site sends a one-time activation link to dom@ — must be clicked once.
- Statement Upload sends the statement FILE as a real FormSubmit attachment (file input `name="attachment"`, multipart FormData; FormSubmit caps attachments at 10MB — enforced client-side). The submit handler checks the AJAX response and shows a retry + mailto fallback on failure instead of a false success screen.
- If forms ever need to work/test inside preview, switch to Web3Forms (needs an access key from web3forms.com).

## Cloudflare Access ops (Sales Hub logins)
- Hub login sessions, login logs, the daily agent-login-digest Worker, and login-page branding are documented in `docs/cloudflare-access-ops.md`.
