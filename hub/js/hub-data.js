/* NextPay Sales Hub — sales content data.
   One source of truth for: discovery questions, industry playbooks
   (recommended stack + qualifying rules), the product library, and
   per-placement deal-submission checklists.
   Pricing figures here follow the verified sources in the repo
   (payspos.com, Quantic Unified Pricing V5, Korona sheet, SkyTab
   owner-provided sheet, SumUp pages). Buy rates & Schedule A live on
   the Pricing page and are agent-only. */

window.HUB_DATA = {

  /* ---------- Discovery every deal needs, regardless of industry ---------- */
  baseDiscovery: [
    { h: 'The business', q: [
      'Walk me through how a customer pays you today — in person, online, over the phone, invoices?',
      'How many locations / registers / people taking payments?',
      'Roughly how much card volume per month, and what is your average ticket?',
      'Are you a new business, or switching from a current setup?'
    ]},
    { h: 'Payments today', q: [
      'Who do you process with now, and what do you think you pay? (Most owners do not know — that is normal.)',
      'Can you grab your last processing statement? We will read it line by line and meet or beat it.',
      'Are you under a contract or lease with your current provider? When does it end? Any early-termination fee?',
      'Have you heard of dual pricing / 0% processing? Would eliminating card fees interest you?'
    ]},
    { h: 'Operations & pain', q: [
      'What annoys you most about your current POS or terminal?',
      'What do you wish you had — online ordering, invoicing, loyalty, better reporting, faster support?',
      'Who else is involved in this decision, and what is your timeline?'
    ]}
  ],

  /* ---------- Startup / no-statement path ---------- */
  startup: {
    intro: 'No statement to beat? Build the numbers from projections instead — underwriting and pricing both work off estimates for new businesses.',
    q: [
      'Projected customers per day and average ticket? (volume ≈ customers/day × avg ticket × days open × ~80% card mix)',
      'Opening date / when do they need to accept payments?',
      'Funding: buying hardware outright, or better to place at $0 down with a monthly?',
      'Any processing history at all (Square/Stripe/PayPal exports count)?',
      'For underwriting: expected monthly volume, highest single ticket, % card-present vs online/keyed.'
    ],
    tips: [
      'New businesses with no history: quote conservatively and set expectations that underwriting may set initial volume caps that grow with processing history.',
      'Startups are the best dual-pricing candidates — they have no baked-in habit of eating card fees.',
      '$0-down placement (SkyTab, Clover placement mode) usually beats a hardware purchase for cash-tight startups.'
    ]
  },

  /* ---------- Industry playbooks ---------- */
  industries: {
    'convenience': { label: 'Convenience & Grocery', group: 'Retail',
      ask: [
        'How many SKUs? Do you need scan data reporting (tobacco rebates) or EBT/SNAP?',
        'Do you sell age-restricted items (tobacco, vape, lotto)? Need built-in ID verification?',
        'Sell anything by weight (deli, produce)? A certified integrated scale changes the hardware pick.',
        'How fast is the line at rush? Lane speed matters more here than anywhere.'
      ],
      primary: { name: 'NRS', why: 'Purpose-built for c-stores and bodegas — age verification, scan-data programs, customer-facing screen, high-speed lanes.' },
      alts: [
        { name: 'Korona', why: 'Serious retail inventory per register ($59–$99/mo/register), great for bigger grocery with label printing and ID scanner add-ons.' },
        { name: 'Clover', why: 'Familiar all-in-one with scale + inventory support (Retail Growth $84.95/mo) when the owner wants a mainstream brand.' }
      ],
      rules: [
        'EBT/SNAP required → confirm on the application up front; it changes underwriting and terminal file builds.',
        'Tobacco scan-data rebates → NRS or Korona, not Square.',
        'Deli counter or by-weight → needs certified scale: Clover (integrated scale) or Quantic (PDN scale $549).',
        'Single register, owner behind counter, price-sensitive → NRS keeps it cheapest.'
      ],
      pricing: 'High volume + low average ticket → per-item fees hurt; dual pricing lands very well here. Always pull a statement — c-stores are usually overpaying on debit.',
      placements: ['nrs', 'korona', 'clover']
    },

    'liquor': { label: 'Liquor Stores', group: 'Retail',
      ask: [
        'How do you handle ID checks today? Want the register to force age verification?',
        'Case discounts, mix-and-match pricing, keg deposits — how complex is pricing?',
        'Inventory counts by bottle or by case? Shrinkage a concern?'
      ],
      primary: { name: 'Korona', why: 'The liquor-store standard — per-register pricing, ID scanner add-on ($550), case-break inventory, label printing.' },
      alts: [
        { name: 'Clover', why: 'Retail Growth plan covers item-level inventory with a friendlier interface for smaller shops.' },
        { name: 'NRS', why: 'Budget lane for bodega-style beer & wine with age verification.' }
      ],
      rules: [
        'Hard age-verification requirement → Korona + Zebra ID scanner.',
        'Multi-store owner → Korona (multi-location) over Clover.',
        'Dual pricing is very common in liquor — most competitors already run it; lead with 0%.'
      ],
      pricing: 'Liquor merchants expect dual pricing — lead with 0% card fees. Statement-beat is the fallback for the rare owner who refuses signage.',
      placements: ['korona', 'clover', 'nrs']
    },

    'boutique': { label: 'Boutique & Clothing', group: 'Retail',
      ask: [
        'Do you also sell online or on Instagram? Need inventory synced between floor and web?',
        'Matrix inventory (size/color) or simple items?',
        'Do you do pop-ups or trunk shows away from the store?'
      ],
      primary: { name: 'Square', why: 'Best-in-class for boutiques — floor + online store + social selling in one ecosystem, beautiful hardware, easy staff training.' },
      alts: [
        { name: 'Clover', why: 'Retail Growth for richer item-level tracking; placement mode gets hardware at $0 down.' },
        { name: 'SumUp', why: 'POS Lite bundle $499 one-time, $0 monthly — the value play for tiny shops.' }
      ],
      rules: [
        'Heavy online + in-person mix → Square wins on ecosystem.',
        'Pop-ups / markets → add Square Reader ($59) or Handheld ($399).',
        'Owner hates monthly fees → SumUp POS Lite ($0/mo software).'
      ],
      pricing: 'Square/SumUp merchants: we review the statement and match or beat the effective rate on our rails. Higher tickets tolerate percentage pricing; dual pricing optional.',
      placements: ['square', 'sumup', 'clover']
    },

    'jewelry': { label: 'Jewelry Stores', group: 'Retail',
      ask: [
        'What is your highest typical ticket? Any single sales over $5–10k? (Underwriting needs this.)',
        'Do you take deposits, layaway, or phone orders?',
        'Repairs and custom work — do you invoice those?'
      ],
      primary: { name: 'Clover', why: 'Clean countertop presence, invoices and deposits handled, strong for high-ticket keyed + card-present mix.' },
      alts: [
        { name: 'Quantic', why: 'Swan station with premium inventory module for serious multi-case stores.' },
        { name: 'Valor terminal + gateway', why: 'Simple high-ticket terminal play when they keep their own books.' }
      ],
      rules: [
        'High single tickets → disclose max ticket on the app; set realistic limits so payouts are not held.',
        'Phone orders/deposits → add a gateway virtual terminal (NMI or Authorize.net).',
        'Repairs pipeline → invoicing add-on or QuickBooks integration.'
      ],
      pricing: 'High average ticket → interchange-plus shines; per-item fees are irrelevant, basis points are everything. Statements from jewelry stores usually show inflated keyed rates — easy beat.',
      placements: ['clover', 'quantic', 'terminal-gateway']
    },

    'specialty-retail': { label: 'Specialty Retail', group: 'Retail',
      ask: [
        'What makes your inventory unusual — serialized items, rentals, consignment, bulk?',
        'Ticketing or admissions component?',
        'How much lives online vs in-store?'
      ],
      primary: { name: 'Korona', why: 'The flexible retail engine — modules for ticketing, franchise, integrations; per-register pricing scales.' },
      alts: [
        { name: 'Clover', why: 'App market covers many niche needs with mainstream ease.' },
        { name: 'Square', why: 'Simple + online-first specialty shops.' }
      ],
      rules: [
        'Admissions/gates → Korona Ticketing module ($50/gate).',
        'Consignment or serialized → Korona Retail/Plus tiers.',
        'Under ~$15k/mo volume and simple needs → Square/SumUp keeps it easy.'
      ],
      pricing: 'Mixed — read the statement. Specialty retail often has one processor for the floor and Stripe online; consolidating both onto one file is the win.',
      placements: ['korona', 'clover', 'square']
    },

    'fine-dining': { label: 'Fine Dining & Full Service', group: 'Food & Beverage',
      ask: [
        'Covers per night and turns? Coursing and table management needs?',
        'Pay-at-table — do servers close checks tableside today?',
        'Online reservations/waitlist? Wine program with high bottle tickets?',
        'How many stations: server stations, bar, kitchen screens, expo?'
      ],
      primary: { name: 'SkyTab by Shift4', why: 'The full-service standard — $29.99/mo base bundle, pay-at-table handhelds, KDS, Lighthouse reporting, lifetime hardware warranty, $0 upfront.' },
      alts: [
        { name: 'Quantic', why: 'Strong table service + reservations module when they want to own hardware.' },
        { name: 'Clover', why: 'Restaurant Growth plan ($89.95/mo) for smaller rooms already comfortable with Clover.' }
      ],
      rules: [
        'White-tablecloth, coursing, big wine list → SkyTab, full stop.',
        'Wants to own hardware outright → Quantic Swan bundles.',
        '30-day SkyTab trial then 30-month agreement — say it up front, it builds trust.'
      ],
      pricing: 'SkyTab is a placement: $0 upfront, per-device monthly. Dual pricing works in casual FSR; fine dining often prefers a clean interchange-plus quote instead — read the room.',
      placements: ['skytab', 'quantic', 'clover']
    },

    'pizzerias': { label: 'Pizzerias', group: 'Food & Beverage',
      ask: [
        'Delivery: your own drivers, third-party apps, or both? Which apps?',
        'Phone orders — how many lines? Caller ID pop would help?',
        'Online ordering: theirs or yours? Commission pain?',
        'Slices at lunch (speed) vs pies at night (phones) — what does rush look like?'
      ],
      primary: { name: 'SkyTab by Shift4', why: 'Built for pizza — caller ID (2-line $9.99/4-line $19.99), delivery management, online ordering, KDS, $0 upfront.' },
      alts: [
        { name: 'PAYS', why: 'All-inclusive dual pricing house — Growth plan $79/mo includes DoorDash/UberEats/Grubhub integration and KDS.' },
        { name: 'Quantic', why: 'Caller ID ($12/mo) + DoorDash Drive ($20/mo) modules, own-your-hardware route.' }
      ],
      rules: [
        'Heavy phone orders → caller ID is the demo moment; lead with it.',
        'Bleeding third-party commissions → pitch first-party online ordering (SkyTab OLO or Quantic OLO $55/mo).',
        'Cash-heavy neighborhood spot → dual pricing lands easily.'
      ],
      pricing: 'Pizzerias run thin margins — 0% dual pricing is usually an instant yes. Statement-beat as fallback.',
      placements: ['skytab', 'pays', 'quantic']
    },

    'food-trucks': { label: 'Food Trucks', group: 'Food & Beverage',
      ask: [
        'Connectivity where you park — reliable LTE? Offline mode matters.',
        'One window or two? Line-busting needed?',
        'Events and festivals — need extra handhelds occasionally?',
        'Power setup — battery/inverter constraints?'
      ],
      primary: { name: 'Square', why: 'The truck favorite — Terminal ($299) or Handheld ($399), works offline, zero monthly to start, easy menu changes from a phone.' },
      alts: [
        { name: 'SkyTab Mobile', why: '$20/mo handheld on the SkyTab platform when they also run a brick-and-mortar.' },
        { name: 'PAX A920 Pro', why: 'Standalone smart terminal on our processing — lowest total cost with dual pricing.' }
      ],
      rules: [
        'Also owns a restaurant → keep one platform (SkyTab both places).',
        'Wants 0% fees at the window → PAX/Dejavoo terminal with dual pricing.',
        'Festivals → add readers, not registers.'
      ],
      pricing: 'Low ticket, high speed → flat-rate Square is fine to start; move them to our terminal + dual pricing once volume justifies it. Great upgrade-later pipeline.',
      placements: ['square', 'skytab', 'terminal-gateway']
    },

    'bars': { label: 'Bars & Nightclubs', group: 'Food & Beverage',
      ask: [
        'Tabs: how do you hold cards? Pre-auth needed?',
        'Speed at last call — how many drinks a minute per well?',
        'Age verification at the door or at the bar?',
        'Cash percentage? ATM on site?'
      ],
      primary: { name: 'SkyTab by Shift4', why: 'Bar-proven — fast tabs with pre-auth, handhelds for the floor, KDS for the kitchen, rugged hardware with lifetime warranty.' },
      alts: [
        { name: 'Clover', why: 'Compact Mini + Flex combo for cocktail bars and taprooms.' },
        { name: 'Quantic', why: 'Own-hardware route with strong bar feature set.' }
      ],
      rules: [
        'Nightclub with door cover → ask about ticketing/cover charge flow.',
        'Tab pre-auth is the killer feature question — if their current system cannot, we win.',
        'High cash + late night → dual pricing normal; also discuss chargeback protection.'
      ],
      pricing: 'Dual pricing very common. Watch for high keyed/no-tip-adjust fees on their current statement — usually an easy beat.',
      placements: ['skytab', 'clover', 'quantic']
    },

    'qsr-cafes': { label: 'QSR, Cafés & Coffee Shops', group: 'Food & Beverage',
      ask: [
        'Line speed at morning rush — seconds per order matters. Kiosk interest?',
        'Loyalty program today? Punch cards → digital?',
        'Mobile/online ahead-of-line ordering?',
        'Tips: counter tip prompts — current setup?'
      ],
      primary: { name: 'SkyTab by Shift4', why: 'QSR-tuned — self-order kiosk ($29.99/mo), KDS, customer-facing display, gift cards ($25/mo), all placement-model.' },
      alts: [
        { name: 'Square', why: 'The café classic — Stand/Register, free plan to start, strong loyalty.' },
        { name: 'PAYS', why: '0% dual-pricing all-inclusive — Starter $59/mo with online ordering included.' }
      ],
      rules: [
        'Lines out the door → kiosk pitch (SkyTab kiosk or Clover Kiosk).',
        'Indie coffee shop vibe, design-conscious → Square hardware fits the counter.',
        'Fee-sensitive franchisee → PAYS dual pricing all-in.'
      ],
      pricing: 'Small tickets → per-item fees brutal on flat rate; interchange-plus or dual pricing saves real money. Show the math on a $6 latte.',
      placements: ['skytab', 'square', 'pays']
    },

    'bakeries': { label: 'Bakeries, Delis & Markets', group: 'Food & Beverage',
      ask: [
        'Sell by weight? Certified scale integration needed?',
        'Wholesale/catering invoices alongside the counter?',
        'Pre-orders (holidays, cakes) — deposits?',
        'Label printing for packaged goods?'
      ],
      primary: { name: 'Clover', why: 'Counter + scale + label support, invoices for wholesale, familiar for staff.' },
      alts: [
        { name: 'SkyTab', why: 'Digital scale ($39.99/mo) + label printer ($19.99/mo) on placement — $0 upfront for a full deli line.' },
        { name: 'Quantic', why: 'PDN certified scale ($549) + label printer, own-hardware route.' }
      ],
      rules: [
        'By-weight selling → certified scale is non-negotiable; spec it in the quote.',
        'Wholesale accounts → invoicing (Clover invoices or QuickBooks integration).',
        'Cake deposits → card-on-file / deposit workflow question.'
      ],
      pricing: 'Mixed ticket sizes; dual pricing works at the counter, invoices often stay standard-priced. Quote both lanes.',
      placements: ['clover', 'skytab', 'quantic']
    },

    'auto-repair': { label: 'Auto Repair & Automotive', group: 'Services',
      ask: [
        'How do you quote and invoice a job today — paper, shop software?',
        'Average repair order? Big tickets ($1–3k) common?',
        'Deposits for parts? Card-on-file for regulars?',
        'Do customers pay in the bay, at the counter, or by text link?'
      ],
      primary: { name: 'Terminal + FieldPulse invoicing', why: 'Countertop or handheld terminal (PAX/Dejavoo/Valor) for walk-ups + FieldPulse for estimates→invoices→text-to-pay.' },
      alts: [
        { name: 'Clover', why: 'Services Growth plan ($84.95/mo) — invoices, customers, payments in one box.' },
        { name: 'Quantic', why: 'Station + QuickBooks interface ($20/mo) for shops living in QB.' }
      ],
      rules: [
        'Shop management software already in place → sell the gateway/terminal that integrates, do not rip out their workflow.',
        'Text-to-pay is the wow demo for shops — invoice from FieldPulse, customer pays from their phone.',
        'High average ticket → interchange-plus; surcharge/dual pricing is common in auto and well accepted.'
      ],
      pricing: 'High tickets → basis points matter. Shops are classic dual-pricing adopters (parts+labor quotes absorb it cleanly). Statements often show old-school tiered pricing — easy beat.',
      placements: ['terminal-gateway', 'clover', 'quantic']
    },

    'salons': { label: 'Salons & Spas', group: 'Services',
      ask: [
        'Booking: how do clients book today? No-show problem?',
        'Independent chairs/booth renters — who takes the payment?',
        'Retail product sales at the front desk?',
        'Tips flow — pooled, direct, on card?'
      ],
      primary: { name: 'Square', why: 'Appointments + POS + no-show protection in one; booth renters can run their own accounts.' },
      alts: [
        { name: 'Clover', why: 'Services Growth plan with appointments via app market; placement mode for $0 down.' },
        { name: 'SumUp', why: 'Solo reader ($54) per chair for independent stylists — dead simple.' }
      ],
      rules: [
        'No-show pain → card-on-file at booking is the closer.',
        'Booth renters → one master account vs per-renter accounts: ask early, it shapes everything.',
        'Med-spa services → may touch healthcare underwriting; ask what services exactly.'
      ],
      pricing: 'Service tickets tolerate percentage pricing; dual pricing less common in upscale spas (optics) — offer both, let the owner choose.',
      placements: ['square', 'clover', 'sumup']
    },

    'home-services': { label: 'Home Services (HVAC, Plumbing, Electrical…)', group: 'Services',
      ask: [
        'How many techs in the field? How do they collect today — check, card over phone?',
        'Quoting/estimating software in use? (ServiceTitan, Housecall, none?)',
        'Deposits before jobs? Financing conversations on big tickets?',
        'Recurring maintenance plans?'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'Our house invoicing platform — estimates, invoices, text-to-pay and recurring on our rails. Invoice-type deals lead with Next2Pay, every time.' },
      alts: [
        { name: 'FieldPulse + gateway', why: 'Full field-service management (scheduling, dispatch) when they need FSM beyond invoicing.' },
        { name: 'Mobile terminal (PAX A920 / Dejavoo P8)', why: 'Tap-in-the-driveway for techs; pairs with any back office.' }
      ],
      rules: [
        'Already on ServiceTitan/Housecall → integrate payments (gateway), do not replace the FSM.',
        'Recurring maintenance contracts → recurring billing via gateway is the hook.',
        'Big tickets → mention business financing referrals (NextPay financing).'
      ],
      pricing: 'Keyed-over-phone is where they bleed today — moving to text-to-pay links and tap-in-field drops their effective rate immediately. Surcharge/dual pricing widely accepted in trades.',
      placements: ['invoicing-gateway', 'terminal-gateway']
    },

    'fitness': { label: 'Fitness & Gyms', group: 'Services',
      ask: [
        'Memberships: how many, billed how, and how many cards fail each month?',
        'Gym management software (MindBody, Zen Planner…)?',
        'Front-desk retail (drinks, gear)?',
        'Class packs, day passes, annual pre-pays?'
      ],
      primary: { name: 'Gateway recurring (NMI / FluidPay)', why: 'Membership billing with account-updater to rescue failing cards — the revenue story gyms care about.' },
      alts: [
        { name: 'Square', why: 'Front desk + simple memberships for boutique studios.' },
        { name: 'Clover', why: 'Counter retail + app-market gym tools.' }
      ],
      rules: [
        'On MindBody etc. → payments integration play, not a POS swap.',
        'Failed recurring payments → account updater + retry logic is the differentiator; quantify recovered revenue.',
        'High-volume recurring → watch chargebacks; mention chargeback protection.'
      ],
      pricing: 'Card-not-present recurring rates dominate — interchange-plus with account updater beats their flat-rate setup. Show recovered-payment math, not just rate.',
      placements: ['invoicing-gateway', 'square', 'clover']
    },

    'professional-services': { label: 'Professional Services (Legal, Accounting…)', group: 'Services',
      ask: [
        'How do clients pay — invoices, retainers, in office?',
        'Trust/IOLTA accounting rules apply (law firms)?',
        'Average invoice size? Net terms?',
        'Practice management software in use?'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'House invoicing — emailed invoices, saved cards, recurring retainers, virtual terminal for phone payments. No countertop hardware needed.' },
      alts: [
        { name: 'QuickBooks integration', why: 'Payments inside the books they already keep.' },
        { name: 'Clover Go / SumUp Solo', why: 'Pocket reader for the occasional in-person payment.' }
      ],
      rules: [
        'Law firms → surcharging rules + trust account handling need care; flag for Dom before quoting fees on trust payments.',
        'Big invoices → percentage caps matter; consider flat-fee ACH as the primary rail with card as convenience.',
        'Offer ACH/echeck via gateway — often the real winner at $2k+ invoices.'
      ],
      pricing: 'High-ticket CNP — every basis point counts, and ACH steals the show. Lead with total cost per $10k invoiced.',
      placements: ['invoicing-gateway']
    },

    'cleaning': { label: 'Cleaning Services', group: 'Services',
      ask: [
        'Residential, commercial, or both? Recurring schedules?',
        'How do you invoice and chase payment today?',
        'Crews in the field — collect on site or bill after?'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'House invoicing — recurring job billing, card-on-file autopay, text-to-pay. Invoice-type deals lead with Next2Pay.' },
      alts: [
        { name: 'SumUp Solo', why: 'Cheap in-field reader for crews that collect on completion.' },
        { name: 'QuickBooks integration', why: 'For owners running everything in QB already.' }
      ],
      rules: [
        'Recurring residential → card-on-file autopay is the pitch (no more chasing checks).',
        'Commercial net-30 accounts → invoicing with ACH option.',
        'Keep hardware minimal — this is a software-and-rails sale.'
      ],
      pricing: 'Mostly CNP recurring — interchange-plus + ACH mix. Small operators are often on PayPal/Venmo; formalizing saves fees and looks professional to their clients.',
      placements: ['invoicing-gateway', 'sumup']
    },

    'healthcare': { label: 'Healthcare & Medical (Vision, Dental, Chiro, Derm, Mental Health, Wellness)', group: 'Healthcare',
      ask: [
        'Copays at front desk vs statements after insurance — what is the mix?',
        'Patient payment plans? Card-on-file consent workflow?',
        'Any HIPAA-driven constraints from their compliance officer on payment tech?',
        'Multiple providers/locations under one tax ID?'
      ],
      primary: { name: 'Clover (Healthcare plan)', why: 'Front-desk friendly, $0 software plan for healthcare, clean countertop presence, payment plans via apps.' },
      alts: [
        { name: 'Terminal + gateway (NMI / Authorize.net)', why: 'Simple copay terminal + virtual terminal for post-insurance balances and stored consents.' },
        { name: 'LQPay', why: 'Healthcare-oriented billing workflows and statements.' }
      ],
      rules: [
        'Card-on-file for balances after adjudication → the killer workflow; needs stored-credential consent language.',
        'Surcharging patient payments is regulated territory in some states — quote standard or dual-pricing-with-care; check with Dom.',
        'Integrations with practice management (Dentrix etc.) → ask before promising; usually gateway-level.'
      ],
      pricing: 'Steady CNP + card-present mix; statements typically show mid-market processors with junk fees (PCI, statement fees) — line-item beats are easy to show.',
      placements: ['clover', 'terminal-gateway', 'invoicing-gateway']
    },

    'high-risk': { label: 'High Risk & Specialty', group: 'Specialty',
      ask: [
        'Exactly what do you sell, and on what billing model (one-time, subscription, trial)?',
        'Processing history: current/former processors, any terminations (MATCH list)?',
        'Chargeback ratio? Refund policy?',
        'Monthly volume and average ticket, documented?'
      ],
      primary: { name: 'Gateway-first (NMI / FluidPay) + specialty underwriting', why: 'High-risk placements are underwriting deals, not hardware deals — package the file well and route to Dom.' },
      alts: [],
      rules: [
        'NEVER promise approval or rates before underwriting on high-risk — package and submit.',
        'Required docs are heavier: 3–6 months statements, bank statements, refund/chargeback history, licenses.',
        'Reserve requirements and rolling reserves are normal — prep the merchant so it is not a surprise.'
      ],
      pricing: 'Rates set by underwriting per file. Your job: complete file, honest volumes, no surprises. Do not quote numbers first.',
      placements: ['high-risk']
    }
  },

  /* ---------- Product library ---------- */
  products: {
    pos: [
      { name: 'NextPay POS (Chively)', tag: 'Our house all-in-one POS', sell: ['Full restaurant + retail feature set', 'Handheld, kiosk and customer-screen options', 'Best margins — our own stack'], link: 'https://nextpaypos.com/chively' },
      { name: 'SkyTab by Shift4', tag: 'Full-service restaurant standard', sell: ['$29.99/mo base bundle, $0 upfront, lifetime warranty', 'Pay-at-table, KDS, kiosk, caller ID', '30-day trial → 30-month agreement'], link: 'https://nextpaypos.com/shift4-dine' },
      { name: 'Clover', tag: 'The mainstream all-in-one', sell: ['Placement ($0 down) or buy outright', 'Software $0–$89.95/mo by vertical', 'Huge app market'], link: 'https://nextpaypos.com/clover' },
      { name: 'Square', tag: 'Design-friendly SMB ecosystem', sell: ['POS + online + invoices in one', 'Free plan to start', 'We meet-or-beat their published rates on our rails'], link: 'https://nextpaypos.com/square' },
      { name: 'Quantic', tag: 'Own-your-hardware cloud POS', sell: ['Swan bundles from $919', 'Pro $60/mo first station, $50 additional', 'Deep module list (OLO, loyalty, reservations)'], link: 'https://nextpaypos.com/quantic' },
      { name: 'Korona', tag: 'Serious retail & liquor inventory', sell: ['Core $59 / Retail $79 / Plus $99 per register', 'Ticketing, franchise, ID-scanner add-ons', 'Multi-location strength'], link: 'https://nextpaypos.com/korona' },
      { name: 'NRS', tag: 'C-store / bodega specialist', sell: ['Age verification + scan data', 'Customer-facing screen', 'Price-friendly for single lanes'], link: 'https://nextpaypos.com/nrs' },
      { name: 'PAYS', tag: 'All-inclusive 0% dual pricing POS', sell: ['Starter $59 / Growth $79 / Enterprise $99', 'Delivery-app integrations on Growth', 'Station bundle $999'], link: 'https://nextpaypos.com/pays-pos' },
      { name: 'SumUp', tag: 'Value hardware, $0 monthly', sell: ['POS Lite bundle $499, Terminal $249, Solo $54', 'Free POS software tier', 'Great for micro-merchants'], link: 'https://nextpaypos.com/sumup' },
      { name: 'DejaPay Pro', tag: 'POS on Dejavoo rails', sell: ['Budget-friendly counter setup', 'Pairs with Dejavoo terminals', 'Simple menus, fast setup'], link: 'https://nextpaypos.com/dejapay' }
    ],
    terminals: [
      { name: 'PAX (A920 Pro, A80, A35…)', tag: 'Smart Android terminals', sell: ['A920 Pro portable flagship', 'Dual pricing ready', 'Countertop to mobile line-up'], link: 'https://nextpaypos.com/pax' },
      { name: 'Dejavoo (P line, QD line)', tag: 'Workhorse terminals', sell: ['P1 desktop / P8 mobile', 'iPOSPays gateway native', 'Great price points'], link: 'https://nextpaypos.com/dejavoo' },
      { name: 'Clover Flex & Go', tag: 'Handheld + pocket reader', sell: ['Flex: printer + scanner in hand', 'Go: phone-paired reader'], link: 'https://nextpaypos.com/clover' },
      { name: 'Square Terminal & Handheld', tag: 'Square hardware line', sell: ['Terminal $299 all-in-one', 'Handheld $399 for tableside'], link: 'https://nextpaypos.com/square' },
      { name: 'Valor VL series', tag: 'Value smart terminals', sell: ['Dual pricing native', 'Valor gateway portal included'], link: 'https://nextpaypos.com/valor-terminals' },
      { name: 'SwipeSimple', tag: 'Mobile reader + virtual terminal', sell: ['Phone-based payments', 'Invoices + item catalog'], link: 'https://nextpaypos.com/swipesimple' }
    ],
    gateways: [
      { name: 'NMI', tag: 'Enterprise-grade gateway', sell: ['Virtual terminal, recurring, account updater', 'Integrates with almost everything'], link: 'https://nextpaypos.com/nmi' },
      { name: 'FluidPay', tag: 'Modern gateway, great for recurring', sell: ['Clean portal', 'Strong for subscriptions & invoicing'], link: 'https://nextpaypos.com/fluidpay' },
      { name: 'Authorize.net', tag: 'The legacy standard', sell: ['Merchants know the name', 'Broad cart/software support'], link: 'https://nextpaypos.com/authorize-net' },
      { name: 'Luqra', tag: 'Specialty gateway', sell: ['Flexible for niche billing models'], link: 'https://nextpaypos.com/luqra' },
      { name: 'Valor gateway', tag: 'Pairs with Valor terminals', sell: ['One portal for card-present + CNP'], link: 'https://nextpaypos.com/valor-gateway' },
      { name: 'iPOSPays', tag: 'Dejavoo-native gateway', sell: ['Drives Dejavoo/DejaPay hardware'], link: 'https://nextpaypos.com/ipospays' }
    ],
    invoicing: [
      { name: 'Next2Pay Invoicing', tag: 'OUR house invoicing — lead with this on every invoice-type deal', sell: ['Estimates, invoices, text-to-pay, recurring — on our rails', 'Best margins in the invoicing lineup', 'Next2Pay proposal ready to build in the Proposal Studio'], link: 'https://nextpaypos.com/next2pay' },
      { name: 'FieldPulse', tag: 'Field service suite', sell: ['Estimates → invoices → text-to-pay', 'Scheduling + CRM for trades'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'Field Work', tag: 'Field service alternative', sell: ['Job management + payments'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'LQPay', tag: 'Billing & statements', sell: ['Healthcare-friendly workflows'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'QuickBooks integrations', tag: 'Payments inside QB', sell: ['Invoices paid straight into the books'], link: 'https://nextpaypos.com/integrations' }
    ]
  },

  /* ---------- Submission playbooks per placement ---------- */
  commonDocs: [
    'Signed merchant application (send from Quick Application or the fillable PDF at nextpaypos.com/application)',
    'Voided check or bank letter (must match legal name on the app)',
    'Owner driver’s license (front)',
    '3 most recent processing statements (existing businesses) or projections (startups)',
    'EIN / SS-4 confirmation if legal name is ambiguous',
    'Photos or site survey for POS installs (counter space, network, power)'
  ],
  placements: {
    'skytab': { label: 'SkyTab by Shift4', steps: [
      'Confirm the build in the Proposal Builder (base bundle $29.99/mo + per-device monthlies) and price processing.',
      'Collect common docs plus the signed SkyTab agreement (30-day trial, then 30-month term — make sure the owner heard this from you first).',
      'Menu build: collect the full menu (photos or files) — send with the submission.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) with subject "SkyTab deal — {DBA}".',
      'Install is scheduled by the SkyTab team; track status in the Shift4 partner portal and log it on the deal in My Pipeline.'
    ]},
    'clover': { label: 'Clover', steps: [
      'Lock the hardware list + software plan (placement vs buy) from the Proposal Builder.',
      'Collect common docs; note the $5/mo Clover platform fee per location on the quote.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) — subject "Clover deal — {DBA}".',
      'Hardware ships configured; schedule the install/training call with the merchant and log it.'
    ]},
    'square': { label: 'Square (hardware resell + rate review)', steps: [
      'Quote hardware from the reseller guide; software plan Free or Plus $49/mo.',
      'If they already process on Square: run the statement meet-or-beat to move processing to our rails where it fits.',
      'Submit order + docs to dom@nextpaypos.com — subject "Square deal — {DBA}".'
    ]},
    'quantic': { label: 'Quantic', steps: [
      'Build from the Unified Pricing sheet (Swan bundles, per-device software, modules).',
      'Include the Setup & Training package line (scoped per build).',
      'Common docs + menu/inventory file; email to dom@nextpaypos.com — subject "Quantic deal — {DBA}".',
      'Quantic runs a remote menu build + install call; coordinate the date with the merchant.'
    ]},
    'korona': { label: 'Korona', steps: [
      'Per-register plan (Core $59 / Retail $79 / Plus $99) + modules + hardware bundles.',
      'Inventory import: ask for their item list/spreadsheet up front — it gates go-live.',
      'Common docs; email to dom@nextpaypos.com — subject "Korona deal — {DBA}".'
    ]},
    'nrs': { label: 'NRS', steps: [
      'Confirm lane count, EBT/SNAP needs and scan-data enrollment.',
      'Common docs + EBT/FNS number if applicable.',
      'Email to dom@nextpaypos.com — subject "NRS deal — {DBA}".'
    ]},
    'pays': { label: 'PAYS', steps: [
      'Pick the plan (Starter $59 / Growth $79 / Enterprise $99) + station bundle ($999) or quoted hardware.',
      'Dual-pricing signage expectations — set them now.',
      'Common docs + menu; email to dom@nextpaypos.com — subject "PAYS deal — {DBA}".'
    ]},
    'sumup': { label: 'SumUp', steps: [
      'Hardware from the SumUp price list (POS Lite $499, Terminal $249, Solo $54…).',
      'Common docs; email to dom@nextpaypos.com — subject "SumUp deal — {DBA}".'
    ]},
    'next2pay': { label: 'Next2Pay / Chively (house POS & invoicing)', steps: [
      'House deal — best margins in the book. Confirm the build: Chively POS stations/handhelds, Next2Pay Invoicing, or both.',
      'Build the quote in the Proposal Studio. Selling NextLink (client automation outreach) too? Its per-seat proposal has its own section there.',
      'Common docs + menu/inventory or invoice workflow details.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) — subject "Next2Pay deal — {DBA}".',
      'Onboarding and install are run in-house — coordinate dates directly with Dom.'
    ]},
    'terminal-gateway': { label: 'Standalone terminal (+ gateway)', steps: [
      'Pick terminal (PAX / Dejavoo / Valor) and file build: dual pricing or standard; tip adjust; auto-batch time.',
      'If CNP needed, add the gateway (NMI / FluidPay / Authorize.net / iPOSPays for Dejavoo).',
      'Common docs; email to dom@nextpaypos.com — subject "Terminal deal — {DBA}".'
    ]},
    'invoicing-gateway': { label: 'Invoicing / gateway (software-first)', steps: [
      'Confirm the workflow: estimates? recurring? text-to-pay? Pick FieldPulse / Field Work / LQPay / QB accordingly.',
      'Gateway pairing (NMI or FluidPay usually) — virtual terminal + recurring + account updater as needed.',
      'Common docs; email to dom@nextpaypos.com — subject "Invoicing deal — {DBA}".'
    ]},
    'high-risk': { label: 'High Risk & Specialty', steps: [
      'Do NOT quote rates. Collect the full file: 3–6 months processing + bank statements, refund/chargeback history, licenses, website/terms.',
      'Write a one-paragraph business summary (what they sell, billing model, why volume is what it is).',
      'Email the complete file to dom@nextpaypos.com — subject "HIGH RISK — {DBA}". Dom routes to the right book.'
    ]}
  },

  contacts: {
    submit: 'dom@nextpaypos.com',
    cc: 'payments@nextpaypos.com, alexander@nextpaypos.com',
    help: 'hello@nextpaypos.com'
  },

  /* ---------- Deal signals ----------
     What the prospect tells you, as checkable facts. The Navigator uses
     these to score the product fit and build the stack automatically. */
  signals: {
    zerofee:   'Wants 0% card fees (dual pricing)',
    cash:      'Cash-heavy customer base',
    zero_down: 'Cash-tight — needs $0 down on hardware',
    ownhw:     'Wants to own the hardware outright',
    budget:    'Very price-sensitive / micro-merchant',
    multi:     'Multiple locations or registers',
    highticket:'High average ticket ($500+)',
    ebt:       'Needs EBT / SNAP',
    scan:      'Tobacco scan-data rebates',
    age:       'Age-restricted items (ID checks)',
    scale:     'Sells by weight (certified scale)',
    phone:     'Heavy phone orders',
    delivery:  'Delivery (own drivers or apps)',
    olo:       'Wants first-party online ordering',
    kiosk:     'Lines at rush — needs speed / kiosk',
    tabs:      'Bar tabs / card pre-auth',
    online:    'Sells online / e-commerce',
    invoices:  'Sends invoices or estimates',
    recurring: 'Recurring billing / memberships',
    field:     'Techs or crews collect in the field',
    appts:     'Appointment booking / no-show pain',
    fsm:       'Already runs shop/practice software'
  },

  /* Signals most worth probing per industry (others behind "show all") */
  industrySignals: {
    'convenience':          ['ebt', 'scan', 'age', 'scale', 'cash', 'zerofee', 'multi', 'budget'],
    'liquor':               ['age', 'cash', 'zerofee', 'multi', 'ownhw'],
    'boutique':             ['online', 'multi', 'budget', 'zero_down'],
    'jewelry':              ['highticket', 'invoices', 'phone', 'online'],
    'specialty-retail':     ['online', 'multi', 'ownhw', 'budget'],
    'fine-dining':          ['tabs', 'phone', 'olo', 'multi', 'zero_down', 'ownhw'],
    'pizzerias':            ['phone', 'delivery', 'olo', 'zerofee', 'cash', 'kiosk'],
    'food-trucks':          ['budget', 'zero_down', 'zerofee', 'kiosk'],
    'bars':                 ['tabs', 'age', 'cash', 'zerofee', 'kiosk'],
    'qsr-cafes':            ['kiosk', 'olo', 'zerofee', 'budget', 'multi'],
    'bakeries':             ['scale', 'invoices', 'phone', 'olo'],
    'auto-repair':          ['highticket', 'invoices', 'fsm', 'zerofee', 'field'],
    'salons':               ['appts', 'budget', 'multi', 'recurring'],
    'home-services':        ['field', 'invoices', 'recurring', 'fsm', 'highticket'],
    'fitness':              ['recurring', 'fsm', 'multi'],
    'professional-services':['invoices', 'highticket', 'recurring', 'online'],
    'cleaning':             ['recurring', 'invoices', 'field', 'budget'],
    'healthcare':           ['appts', 'recurring', 'fsm', 'highticket'],
    'high-risk':            ['online', 'recurring', 'highticket']
  },

  /* How each signal moves the recommendation.
     boosts: score changes on candidate products (m = name-match regex, d = delta)
     stack:  auto-suggestions for the rest of the stack (slot: terminal|gateway|invoicing|addon)
     note:   strategy reminder shown with the recommendation */
  signalEffects: {
    zerofee:   { boosts: [{ m: 'pays', d: 2, why: 'All-inclusive dual pricing house' }],
                 note: 'Lead with dual pricing — signage + a correctly built terminal/POS file.' },
    cash:      { note: 'Cash-heavy crowd = easy dual-pricing adoption. Show the cash price.' },
    zero_down: { boosts: [{ m: 'skytab|shift4', d: 2, why: '$0-down placement model' }, { m: 'clover', d: 1, why: 'Placement mode available' }, { m: 'quantic|korona', d: -1, why: 'Buy-outright model needs cash up front' }] },
    ownhw:     { boosts: [{ m: 'quantic', d: 2, why: 'Own-your-hardware bundles' }, { m: 'korona', d: 2, why: 'One-time hardware, per-register software' }, { m: 'skytab|shift4', d: -2, why: 'Placement-only — no ownership' }] },
    budget:    { boosts: [{ m: 'sumup', d: 2, why: '$0 monthly software tier' }, { m: 'nrs', d: 1, why: 'Price-friendly single lane' }] },
    multi:     { boosts: [{ m: 'korona', d: 2, why: 'Multi-location strength' }, { m: 'quantic', d: 1, why: 'Multi-location dashboard' }, { m: 'skytab|shift4', d: 1, why: 'Lighthouse multi-site reporting' }] },
    highticket:{ boosts: [{ m: 'clover', d: 1, why: 'Handles high-ticket keyed + deposits well' }],
                 stack: [{ slot: 'gateway', v: 'NMI or Authorize.net (virtual terminal)', why: 'High tickets usually mean phone/keyed payments too' }],
                 note: 'Interchange-plus shines at high tickets; disclose max single ticket on the application.' },
    ebt:       { boosts: [{ m: 'nrs', d: 2, why: 'EBT/SNAP native' }, { m: 'korona', d: 1, why: 'EBT-capable retail lanes' }],
                 note: 'Confirm EBT/FNS number on the application up front — it changes the file build.' },
    scan:      { boosts: [{ m: 'nrs', d: 2, why: 'Scan-data programs built in' }, { m: 'korona', d: 2, why: 'Scan-data capable' }, { m: 'square|sumup', d: -2, why: 'No tobacco scan-data support' }] },
    age:       { boosts: [{ m: 'korona', d: 2, why: 'Zebra ID-scanner add-on forces age checks' }, { m: 'nrs', d: 1, why: 'Built-in age verification' }] },
    scale:     { boosts: [{ m: 'clover', d: 1, why: 'Integrated certified scale' }, { m: 'quantic', d: 1, why: 'PDN certified scale ($549)' }, { m: 'skytab|shift4', d: 1, why: 'Digital scale $39.99/mo on placement' }],
                 stack: [{ slot: 'addon', v: 'Certified integrated scale', why: 'By-weight selling — spec it in the quote, non-negotiable' }] },
    phone:     { boosts: [{ m: 'skytab|shift4', d: 2, why: 'Caller ID pop ($9.99–$19.99/mo) — the demo moment' }, { m: 'quantic', d: 1, why: 'Caller ID module $12/mo' }],
                 stack: [{ slot: 'addon', v: 'Caller ID (2- or 4-line)', why: 'Heavy phone orders' }] },
    delivery:  { boosts: [{ m: 'skytab|shift4', d: 2, why: 'Delivery management built in' }, { m: 'pays', d: 2, why: 'Growth plan includes DoorDash/UberEats/Grubhub' }, { m: 'quantic', d: 1, why: 'DoorDash Drive module $20/mo' }] },
    olo:       { boosts: [{ m: 'skytab|shift4', d: 1, why: 'First-party online ordering' }, { m: 'pays', d: 1, why: 'Online ordering included from Starter' }, { m: 'quantic', d: 1, why: 'OLO module $55/mo' }],
                 note: 'Pitch first-party ordering as the escape from third-party commissions.' },
    kiosk:     { boosts: [{ m: 'skytab|shift4', d: 1, why: 'Self-order kiosk $29.99/mo' }, { m: 'clover', d: 1, why: 'Clover Kiosk' }],
                 stack: [{ slot: 'addon', v: 'Self-order kiosk', why: 'Rush-hour lines — kiosks lift ticket size too' }] },
    tabs:      { boosts: [{ m: 'skytab|shift4', d: 2, why: 'Fast tabs with card pre-auth' }],
                 note: 'Pre-auth tabs is the killer question at bars — if their current system can’t, we win.' },
    online:    { boosts: [{ m: 'square', d: 1, why: 'POS + online store one ecosystem' }],
                 stack: [{ slot: 'gateway', v: 'NMI or FluidPay', why: 'E-commerce / card-not-present rail' }] },
    invoices:  { stack: [{ slot: 'invoicing', v: 'Next2Pay Invoicing — house first', why: 'Invoice-type deals always lead with Next2Pay; FieldPulse only if they need full FSM' }] },
    recurring: { stack: [{ slot: 'invoicing', v: 'Next2Pay Invoicing — recurring billing', why: 'House recurring first' }, { slot: 'gateway', v: 'NMI or FluidPay with account updater', why: 'Account updater rescues failing cards' }],
                 note: 'Quantify recovered failed payments — that story beats any rate pitch.' },
    field:     { stack: [{ slot: 'terminal', v: 'PAX A920 Pro or Dejavoo P8 (mobile)', why: 'Crews collecting in the field' }, { slot: 'invoicing', v: 'Next2Pay Invoicing — text-to-pay', why: 'Estimates → invoice → pay-by-text, house first' }] },
    appts:     { boosts: [{ m: 'square', d: 2, why: 'Appointments + card-on-file no-show protection' }, { m: 'clover', d: 1, why: 'Appointments via app market' }] },
    fsm:       { note: 'They already run shop/practice software — sell the payments integration (gateway/terminal), do NOT pitch ripping out their workflow.',
                 stack: [{ slot: 'gateway', v: 'Gateway that integrates with their software (NMI first ask)', why: 'Integration play, not a POS swap' }] }
  },

  /* ---------- What to say — talk tracks per step ---------- */
  talkTracks: {
    discovery: '“Walk me through a normal day at the register — I’m not here to pitch you a box, I want to see where the money leaks first.” Then shut up and take notes. The rep who asks the best questions wins the deal.',
    statement: '“Grab me last month’s statement — two minutes. I’ll read it line by line and show you exactly what you’re paying. If you’re actually in good shape, I’ll tell you that too and leave you alone.” That last sentence is what gets the statement.',
    recommend: '“Based on what you told me — [their answers] — here’s what I’d put in: [primary]. Here’s why that beats what you have…” One recommendation with reasons tied to THEIR words. Never read them a menu.',
    pricing:   '“There are two ways to do this: keep paying fees and I make them smaller, or post a cash price and a card price and your fees basically disappear. Businesses like yours around here mostly run the second. Want to see both on paper?”',
    close:     '“If the numbers on this page hold, is there anything stopping us from getting you installed this month?” Ask it, then be quiet. Whatever they say next is the real objection — handle that one, not the ones you imagined.'
  },

  /* ---------- Stall-breakers — where deals go to die, and the play ---------- */
  stalls: [
    { s: '“Just send me some info.”',
      play: 'Info never closed a deal — the statement does. “Happy to — and the useful version of that is me pricing YOUR numbers. Get me last month’s statement and the info I send will have your savings on it, not a brochure.” Book the 10-minute review before you leave.' },
    { s: 'Ghosting after the proposal.',
      play: 'Never chase with “just following up.” Bring new information every touch: “Ran your numbers against three other [industry] shops we signed — you’re mid-pack, here’s the gap.” Three value touches over ~10 days, then the breakup text: “Closing your file — if the fees start hurting again, you have my number.” The breakup text revives more deals than the follow-ups.' },
    { s: '“I’ll get you the statement” … never does.',
      play: 'Make it effortless: text them the upload link (nextpaypos.com/statement-upload), or “snap a photo of the last two pages, that’s all I need.” Still stuck? “Want to grab it off your processor’s portal together? Takes five minutes, I’ll wait.”' },
    { s: '“I need to talk to my partner / spouse.”',
      play: 'Real objection or shield — find out: “Totally fair. What do you think they’ll want to know?” Then book the 15 minutes with both of them ON that call, and send the one-pager ahead so the partner isn’t hearing it second-hand.' },
    { s: '“After the holidays / busy season.”',
      play: 'Cost of waiting, in their numbers: “Waiting three months costs you about $[monthly overpay × 3]. We install off-hours and you keep taking payments the whole time — busy season is exactly when the better system pays for itself.”' },
    { s: '“My current rep says they’ll match your rate.”',
      play: '“If they could do that rate, why weren’t you already on it?” Get any match offer in writing, then compare the stack — a rate match on the same tired terminal still loses to pay-at-table, online ordering, and a rep who answers the phone. And a match without a contract release is the same trap at a lower price.' }
  ],

  /* ---------- Deal economics by source ----------
     Where the deal is written decides what the agent makes and where the
     processing gets quoted. Entries with `need` are waiting on a Schedule A
     from Dom — they render as "missing" until filled in. INTERNAL ONLY. */
  economics: {
    'next2pay': {
      source: 'In-house (NextPay / Chively / Next2Pay / NextLink)',
      quote: 'Processing on our house paper — dual pricing or IC+ per your Schedule A. NextLink (client automation outreach) seats per the internal list: Trial $599 / Annual $749 / M2M $999 per seat/mo.',
      make: ['Best margins in the book — house software margin + full processing residual split', 'No third-party program taking a cut'],
      need: 'Your agent Schedule A defines the split — confirm SaaS-margin share on Next2Pay Invoicing and NextLink seats with Dom.'
    },
    'skytab': {
      source: 'Shift4 partner program (Lighthouse partner portal)',
      quote: 'Processing on the Shift4 file — dual pricing or IC+. Hardware/software at sheet prices ($29.99/mo per device class; see Pricing page).',
      make: ['Processing residual per the SkyTab partner Schedule A (PDF on the Pricing page)', 'Activation bonus per NextPay comp plan'],
      need: null
    },
    'clover': {
      source: 'Clover via our ISO paper',
      quote: 'Processing quoted by us on the Clover file — dual pricing available; $5/mo Clover platform fee per location passes through.',
      make: ['Hardware margin (placement spread or purchase markup)', 'Software plan margin', 'Processing residual per Schedule A'],
      need: 'Clover Schedule A — hardware cost sheet + processing buy rates for Clover deals.'
    },
    'square': {
      source: 'Square reseller program',
      quote: 'Square’s published rates apply while they process on Square — the play is hardware margin now, then move processing to our rails via statement beat where it fits.',
      make: ['Hardware margin per the Square reseller guides (xlsx on the Pricing page)', 'Processing residual only if/when moved to our paper'],
      need: null
    },
    'quantic': {
      source: 'Quantic referral program (Unified Pricing V5)',
      quote: 'Hardware/software at the Unified Pricing sheet numbers; processing quoted by us — dual pricing available.',
      make: ['Referral share on the Quantic build', 'Processing residual per Schedule A'],
      need: 'Quantic referral split % — confirm the referral payout terms with Dom.'
    },
    'korona': {
      source: 'Korona dealer program',
      quote: 'Software per register at sheet prices ($59/$79/$99); hardware one-time; processing through NextPay — meet-or-beat or dual pricing.',
      make: ['Software/hardware margin per dealer terms', 'Processing residual per Schedule A'],
      need: 'Korona dealer Schedule A — software/hardware margin terms.'
    },
    'nrs': {
      source: 'NRS dealer program',
      quote: 'NRS hardware/software per their current dealer sheet; processing on the NRS Pay or our paper — ask Dom which book before quoting.',
      make: ['Dealer margin on hardware', 'Processing residual depending on which paper the deal is written on'],
      need: 'NRS dealer Schedule A + guidance on NRS Pay vs house paper.'
    },
    'pays': {
      source: 'PAYS agent program',
      quote: 'Plans at sheet prices (Starter $59 / Growth $79 / Enterprise $99; station $999). All-inclusive dual pricing — program fee structure per PAYS.',
      make: ['Residual on the dual-pricing program per PAYS agent terms', 'Software margin if any'],
      need: 'PAYS agent Schedule A — residual split on the dual-pricing program.'
    },
    'sumup': {
      source: 'SumUp reseller',
      quote: 'Hardware at our listed prices (POS Lite $499, Terminal $249, Solo $54); SumUp’s published rate applies until processing moves to our rails.',
      make: ['Hardware margin', 'Statement-beat conversion later = processing residual'],
      need: 'SumUp reseller margin sheet.'
    },
    'terminal-gateway': {
      source: 'House paper (PAX / Dejavoo / Valor + NMI / FluidPay / Authorize.net / iPOSPays)',
      quote: 'Fully ours to price: dual pricing or IC+ per your processing Schedule A; terminal at cost + margin or placement; gateway monthly + per-item.',
      make: ['Processing residual — your bps margin × volume, split per Schedule A', 'Terminal hardware margin', 'Gateway monthly margin'],
      need: null
    },
    'invoicing-gateway': {
      source: 'House paper + software partner (Next2Pay first; FieldPulse / LQPay / QB)',
      quote: 'Lead with Next2Pay Invoicing (house). Processing per your Schedule A (CNP rates); partner-software subscriptions at partner list prices.',
      make: ['Processing residual on CNP volume', 'Next2Pay Invoicing SaaS margin (house)', 'Partner software referral where applicable'],
      need: 'FieldPulse / LQPay referral terms, if we get paid on those subscriptions.'
    },
    'high-risk': {
      source: 'Specialty underwriting via Dom',
      quote: 'Never quote first — pricing comes back from underwriting per file.',
      make: ['Residual per file, set at approval — often strong, always case-by-case'],
      need: null
    }
  }
};
