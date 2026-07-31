/* NextPay Sales Hub — shared shell: left sidebar nav, identity, mobile drawer.
   Every hub page includes: <div id="hub-side"></div> + <main class="hub-main"> inside .hub-shell. */
(function () {
  const ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 9v11h14V9"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-4 1 2-5z"/>',
    board: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v10"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    cap: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    store: '<path d="M4 7l1-4h14l1 4"/><path d="M4 7h16v3a2 2 0 01-4 0 2 2 0 01-4 0 2 2 0 01-4 0 2 2 0 01-4 0z"/><path d="M5 12v9h14v-9M9 21v-5h6v5"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 .9-3 2.2c0 2.9 6 1.6 6 4.4 0 1.3-1.3 2.4-3 2.4s-3-1.1-3-2.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.7c2.9.2 5.2 2.1 5.8 5.3"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    mega: '<path d="M3 11l14-5v12L3 13z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/><path d="M17 8a4 4 0 010 6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
    folder: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>'
  };
  function icon(k) {
    return '<svg viewBox="0 0 24 24">' + (ICONS[k] || '') + '</svg>';
  }

  const NAV = [
    { sec: 'Work a deal' },
    { href: 'index.html', label: 'Dashboard', ic: 'home' },
    { href: 'deal-navigator.html', label: 'Deal Navigator', ic: 'compass' },
    { href: 'crm.html', label: 'My Pipeline', ic: 'board' },
    { href: 'statement-review.html', label: 'Statement Review', ic: 'calc' },
    { href: 'pricing.html', label: 'Pricing & Buy Rates', ic: 'coin' },
    { href: 'proposals.html', label: 'Proposal Studio', ic: 'pen' },
    { href: 'submit-deal.html', label: 'Submit a Deal', ic: 'send' },
    { sec: 'Learn' },
    { href: 'training.html', label: 'Training Academy', ic: 'cap' },
    { href: 'playbook.html', label: 'Sales Playbook', ic: 'book' },
    { href: 'products.html', label: 'Products', ic: 'box' },
    { href: 'industries.html', label: 'Industry Playbooks', ic: 'store' },
    { href: 'resources.html', label: 'Resource Library', ic: 'folder' },
    { sec: 'My business' },
    { href: 'merchants.html', label: 'My Merchants', ic: 'users' },
    { href: 'compensation.html', label: 'Compensation', ic: 'doc' },
    { href: 'marketing.html', label: 'Marketing & Brand', ic: 'mega' },
    { href: 'business-profile.html', label: 'Google Business Profile', ic: 'store' },
    { href: 'calendar.html', label: 'Calendar', ic: 'cal' },
    { sec: 'Admin', admin: true },
    { href: 'admin.html', label: 'All Agent Deals', ic: 'shield', admin: true }
  ];

  const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
  const LOGO = 'assets/logos/nextpay.png';

  // --- identity: Cloudflare Access on hub.nextpaypos.com, manual fallback in preview ---
  let _who = null;
  async function whoami() {
    if (_who) return _who;
    const cached = localStorage.getItem('hub_user_email');
    try {
      const r = await fetch('/cdn-cgi/access/get-identity', { credentials: 'include' });
      if (r.ok) {
        const j = await r.json();
        if (j && j.email) {
          _who = j.email.toLowerCase();
          localStorage.setItem('hub_user_email', _who);
          return _who;
        }
      }
    } catch (e) { /* not behind Access (preview) — fall back */ }
    _who = (cached || '').toLowerCase() || null;
    return _who;
  }
  function isAdmin(email) { return ADMINS.includes((email || '').toLowerCase()); }

  function page() {
    const p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function render(email) {
    const admin = isAdmin(email);
    const cur = page();
    let html = '<div class="hs-logo"><span class="box"><img src="' + LOGO + '" alt="NextPay"></span><span class="t">Sales Hub</span></div>';
    html += '<div class="hs-user" id="hs-user">' + (email ? 'Signed in as <b>' + email + '</b>' : '<a href="#" id="hs-setuser" style="color:#9FB2C2">Set your email →</a>') + '</div>';
    html += '<nav>';
    for (const it of NAV) {
      if (it.admin && !admin) continue;
      if (it.sec) { html += '<div class="hs-sec">' + it.sec + '</div>'; continue; }
      html += '<a href="' + it.href + '"' + (it.href === cur ? ' class="on"' : '') + '>' + icon(it.ic) + it.label + '</a>';
    }
    html += '</nav>';
    html += '<div class="hs-foot">Questions? Google Chat —<br>Deal Desk · General Q&amp;A<br><a href="https://nextpaypos.com" target="_blank" rel="noopener">nextpaypos.com ↗</a></div>';
    const side = document.getElementById('hub-side');
    side.className = 'hub-side';
    side.innerHTML = html;

    const set = document.getElementById('hs-setuser');
    if (set) set.addEventListener('click', function (e) {
      e.preventDefault();
      const v = prompt('Enter your NextPay agent email (used to tag your deals):');
      if (v && v.includes('@')) { localStorage.setItem('hub_user_email', v.toLowerCase()); location.reload(); }
    });
  }

  function topbar() {
    const bar = document.createElement('div');
    bar.className = 'hub-topbar';
    bar.innerHTML = '<span class="box"><img src="' + LOGO + '" alt="NextPay"></span><span class="t">SALES HUB</span><button class="hub-burger" aria-label="Menu">☰</button>';
    document.body.prepend(bar);
    bar.querySelector('.hub-burger').addEventListener('click', () => document.body.classList.toggle('side-open'));
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('side-open') && !e.target.closest('.hub-side') && !e.target.closest('.hub-burger')) {
        document.body.classList.remove('side-open');
      }
    });
  }

  window.Hub = { whoami, isAdmin, ADMINS };

  document.addEventListener('DOMContentLoaded', async function () {
    topbar();
    const email = await whoami();
    render(email);
    document.dispatchEvent(new CustomEvent('hub:ready', { detail: { email, admin: isAdmin(email) } }));
  });
})();
