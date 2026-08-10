/* NextPay POS build catalog — shared by the public Build Your Solution page
and the Sales Hub Proposal Builder. One source of truth for platforms,
hardware, software plans and accessories.

Item fields:
id unique id
cat category key (must match a cats[] entry for the brand)
name/sub display copy
buy one-time purchase price (omit if monthly-only)
mo monthly price (placement/finance/software/SaaS)
addl per-additional-device monthly (software plans)
term finance term label
img product thumbnail path
quote true = no public price; itemized on the order and priced in
the final quote (never invents a number, excluded from totals)
*/
window.NP_POS_CATALOG = {
clover: { label: 'Clover', logo: 'assets/logos/clover.png', modes: ['placement', 'buy'],
proc: 'Processing is quoted separately — dual pricing available for 0% card fees, or we match/beat your rate. A $5/mo Clover platform fee per location also applies.',
cats: [
{ key: 'base', label: 'Base systems', type: 'qty' },
{ key: 'software', label: 'Software plan', type: 'single' },
{ key: 'kitchen', label: 'Kitchen & displays', type: 'qty' },
{ key: 'accessory', label: 'Peripherals & accessories', type: 'qty' }
],
items: [
{ id: 'cl-duo', cat: 'base', name: 'Clover Station Duo', sub: 'Dual-screen flagship — 14-inch merchant screen plus 7-inch customer display, printer and cash drawer', buy: 2078, mo: 55, img: 'assets/pos/clover-duo.png' },
{ id: 'cl-duob', cat: 'base', name: 'Clover Station Duo Bundle', sub: 'Dual-screen bundle — tablet, printer, terminal, starter kit and cash drawer', buy: 2172.80, mo: 60, img: 'assets/pos/clover-duo.png' },
{ id: 'cl-solo', cat: 'base', name: 'Clover Station Solo', sub: 'Single 14-inch countertop register with built-in receipt printer', buy: 1766, mo: 45, img: 'assets/pos/clover-station-solo.webp' },
{ id: 'cl-solob', cat: 'base', name: 'Clover Station Solo Bundle', sub: 'Single-screen bundle — tablet, printer, starter kit and cash drawer', buy: 1860.80, mo: 50, img: 'assets/pos/clover-station-solo.webp' },
{ id: 'cl-mini', cat: 'base', name: 'Clover Mini', sub: 'Compact 7-inch countertop POS with built-in receipt printer', buy: 937, mo: 25, img: 'assets/terminals/clover-mini.png' },
{ id: 'cl-flex', cat: 'base', name: 'Clover Flex (Gen 4)', sub: 'Handheld 5-inch POS with built-in printer and scanner — ring up anywhere', buy: 758, mo: 20, img: 'assets/pos/clover-flex.webp' },
{ id: 'cl-pocket', cat: 'base', name: 'Clover Pocket', sub: 'Pocket card reader — tap and chip, pairs with your phone', buy: 449, mo: 18, img: 'assets/pos/clover-pocket.png' },
{ id: 'cl-kiosk', cat: 'base', name: 'Clover Kiosk', sub: '24-inch self-order kiosk with printer — cuts lines and lifts ticket size', buy: 3587, mo: 90, img: 'assets/pos/clover-kiosk.webp' },

{ id: 'sw-starter', cat: 'software', name: 'Starter', sub: 'Basic payments and reporting for simple, single-device setups', mo: 0, addl: 11.95 },
{ id: 'sw-essentials', cat: 'software', name: 'Essentials', sub: 'Payments, basic inventory and the Clover Go mobile app', mo: 29.95, addl: 11.95 },
{ id: 'sw-retail', cat: 'software', name: 'Retail Growth', sub: 'Advanced retail — full inventory, item-level tracking and reporting', mo: 84.95, addl: 19.95 },
{ id: 'sw-services', cat: 'software', name: 'Services Growth', sub: 'For service businesses — invoicing, appointments and customer management', mo: 84.95, addl: 19.95 },
{ id: 'sw-restaurant', cat: 'software', name: 'Restaurant Growth', sub: 'Full-service restaurant — tables, coursing, online ordering and KDS', mo: 89.95, addl: 19.95 },
{ id: 'sw-healthcare', cat: 'software', name: 'Clover for Healthcare', sub: 'Payments tailored for medical and dental offices', mo: 0, addl: 11.95 },

{ id: 'ac-kds14', cat: 'kitchen', name: 'Clover KDS 14" (screen)', sub: 'Kitchen display screen — routes orders straight to the line', buy: 531, mo: 14, img: 'assets/pos/clover-kds.jpg' },
{ id: 'ac-kds24', cat: 'kitchen', name: 'Clover KDS 24" (screen)', sub: 'Large kitchen display screen for busy kitchens', buy: 722, mo: 24, img: 'assets/pos/clover-kds.jpg' },
{ id: 'ac-kdswall', cat: 'kitchen', name: 'KDS Wall Mount', sub: 'Wall mount for the KDS screen', buy: 53, mo: 2 },
{ id: 'ac-kdsstand', cat: 'kitchen', name: 'KDS Countertop Stand', sub: 'Countertop stand for the KDS screen', buy: 80, mo: 3 },
{ id: 'ac-starimpact', cat: 'kitchen', name: 'STAR Impact Kitchen Printer', sub: 'Impact kitchen printer — durable for hot kitchens', buy: 539.22, mo: 20, img: 'assets/terminals/chively-printer.png' },
{ id: 'ac-starthermal', cat: 'kitchen', name: 'STAR Thermal Kitchen Printer', sub: 'Thermal kitchen printer — fast and quiet', buy: 365.22, mo: 15, img: 'assets/terminals/chively-printer.png' },

{ id: 'ac-clovergo', cat: 'accessory', name: 'Clover Go Reader', sub: 'Pocket tap-and-chip reader — pairs with the Clover app on your phone', buy: 49, mo: 5, img: 'assets/terminals/clover-go.png' },
{ id: 'ac-zebra9308', cat: 'accessory', name: 'Zebra DS 9308 Scanner', sub: 'Hands-free 2D barcode scanner for high-volume retail', buy: 233.22, mo: 8, img: 'assets/terminals/chively-scanner.png' },
{ id: 'ac-zebra2208', cat: 'accessory', name: 'Zebra DS 2208 Scanner', sub: 'Handheld 2D barcode scanner', buy: 164.22, mo: 6, img: 'assets/terminals/chively-scanner.png' },
{ id: 'ac-cashdrawer', cat: 'accessory', name: 'Cash Drawer', sub: 'Standard cash drawer', buy: 79, mo: 5, img: 'assets/terminals/chively-drawer.png' },
{ id: 'ac-kioskfloor', cat: 'accessory', name: 'Kiosk Floor Stand', sub: 'Free-standing floor stand for the kiosk', buy: 549, mo: 25 },
{ id: 'ac-kioskwall', cat: 'accessory', name: 'Kiosk Wall Mount', sub: 'Wall mount for the kiosk', buy: 54, mo: 3 },
{ id: 'ac-scale', cat: 'accessory', name: 'Integrated Weight Scale', sub: 'Deli & market weighing at checkout — we spec the right certified model for you', quote: true },
{ id: 'ac-label', cat: 'accessory', name: 'Barcode Label Printer', sub: 'Print shelf and product barcode labels for retail inventory', quote: true },
{ id: 'ac-paper', cat: 'accessory', name: 'Receipt Paper Starter Pack', sub: 'Thermal receipt rolls sized to your printers', quote: true },
{ id: 'ac-network', cat: 'accessory', name: 'Network & Cabling Kit', sub: 'Router, switch and cabling for a clean, reliable install', quote: true }
]
},

shift4: { label: 'SkyTab by Shift4', logo: 'assets/logos/skytab.svg', modes: ['placement'],
proc: 'No upfront cost — dual pricing available for 0% card fees. Processing is quoted separately. 30-day trial, then a 36-month agreement; hardware carries a lifetime warranty.',
cats: [
{ key: 'base', label: 'Base system', type: 'qty' },
{ key: 'stations', label: 'Stations, kitchen & displays', type: 'qty' },
{ key: 'services', label: 'Value-added services', type: 'qty' },
{ key: 'accessory', label: 'Peripherals & accessories', type: 'qty' }
],
items: [
{ id: 's4-base', cat: 'base', name: 'SkyTab POS Base Bundle', sub: 'Software, hardware, receipt printer and cash drawer (lifetime warranty), card processing and 24/7 support', mo: 29.99, img: 'assets/pos/shift4-skytab-pos.png' },

{ id: 's4-glass', cat: 'stations', name: 'SkyTab Glass', sub: 'Built-for-purpose tablet running the full POS — order and pay at the table', mo: 29.99, img: 'assets/pos/shift4-glass.png' },
{ id: 's4-air', cat: 'stations', name: 'SkyTab Air', sub: 'Phone-style handheld with hand strap running the full SkyTab POS — take orders and payments anywhere', mo: 29.99, img: 'assets/pos/shift4-handheld.png' },
{ id: 's4-kds', cat: 'stations', name: 'Kitchen Display System (KDS)', sub: 'Kitchen display — routes multiple order types across screens, works offline', mo: 29.99, img: 'assets/pos/shift4-kds.png' },
{ id: 's4-bumpbar', cat: 'stations', name: 'KDS Bump Bar', sub: 'Physical bump bar for clearing tickets off the kitchen display', mo: 9.99 },
{ id: 's4-cfd', cat: 'stations', name: 'Customer-Facing Display', sub: 'Order confirmation, tipping and checkout — detaches on a cable', mo: 29.99, img: 'assets/pos/shift4-display.png' },
{ id: 's4-kiosk', cat: 'stations', name: 'Self Order Kiosk', sub: 'Self-serve ordering kiosk for QSR and high-traffic counters — lifts ticket size', mo: 29.99, img: 'assets/pos/shift4-kiosk.png' },
{ id: 's4-mobile', cat: 'stations', name: 'SkyTab Mobile', sub: 'Handheld for pay-at-table, check printing and live customer survey ratings', mo: 20, img: 'assets/pos/shift4-skytab-mobile.jpg' },

{ id: 's4-lighthouse', cat: 'services', name: 'Lighthouse Business Manager', sub: 'Reporting, reputation and marketing dashboard', mo: 20 },
{ id: 's4-giftcards', cat: 'services', name: 'Gift Cards', sub: 'Physical and digital gift card program', mo: 25 },
{ id: 's4-workforce', cat: 'services', name: 'SkyTab Workforce', sub: 'Scheduling, time clock and team management', mo: 35 },
{ id: 's4-thermal', cat: 'accessory', name: 'Remote Thermal Printer (M335A)', sub: 'Remote thermal receipt or prep printer', mo: 9.99, img: 'assets/terminals/chively-printer.png' },
{ id: 's4-dotmatrix', cat: 'accessory', name: 'Remote Dot Matrix Printer (TM-U220)', sub: 'Remote impact printer for hot kitchens', mo: 9.99, img: 'assets/terminals/chively-printer.png' },
{ id: 's4-scanner', cat: 'accessory', name: '2D Barcode Scanner (Honeywell Voyager 1400g)', sub: '2D barcode scanner for retail and checkout', mo: 9.99, img: 'assets/terminals/chively-scanner.png' },
{ id: 's4-pinpad', cat: 'accessory', name: 'EMV/NFC PIN Pad', sub: 'Customer-facing PIN pad — tap, dip and PIN debit', mo: 9.99 },
{ id: 's4-labelprinter', cat: 'accessory', name: 'Label Printer', sub: 'Label printing for prep, packaging and retail', mo: 19.99 },
{ id: 's4-scale', cat: 'accessory', name: 'Digital Scale (CAS PD-II)', sub: 'Integrated weight scale for delis, markets and checkout', mo: 39.99 },
{ id: 's4-caller2', cat: 'accessory', name: 'Caller ID (2-line)', sub: 'Pops up customer info on incoming calls', mo: 9.99 },
{ id: 's4-caller4', cat: 'accessory', name: 'Caller ID (4-line)', sub: '4-line caller ID for higher call volume', mo: 19.99 },
{ id: 's4-drawer', cat: 'accessory', name: 'Additional Cash Drawer', sub: 'Extra cash drawer beyond the one in the base bundle', buy: 129, img: 'assets/terminals/chively-drawer.png' },
{ id: 's4-till', cat: 'accessory', name: 'Additional Cash Till', sub: 'Extra till insert for shift changes', buy: 25 },
{ id: 's4-splitcable', cat: 'accessory', name: 'Split Cable for Cash Drawer', sub: 'Run two drawers off one printer port', buy: 25 },
{ id: 's4-paper', cat: 'accessory', name: 'Receipt Paper Starter Pack', sub: 'Thermal and impact rolls sized to your printers', quote: true },
{ id: 's4-network', cat: 'accessory', name: 'Network & Cabling Kit', sub: 'Router, switch and cabling for a clean, reliable install', quote: true }
]
},

square: { label: 'Square', logo: 'assets/logos/square.svg', modes: ['buy', 'finance'],
proc: "Square's published rates apply (2.6% + 10¢ in person, 2.9% + 30¢ online, 3.5% + 15¢ keyed). These are Square's fixed, published rates — set and billed directly by Square, and not something NextPay discounts or adjusts.",
resources: [
{ label: 'Square Partner Support', phone: '855-700-6000' },
{ label: 'Square Support Center', url: 'https://squareup.com/help/us/en' },
{ label: 'Square Marketing Portal', url: 'https://view-su2.highspot.com/viewer/678d1ce1ebafc29c0887e958d0e8caea' },
{ label: 'Square YouTube Channel', url: 'https://www.youtube.com/square/featured' }
],
cats: [
{ key: 'base', label: 'Hardware', type: 'qty' },
{ key: 'software', label: 'Software plan', type: 'single' },
{ key: 'accessory', label: 'Peripherals & accessories', type: 'qty' }
],
items: [
{ id: 'sq-terminal', cat: 'base', name: 'Square Terminal', sub: 'All-in-one handheld terminal with built-in receipt printer — tap, chip and swipe', buy: 299, mo: 27, term: '12 mo', img: 'assets/terminals/square-terminal.png' },
{ id: 'sq-station', cat: 'base', name: 'Square Station', sub: 'Two-screen register — large seller screen plus customer display, no tablet needed', buy: 899, mo: 44, term: '24 mo', img: 'assets/pos/square-register.png' },
{ id: 'sq-handheld', cat: 'base', name: 'Square Handheld', sub: 'Lightweight handheld for tableside ordering and tap-to-pay', buy: 399, mo: 37, term: '12 mo', img: 'assets/terminals/square-handheld.png' },
{ id: 'sq-stand', cat: 'base', name: 'Square Stand', sub: 'Turns your iPad into a countertop POS with a swivel customer display (iPad sold separately)', buy: 149, img: 'assets/pos/square-stand.png' },
{ id: 'sq-reader', cat: 'base', name: 'Square Reader', sub: 'Pocket reader — tap and chip, pairs with your phone or tablet', buy: 59, mo: 21, term: '12 mo', img: 'assets/terminals/square-reader.avif' },
{ id: 'sq-kioskstand', cat: 'base', name: 'Square Kiosk Stand', sub: 'Self-serve iPad kiosk stand for quick-service ordering (iPad sold separately)', buy: 149, img: 'assets/pos/square-kiosk-white.png' },

{ id: 'sq-free', cat: 'software', name: 'Square Free Plan', sub: 'Core POS, online store and invoices at no monthly fee', mo: 0 },
{ id: 'sq-plus', cat: 'software', name: 'Square Plus Plan', sub: 'Advanced Retail or Restaurant tools — inventory, reporting and team management', mo: 49 },
{ id: 'sq-premium', cat: 'software', name: 'Square Premium Plan', sub: 'Full platform tools — advanced reporting, staff permissions, multi-location management and premium support', mo: 150 },

{ id: 'sq-ipad', cat: 'accessory', name: 'iPad', sub: 'Required for Square Stand and Kiosk — add one or bring your own', buy: 349 },
{ id: 'sq-kiosksw', cat: 'accessory', name: 'Square Kiosk Software', sub: 'Runs the customer-facing self-order kiosk screen', mo: 89 },
{ id: 'sq-kdssw', cat: 'accessory', name: 'Square KDS (per screen)', sub: 'Kitchen display software — runs on a tablet in the kitchen', mo: 20 },
{ id: 'sq-drawer', cat: 'accessory', name: 'Cash Drawer', sub: 'USB or printer-driven cash drawer for Stand and Station', buy: 129, img: 'assets/terminals/chively-drawer.png' },
{ id: 'sq-printer', cat: 'accessory', name: 'USB Receipt Printer', sub: 'Countertop thermal receipt printer', buy: 299, img: 'assets/terminals/chively-printer.png' },
{ id: 'sq-kitchenprinter', cat: 'accessory', name: 'Kitchen Impact Printer', sub: 'Durable impact printer for hot kitchens', buy: 399, img: 'assets/terminals/chively-printer.png' },
{ id: 'sq-scanner', cat: 'accessory', name: 'USB Barcode Scanner', sub: 'Plug-and-play 2D barcode scanner', buy: 119, img: 'assets/terminals/chively-scanner.png' },
{ id: 'sq-scale', cat: 'accessory', name: 'Integrated Scale', sub: 'Certified scale for by-weight selling — we spec the right model', quote: true },
{ id: 'sq-paper', cat: 'accessory', name: 'Receipt Paper Starter Pack', sub: 'Thermal rolls sized to your printers', quote: true }
]
},

sumup: { label: 'SumUp', logo: 'assets/logos/sumup.svg', modes: ['buy'],
proc: "SumUp's published in-person rate applies (2.6% + 10¢ per tap, dip or swipe) — set and billed directly by SumUp, and not something NextPay discounts or adjusts.",
cats: [
{ key: 'base', label: 'Hardware', type: 'qty' },
{ key: 'software', label: 'Software plan', type: 'single' },
{ key: 'accessory', label: 'Add-ons & accessories', type: 'qty' }
],
items: [
{ id: 'su-bundle', cat: 'base', name: 'POS Lite & Solo Bundle', sub: '13-inch HD Register touchscreen plus Solo reader — free POS software, $0 monthly', buy: 499, img: 'assets/pos/sumup-pos-lite.webp' },
{ id: 'su-pos', cat: 'base', name: 'SumUp POS (full system)', sub: 'Customer touchscreen with built-in reader — CRM, rewards and marketing tools (requires the SumUp POS plan)', buy: 799, img: 'assets/pos/sumup-pos-full.png' },
{ id: 'su-terminal', cat: 'base', name: 'SumUp Terminal', sub: 'Palm-size POS with built-in printer — take orders and payments anywhere', buy: 249, img: 'assets/pos/sumup-terminal.webp' },
{ id: 'su-solo', cat: 'base', name: 'Solo Card Reader', sub: 'Pocket tap-and-chip reader', buy: 54, img: 'assets/pos/sumup-solo.jpg' },

{ id: 'su-swfree', cat: 'software', name: 'Free POS Software', sub: 'Included with POS Lite, Terminal and Solo — no monthly fee', mo: 0 },
{ id: 'su-swpos', cat: 'software', name: 'SumUp POS Plan', sub: 'Required for the full SumUp POS — install and training, CRM, rewards, staff and marketing tools', mo: 99 },
{ id: 'su-connectplus', cat: 'software', name: 'Connect Plus', sub: 'Loyalty and marketing — SMS/email promotions and customer insights', mo: 199 },
{ id: 'su-connectpro', cat: 'software', name: 'Connect Pro', sub: 'Everything in Plus with AI-enhanced campaigns and advanced growth tools', mo: 289 },

{ id: 'su-online', cat: 'accessory', name: 'Online Ordering', sub: 'Add online ordering to SumUp POS', mo: 19 },
{ id: 'su-drawer', cat: 'accessory', name: 'Cash Drawer', sub: 'Standard cash drawer for the Register', quote: true, img: 'assets/terminals/chively-drawer.png' },
{ id: 'su-printer', cat: 'accessory', name: 'Receipt Printer', sub: 'Countertop thermal receipt printer', quote: true, img: 'assets/terminals/chively-printer.png' },
{ id: 'su-scanner', cat: 'accessory', name: 'Barcode Scanner', sub: '2D barcode scanner for retail checkout', quote: true, img: 'assets/terminals/chively-scanner.png' },
{ id: 'su-paper', cat: 'accessory', name: 'Receipt Paper Starter Pack', sub: 'Thermal rolls sized to your printers', quote: true }
]
},

pays: { label: 'PAYS', logo: 'assets/logos/pays.svg', modes: ['buy'],
proc: 'All-inclusive dual pricing — 0% card processing fees. Software plans per payspos.com; hardware beyond the station bundle is quoted with your order.',
cats: [
{ key: 'base', label: 'Hardware', type: 'qty' },
{ key: 'software', label: 'Software plan', type: 'single' },
{ key: 'accessory', label: 'Add-ons & accessories', type: 'qty' }
],
items: [
{ id: 'pa-station', cat: 'base', name: 'PAYS Station + Reader Bundle', sub: 'Countertop POS station with card reader — the core PAYS setup', buy: 999, img: 'assets/pos/pays-station-web2.png' },
{ id: 'pa-handheld', cat: 'base', name: 'PAYS Handheld', sub: 'Mobile handheld for line-busting and tableside orders', quote: true, img: 'assets/pos/pays-handheld.png' },
{ id: 'pa-kds', cat: 'base', name: 'PAYS Kitchen Display (KDS)', sub: 'Kitchen display for order routing', quote: true, img: 'assets/pos/pays-kds.png' },
{ id: 'pa-kiosk', cat: 'base', name: 'PAYS Self-Order Kiosk', sub: 'Customer self-ordering kiosk', quote: true, img: 'assets/pos/pays-kiosk-web.png' },

{ id: 'pa-starter', cat: 'software', name: 'Starter', sub: 'Payment processing, 24/7/365 support, reporting, online ordering, take-out & phone orders', mo: 59 },
{ id: 'pa-growth', cat: 'software', name: 'Growth', sub: 'All Starter features + invoicing, DoorDash/Uber Eats/Grubhub delivery, KDS, fine dine-in, scan gun', mo: 79 },
{ id: 'pa-enterprise', cat: 'software', name: 'Enterprise', sub: 'All Growth features + gift cards, loyalty, email marketing, catering & events, reservations, multi-location dashboard', mo: 99 },

{ id: 'pa-drawer', cat: 'accessory', name: 'Cash Drawer', sub: 'Standard cash drawer', quote: true, img: 'assets/terminals/chively-drawer.png' },
{ id: 'pa-printer', cat: 'accessory', name: 'Receipt Printer', sub: 'Countertop thermal receipt printer', quote: true, img: 'assets/terminals/chively-printer.png' },
{ id: 'pa-scanner', cat: 'accessory', name: 'Barcode Scanner', sub: '2D barcode scanner for retail checkout', quote: true, img: 'assets/terminals/chively-scanner.png' },
{ id: 'pa-paper', cat: 'accessory', name: 'Receipt Paper Starter Pack', sub: 'Thermal rolls sized to your printers', quote: true }
]
},

quantic: { label: 'Quantic', logo: 'assets/logos/quantic-tight.png', modes: ['buy'],
proc: 'Dual pricing available for 0% card fees — processing quoted separately. Software per the Quantic Unified Pricing sheet; support included.',
cats: [
{ key: 'base', label: 'Stations, kiosks & bundles', type: 'qty' },
{ key: 'persw', label: 'Software (per device, monthly)', type: 'qty' },
{ key: 'addons', label: 'Add-on modules (monthly)', type: 'qty' },
{ key: 'accessory', label: 'Terminals, printers & peripherals', type: 'qty' }
],
items: [
{ id: 'qt-swanbundle', cat: 'base', name: 'Swan 1 Pro Bundle (15.6" + 10.1" CDS)', sub: 'Station with customer display, Dejavoo P1 terminal, cash drawer and printer', buy: 1419, img: 'assets/pos/quantic-pos.png' },
{ id: 'qt-swanbundle2', cat: 'base', name: 'Swan 1 Pro Bundle — no terminal', sub: 'Station with customer display, cash drawer and printer', buy: 1119, img: 'assets/pos/quantic-pos.png' },
{ id: 'qt-swansolo', cat: 'base', name: 'Swan 1 Pro Solo Bundle', sub: 'Single-screen station with Dejavoo P1, drawer and printer', buy: 1219, img: 'assets/pos/quantic-lite.jpg' },
{ id: 'qt-swansolo2', cat: 'base', name: 'Swan 1 Pro Solo Bundle — no terminal', sub: 'Single-screen station with drawer and printer', buy: 919, img: 'assets/pos/quantic-lite.jpg' },
{ id: 'qt-swan', cat: 'base', name: 'Swan 1 Pro Station', sub: 'Station only — add your own peripherals', buy: 699, img: 'assets/pos/quantic-lite.jpg' },
{ id: 'qt-swan2nd', cat: 'base', name: 'Swan 1 Pro — 2nd Display', sub: 'Customer-facing second display for the Swan station', buy: 199, img: 'assets/pos/quantic-cust-display.png' },
{ id: 'qt-propanel', cat: 'base', name: 'Pro Panel 21.5" Android AIO', sub: 'Large all-in-one Android POS panel', buy: 930 },
{ id: 'qt-kdspanel', cat: 'base', name: '24" Android KDS Panel', sub: 'Kitchen display panel', buy: 885, img: 'assets/pos/quantic-kds.png' },
{ id: 'qt-kiosk', cat: 'base', name: '24" OMNIA Kiosk w/ Printer', sub: 'Self-order kiosk with Epson m30 printer', buy: 1469 },
{ id: 'qt-kioskstand', cat: 'base', name: 'OMNIA Kiosk Floor Stand', sub: 'Free-standing floor stand for the kiosk', buy: 409 },

{ id: 'qt-swpro', cat: 'persw', name: 'POS Station — Pro (1st station)', sub: 'Core Quantic POS subscription; each additional station $50/mo', mo: 60, img: '' },
{ id: 'qt-swproaddl', cat: 'persw', name: 'POS Station — Pro (additional)', sub: 'Each additional Pro station', mo: 50 },
{ id: 'qt-swent', cat: 'persw', name: 'POS Station — Enterprise (1st station)', sub: 'Advanced feature set; each additional station $80/mo', mo: 90 },
{ id: 'qt-swentaddl', cat: 'persw', name: 'POS Station — Enterprise (additional)', sub: 'Each additional Enterprise station', mo: 80 },
{ id: 'qt-swkiosk', cat: 'persw', name: 'Kiosk software (1st)', sub: 'Each additional kiosk $45/mo', mo: 50 },
{ id: 'qt-swhandheld', cat: 'persw', name: 'Handheld (Lite, 1st)', sub: 'Each additional handheld $25/mo', mo: 30 },
{ id: 'qt-swterminal', cat: 'persw', name: 'Smart Terminal (1st)', sub: 'Each additional $8/mo; non-cloud $5/mo', mo: 12, img: 'assets/pos/quantic-smart-terminal.png' },
{ id: 'qt-swcds', cat: 'persw', name: 'Customer Display (CDS)', sub: 'Customer-facing display software', mo: 10 },
{ id: 'qt-swkds', cat: 'persw', name: 'Kitchen Display (KDS)', sub: 'Kitchen display software', mo: 20 },

{ id: 'qt-loyalty', cat: 'addons', name: 'Loyalty & Gift Cards', sub: 'Digital + physical gift cards and loyalty', mo: 30 },
{ id: 'qt-olo', cat: 'addons', name: 'eComm / Online Ordering (OLO)', sub: 'Quantic online ordering', mo: 55 },
{ id: 'qt-qb', cat: 'addons', name: 'QuickBooks Interface', sub: 'Accounting sync', mo: 20 },
{ id: 'qt-callerid', cat: 'addons', name: 'Caller ID', sub: 'Customer pop-up on incoming calls', mo: 12 },
{ id: 'qt-reservations', cat: 'addons', name: 'Reservations', sub: 'Reservations & table management', mo: 15 },
{ id: 'qt-inventory', cat: 'addons', name: 'Inventory (Premium)', sub: 'Advanced inventory management', mo: 30 },
{ id: 'qt-coupon', cat: 'addons', name: 'Coupon Marketing', sub: 'Includes 500 SMS/mo', mo: 25 },
{ id: 'qt-doordash', cat: 'addons', name: 'DoorDash Drive', sub: 'Delivery dispatch integration', mo: 20 },

{ id: 'qt-p1', cat: 'accessory', name: 'Dejavoo P1 Desktop Terminal', sub: 'Android payment terminal', buy: 300 },
{ id: 'qt-p8', cat: 'accessory', name: 'Dejavoo P8 Mobile Terminal', sub: 'Mobile Android payment terminal', buy: 412 },
{ id: 'qt-paxa35', cat: 'accessory', name: 'PAX A35', sub: 'Customer-facing smart PIN pad', buy: 337.50 },
{ id: 'qt-paxa80', cat: 'accessory', name: 'PAX A80', sub: 'Countertop smart terminal', buy: 300 },
{ id: 'qt-epsonm30', cat: 'accessory', name: 'Epson TM-M30III Receipt Printer', sub: 'With cable; Bluetooth version $370', buy: 300, img: 'assets/terminals/chively-printer.png' },
{ id: 'qt-kitchenprinter', cat: 'accessory', name: 'Kitchen Printer TM-U220IIB', sub: 'Impact kitchen printer with cable', buy: 430, img: 'assets/terminals/chively-printer.png' },
{ id: 'qt-lyntekprinter', cat: 'accessory', name: 'Lyntek Printer (USB)', sub: 'Budget USB receipt printer', buy: 99, img: 'assets/terminals/chively-printer.png' },
{ id: 'qt-drawer', cat: 'accessory', name: 'Cash Drawer', sub: 'Lyntek $99 · Epson (black) $135', buy: 99, img: 'assets/terminals/chively-drawer.png' },
{ id: 'qt-zebrascanner', cat: 'accessory', name: 'Zebra EVM Scanner', sub: 'With cable', buy: 392, img: 'assets/terminals/chively-scanner.png' },
{ id: 'qt-labelprinter', cat: 'accessory', name: 'ZD411 Label Printer', sub: 'With one roll of labels', buy: 500 },
{ id: 'qt-scale', cat: 'accessory', name: 'PDN Scale (12/30/60 lb)', sub: 'Certified integrated scale', buy: 549 },
{ id: 'qt-router', cat: 'accessory', name: 'Dream Machine Router Kit', sub: 'Router with AP + switch; 4G backup router $250', buy: 510 },
{ id: 'qt-setup', cat: 'accessory', name: 'Setup & Training Package', sub: 'Software setup, hardware integration, menu build, remote install and training — scoped to your build', quote: true }
]
},

korona: { label: 'Korona', logo: 'assets/logos/korona.png', modes: ['buy'],
proc: 'Processing through NextPay — we match or beat your rate; dual pricing available. Software is per register, hardware is one-time.',
cats: [
{ key: 'plans', label: 'Software plan (per register, monthly)', type: 'qty' },
{ key: 'modules', label: 'Modules (monthly)', type: 'qty' },
{ key: 'base', label: 'Register bundles', type: 'qty' },
{ key: 'accessory', label: 'Terminals, scanners & printers', type: 'qty' }
],
items: [
{ id: 'ko-core', cat: 'plans', name: 'KORONA Core', sub: 'Per register — POS, reporting and support', mo: 59 },
{ id: 'ko-retail', cat: 'plans', name: 'KORONA Retail', sub: 'Per register — Core + inventory, stock management, barcode automation, price labels', mo: 79 },
{ id: 'ko-plus', cat: 'plans', name: 'KORONA Plus', sub: 'Per register — the full feature set', mo: 99 },

{ id: 'ko-food', cat: 'modules', name: 'KORONA Food Module', sub: 'Food service features', mo: 10 },
{ id: 'ko-invoicing', cat: 'modules', name: 'Invoicing Module', sub: 'Invoicing from the register', mo: 10 },
{ id: 'ko-ticketing', cat: 'modules', name: 'Ticketing Module (per gate)', sub: 'Admissions, ticketing and gates', mo: 50 },
{ id: 'ko-franchise', cat: 'modules', name: 'Franchise Module', sub: 'Multi-operator franchise tools', mo: 30 },
{ id: 'ko-integration', cat: 'modules', name: 'Integration (per token)', sub: 'Third-party integration token', mo: 45 },

{ id: 'ko-a7', cat: 'base', name: 'Audrey A7 Bundle (21.5" i5)', sub: 'Register with scanner, cash drawer and printer', buy: 2599.99, img: 'assets/pos/korona-station.png' },
{ id: 'ko-a5', cat: 'base', name: 'Audrey A5-II Bundle (15.6" i3)', sub: 'Register with scanner, cash drawer and printer', buy: 2299.99, img: 'assets/pos/korona-station.png' },
{ id: 'ko-j14', cat: 'base', name: 'Joy J14 Bundle (14")', sub: 'Compact register with scanner, cash drawer and printer', buy: 1399.99, img: 'assets/pos/korona-full-set.png' },

{ id: 'ko-z11', cat: 'accessory', name: 'Dejavoo Z11 Terminal', sub: 'Countertop payment terminal', buy: 300 },
{ id: 'ko-z9', cat: 'accessory', name: 'Dejavoo Z9 Terminal (wireless)', sub: 'Wireless payment terminal', buy: 450 },
{ id: 'ko-qd4', cat: 'accessory', name: 'Dejavoo QD4 Terminal', sub: 'Android countertop terminal', buy: 350 },
{ id: 'ko-a920', cat: 'accessory', name: 'PAX A920 Pro Terminal', sub: 'Portable smart terminal', buy: 600 },
{ id: 'ko-a80', cat: 'accessory', name: 'PAX A80 Terminal', sub: 'Countertop smart terminal', buy: 350 },
{ id: 'ko-a35', cat: 'accessory', name: 'PAX A35 PIN Pad', sub: 'Customer-facing smart PIN pad', buy: 350 },
{ id: 'ko-snbc', cat: 'accessory', name: 'SNBC Receipt Printer', sub: 'Thermal receipt printer', buy: 250, img: 'assets/terminals/chively-printer.png' },
{ id: 'ko-zebralabel', cat: 'accessory', name: 'Zebra Label Printer', sub: 'Shelf and product labels', buy: 450 },
{ id: 'ko-zebraid', cat: 'accessory', name: 'Zebra ID Scanner', sub: 'Age-verification ID scanner', buy: 550, img: 'assets/terminals/chively-scanner.png' },
{ id: 'ko-orbit', cat: 'accessory', name: '1D Orbit Scanner', sub: 'Hands-free presentation scanner', buy: 340, img: 'assets/terminals/chively-scanner.png' },
{ id: 'ko-pranger', cat: 'accessory', name: 'P-Ranger Ticket & Inventory Scanner', sub: 'Pistol grip available for $195', buy: 730 }
]
}
};
window.NP_POS_ORDER = ['clover', 'shift4', 'square', 'sumup', 'pays', 'quantic', 'korona'];
window.NP_POS_MODEINFO = {
placement: { label: 'Placement · $0 down', note: 'Low monthly, nothing upfront — unlimited replacements, no contract.' },
buy: { label: 'Buy outright', note: 'Own the hardware — one-time cost. Software is still billed monthly.' },
finance: { label: 'Finance monthly', note: 'Prefer not to pay upfront? Spread the hardware over 12–24 months, then you own it. Software billed monthly.' }
};
