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
    { h: 'How you operate today', q: [
      'Walk me through a busy shift — where do lines, mistakes or bottlenecks actually happen?',
      'What do you still do on paper or by hand that you wish you didn\u2019t?',
      'At the end of the day, how do you know what sold and what made money — reports, gut feel, or the accountant months later?',
      'When something breaks at 7pm on a Friday, what happens today?'
    ]},
    { h: 'Payments today', q: [
      'Who do you process with now, and what do you think you pay? (Most owners do not know — that is normal.)',
      'Can you grab your last processing statement? We will read it line by line and meet or beat it.',
      'Are you under a contract or lease with your current provider? When does it end? Any early-termination fee?',
      'Have you heard of dual pricing / 0% processing? Would eliminating card fees interest you?'
    ]},
    { h: 'Beyond the rate — where the real win is', q: [
      'If you could fix ONE thing about how this place runs, what would move the needle most?',
      'What would an extra hour a day back be worth to you? (That is usually what the right system buys.)',
      'What almost made you switch before — and what stopped you?',
      'Who else needs to be convinced, and what will THEY care about?'
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
    'convenience': { label: 'Convenience & Grocery', group: 'Retail', bg: 'convenience.png',
      ask: [
        'Walk me through the counter at rush hour — how many customers an hour, and what actually slows the line?',
        'How do you track inventory today — do you know your top 20 sellers and your dead stock, or is it a walk-the-aisles-with-a-notepad situation?',
        'EBT/SNAP — what share of your sales? (Changes the file build AND the POS pick.)',
        'Tobacco: are you collecting scan-data rebates today? If not, that\'s found money we can turn on.',
        'Age-restricted items — how do you make sure every clerk cards every customer, even when you\'re not standing there?',
        'Anything sold by weight — deli, produce? A certified integrated scale changes the hardware.',
        'Can you see voids, no-sales and discounts by clerk right now? (Shrinkage usually hides there.)'
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

    'liquor': { label: 'Liquor Stores', group: 'Retail', bg: 'liquor.png',
      ask: [
        'How do you card today — and has a missed check ever cost you? Register-forced ID scanning takes that risk off your clerks.',
        'Case discounts, mix-and-match, keg deposits — does the register handle that, or is it clerk math?',
        'Do you know your margin by bottle? Which 50 SKUs actually make you the money?',
        'How long does a full inventory count take you today — and when did you last do one?',
        'How much of your volume is debit? (PIN debit pricing is where liquor statements bleed.)',
        'Multi-store, or planning a second? (Changes the platform pick.)',
        'What happens to pricing when your distributor costs jump — how fast can you re-tag the store?'
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

    'boutique': { label: 'Boutique & Clothing', group: 'Retail', bg: 'boutique.jpg',
      ask: [
        'Do you sell online or on Instagram too? Does floor inventory sync with web inventory, or do you oversell?',
        'Size/color matrix inventory or simple items? How do you know what to reorder and in what size?',
        'Pop-ups, markets, trunk shows — do you sell away from the register?',
        'Gift cards and loyalty — anything today, or is it a punch card in a drawer?',
        'When a regular walks in, can staff see what she bought last time?',
        'How many hours a week goes into receiving new stock and tagging it?',
        'What did last season\'s dead inventory cost you — and would earlier reporting have caught it?'
      ],
      primary: { name: 'Square', why: 'Best-in-class for boutiques — floor + online store + social selling in one ecosystem, beautiful hardware, easy staff training. Lowest monthly cost play: free plan with no PCI or regulatory fees.' },
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

    'jewelry': { label: 'Jewelry Stores', group: 'Retail', bg: 'jewelry.png',
      ask: [
        'What\'s your highest typical ticket, and any single sales over $5–10k? (Underwriting needs this up front so payouts never get held.)',
        'Deposits, layaway, custom orders — how do you track what\'s owed and what\'s in the safe?',
        'Repairs: how do you track a piece from intake to pickup, and how do customers pay for them?',
        'Phone orders and out-of-state buyers — how do you take those cards today?',
        'Do you offer financing on big pieces? (NextFund — our financing lane — is the answer for anything finance or lending.)',
        'How do you handle appraisals and insurance work — invoiced, or paid at the counter?',
        'Who reconciles the register against the case inventory, and how often?'
      ],
      primary: { name: 'Clover', why: 'Clean countertop presence, invoices and deposits handled, strong for high-ticket keyed + card-present mix.' },
      alts: [
        { name: 'Quantic', why: 'Swan station with premium inventory module for serious multi-case stores.' },
        { name: 'Valor terminal + gateway', why: 'Simple high-ticket terminal play when they keep their own books.' }
      ],
      rules: [
        'High single tickets → disclose max ticket on the app; set realistic limits so payouts are not held.',
        'Phone orders/deposits → Next2Pay virtual terminal (linked2pay rails).',
        'Repairs pipeline → invoicing add-on or Invoice with QuickBooks Integration.'
      ],
      pricing: 'High average ticket → interchange-plus shines; per-item fees are irrelevant, basis points are everything. Statements from jewelry stores usually show inflated keyed rates — easy beat.',
      placements: ['clover', 'quantic', 'terminal-gateway']
    },

    'specialty-retail': { label: 'Specialty Retail', group: 'Retail', bg: 'specialty-retail.png',
      ask: [
        'What\'s unusual about your inventory — serialized items, rentals, consignment, bulk, bundles?',
        'Any tickets, admissions, classes or events in the mix?',
        'How much lives online vs in-store, and do the two share inventory?',
        'Consignors or vendors to pay out? How do you track their share today?',
        'What does your current system NOT track that you end up keeping in a spreadsheet?',
        'Seasonal spikes — what breaks first when you get slammed?',
        'How do you decide what to reorder, and how often are you wrong?'
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

    'fine-dining': { label: 'Fine Dining & Full Service', group: 'Food & Beverage', bg: 'fine-dining.png',
      ask: [
        'Covers a night and how many turns? Where does a table stall — kitchen, server, or the check?',
        'How do servers close checks today — walk to a station, or at the table? (Pay-at-table alone can add a turn.)',
        'How does the kitchen get orders — printed tickets, shouted, KDS? How many remakes a week from misreads?',
        'Wine program: big bottle tickets? How are they rung and tipped?',
        'Reservations and no-shows — what does a no-showed 6-top cost you on a Saturday?',
        'Tips: pooled, direct, tip-out rules — what does closing look like for your manager each night?',
        'How late does someone stay after close doing reports — and what would they do with that hour back?'
      ],
      primary: { name: 'SkyTab by Shift4', why: 'The full-service standard — $29.99/mo base bundle, pay-at-table handhelds, KDS, Lighthouse reporting, lifetime hardware warranty, $0 upfront.' },
      alts: [
        { name: 'Quantic', why: 'Strong table service + reservations module when they want to own hardware.' },
        { name: 'Clover', why: 'Restaurant Growth plan ($89.95/mo) for smaller rooms already comfortable with Clover.' }
      ],
      rules: [
        'White-tablecloth, coursing, big wine list → SkyTab, full stop.',
        'Wants to own hardware outright → Quantic Swan bundles.',
        '30-day SkyTab trial then 36-month agreement — say it up front, it builds trust.'
      ],
      pricing: 'SkyTab is a placement: $0 upfront, per-device monthly. Dual pricing works in casual FSR; fine dining often prefers a clean interchange-plus quote instead — read the room.',
      placements: ['skytab', 'quantic', 'clover']
    },

    'pizzerias': { label: 'Pizzerias', group: 'Food & Beverage', bg: 'pizzeria.png',
      ask: [
        'Phone vs online vs walk-in — what\'s the order mix at Friday rush?',
        'Who answers the phones at rush, and how many order errors a week come from that scramble?',
        'Delivery: your drivers or the apps? What did you pay in third-party commissions last month? (Get the real number.)',
        'If we put your own online ordering in front of regulars, what share of app orders could you pull back?',
        'How do orders hit the kitchen — handwritten tickets or screens? Remakes cost how much a week?',
        'Caller ID that pops the customer\'s history when the phone rings — what would that save at rush?',
        'Lunch slices need speed, dinner needs phones — where does the current setup fall down?'
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

    'food-trucks': { label: 'Food Trucks', group: 'Food & Beverage', bg: 'food.png',
      ask: [
        'How\'s connectivity where you park? Ever lost sales to a dead signal? (Offline mode matters more than any rate.)',
        'One window or two? How many customers can you turn an hour, and what caps it?',
        'Events and festivals — need extra readers a few weekends a year?',
        'Power setup — battery, inverter, generator? (Decides the hardware.)',
        'Do you track sales by location/event so you know which spots earn?',
        'Menu changes — how fast can you 86 an item or change a price from the window?',
        'Commissary, catering or a brick-and-mortar in the plans? (Pick a platform that grows with that.)'
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

    'bars': { label: 'Bars & Nightclubs', group: 'Food & Beverage', bg: 'bar.png',
      ask: [
        'Tabs: how do you hold cards today, and how many walked tabs a month? (Pre-auth kills that number.)',
        'Speed at last call — how many drinks a minute per well, and what slows it?',
        'How do you track pour cost and comps? Can you see comps by bartender?',
        'Age checks at the door or the bar — any exposure there?',
        'What\'s your cash mix? ATM on site?',
        'Kitchen or food menu? How do those orders route?',
        'What does inventory night look like — and who counts the bottles?'
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

    'qsr-cafes': { label: 'QSR, Cafés & Coffee Shops', group: 'Food & Beverage', bg: 'coffee.png',
      ask: [
        'Orders per hour at peak — and how many seconds does each order take at the register?',
        'Would a self-order kiosk pull people out of your line? (Kiosks also lift average ticket.)',
        'Loyalty today — punch cards? How many regulars could you actually reach if you had their info?',
        'Mobile/ahead-of-line ordering — do regulars ask for it?',
        'Staff turnover: how long to train a new hire on your current register?',
        'Catering or wholesale orders — how are those taken and paid?',
        'Morning rush staffing — could one less register body cover it with faster checkout?'
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

    'bakeries': { label: 'Bakeries, Delis & Markets', group: 'Food & Beverage', bg: 'bakery.png',
      ask: [
        'What\'s sold by weight vs by piece? (Certified scale integration is the fork in the road.)',
        'Custom orders — cakes, catering: how do you take deposits and schedule pickups today? Paper book?',
        'Wholesale accounts — how do you invoice them, and how long do they take to pay?',
        'Do you print labels for packaged goods — ingredients, barcodes, dates?',
        'Pre-orders for holidays: what did the counter chaos look like last time?',
        'Who reconciles the drawer after the 5am-noon rush?',
        'What sells out and what gets tossed — do you know by item, by day?'
      ],
      primary: { name: 'Clover', why: 'Counter + scale + label support, invoices for wholesale, familiar for staff.' },
      alts: [
        { name: 'SkyTab', why: 'Digital scale ($39.99/mo) + label printer ($19.99/mo) on placement — $0 upfront for a full deli line.' },
        { name: 'Quantic', why: 'PDN certified scale ($549) + label printer, own-hardware route.' }
      ],
      rules: [
        'By-weight selling → certified scale is non-negotiable; spec it in the quote.',
        'Wholesale/catering invoices → usually a feature of the POS they get (Clover invoices, SkyTab); Next2Pay only if they are invoice-first with no POS need.',
        'Cake deposits → card-on-file / deposit workflow question.'
      ],
      pricing: 'Mixed ticket sizes; dual pricing works at the counter, invoices often stay standard-priced. Quote both lanes.',
      placements: ['clover', 'skytab', 'quantic']
    },

    'auto-repair': { label: 'Auto Repair & Automotive', group: 'Services', bg: 'auto-repair.jpg',
      ask: [
        'Walk me through a job today: estimate → approval → work → payment. Where\'s the paper, and where does it stall?',
        'What\'s your average repair order — and your biggest this month? (Underwriting needs the max ticket.)',
        'How do customers approve added work mid-job — phone call, or could a text with photos and a pay link close it faster?',
        'Deposits on big parts orders — how do you take them?',
        'Fleet or commercial accounts — how long do they float you? Net-30 pain?',
        'Cards over the phone today? (That\'s your highest rate and your highest risk — text-to-pay fixes both.)',
        'Shop management software in use? (If yes, we integrate payments — we don\'t rip out your workflow.)'
      ],
      primary: { name: 'Terminal + Next2Pay Invoicing', why: 'Countertop or handheld terminal (PAX/Dejavoo/Valor) for walk-ups + Next2Pay for estimates → invoices → text-to-pay.' },
      alts: [
        { name: 'Clover', why: 'Services Growth plan ($84.95/mo) — invoices, customers, payments in one box.' },
        { name: 'Quantic', why: 'Station + QuickBooks interface ($20/mo) for shops living in QB.' }
      ],
      rules: [
        'Shop management software already in place → Next2Pay payments integrated underneath, do not rip out their workflow.',
        'Text-to-pay is the wow demo for shops — invoice from Next2Pay, customer pays from their phone.',
        'High average ticket → interchange-plus; surcharge/dual pricing is common in auto and well accepted.'
      ],
      pricing: 'High tickets → basis points matter. Shops are classic dual-pricing adopters (parts+labor quotes absorb it cleanly). Statements often show old-school tiered pricing — easy beat.',
      placements: ['terminal-gateway', 'clover', 'quantic']
    },

    'salons': { label: 'Salons & Spas', group: 'Services', bg: 'salon.png',
      ask: [
        'How do clients book — and what did no-shows cost you last week, honestly?',
        'Card-on-file at booking: would your stylists back a no-show policy if the system enforced it?',
        'Booth renters or employees? Who takes the payment, and who pays the fees?',
        'Retail at the front desk — tracked, or on the honor system?',
        'How do tips flow — on card, pooled, paid out how?',
        'Rebooking: does anyone ask for the next appointment at checkout, every time?',
        'How many hours a week goes to booking calls, confirms, reschedules?'
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

    'home-services': { label: 'Home Services (HVAC, Plumbing, Electrical…)', group: 'Services', bg: 'home-services.jpg',
      ask: [
        'How many techs in the field, and how does each one collect today — check, card over phone, \'we\'ll bill you\'?',
        'From job-done to money-in-bank: how many days, really?',
        'How do estimates go out — and how do customers approve and pay? Could a text link close it same-day?',
        'Deposits before big jobs — how do you take them?',
        'Maintenance plans or recurring contracts — billed how? Cards on file?',
        'Big tickets: do financing conversations come up? (NextFund is our lane for that.)',
        'How many office hours a week go to invoicing and chasing payments?'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'Our house invoicing platform — estimates, invoices, text-to-pay and recurring on our rails. Invoice-type deals lead with Next2Pay, every time.' },
      alts: [
        { name: 'Next2Pay + their existing FSM', why: 'Already on ServiceTitan/Housecall? Keep it — Next2Pay handles the payments underneath.' },
        { name: 'Mobile terminal (PAX A920 / Dejavoo P8)', why: 'Tap-in-the-driveway for techs; pairs with any back office.' }
      ],
      rules: [
        'Already on ServiceTitan/Housecall → integrate Next2Pay payments underneath, do not replace the FSM.',
        'Recurring maintenance contracts → Next2Pay recurring billing is the hook.',
        'Big tickets → the recommendation for anything finance or lending is NextFund.'
      ],
      pricing: 'Keyed-over-phone is where they bleed today — moving to text-to-pay links and tap-in-field drops their effective rate immediately. Surcharge/dual pricing widely accepted in trades.',
      placements: ['invoicing-gateway', 'terminal-gateway']
    },

    'fitness': { label: 'Fitness & Gyms', group: 'Services', bg: 'fitness.jpg',
      ask: [
        'How many members, and how many payments FAIL each month? Get the real number — that\'s the deal right there.',
        'What happens to a failed payment today — who chases it, and how much never comes back?',
        'Contracts vs month-to-month? Annual pre-pays, class packs, drop-ins?',
        'Gym software (MindBody, Zen Planner…)? (We integrate payments — not a software rip-out.)',
        'Front desk retail — drinks, gear, supplements?',
        'How do members sign up — in person, online, both?',
        'What\'s your churn, and how much of it starts with a billing problem?'
      ],
      primary: { name: 'Next2Pay recurring billing', why: 'House recurring engine — membership billing with card-on-file, retries and account updater. The revenue story gyms care about: recovered failed dues.' },
      alts: [
        { name: 'Square', why: 'Front desk + simple memberships for boutique studios.' },
        { name: 'Clover', why: 'Counter retail + app-market gym tools.' }
      ],
      rules: [
        'On MindBody etc. → Next2Pay payments integration underneath, not a POS swap.',
        'Failed recurring payments → account updater + retry logic is the differentiator; quantify recovered revenue.',
        'High-volume recurring → watch chargebacks; mention chargeback protection.'
      ],
      pricing: 'Card-not-present recurring rates dominate — interchange-plus with account updater beats their flat-rate setup. Show recovered-payment math, not just rate.',
      placements: ['invoicing-gateway', 'square', 'clover']
    },

    'professional-services': { label: 'Professional Services (Legal, Accounting…)', group: 'Services', bg: 'professional.png',
      ask: [
        'How do invoices go out today, and what\'s the average days-to-paid?',
        'Retainers: how are they collected and replenished?',
        '(Law firms) Trust/IOLTA rules in play? — flag before we quote anything on trust money.',
        'Phone payments today — how are those cards handled and stored? (Compliance risk hiding there.)',
        'What percentage of invoices go past 60 days, and who does the chasing?',
        'Average invoice size? (Above ~$2k, ACH beats cards — we quote both rails.)',
        'Would clients pay faster with a pay link on the invoice? (They do — measurably.)'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'House invoicing — emailed invoices, saved cards, recurring retainers, virtual terminal for phone payments. No countertop hardware needed.' },
      alts: [
        { name: 'Next2Pay + QuickBooks sync', why: 'Invoices and payments flowing into the books they already keep.' },
        { name: 'Clover Go / SumUp Solo', why: 'Pocket reader for the occasional in-person payment.' }
      ],
      rules: [
        'Law firms → surcharging rules + trust account handling need care; flag for Dom before quoting fees on trust payments.',
        'Big invoices → percentage caps matter; consider flat-fee ACH as the primary rail with card as convenience.',
        'Offer ACH/echeck through Next2Pay — often the real winner at $2k+ invoices.'
      ],
      pricing: 'High-ticket CNP — every basis point counts, and ACH steals the show. Lead with total cost per $10k invoiced.',
      placements: ['invoicing-gateway']
    },

    'cleaning': { label: 'Cleaning Services', group: 'Services', bg: 'cleaning.jpg',
      ask: [
        'Residential, commercial, or both? How many recurring jobs a week?',
        'How do you bill — after each job, monthly, and how do you get paid: check, Venmo, card?',
        'Days from job-done to money-in-bank?',
        'Do crews collect on site, or does the office bill later?',
        'Commercial accounts on net-30 — how much is floating out there right now?',
        'Card-on-file autopay for recurring residentials: what would never-chasing-a-check-again be worth?',
        'How do customers tip your crews, if at all?'
      ],
      primary: { name: 'Next2Pay Invoicing', why: 'House invoicing — recurring job billing, card-on-file autopay, text-to-pay. Invoice-type deals lead with Next2Pay.' },
      alts: [
        { name: 'SumUp Solo', why: 'Cheap in-field reader for crews that collect on completion.' },
        { name: 'Next2Pay + QuickBooks sync', why: 'For owners running everything in QB already.' }
      ],
      rules: [
        'Recurring residential → card-on-file autopay is the pitch (no more chasing checks).',
        'Commercial net-30 accounts → invoicing with ACH option.',
        'Keep hardware minimal — this is a software-and-rails sale.'
      ],
      pricing: 'Mostly CNP recurring — interchange-plus + ACH mix. Small operators are often on PayPal/Venmo; formalizing saves fees and looks professional to their clients.',
      placements: ['invoicing-gateway', 'sumup']
    },

    'healthcare': { label: 'Healthcare & Medical (Vision, Dental, Chiro, Derm, Mental Health, Wellness)', group: 'Healthcare', bg: 'health.png',
      ask: [
        'Copays at the desk vs balances after insurance — what\'s the mix?',
        'How do patient statements go out, and what share actually gets collected?',
        'Card-on-file with consent for post-adjudication balances — does your compliance flow allow it? (This is the workflow that changes everything.)',
        'Payment plans for bigger treatment — offered? Tracked how?',
        'No-shows: what does your no-show rate cost per provider per week?',
        'How much front-desk time goes to billing calls?',
        'Multiple providers or locations under one tax ID? Practice management software in use?'
      ],
      primary: { name: 'Clover (Healthcare plan)', why: 'Front-desk friendly, $0 software plan for healthcare, clean countertop presence, payment plans via apps.' },
      alts: [
        { name: 'Terminal + Next2Pay virtual terminal', why: 'Simple copay terminal + Next2Pay for post-insurance balances and stored consents.' },
        { name: 'Next2Pay payment plans', why: 'Card-on-file treatment plans and statements on house rails.' }
      ],
      rules: [
        'Card-on-file for balances after adjudication → the killer workflow; needs stored-credential consent language.',
        'Surcharging patient payments is regulated territory in some states — quote standard or dual-pricing-with-care; check with the NextPay team in Deal Desk.',
        'Integrations with practice management (Dentrix etc.) → ask before promising; Next2Pay rails underneath is the usual answer.'
      ],
      pricing: 'Steady CNP + card-present mix; statements typically show mid-market processors with junk fees (PCI, statement fees) — line-item beats are easy to show.',
      placements: ['clover', 'terminal-gateway', 'invoicing-gateway']
    },

    'high-risk': { label: 'High Risk & Specialty', group: 'Specialty', bg: 'retail.png',
      ask: [
        'Exactly what do you sell, and on what billing model — one-time, subscription, trial-to-paid?',
        'Processing history: current and former processors, any terminations or MATCH list events? (Be straight — underwriting finds everything.)',
        'Chargeback ratio and refund policy — what are the real numbers?',
        'Monthly volume and average ticket, documented — bank statements if processing statements don\'t exist.',
        'Why did the last processor relationship end?',
        'Licenses, website, terms of service — current and compliant?',
        'How do they operate day-to-day — fulfillment, customer service, dispute handling? Underwriting reads operations, not just numbers.'
      ],
      primary: { name: 'Next2Pay rails + specialty underwriting', why: 'High-risk placements are underwriting deals, not hardware deals — package the file well and route to Dom; the gateway rides our rails once approved.' },
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
      { name: 'SkyTab by Shift4', logo: 'skytab.svg', tag: 'Full-service restaurant standard', sell: ['$29.99/mo base bundle, $0 upfront, lifetime warranty', 'Pay-at-table, KDS, kiosk, caller ID', '30-day trial → 36-month agreement'], link: 'https://nextpaypos.com/shift4-dine' },
      { name: 'Clover', logo: 'clover.png', tag: 'The mainstream all-in-one', sell: ['Placement ($0 down) or buy outright', 'Software $0–$89.95/mo by vertical', 'Huge app market'], link: 'https://nextpaypos.com/clover' },
      { name: 'Square', logo: 'square.svg', tag: 'Design-friendly SMB ecosystem', sell: ['POS + online + invoices in one', 'Free plan to start — lowest monthly cost in the lineup: no PCI, regulatory or statement junk fees', 'We meet-or-beat their published rates on our rails'], link: 'https://nextpaypos.com/square' },
      { name: 'Quantic', logo: 'quantic-tight.png', logoH: 32, tag: 'Own-your-hardware cloud POS', sell: ['Swan bundles from $919', 'Pro $60/mo first station, $50 additional', 'Deep module list (OLO, loyalty, reservations)'], link: 'https://nextpaypos.com/quantic' },
      { name: 'Korona', logo: 'korona.png', tag: 'Serious retail & liquor inventory', sell: ['Core $59 / Retail $79 / Plus $99 per register', 'Ticketing, franchise, ID-scanner add-ons', 'Multi-location strength'], link: 'https://nextpaypos.com/korona' },
      { name: 'NRS', logo: 'nrs.png', tag: 'C-store / bodega specialist', sell: ['Age verification + scan data', 'Customer-facing screen', 'Price-friendly for single lanes'], link: 'https://nextpaypos.com/nrs' },
      { name: 'PAYS', logo: 'pays.svg', tag: 'All-inclusive 0% dual pricing POS', sell: ['Starter $59 / Growth $79 / Enterprise $99', 'Delivery-app integrations on Growth', 'Station bundle $999'], link: 'https://nextpaypos.com/pays-pos' },
      { name: 'SumUp', logo: 'sumup.svg', tag: 'Value hardware, $0 monthly', sell: ['POS Lite bundle $499, Terminal $249, Solo $54', 'Free POS software tier', 'Great for micro-merchants'], link: 'https://nextpaypos.com/sumup' },
      { name: 'DejaPay Pro', logo: 'dejapay.webp', tag: 'POS on Dejavoo rails', sell: ['Budget-friendly counter setup', 'Pairs with Dejavoo terminals', 'Simple menus, fast setup'], link: 'https://nextpaypos.com/dejapay' },
      { name: 'Chively POS', logo: 'chively-white.png', logoDark: true, tag: 'All-in-one POS — its own platform, written through Solutions in Payments (Luqra)', sell: ['Full restaurant + retail feature set', 'Handheld, kiosk and customer-screen options', 'Written on SIP paper — SIP Schedule A economics', 'Pricing coming soon'], link: 'https://nextpaypos.com/chively' },
    ],
    terminals: [
      { name: 'PAX (A920 Pro, A80, A35…)', logo: 'pax.svg', tag: 'Smart Android terminals', sell: ['A920 Pro portable flagship', 'Dual pricing ready', 'Countertop to mobile line-up'], link: 'https://nextpaypos.com/pax' },
      { name: 'Dejavoo (P line, QD line)', logo: 'dejavoo.png', tag: 'Workhorse terminals', sell: ['P1 desktop / P8 mobile', 'iPOSPays gateway native', 'Great price points'], link: 'https://nextpaypos.com/dejavoo' },
      { name: 'Clover Flex & Go', logo: 'clover.png', tag: 'Handheld + pocket reader', sell: ['Flex: printer + scanner in hand', 'Go: phone-paired reader'], link: 'https://nextpaypos.com/clover' },
      { name: 'Square Terminal & Handheld', logo: 'square.svg', tag: 'Square hardware line', sell: ['Terminal $299 all-in-one', 'Handheld $399 for tableside'], link: 'https://nextpaypos.com/square' },
      { name: 'Valor VL series', logo: 'valor.png', tag: 'Value smart terminals', sell: ['Dual pricing native', 'Valor gateway portal included'], link: 'https://nextpaypos.com/valor-terminals' },
      { name: 'SwipeSimple', logo: 'swipesimple.png', tag: 'Mobile reader + virtual terminal', sell: ['Phone-based payments', 'Invoices + item catalog'], link: 'https://nextpaypos.com/swipesimple' }
    ],
    gateways: [
      { name: 'Next2Pay Gateway', logo: 'next2pay-globe.png', tag: 'House gateway \u2014 linked2pay rails', sell: ['E-commerce, virtual terminal and recurring billing on our rails', 'The Navigator\u2019s only gateway recommendation \u2014 best margins in the book', 'Pairs with Next2Pay Invoicing for invoice-first businesses'], link: 'https://nextpaypos.com/next2pay' },
      { name: 'NMI', logo: 'nmi.png', tag: 'Enterprise-grade gateway', sell: ['Virtual terminal, recurring, account updater', 'Integrates with almost everything'], link: 'https://nextpaypos.com/nmi' },
      { name: 'FluidPay', logo: 'fluidpay.png', tag: 'Modern gateway, great for recurring', sell: ['Clean portal', 'Strong for subscriptions & invoicing'], link: 'https://nextpaypos.com/fluidpay' },
      { name: 'Authorize.net', logo: 'authnet-tight.png', logoH: 32, tag: 'The legacy standard', sell: ['Merchants know the name', 'Broad cart/software support'], link: 'https://nextpaypos.com/authorize-net' },
      { name: 'Luqra', logo: 'luqra.png', tag: 'Specialty gateway', sell: ['Flexible for niche billing models'], link: 'https://nextpaypos.com/luqra' },
      { name: 'Valor gateway', logo: 'valor.png', tag: 'Pairs with Valor terminals', sell: ['One portal for card-present + CNP'], link: 'https://nextpaypos.com/valor-gateway' },
      { name: 'iPOSPays', logo: 'ipospays.png', tag: 'Dejavoo-native gateway', sell: ['Drives Dejavoo/DejaPay hardware'], link: 'https://nextpaypos.com/ipospays' }
    ],
    invoicing: [
      { name: 'Next2Pay Invoicing', logo: 'next2pay-globe.png', tag: 'House invoicing — for trades & businesses that INVOICE their customers', sell: ['Roofers, electricians, plumbers, pros, cleaning routes — estimates, invoices, text-to-pay, recurring', 'NOT a POS replacement: salons/bakeries/restaurants get a full POS (invoicing is usually a POS feature there)', 'Best margins in the invoicing lineup — proposal ready in the Proposal Studio'], link: 'https://nextpaypos.com/next2pay' },
      { name: 'FieldPulse', logo: 'fieldpulse.png', tag: 'Field service suite', sell: ['Estimates → invoices → text-to-pay', 'Scheduling + CRM for trades'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'Field Work', logo: 'fieldwork.png', tag: 'Field service alternative', sell: ['Job management + payments'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'LQPay', logo: 'lqpay.png', tag: 'Billing & statements', sell: ['Healthcare-friendly workflows'], link: 'https://nextpaypos.com/invoicing' },
      { name: 'Invoice with QuickBooks Integrations', logo: 'quickbooks-t.png', logoH: 32, tag: 'Payments inside QB', sell: ['Invoices paid straight into the books'], link: 'https://nextpaypos.com/integrations' }
    ],
    services: [
      { name: 'NextFund — Business Financing', logo: 'nextfund-globe.png', tag: 'The recommendation for ANYTHING finance or lending', sell: ['Working capital, equipment loans, merchant cash advances', 'Fast approvals off processing history', 'A second commission riding alongside your processing deal'], link: 'https://nextpaypos.com/financing' },
      { name: 'NextLink — Client Automation & Outreach', logo: 'nextlink.png', tag: 'House outreach platform, sold per seat', sell: ['Automated campaigns + follow-up sequences that never forget', 'Proposal ready to build in the Proposal Studio', 'Internal seat pricing on the Pricing page'], link: 'https://nextpaypos.com/outreach' },
      { name: 'Merchant Rewards', logo: 'nextpay.png', tag: 'Sweetener on every processing deal', sell: ['Merchants earn on the volume they already process', 'Stacks with dual pricing', 'Pitch it during the statement review'], link: 'https://nextpaypos.com/merchant-rewards' }
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
    'skytab': { label: 'SkyTab by Shift4', logo: 'skytab.svg', steps: [
      'Confirm the build in the Proposal Builder (base bundle $29.99/mo + per-device monthlies) and price processing.',
      'Collect common docs plus the signed SkyTab agreement (30-day trial, then 36-month term — make sure the owner heard this from you first).',
      'Menu build: collect the full menu (photos or files) — send with the submission.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) with subject "SkyTab deal — {DBA}".',
      'Install is scheduled by the SkyTab team; track status in the Shift4 partner portal and log it on the deal in My Pipeline.'
    ]},
    'clover': { label: 'Clover', logo: 'clover.png', steps: [
      'Lock the hardware + software plan. Wholesale pricing sheet: hub docs \u2192 Clover hardware & software pricing (Duo bundle $2,058.80 \u00b7 Solo $1,734.80 \u00b7 Mini $917.10 \u00b7 Flex Gen 4 $738.11 \u00b7 Kiosk $3,537.12 + deployment fees). Note the $5/mo Clover platform fee per MID on the quote.',
      'Need help mid-sale? Clover program POS desk: (877) 928-0305 opt 2 \u00b7 pos@redfynn.com \u2014 POS sale assistance, system functionality, configuration questions.',
      'Application: use the Clover merchant application PDF (hub docs). Application questions or status: (877) 928-0305 ext 205 \u00b7 applications@redfynn.com. Collect the common docs below as usual.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) \u2014 subject "Clover deal \u2014 {DBA}".',
      'Install & training: schedule installs at book.redfynn.com/install or (813) 803-5503; onboarding training at calendly.com/pos-nhs/onboarding-training or (877) 928-0305 ext 280.',
      'After go-live: merchant support (877) 928-0305 opt 3 \u00b7 support@redfynn.com; merchants already on Clover devices call (844) 864-5449. Log the merchant in My Merchants.'
    ]},
    'square': { label: 'Square (hardware resell + rate review)', logo: 'square.svg', steps: [
      'Quote hardware from the reseller guide; software plan Free or Plus $49/mo.',
      'If they already process on Square: run the statement meet-or-beat to move processing to our rails where it fits.',
      'Submit order + docs to dom@nextpaypos.com — subject "Square deal — {DBA}".'
    ]},
    'quantic': { label: 'Quantic', logo: 'quantic.svg', steps: [
      'Build from the Unified Pricing sheet (Swan bundles, per-device software, modules).',
      'Include the Setup & Training package line (scoped per build).',
      'Common docs + menu/inventory file; email to dom@nextpaypos.com — subject "Quantic deal — {DBA}".',
      'Quantic runs a remote menu build + install call; coordinate the date with the merchant.'
    ]},
    'korona': { label: 'Korona', logo: 'korona.png', steps: [
      'Per-register plan (Core $59 / Retail $79 / Plus $99) + modules + hardware bundles.',
      'Inventory import: ask for their item list/spreadsheet up front — it gates go-live.',
      'Common docs; email to dom@nextpaypos.com — subject "Korona deal — {DBA}".'
    ]},
    'nrs': { label: 'NRS', logo: 'nrs.png', steps: [
      'Confirm lane count, EBT/SNAP needs and scan-data enrollment.',
      'Common docs + EBT/FNS number if applicable.',
      'Email to dom@nextpaypos.com — subject "NRS deal — {DBA}".'
    ]},
    'pays': { label: 'PAYS', logo: 'pays.svg', steps: [
      'Pick the plan (Starter $59 / Growth $79 / Enterprise $99) + station bundle ($999) or quoted hardware.',
      'Dual-pricing signage expectations — set them now. Loaner/rental hardware carries a Return Obligation: if the merchant terminates early, the hardware ships back or the penalty applies.',
      'Common docs + menu; email to dom@nextpaypos.com — subject "PAYS deal — {DBA}".'
    ]},
    'sumup': { label: 'SumUp', logo: 'sumup.svg', steps: [
      'Hardware from the SumUp price list (POS Lite $499, Terminal $249, Solo $54…).',
      'Common docs; email to dom@nextpaypos.com — subject "SumUp deal — {DBA}".'
    ]},
    'chively': { label: 'Chively POS (via Solutions in Payments — Luqra)', logo: 'chively-white.png', steps: [
      'Chively is its own POS, written through Solutions in Payments (Luqra) — SIP Schedule A economics apply. It is NOT house paper and NOT Next2Pay.',
      'Confirm the build — stations, handhelds, kiosk, customer screens. Hardware/software pricing coming soon; until then, price the build in the deal’s Deal Desk thread.',
      'Common docs (app, voided check, ID, statements/projections) plus menu/inventory files.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) — subject "Chively deal — {DBA}".',
      'Install scheduling and file questions → the deal’s Deal Desk thread.'
    ]},
    'next2pay': { label: 'Next2Pay (house invoicing, gateway & recurring)', logo: 'next2pay-globe.png', steps: [
      'House deal — best margins in the book. Confirm the build: Next2Pay Invoicing, gateway/virtual terminal, recurring billing, or a combination.',
      'Build the quote in the Proposal Studio. Selling NextLink (client automation outreach) too? Its per-seat proposal has its own section there.',
      'Underwriting docs (all required): last 3 months processing statements · last 3 months business bank statements · Articles of Incorporation · owner ID(s) · bank account details · Plaid connection · Veriff completion. Plus menu/inventory or invoice workflow details.',
      'Email the packaged deal to dom@nextpaypos.com (CC payments@ + alexander@) — subject "Next2Pay deal — {DBA}".',
      'Onboarding and install are run in-house — coordinate dates with the NextPay team in the deal’s Deal Desk thread.'
    ]},
    'terminal-gateway': { label: 'Standalone terminal (+ gateway)', steps: [
      'Pick terminal (PAX / Dejavoo / Valor) and file build: dual pricing or standard; tip adjust; auto-batch time.',
      'If CNP needed, add the gateway (NMI / FluidPay / Authorize.net / iPOSPays for Dejavoo).',
      'Common docs; email to dom@nextpaypos.com — subject "Terminal deal — {DBA}".'
    ]},
    'invoicing-gateway': { label: 'Next2Pay Invoicing / gateway (software-first)', steps: [
      'Confirm the workflow: estimates? recurring? text-to-pay? virtual terminal? Next2Pay covers all of it — partner tools (FieldPulse / LQPay / QB sync) only where Dom approves an exception.',
      'Spec the Next2Pay build: invoicing seats, recurring plans, card-on-file, ACH option for big invoices.',
      'Common docs; email to dom@nextpaypos.com — subject "Invoicing deal — {DBA}".'
    ]},
    'high-risk': { label: 'High Risk & Specialty', logo: 'nextpay.png', steps: [
      'Do NOT quote rates. Collect the full file: 3–6 months processing + bank statements, refund/chargeback history, licenses, website/terms.',
      'Write a one-paragraph business summary (what they sell, billing model, why volume is what it is).',
      'Email the complete file to dom@nextpaypos.com — subject "HIGH RISK — {DBA}". Dom routes to the right book.'
    ]}
  },

  contacts: {
    submit: 'hello@nextpaypos.com',
    cc: 'dom@nextpaypos.com, alexander@nextpaypos.com',
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
    fsm:       'Already runs shop/practice software',
    funding:   'Needs funding / working capital'
  },

  /* Signals most worth probing per industry (others behind "show all") */
  industrySignals: {
    'convenience':          ['ebt', 'scan', 'age', 'scale', 'cash', 'zerofee', 'multi', 'budget'],
    'liquor':               ['age', 'cash', 'zerofee', 'multi', 'ownhw'],
    'boutique':             ['online', 'multi', 'budget', 'zero_down'],
    'jewelry':              ['highticket', 'invoices', 'phone', 'online', 'funding'],
    'specialty-retail':     ['online', 'multi', 'ownhw', 'budget'],
    'fine-dining':          ['tabs', 'phone', 'olo', 'multi', 'zero_down', 'ownhw', 'funding'],
    'pizzerias':            ['phone', 'delivery', 'olo', 'zerofee', 'cash', 'kiosk'],
    'food-trucks':          ['budget', 'zero_down', 'zerofee', 'kiosk'],
    'bars':                 ['tabs', 'age', 'cash', 'zerofee', 'kiosk'],
    'qsr-cafes':            ['kiosk', 'olo', 'zerofee', 'budget', 'multi'],
    'bakeries':             ['scale', 'invoices', 'phone', 'olo'],
    'auto-repair':          ['highticket', 'invoices', 'fsm', 'zerofee', 'field', 'funding'],
    'salons':               ['appts', 'budget', 'multi', 'recurring'],
    'home-services':        ['field', 'invoices', 'recurring', 'fsm', 'highticket', 'funding'],
    'fitness':              ['recurring', 'fsm', 'multi', 'funding'],
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
                 stack: [{ slot: 'gateway', v: 'Next2Pay virtual terminal', why: 'High tickets usually mean phone/keyed payments too' }],
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
                 stack: [{ slot: 'gateway', v: 'Next2Pay gateway (linked2pay rails)', why: 'E-commerce / card-not-present rail' }] },
    invoices:  { stack: [{ slot: 'invoicing', v: 'Next2Pay Invoicing', why: 'They invoice their customers — Next2Pay is the play. (If they run a full POS, invoicing is usually a feature there; Next2Pay is for true invoice-first businesses or one-off simple invoicing needs.)' }] },
    recurring: { stack: [{ slot: 'invoicing', v: 'Next2Pay recurring billing', why: 'House recurring — card-on-file, retries, account updater rescues failing cards' }],
                 note: 'Quantify recovered failed payments — that story beats any rate pitch.' },
    field:     { stack: [{ slot: 'terminal', v: 'PAX A920 Pro or Dejavoo P8 (mobile)', why: 'Crews collecting in the field' }, { slot: 'invoicing', v: 'Next2Pay Invoicing (text-to-pay)', why: 'Estimates → invoice → pay-by-text' }] },
    appts:     { boosts: [{ m: 'square', d: 2, why: 'Appointments + card-on-file no-show protection' }, { m: 'clover', d: 1, why: 'Appointments via app market' }] },
    fsm:       { note: 'They already run shop/practice software — sell the payments integration, do NOT pitch ripping out their workflow.',
                 stack: [{ slot: 'gateway', v: 'Next2Pay rails integrated with their existing software', why: 'Integration play, not a POS swap' }] },
    funding:   { stack: [{ slot: 'addon', v: 'NextFund — business financing referral', why: 'Anything finance or lending: the recommendation is NextFund. Working capital, equipment loans, cash advances — package the intro to Dom.' }],
                 note: 'Financing talk on a deal is a second commission: NextFund referrals ride alongside the processing deal.' }
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

  /* ---------- Agent split rule (INTERNAL ONLY) ----------
     House rule from Dom: on every Schedule A / buy-rate sheet uploaded to
     this hub, agents earn 50% OF OUR 50% of the residual the program pays.
     Worked SIP example uses that reading — flag to Dom if the math should
     read differently. */
  agentSplit: {
    label: '50% of the net residual',
    text: 'The standard on every program: buy rates and program costs are the deal\u2019s expenses \u2014 they come off the top first. What\u2019s left is the net residual and payout, and you earn 50% of it. Every number in this hub is already stated as YOUR share. Your signed agent agreement is the final word.',
    calcPct: 45,
    calcNote: 'Your share of gross deal margin, preloaded per program \u2014 SIP low-risk 45 \u00b7 SIP high-risk 30 \u00b7 Next2Pay 50 \u00b7 Clover 45 \u00b7 SumUp 40.'
  },

  /* ---------- Schedule As (INTERNAL ONLY) ---------- */
  schedules: {
    sip: {
      label: 'Solutions in Payments (SIP)',
      cols: ['Low-Risk', 'High-Risk'],
      splitNote: 'The costs below come off the top of every deal. You earn 50% of the net residual that remains \u2014 which works out to \u2248 45% of the gross margin you create on low-risk files (30% on the high-risk book). That is your number; nothing further comes out of it.',
      covers: 'House processing paper for: Chively POS (via Luqra) · Quantic · NRS · Korona · standalone terminals (PAX / Dejavoo / Valor) · gateways (NMI / FluidPay / Authorize.net / iPOSPays) · high-risk files. Does NOT cover: Square, SkyTab/Shift4, Clover/Fiserv, Next2Pay, NextLink, SumUp, PAYS, FieldPulse, LQPay (each has its own schedule).',
      floor: 'Your true cost on low-risk SIP paper = interchange (pass-through) + 0.02% BIN sponsor + $0.02 per transaction (+ $0.02 per batch). Everything you quote above that is margin — and your share is ≈45% of it (30% on the high-risk book).',
      example: 'Example: $45,000/mo, ~1,500 transactions, quoted at IC + 0.50% + $0.10 → gross margin ≈ $336/mo. Your share ≈ $151/mo, for the life of the merchant. Ten of these = $1,500/mo that keeps paying.',
      groups: [
        { h: 'Portfolio fees', rows: [
          ['Visa/MC/Disc/Amex — BIN sponsor', '0.02%', '0.25%'],
          ['Interchange & association fees', 'Pass-through', 'Pass-through']] },
        { h: 'Transaction fees', rows: [
          ['Visa/MC/Disc/Amex — transaction', '$0.02', '$0.10'],
          ['PIN debit / EBT — transaction', '$0.02', '$0.10'],
          ['Batch', '$0.02', '$0.10'],
          ['AVS (voice)', '$3.50', '$3.50'],
          ['AVS (electronic)', '$0.02', '$0.10'],
          ['Wireless transaction (vendor specific)', '$0.05', '$0.10'],
          ['Other transaction', '$0.00', '$0.00'],
          ['Chargeback', '$10.00', '$15.00'],
          ['Retrieval (12B letters)', '$7.00', '$10.00']] },
        { h: 'Monthly & annual — per occurrence', rows: [
          ['Account on file', '$5.00', '$10.00'],
          ['Debit access', '$0.00', '$0.00'],
          ['Risk monitoring', '$0.00', '0.15%'],
          ['IRS regulatory', '$2.00', '$5.00'],
          ['Wireless terminal monthly (vendor specific)', '$15.00', '$15.00'],
          ['Gateway monitoring', '$0.00', '$25.00'],
          ['Merchant online access', '$0.00', '$0.00'],
          ['Monthly minimum', '$0.00', '$50.00'],
          ['Annual PCI / with breach insurance', '$36.00 / $79.00', '$36.00 / $79.00'],
          ['Annual fee', '$0.00', '$50.00']] }
      ]
    },
    next2pay: {
      label: 'Next2Pay / linked2pay (house invoicing & gateway)',
      cols: ['Buy rate', 'Rev share'],
      covers: 'House rails for: Next2Pay Invoicing with Invoice with QuickBooks Integration · the house gateway · ACH / RDC processing · card processing written on linked2pay. This is the schedule behind every invoice-type deal.',
      splitNote: 'The buy rates below are the deal\u2019s costs — covered off the top. You earn 50% of the net residual that remains: everything quoted above cost, on card, ACH and Invoice with QuickBooks Integration alike.',
      floor: 'Your true cost on Next2Pay card processing = interchange + 2 bps + $0.0215/transaction + $0.03 authorization. ACH costs $0.10/item (+$10/mo enabled). Invoice with QuickBooks Integration costs $35/mo + $10/mo platform maintenance = $45/mo total. Quote above these — your share is 50% of the difference.',
      example: 'Example: a service business doing $30,000/mo CNP, ~600 transactions, quoted at IC + 0.75% + $0.15: card margin ≈ $278/mo. With Invoice with QuickBooks Integration ($45/mo cost floor → quote at $50/mo for $5/mo residual on the invoicing). Your 50% ≈ $141/mo from card + $2.50 from invoicing, plus ACH at $0.10 buy per item.',
      groups: [
        { h: 'Card processing buy rates', rows: [
          ['Interchange & assessments (V/MC/D/EBT)', 'Interchange + 2 bps', 'Yes'],
          ['American Express', 'Interchange + 2 bps', 'Yes'],
          ['Transaction', '$0.0215 / item', 'Yes'],
          ['Authorization', '$0.03 / item', 'Yes'],
          ['AVS', '$0.01 / item', 'Yes'],
          ['Batch fee', '$0.03 / item', 'Yes'],
          ['Voice authorization', '$1.24 / call', 'Yes'],
          ['PIN debit', '$0.0215 / item', 'Yes'],
          ['Chargeback', '$20.00 / occurrence', 'Yes'],
          ['Retrieval request', '$2.50 / occurrence', 'Yes'],
          ['Application / terminal download / equipment', '$0.00', 'Yes'],
          ['Account maintenance', '$2.99 / mo', 'Yes'],
          ['Online reporting', '$2.95 / mo', 'Yes'],
          ['PCI compliance', '$2.53 / mo', 'Yes'],
          ['GPRS terminal (SIM card)', '$50.00 / mo', 'Yes'],
          ['1099-K reporting', '$15.00 / yr', 'Yes'],
          ['Annual fee', '$20.00 / yr', 'Yes']] },
        { h: 'Additional costs', rows: [
          ['Account on file — open', '$0.99 / mo', '—'],
          ['Account on file — closed', '$0.49 / mo', '—'],
          ['Merchant statements (paper)', '$0.25 / mo', '—'],
          ['Electronic statements', '$0.45 / mo', '—'],
          ['Regulatory IRS reporting', '$0.95 / mo', '—'],
          ['Excessive chargebacks', '$4.00 / occurrence', '—'],
          ['Mid-risk BIN monitoring', '5 bps on volume', '—'],
          ['High-risk BIN monitoring', '35 bps on volume', '—'],
          ['High-risk monitoring fee', '$10.00 / mo', '—']] },
        { h: 'Gateway & ACH buy rates', rows: [
          ['Monthly gateway fee per MID', '$3.00 / mo', 'Yes'],
          ['ACH processing enabled', '$10.00 / mo', 'Yes'],
          ['ACH processing transaction', '$0.10 / item', 'Yes'],
          ['ACH return', '$2.00 / item', 'Yes'],
          ['Unauthorized return', '$10.00 / item', 'Yes'],
          ['Account verification', '$0.30 / item', 'No'],
          ['Notice of change', '$2.00 / item', 'No'],
          ['Standard funding', '1 bps on volume', 'Yes'],
          ['Next-day funding', '3 bps on volume · NDF $0.20/item + 10 bps', 'Yes'],
          ['RDC main location', '$75.00 / mo', 'Yes'],
          ['RDC next-day funding', '$20.00 / mo', 'Yes'],
          ['RDC processing transaction', '$0.12 / item', 'Yes'],
          ['RDC return / unauthorized', '$4.00 / $7.50 per item', 'Yes'],
          ['Transaction (Direct X9)', '$0.15 / item', 'Yes'],
          ['Credit card processing transaction (gateway)', '$0.05 / item', 'Yes'],
          ['Add store fee', '$25.00 one-time', 'No'],
          ['Mailed check', '$3.00 / item', 'No'],
          ['Early termination', '$65.00 one-time', 'No']] }
      ],
      docs: ['Last 3 months of processing statements', 'Last 3 months of business bank statements', 'Articles of Incorporation', 'ID for the business owners', 'Bank account details', 'Connection to Plaid', 'Completion of Veriff']
    },
    clover: {
      label: 'Clover (Fiserv partnership)',
      cols: ['Partner cost'],
      covers: 'Clover deals (Fiserv application). Hardware at wholesale per the Clover pricing sheet (hub docs); Clover platform fee $5/MID + $0.03 non-swiped auth pass through.',
      splitNote: 'The costs below come off the top. You earn 50% of the net residual — ≈ 45% of the margin you create on standard Clover accounts; roughly half that on high-risk and ACH. Heads up: closes assisted by Clover sales\u2019s POS team trim the residual slightly (20 bps).',
      floor: 'Your true cost on Clover paper = interchange (pass-through) + 0.03% BIN + $0.035/authorization (+ $0.02 batch, $0.01 AVS). Several lines carry built-in spread: PCI billed $149/yr vs $99 cost, PCI non-action $39.95/mo vs $21.95, statement $1/mo cost. Same-day funding $9.95 cannot be marked up.',
      example: 'Example: $45,000/mo Clover retail, ~1,500 transactions, quoted at IC + 0.50% + $0.10: gross margin ≈ $309/mo. Your share ≈ $139/mo, plus PCI/statement spread and hardware markup.',
      groups: [
        { h: 'Processing costs (pass-through + per item)', rows: [
          ['Interchange, dues & assessments (V/MC/D)', 'Pass-through'],
          ['Amex pass-through, network & system fees', 'Pass-through + 0.30% system fee'],
          ['BIN fee (bank sponsorship)', '0.03% (0.0003)'],
          ['Authorization', '$0.035'],
          ['Non-bankcard T&E authorization', '$0.04'],
          ['AVS', '$0.01'],
          ['Batch fee', '$0.02'],
          ['Voice authorization', '$0.75'],
          ['EBT authorization', '$0.05'],
          ['PIN debit authorization', '$0.05']] },
        { h: 'Per occurrence', rows: [
          ['Chargeback', '$15.00'],
          ['Retrieval', '$10.00'],
          ['ACH reject', '$15.00']] },
        { h: 'Monthly & annual', rows: [
          ['Merchant on file + IRS compliance', '$6.95 / mo'],
          ['Merchant statement (per location)', '$1.00 / mo'],
          ['Monthly minimum (if V/MC/D volume < $5k)', '$0.00'],
          ['PCI annual — merchant billed $149', '$99.00 cost'],
          ['PCI non-action — merchant billed $39.95/mo', '$21.95 cost'],
          ['Annual fee (optional)', '$0.00'],
          ['Early termination (optional, only if charged)', '$0.00'],
          ['Same-day funding (no markup allowed)', '$9.95'],
          ['TIN mismatch (until validated)', '$4.95 / mo'],
          ['Payanywhere terminals (A80, A920, E600, E700)', 'Free placement'],
          ['Clover platform fee', '$5.00 / MID'],
          ['Clover non-swiped auth', '$0.03 / auth']] }
      ]
    },
    sumup: {
      label: 'SumUp reseller program',
      cols: ['Rate / cost'],
      covers: 'SumUp reseller paper — Cloud POS SaaS, kiosk, eCommerce and hardware resale, with processing commission on merchants you place. Hardware cannot be discounted below the Schedule A cost.',
      splitNote: 'Costs come off the top; you earn 50% of the net payout — ≈ 40% of the processing margin you quote above cost (steps up on large books — ask the NextPay team) and ≈ 10% of new-merchant SaaS subscriptions. Hardware markup follows the same split.',
      floor: 'Processing buy rate = interchange + 0.05%, per-transaction fee waived. You set the merchant\u2019s pricing — your share ≈ 40% of whatever you quote above cost. SaaS subscriptions on new merchants pay you ≈ 10% of the sub; existing/non-transactional merchants pay no SaaS share.',
      example: 'Example: $20,000/mo boutique quoted at IC + 0.50% + $0.08 (400 txns): margin ≈ $122/mo → your share ≈ $49/mo. Add Cloud POS w/ Connect Lite at $99/mo retail → your share ≈ $10/mo. Plus hardware markup over the costs below.',
      groups: [
        { h: 'Processing (interchange-plus)', rows: [
          ['Interchange, card association, dues & assessments', 'Pass-through'],
          ['Buy rate', 'IC + 0.05%'],
          ['Per-transaction fee', 'Waived']] },
        { h: 'SaaS monthly fees (partner pricing)', rows: [
          ['SumUp Cloud POS w/ Connect Lite', '$99.00 / mo'],
          ['Cloud POS w/ Connect Plus (SMS promos, AutoPilot)', '$199.00 / mo'],
          ['Cloud POS w/ Connect Pro (AI-enhanced promos)', '$289.00 / mo'],
          ['SumUp eCommerce', '$19.00 / mo'],
          ['SumUp Kiosk (per station)', '$69.00 / mo'],
          ['Order aggregation (Urban Piper)', '$79.00 / mo']] },
        { h: 'Hardware costs (no discounting below these)', rows: [
          ['Core POS (register + customer display)', '$1,040.00'],
          ['Core POS + printer', '$1,340.00'],
          ['Complete POS (displays, printer, drawer)', '$1,440.00'],
          ['Retail Complete (+ barcode scanner)', '$1,499.00'],
          ['SumUp Kiosk', '$699.00'],
          ['Kiosk + counter stand', '$739.00'],
          ['Kiosk + floor stand', '$839.00']] },
        { h: 'One-time & per occurrence', rows: [
          ['Installation & inventory/menu setup', '$199.00'],
          ['eCommerce setup', '$99.00'],
          ['Order aggregation setup', '$99.00'],
          ['Chargeback / retrieval / reversal', '$12.00 each'],
          ['Chargeback mediation', '$22.00'],
          ['Inactive merchant / account on file / statement', 'Waived']] }
      ]
    },
    pays: {
      label: 'PAYS (POS licensing + our processing)',
      cols: ['Cost'],
      covers: 'PAYS POS deals: we license the software per merchant and pair it with our own processing on SIP paper. Loaner/rental hardware carries a Return Obligation — early terminations must ship the hardware back.',
      splitNote: 'Starter/Growth/Enterprise are the published payspos.com plans — what the MERCHANT pays monthly. The license below is the deal\u2019s cost, covered off the top. You earn 50% of the net processing residual on our SIP paper (\u2248 45% of margin).',
      floor: 'The deal\u2019s cost: $59/mo license per merchant start (first terminal), $29/mo for a second terminal at the same merchant. The merchant pays the published plan price (Starter $59 / Growth $79 / Enterprise $99) —',
      example: 'Example: merchant on Growth plan ($79/mo) — the $59 license comes off the top. Processing residual on SIP paper (SIP paper, dual pricing the norm) and markup on the $999 station bundle.',
      groups: [
        { h: 'Licensing (our cost)', rows: [
          ['License — per merchant start (first terminal)', '$59.00 / mo'],
          ['Second terminal (same merchant)', '$29.00 / mo']] },
        { h: 'Retail price points (published — safe to quote)', rows: [
          ['Starter plan', '$59 / mo'],
          ['Growth plan (delivery apps, KDS, fine dine-in)', '$79 / mo'],
          ['Enterprise plan (gift cards, loyalty, multi-location)', '$99 / mo'],
          ['Station + reader bundle', '$999 one-time'],
          ['Reference', 'payspos.com/pos-system-cost · payspos.com/shop']] }
      ]
    }
  },

  /* ---------- Deal economics by source ----------
     Where the deal is written decides what the agent makes and where the
     processing gets quoted. Entries with `need` are waiting on a Schedule A
     from Dom — they render as "missing" until filled in. INTERNAL ONLY. */
  economics: {
    'chively': {
      source: 'Solutions in Payments paper (Luqra) — Chively POS',
      sched: 'sip',
      quote: 'Chively hardware/software pricing coming soon — until then, work the quote in the deal’s Deal Desk thread. Processing is fully ours to price on SIP — dual pricing or IC+ above the SIP cost floor (IC pass-through + 0.02% + $0.02/txn).',
      make: ['Your share ≈ 45% of everything above the SIP cost floor — bps, per-item and monthly-fee margin', 'Hardware/software margin on the Chively build'],
      need: null
    },
    'next2pay': {
      source: 'In-house — linked2pay rails (Next2Pay / NextLink)',
      sched: 'next2pay',
      quote: 'Card processing at the linked2pay buy rates (IC + 2 bps + $0.0215/txn) — quote dual pricing or IC+ above it. ACH at $0.10/item buy. Invoice with QuickBooks Integration at $35/mo buy — retail-price it per deal. NextLink (outreach) seats per the internal list: Trial $599 / Annual $749 / M2M $999 per seat/mo.',
      make: ['Your share = 50% of the margin over the Next2Pay buy rates — card, ACH and Invoice with QuickBooks Integration SaaS', 'Best-control paper in the book: every line on the schedule is shareable'],
      need: null
    },
    'skytab': {
      source: 'Shift4 partner program (Lighthouse partner portal)',
      quote: 'Processing on the Shift4 file — dual pricing or IC+. Hardware/software at sheet prices ($29.99/mo per device class; see Pricing page).',
      make: ['Your share = 50% of NextPay’s SkyTab residuals and payouts', 'Activation bonus per NextPay comp plan'],
      need: null
    },
    'clover': {
      source: 'NextPay\u2019s white-labeled Clover program (house paper, Fiserv application)',
      sched: 'clover',
      quote: 'Quote dual pricing or IC+ above the Clover cost floor (IC + 0.03% + $0.035/auth). $5/mo Clover platform fee per MID passes through. Hardware at wholesale per the pricing sheet \u2014 mark up per deal. Ask in Deal Desk whether the deal qualifies for the Clover Advantage program before quoting.',
      make: ['Your share \u2248 45% of the margin you create on standard Clover accounts', 'Hardware markup over wholesale (Duo bundle $2,058.80 \u00b7 Solo $1,734.80 \u00b7 Mini $917.10 \u00b7 Flex Gen 4 $738.11 + deployment)', 'Built-in spreads: PCI, statement, compliance lines', 'Watch: POS-assisted closes trim your residual 20 bps; high-risk/ACH pay roughly half the standard share'],
      need: null
    },
    'square': {
      source: 'Square reseller program',
      quote: 'Square’s published rates apply while they process on Square — the play is hardware margin now, then move processing to our rails via statement beat where it fits.',
      make: ['Hardware margin per the Square reseller guides (xlsx on the Pricing page)', 'Processing residual only if/when moved to our paper'],
      need: null
    },
    'quantic': {
      source: 'Quantic (Unified Pricing V5) · processing on Solutions in Payments paper',
      sched: 'sip',
      quote: 'Hardware/software at the Unified Pricing sheet numbers; processing quoted by us on SIP — dual pricing or IC+ above the SIP cost floor.',
      make: ['Your share ≈ 45% of the margin over SIP cost (IC + 0.02% + $0.02/txn)', 'Hardware/software quoted at the Unified Pricing sheet numbers'],
      need: null
    },
    'korona': {
      source: 'Korona dealer program · processing on Solutions in Payments paper',
      sched: 'sip',
      quote: 'Software per register at sheet prices ($59/$79/$99); hardware one-time; processing on SIP — meet-or-beat or dual pricing above the SIP cost floor.',
      make: ['Your share ≈ 45% of the margin over SIP cost (IC + 0.02% + $0.02/txn)', 'Software per register and hardware quoted at sheet prices'],
      need: null
    },
    'nrs': {
      source: 'NRS dealer program · processing on Solutions in Payments paper',
      sched: 'sip',
      quote: 'NRS hardware/software per their current dealer sheet; processing on SIP — dual pricing is the norm in c-stores.',
      make: ['Your share ≈ 45% of the margin over SIP cost (IC + 0.02% + $0.02/txn)', 'NRS hardware/software quoted per their current dealer sheet'],
      need: null
    },
    'pays': {
      source: 'PAYS ISO licensing + our processing (SIP paper)',
      sched: 'pays',
      quote: 'Sell the plans at the published retail (Starter $59 / Growth $79 / Enterprise $99; station $999). The license costs us $59/mo per start ($29 second terminal). Processing is ours to price on SIP paper \u2014 dual pricing is the PAYS norm.',
      make: ['Software margin: retail plan \u2212 $59 license (Growth +$20, Enterprise +$40/mo) \u2014 your share is 50% of it', 'Your share \u2248 45% of the processing margin on our SIP paper', 'Hardware markup on the station bundle'],
      need: null
    },
    'sumup': {
      source: 'SumUp reseller program',
      sched: 'sumup',
      quote: 'You set the merchant\u2019s processing price above IC + 0.05% (per-item waived). SaaS at partner pricing (Cloud POS $99\u2013$289/mo tiers); hardware marked up over Schedule A costs \u2014 never below them. Small merchants can also start on SumUp\u2019s published simple rates.',
      make: ['Your share \u2248 40% of the processing margin you quote above cost (steps up on large books)', '\u2248 10% of new-merchant SaaS subscriptions is yours', 'Hardware markup over Schedule A cost (discounting below cost comes out of your pocket)'],
      need: null
    },
    'terminal-gateway': {
      source: 'Solutions in Payments paper (PAX / Dejavoo / Valor + NMI / FluidPay / Authorize.net / iPOSPays)',
      sched: 'sip',
      quote: 'Fully ours to price on SIP: dual pricing or IC+ above the cost floor (IC pass-through + 0.02% + $0.02/txn); terminal at cost + margin or placement; gateway monthly + per-item.',
      make: ['Your share ≈ 45% of everything above the SIP cost floor — bps, per-item AND monthly-fee margin', 'Terminal hardware margin', 'Gateway monthly margin'],
      need: null
    },
    'invoicing-gateway': {
      source: 'Next2Pay / linked2pay rails (house invoicing + gateway + ACH)',
      sched: 'next2pay',
      quote: 'Lead with Next2Pay Invoicing. Card CNP quoted above IC + 2 bps + $0.0215; ACH is the winner on $2k+ invoices ($0.10/item buy). Invoice with QuickBooks Integration $35/mo buy — set the retail per deal.',
      make: ['Your share = 50% of the margin over the linked2pay buy rates on card + ACH volume', 'Invoice with QuickBooks Integration SaaS margin (retail − $35/mo buy)'],
      need: null
    },
    'high-risk': {
      source: 'Solutions in Payments high-risk book, underwritten per file — work it with the NextPay team in Deal Desk',
      sched: 'sip',
      quote: 'Never quote first — pricing comes back from underwriting per file, priced above the SIP high-risk floor (IC + 0.25% BIN + $0.10/txn + risk monitoring 0.15%).',
      make: ['Your share ≈ 30% of the margin over the SIP high-risk schedule — pricing set at approval, per file'],
      need: null
    }
  },

  /* ---------- Residuals calculator — product-specific fee structures ---------- */
  productCalculators: {
    skytab: {
      name: 'SkyTab by Shift4',
      provider: 'Shift4',
      bonus: 500,
      baseCalculation: 'Margin is generated by the monthly volume and the rate you quote above our interchange cost.',
      feeStructure: {
        interchangePassthrough: 0.60, // We pass 60% of IC through, keep 40%
        binFee: 0.025, // 2.5 bps
        transactionFeeVisaMC: 0.05,
        transactionFeeOther: 0.05,
        amexOptblue: 0.25, // 25 bps
        monthlySupport: 4.75,
        chargebackFee: 15,
        retrievalFee: 5
      },
      note: 'SkyTab is a placement model ($0 upfront). Revenue is based on 18x average monthly profitability after costs. Your share = 50% of NextPay\'s margin after all fees.'
    },
    clover: {
      name: 'Clover (NextPay white-label)',
      provider: 'Fiserv / RedFynn',
      bonus: 250,
      baseCalculation: 'Margin from processing volume and rate above our cost floor (IC + 0.03% BIN + $0.035/auth). Hardware and optional services add margin too.',
      feeStructure: {
        interchangePassthrough: 1.0, // Pass-through
        binFee: 0.0003, // 0.03%
        authorizationFee: 0.035,
        avsFee: 0.01,
        batchFee: 0.02,
        merchantOnFileFee: 6.95, // Monthly
        merchantStatementFee: 1.00, // Monthly per location
        chargebackFee: 15,
        retrievalFee: 10,
        pciAnnual: 99, // Cost (merchant billed $149)
        platformFee: 5, // Per MID monthly
        nonSwipedAuth: 0.03
      },
      note: 'Clover is our best-margin standard book. You earn ~45% of the margin you create above cost. POS-assisted deals trim residual by 20 bps. Hardware markup is additional.'
    },
    sip: {
      name: 'Solutions in Payments (SIP) — Low-Risk',
      provider: 'Solutions in Payments (Luqra)',
      bonus: 250,
      baseCalculation: 'Margin from processing volume and rate above our cost floor (IC + 0.02% BIN + $0.02/txn). Used for: Chively, Quantic, NRS, Korona, standalone terminals and gateways.',
      feeStructure: {
        interchangePassthrough: 1.0, // Pass-through
        binFee: 0.0002, // 0.02%
        transactionFee: 0.02,
        batchFee: 0.02,
        avsFee: 0.02,
        chargebackFee: 10,
        retrievalFee: 7,
        accountOnFileFee: 5, // Monthly
        irsRegulatoryFee: 2, // Monthly
        pciAnnual: 36, // Cost
        monthlyMinimum: 0
      },
      note: 'This is the cost floor for SIP paper — your share = ~45% of the margin above this. High-risk premium: add 0.25% BIN + $0.10/txn, your share drops to ~30%.'
    },
    quantic: {
      name: 'Quantic',
      provider: 'Quantic (SIP paper)',
      bonus: 250,
      baseCalculation: 'Processing margin on SIP paper above cost floor (IC + 0.02% + $0.02/txn) + hardware/software at Unified Pricing sheet.',
      feeStructure: {
        interchangePassthrough: 1.0,
        binFee: 0.0002,
        transactionFee: 0.02,
        batchFee: 0.02,
        processingMarginShare: 0.45, // Your share ~45% of margin on processing
        softwareCostFirst: 60, // Your cost — retail varies per build
        softwareCostAdditional: 50
      },
      note: 'Quantic deals stack SIP processing with hardware/software from the Unified Pricing V5 sheet. Swan bundles, per-device software — check the Proposal Builder for current pricing.'
    },
    next2pay: {
      name: 'Next2Pay Invoicing & Gateway',
      provider: 'NextPay (linked2pay rails)',
      bonus: 250,
      baseCalculation: 'Margin from invoices, card processing, ACH, and recurring billing — all at 50% of our margin. Best for invoice-first businesses, not POS.',
      feeStructure: {
        interchangePassthrough: 1.0, // IC pass-through
        cardBuyRate: 0.02, // 2 bps
        transactionFee: 0.0215, // Per transaction
        authorizationFee: 0.03,
        avsFee: 0.01,
        batchFee: 0.03,
        chargebackFee: 20,
        retrievalFee: 2.50,
        accountMaintenance: 2.99, // Monthly
        pciCompliance: 2.53, // Monthly
        gatewayFeePerMID: 3, // Monthly
        achEnabled: 10, // Monthly
        achTransaction: 0.10,
        linked2Invoice: 35 // Monthly cost
      },
      note: 'Next2Pay is our highest-margin lane. You earn 50% of the margin on card, ACH, and Invoice with QuickBooks Integration. Quote ACH on invoices over $2k — it\'s often the winner.'
    }
  }
};
