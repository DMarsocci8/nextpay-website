/* NextPay POS build catalog — shared by the public Build Your Solution page
   and the Sales Hub Proposal Builder. One source of truth for platforms,
   hardware, software plans and accessories.

   Item fields:
     id       unique id
     cat      category key (must match a cats[] entry for the brand)
     name/sub display copy
     buy      one-time purchase price (omit if monthly-only)
     mo       monthly price (placement/finance/software/SaaS)
     addl     per-additional-device monthly (software plans)
     term     finance term label
     img      product thumbnail path
     quote    true = no public price; itemized on the order and priced in
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

  shift4: { label: 'Shift4 Dine', logo: 'assets/logos/shift4.png', modes: ['placement'],
    proc: 'No upfront cost — dual pricing available for 0% card fees. Processing is quoted separately. 30-day trial, then a 30-month agreement; hardware carries a lifetime warranty.',
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
      { id: 's4-mobile', cat: 'stations', name: 'SkyTab Mobile', sub: 'Handheld for pay-at-table, check printing and live customer survey ratings', mo: 20 },

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
    proc: "Square's published rates apply (2.6% + 10¢ in person, 2.9% + 30¢ online, 3.5% + 15¢ keyed). NextPay reviews your statement to match or beat your effective rate.",
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
    proc: "SumUp's published in-person rate applies (2.6% + 10¢ per tap, dip or swipe). NextPay reviews your statement to match or beat your effective rate.",
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
  }
};
window.NP_POS_ORDER = ['clover', 'shift4', 'square', 'sumup'];
window.NP_POS_MODEINFO = {
  placement: { label: 'Placement · $0 down', note: 'Low monthly, nothing upfront — unlimited replacements, no contract.' },
  buy: { label: 'Buy outright', note: 'Own the hardware — one-time cost. Software is still billed monthly.' },
  finance: { label: 'Finance monthly', note: 'Prefer not to pay upfront? Spread the hardware over 12–24 months, then you own it. Software billed monthly.' }
};
