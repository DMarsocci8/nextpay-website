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
    folder: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
    chat: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'
  };
  function icon(k) {
    return '<svg viewBox="0 0 24 24">' + (ICONS[k] || '') + '</svg>';
  }

  const NAV = [
    { sec: 'Work a deal' },
    { href: 'index.html', label: 'Dashboard', ic: 'home' },
    { href: 'deal-navigator.html', label: 'Deal Navigator', ic: 'compass' },
    { href: 'crm.html', label: 'CRM (My Pipeline)', ic: 'board' },
    { href: 'statement-review.html', label: 'Statement Review', ic: 'calc' },
    { href: 'proposals.html', label: 'Proposal Studio', ic: 'pen' },
    { href: 'submit-deal.html', label: 'Submit a Deal', ic: 'send' },
    { sec: 'Learn' },
    { href: 'training.html', label: 'Training Academy', ic: 'cap' },
    { href: 'playbook.html', label: 'Sales Playbook', ic: 'book' },
    { href: 'quick-sales-tools.html', label: 'Quick Sales Tools', ic: 'send' },
    { href: 'products.html', label: 'Products', ic: 'box' },
    { href: 'resources.html', label: 'Resource Library', ic: 'folder' },
    { sec: 'My business' },
    { href: 'merchants.html', label: 'My Merchants', ic: 'users' },
    { href: 'earnings.html', label: 'Earnings & Compensation', ic: 'coin' },
    { href: 'schedule-as.html', label: 'Partner Programs & Schedule A', ic: 'doc' },
    { href: 'marketing.html', label: 'Marketing & Brand', ic: 'mega' },
    { href: 'https://chat.google.com/u/1/app/home', label: 'Google Chat', ic: 'chat', target: '_blank' },
    { href: 'calendar.html', label: 'Calendar', ic: 'cal' },
    { sec: 'Admin', admin: true },
    { href: 'admin.html', label: 'All Agent Deals', ic: 'shield', admin: true }
  ];

  const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
  const LOGO = 'assets/logos/nextpay.png';

  // --- authentication: Google Sign-In + Cloudflare Access ---
  let _who = null;
  let _authData = null;

  async function whoami() {
    if (_who) return _who;

    // Check Google Sign-In auth first
    const googleAuth = localStorage.getItem('hub_auth');
    if (googleAuth) {
      try {
        _authData = JSON.parse(googleAuth);
        _who = (_authData.email || '').toLowerCase();
        localStorage.setItem('hub_user_email', _who);

        // Track login if needed
        trackLogin(_who);

        return _who;
      } catch (e) {}
    }

    // Fall back to Cloudflare Access
    const cached = localStorage.getItem('hub_user_email');
    try {
      const r = await fetch('/cdn-cgi/access/get-identity', { credentials: 'include' });
      if (r.ok) {
        const j = await r.json();
        if (j && j.email) {
          _who = j.email.toLowerCase();
          localStorage.setItem('hub_user_email', _who);
          trackLogin(_who);
          return _who;
        }
      }
    } catch (e) { /* not behind Access (preview) */ }

    _who = (cached || '').toLowerCase() || null;
    return _who;
  }

  // Login tracking
  function trackLogin(email) {
    try {
      const logins = JSON.parse(localStorage.getItem('hub_logins') || '{}');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `${email}_${today}`;

      logins[key] = (logins[key] || 0) + 1;
      logins['_timestamps'] = logins['_timestamps'] || [];
      logins['_timestamps'].push({
        email: email,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });

      // Keep only last 30 days of timestamps
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      logins['_timestamps'] = logins['_timestamps'].filter(t => new Date(t.timestamp) > thirtyDaysAgo);

      localStorage.setItem('hub_logins', JSON.stringify(logins));
    } catch (e) {
      console.error('Error tracking login:', e);
    }
  }

  // Generate weekly login report
  function generateWeeklyReport() {
    try {
      const logins = JSON.parse(localStorage.getItem('hub_logins') || '{}');
      const report = {};

      // Aggregate login counts by email
      for (const [key, count] of Object.entries(logins)) {
        if (key.startsWith('_')) continue;
        const [email] = key.split('_');
        report[email] = (report[email] || 0) + count;
      }

      // Sort by count descending
      const sorted = Object.entries(report)
        .sort((a, b) => b[1] - a[1])
        .map(([email, count]) => ({ email, count }));

      return {
        generatedAt: new Date().toISOString(),
        reportPeriod: 'Last 7 days',
        totalLogins: Object.values(report).reduce((a, b) => a + b, 0),
        agentLogins: sorted,
        timestamps: logins['_timestamps'] || []
      };
    } catch (e) {
      console.error('Error generating report:', e);
      return null;
    }
  }

  // Export report function for admin use
  window.Hub.generateWeeklyReport = generateWeeklyReport;

  function getAuthData() { return _authData; }
  function logout() {
    localStorage.removeItem('hub_auth');
    localStorage.removeItem('hub_user_email');
    window.location.href = 'login.html';
  }
  function isAdmin(email) { return ADMINS.includes((email || '').toLowerCase()); }

  // Enforce authentication
  async function enforceAuth() {
    const email = await whoami();
    if (!email || !email.endsWith('@nextpaypos.com')) {
      // Redirect to login if not authenticated or wrong domain
      if (window.location.pathname !== '/hub/login.html' && !window.location.pathname.includes('login')) {
        window.location.href = 'login.html';
      }
    }
  }

  function page() {
    const p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p + (p && !p.includes('.') ? '.html' : '');
  }

  function render(email) {
    const admin = isAdmin(email);
    const cur = page();
    let html = '<div class="hs-logo"><span class="box"><img src="' + LOGO + '" alt="NextPay"></span><span class="t">Sales Hub</span></div>';
    html += '<div class="hs-user" id="hs-user">' + (email ? 'Signed in as <b>' + email + '</b><br><button id="hs-logout" style="background:none;border:none;color:#8FA5B8;cursor:pointer;font-size:11px;margin-top:6px;text-decoration:underline">Sign out</button>' : '<a href="login.html" id="hs-setuser" style="color:#9FB2C2">Sign in →</a>') + '</div>';
    html += '<nav>';
    for (const it of NAV) {
      if (it.admin && !admin) continue;
      if (it.sec) { html += '<div class="hs-sec">' + it.sec + '</div>'; continue; }
      html += '<a href="' + it.href + '"' + (it.href === cur ? ' class="on"' : '') + (it.target ? ' target="' + it.target + '" rel="noopener"' : '') + '>' + icon(it.ic) + it.label + '</a>';
    }
    html += '</nav>';
    html += '<div class="hs-foot">Questions? Google Chat —<br>Deal Desk · General Q&amp;A<br><button id="hs-feedback" style="background:none;border:none;color:#8FA5B8;cursor:pointer;font-size:11px;margin-top:12px;text-decoration:underline">💭 Suggest a change</button><br><a href="https://nextpaypos.com" target="_blank" rel="noopener">nextpaypos.com ↗</a></div>';
    const side = document.getElementById('hub-side');
    side.className = 'hub-side';
    side.innerHTML = html;

    const logout = document.getElementById('hs-logout');
    if (logout) logout.addEventListener('click', logout);

    const feedback = document.getElementById('hs-feedback');
    if (feedback) feedback.addEventListener('click', showFeedbackModal);

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

  // Feedback modal
  function showFeedbackModal() {
    const existing = document.getElementById('feedback-modal-bg');
    if (existing) {
      existing.classList.add('open');
      document.getElementById('feedback-textarea').focus();
      return;
    }

    const modalHtml = `
      <div class="modal-bg open" id="feedback-modal-bg">
        <div class="modal">
          <button class="x" type="button" onclick="document.getElementById('feedback-modal-bg').classList.remove('open')">✕</button>
          <h3>Suggest a Change</h3>
          <p class="muted small" style="margin-bottom:16px">Help us improve the Sales Hub. What would make this better for you?</p>
          <textarea id="feedback-textarea" class="fi" placeholder="Your suggestion or feedback..." style="min-height:100px;font-family:inherit;padding:8px;margin-bottom:16px;resize:vertical"></textarea>
          <p class="small muted" style="margin-bottom:16px">Your email: <b id="feedback-email">${_authData?.email || ''}</b></p>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('feedback-modal-bg').classList.remove('open')">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" id="feedback-submit">Send Feedback</button>
          </div>
          <div id="feedback-status" style="margin-top:12px;font-size:13px;color:#5B6B7B;display:none"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const submitBtn = document.getElementById('feedback-submit');
    const textarea = document.getElementById('feedback-textarea');
    const statusDiv = document.getElementById('feedback-status');

    submitBtn.addEventListener('click', async () => {
      const feedback = textarea.value.trim();
      if (!feedback) {
        statusDiv.textContent = '❌ Please enter your feedback';
        statusDiv.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      statusDiv.textContent = '⏳ Sending...';
      statusDiv.style.display = 'block';

      try {
        // Send to Formspree (replace with your form endpoint)
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: _authData?.email || '',
            feedback: feedback,
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          statusDiv.textContent = '✅ Feedback sent! Thank you.';
          statusDiv.style.color = '#2E9E6B';
          textarea.value = '';
          setTimeout(() => {
            document.getElementById('feedback-modal-bg').classList.remove('open');
          }, 1500);
        } else {
          throw new Error('Failed to send');
        }
      } catch (e) {
        statusDiv.textContent = '❌ Error sending feedback. Try again or email dom@nextpaypos.com directly.';
        statusDiv.style.color = '#D65A5A';
        submitBtn.disabled = false;
      }
    });
  }

  window.Hub = { whoami, isAdmin, ADMINS, logout, enforceAuth, getAuthData };

  document.addEventListener('DOMContentLoaded', async function () {
    // Enforce authentication on protected pages
    if (!window.location.pathname.includes('login')) {
      await enforceAuth();
    }

    topbar();
    const email = await whoami();
    render(email);
    document.dispatchEvent(new CustomEvent('hub:ready', { detail: { email, admin: isAdmin(email) } }));
  });
})();
