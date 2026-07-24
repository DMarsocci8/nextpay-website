/* NextPay Sales Hub — data layer for deals & merchants.
   Works two ways, automatically:
   1) API mode  — when the hub-crm-api Worker is routed at /api/* on
      hub.nextpaypos.com, everything is stored centrally (D1). Agents see
      their own records; Dom & Alexander see everyone's.
   2) Local mode — no API reachable (preview, or Worker not deployed yet):
      records live in this browser's localStorage. Export/Import JSON lets
      agents hand their book to admin until the API is live. */
(function () {
  const API = localStorage.getItem('hub_api_base') || '/api';
  let apiOK = null; // null = unknown, true/false after probe

  async function probe() {
    if (apiOK !== null) return apiOK;
    try {
      const r = await fetch(API + '/health', { credentials: 'include' });
      apiOK = r.ok;
    } catch (e) { apiOK = false; }
    return apiOK;
  }

  const uid = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ---------- local storage backend ----------
  function lread(kind) { try { return JSON.parse(localStorage.getItem('hub_' + kind) || '[]'); } catch (e) { return []; } }
  function lwrite(kind, rows) { localStorage.setItem('hub_' + kind, JSON.stringify(rows)); }

  // ---------- public API ----------
  async function list(kind) {
    if (await probe()) {
      const r = await fetch(API + '/' + kind, { credentials: 'include' });
      if (r.ok) return r.json();
    }
    return lread(kind);
  }

  async function save(kind, rec) {
    rec.id = rec.id || uid();
    rec.updatedAt = new Date().toISOString();
    rec.createdAt = rec.createdAt || rec.updatedAt;
    if (!rec.agent) rec.agent = (await Hub.whoami()) || 'unknown';
    if (await probe()) {
      const r = await fetch(API + '/' + kind, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec)
      });
      if (r.ok) return rec;
    }
    const rows = lread(kind);
    const i = rows.findIndex(x => x.id === rec.id);
    if (i >= 0) rows[i] = rec; else rows.push(rec);
    lwrite(kind, rows);
    return rec;
  }

  async function remove(kind, id) {
    if (await probe()) {
      const r = await fetch(API + '/' + kind + '/' + encodeURIComponent(id), { method: 'DELETE', credentials: 'include' });
      if (r.ok) return true;
    }
    lwrite(kind, lread(kind).filter(x => x.id !== id));
    return true;
  }

  function exportAll() {
    const blob = new Blob([JSON.stringify({
      exported: new Date().toISOString(),
      agent: localStorage.getItem('hub_user_email') || '',
      deals: lread('deals'), merchants: lread('merchants')
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nextpay-hub-book-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
  }

  function importAll(file, cb) {
    const rd = new FileReader();
    rd.onload = function () {
      try {
        const j = JSON.parse(rd.result);
        for (const kind of ['deals', 'merchants']) {
          const rows = lread(kind);
          for (const rec of (j[kind] || [])) {
            const i = rows.findIndex(x => x.id === rec.id);
            if (i >= 0) rows[i] = rec; else rows.push(rec);
          }
          lwrite(kind, rows);
        }
        cb && cb(null, j);
      } catch (e) { cb && cb(e); }
    };
    rd.readAsText(file);
  }

  // Deal pipeline stages — one source of truth for CRM + navigator + dashboard.
  const STAGES = [
    { key: 'prospect', label: 'Prospect' },
    { key: 'discovery', label: 'Discovery' },
    { key: 'solution', label: 'Solution Design' },
    { key: 'proposal', label: 'Proposal Sent' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'underwriting', label: 'Underwriting' },
    { key: 'installed', label: 'Installed & Live' },
    { key: 'lost', label: 'Lost' }
  ];

  window.Store = {
    listDeals: () => list('deals'),
    saveDeal: (d) => save('deals', d),
    deleteDeal: (id) => remove('deals', id),
    listMerchants: () => list('merchants'),
    saveMerchant: (m) => save('merchants', m),
    deleteMerchant: (id) => remove('merchants', id),
    exportAll, importAll, probe, STAGES,
    stageLabel: (k) => (STAGES.find(s => s.key === k) || {}).label || k,
    apiMode: () => apiOK === true
  };
})();
