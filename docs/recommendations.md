# NextPay — Recommendation engine reference (from user's quiz tree)

Source of truth for product recommendations and the "Take the Quiz" flow.

## Quiz steps
1. **Business Stage** — A) Existing  B) New/opening
2. **What do you need?** — A) Full POS  B) Standalone Terminal  C) Gateway/Software only  D) Combination
3. **Industry** — A) Food & Beverage  B) Retail  C) Convenience/QSR/Ticketing  D) Services  E) Home Services/Contractors  F) Healthcare  G) High Risk
4. **Additional Needs** (multi) — Offset CC fees (dual pricing/surcharge/cash discount — ALL products) · Business Financing · Payroll & Workers Comp · Network Building & Marketing (NextLink)
5. **Hardware Preference** *(only if Step2=A or D)* — A) Own outright  B) No upfront/Placement  C) Flexible
6. **Mobile App?** *(only if Step3=D or E)* — A) Yes, take payments in field  B) No, fixed location
7. **Monthly Card Volume** — A) <$20k  B) $20–60k  C) $60–120k  D) $120k+
8. **Avg Transaction Size** — A) <$20  B) $20–40  C) $40–80  D) $80+
9. **# Locations** — A) 1  B) 2–3  C) 4+
10. **Timeline** — A) ASAP/<1mo  B) 2–3mo  C) 4+mo

## Recommendation matrix (Industry + Setup → Top Pick / Option)
**Food & Beverage**
- No Upfront/Lease (Step5=B/C): **SkyTab POS** (lease, from $29.99/mo, lifetime warranty, no upfront) · **Clover POS** (placement) · +PAYS POS if dual pricing
- Buy (Step5=A/C): **Square POS** (free tier, from $0) · **Clover POS** (purchase) · +PAYS if dual pricing
- Terminal: **Dejavoo Terminals** (countertop+wireless, tip prompting, dual pricing) · Shift4 Terminals (if SkyTab POS) · Clover Flex & Go (if Clover POS)
- Online: **Square Online & Invoicing** (free tier, 2.9%+30¢) · iPOSpays by Dejavoo (from $25/mo)

**Retail (General)**
- POS: **Square POS** (1st choice, free tier, inventory, eCom) · SwipeSimple (mobile, from $25/mo) · +PAYS if dual pricing, +KORONA if multi-location
- Terminal: **PAX Terminals** (4G LTE, WiFi, BT, long battery) · Valor PayTech (dual pricing, SMS) · Square Terminal (if Square POS)
- Online: **Authorize.net** (invoicing, ACH, QuickBooks, from $25/mo) · Square Online

**Convenience / QSR / Ticketing**
- POS: **Square POS** (fast checkout) · Clover POS (placement) · **KORONA POS** (regulated/ticketing/multi-location, from $59/mo), +PAYS if dual pricing

**Services (Salon, Auto, Beauty, Professional)**
- POS: **SwipeSimple** (mobile app, appointments, Text-to-Pay, from $25/mo) · Clover POS · +PAYS if dual pricing
- Online/GW: **SwipeSimple** · iPOSpays by Dejavoo · +Fluid Pay if mobile virtual terminal
- Terminal: **PAX Terminals** (pairs w/ SwipeSimple/iPOSpays) · Valor PayTech

**Home Services / Contractors (HVAC, Plumbing, Electrical, Construction)**
- Software: **FieldPulse** (dispatch, scheduling, GPS, invoicing, QBO) · iPOSPays by Dejavoo · SwipeSimple
- Terminal: **PAX Terminals** (wireless, pairs w/ FieldPulse) · Valor PayTech

**Healthcare (Medical, Dental, Optometry, Chiro, Derm)**
- Billing: **LQpay** (EMR/EHR integration, Text-to-Pay, payment plans) · SwipeSimple
- Terminal: **Dejavoo Terminals** (countertop, PIN debit, pairs w/ LQpay) · Square Terminal

**High Risk (CBD, Vape, Peptides, Travel, Specialty)**
- In-Person: **KORONA POS** (processor agnostic, age verification, from $59/mo) · Valor PayTech Terminals
- Online: **Valor Gateway** (high-risk, dual pricing) · Fluid Pay (invoicing, AI fraud)

## Additional services (surface at end based on Step 4; always show Brokerage)
- Financing → **NextFund** (working capital, equipment, MCA)
- Payroll → **Payroll & Workers Comp**
- Marketing → **NextLink** (outreach, reputation, campaigns)
- Always → **Business Brokerage** (buy/sell/valuation)

## Product quick reference (pricing · differentiator)
- **Square POS** — Free–$149/mo — free tier, eCom, broadest fit, 2.6%+10¢ in-person
- **SkyTab POS (Shift4 Dine)** — from $29.99/mo — restaurant-focused, lease only/no upfront, lifetime warranty, free 30-day trial
- **Clover POS** — Placement Program — 500+ apps, no upfront, lifetime warranty, buy or lease
- **PAYS POS** — Custom — dual pricing specialist, 0% processing, F&B + Retail
- **Linga POS** — from $75/mo — cloud, any device, works offline, free 30-day trial
- **KORONA POS** — from $59/mo — retail/convenience/ticketing/regulated, processor agnostic, purchase required
- **SwipeSimple** — from $25/mo — mobile-first, appointments, Text-to-Pay, loyalty, iOS/Android
- **Dejavoo Terminals** — processing only — countertop + wireless, tip prompting, dual pricing, PIN debit, EBT
- **PAX Terminals** — processing only — Android, 4G LTE, long battery, built-in printer, great all-around
- **Valor PayTech** — processing only — dual pricing built-in, SMS marketing (Engage My Customer), multi-MID
- **Square Terminal** — 2.6%+10¢ — simple standalone, built-in printer, Square ecosystem
- **Clover Flex & Go** — processing only — portable handheld, built-in printer, Clover add-on
- **Shift4 Terminals** — processing only — same Shift4 network as SkyTab, tableside handheld
- **FieldPulse** — from $25/mo — field service mgmt, dispatch/scheduling/GPS, invoicing, QBO sync
- **LQpay** — Custom — healthcare only, EMR/EHR, Text-to-Pay patient billing, in-person + remote
- **iPOSpays by Dejavoo** — from $25/mo — dual pricing invoicing, ACH, virtual terminal, 0% processing
- **Fluid Pay** — from $25/mo — AI fraud detection, B2B Level 3, recurring, ACH, mobile app
- **NMI Gateway** — from $25/mo — multi-platform, 100s integrations, recurring, ACH, dual pricing
- **Authorize.net** — from $25/mo — trusted eCom gateway, invoicing, ACH, QuickBooks, retail focus
- **Valor Gateway** — from $25/mo — high-risk, dual pricing, PayNow links, ACH, inventory sync
- **Square Online** — Free–$149/mo — eCom store + invoicing, online ordering, 2.9%+30¢

## Terminal images (local, assets/terminals/)
pax-a920.jpeg · dejavoo-qd1/qd2/qd4/qd4-wired/qd4-duo/qd5/qd-circle.* · dejavoo-p1.jpg · clover-flex.webp · clover-mini.png · clover-go.png · square-reader.avif · swipesimple-reader.jpg · swipesimple-reader2.webp · swipesimple-dashboard.png · valor-vl550.webp · valor-vp550.webp · valor-vp550e.webp
Logos: assets/logos/ dejavoo.png · ipospays.png · korona.png · chively-white.png · dejavoo-white.webp · nextpay.png
