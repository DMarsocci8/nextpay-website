/* NextPay Sales Hub — CRM API (Cloudflare Worker + D1)
   Backs the hub's built-in CRM (My Pipeline / My Merchants / All Agent Deals)
   with central storage so every agent's book is visible to Dom & Alexander.

   Identity comes from Cloudflare Access: the hub sits behind Access, and
   Cloudflare injects the verified `Cf-Access-Authenticated-User-Email`
   header on every request — no passwords or tokens to manage.

   ── Deploy (one time) ─────────────────────────────────────────────────
   1. Workers & Pages → Create Worker, name: hub-crm-api, paste this file.
   2. D1: Workers & Pages → D1 → Create database `hub-crm`, then bind it to
      the Worker as `DB` (Worker → Settings → Bindings → D1 database).
   3. Create the tables (D1 console → Query):
        CREATE TABLE IF NOT EXISTS deals (
          id TEXT PRIMARY KEY, agent TEXT NOT NULL, data TEXT NOT NULL,
          updatedAt TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS merchants (
          id TEXT PRIMARY KEY, agent TEXT NOT NULL, data TEXT NOT NULL,
          updatedAt TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS deals_agent ON deals(agent);
        CREATE INDEX IF NOT EXISTS merchants_agent ON merchants(agent);
   4. Route it on the hub domain so same-origin fetches work:
      Worker → Settings → Domains & Routes → Add route
        hub.nextpaypos.com/api/*   (zone: nextpaypos.com)
      IMPORTANT: also add the same path to the Cloudflare Access "hub"
      application (or a second Access app for hub.nextpaypos.com/api) so
      /api/* stays behind login — the Worker refuses requests without the
      Access header either way.
   5. Done — the hub pages auto-detect /api/health and switch from
      local-browser storage to central storage.

   ── CRM integration (Freshsales-ready, off by default) ────────────────
   The hub is the system of record. Every save/delete below also calls
   syncToCRM(), which pushes the record to an external CRM through an
   adapter. With no adapter configured this is a no-op — zero cost, zero
   risk. To turn on Freshsales one-way push later:
   1. Worker → Settings → Variables and Secrets, add:
        CRM_PROVIDER        freshsales
        FRESHSALES_DOMAIN   yourcompany   (the part before .myfreshworks.com)
        FRESHSALES_API_KEY  <secret>      (Freshsales → Settings → API)
      Optional: FRESHSALES_STAGE_MAP — JSON mapping hub stages to your
      account's numeric deal_stage ids, e.g. {"prospect":401,"proposal":402}
      (ids are per-account: Freshsales → Admin → Deal Pipelines).
   2. Redeploy. Pushes are fire-and-forget (ctx.waitUntil) so hub saves
      never slow down or fail because the CRM is down; Freshsales ids are
      written back onto the hub record (rec.crm.freshsales) so re-saves
      update the same CRM records instead of duplicating them.
   Other CRMs (GoHighLevel etc.): add an adapter object to ADAPTERS with
   the same pushDeal/pushMerchant/remove shape and set CRM_PROVIDER to it.
*/

const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
const KINDS = ['deals', 'merchants'];

/* ── CRM adapters ──────────────────────────────────────────────────────
   Each adapter: enabled(env) → bool, plus async pushDeal/pushMerchant/
   remove(env, rec) which may return { ids } to store back on the record
   under rec.crm.<provider>. Failures are logged, never surfaced to the
   agent — the hub record is already saved by the time sync runs. */

const ADAPTERS = {
  freshsales: {
    enabled: (env) => !!(env.FRESHSALES_DOMAIN && env.FRESHSALES_API_KEY),
    base: (env) => `https://${env.FRESHSALES_DOMAIN}.myfreshworks.com/crm/sales/api`,
    headers: (env) => ({
      'Authorization': `Token token=${env.FRESHSALES_API_KEY}`,
      'Content-Type': 'application/json'
    }),

    // Hub stage → Freshsales deal_stage id. Ids are account-specific, so
    // they come from the optional FRESHSALES_STAGE_MAP env var (JSON).
    stageId(env, stage) {
      try {
        const map = JSON.parse(env.FRESHSALES_STAGE_MAP || '{}');
        return map[stage] || null;
      } catch (e) { return null; }
    },

    // Contact upsert keyed on email (falls back to create when no email).
    async upsertContact(env, rec) {
      const contact = {
        last_name: rec.contactName || rec.biz || 'Unknown',
        mobile_number: rec.phone || undefined,
        email: rec.email || undefined
      };
      const saved = rec.crm && rec.crm.freshsales;
      if (saved && saved.contactId) {
        const r = await fetch(`${this.base(env)}/contacts/${saved.contactId}`, {
          method: 'PUT', headers: this.headers(env), body: JSON.stringify({ contact })
        });
        if (r.ok) return saved.contactId;
      }
      const r = await fetch(`${this.base(env)}/contacts`, {
        method: 'POST', headers: this.headers(env), body: JSON.stringify({ contact })
      });
     if (!r.ok) { const t = await r.text().catch(() => ''); throw new Error(`freshsales contact ${r.status}: ${t.slice(0, 300)}`); }
      const body = await r.json();
      return body.contact && body.contact.id;
    },

    // Hub deal → Freshsales deal linked to the contact.
    async pushDeal(env, rec) {
      const contactId = await this.upsertContact(env, rec);
      const deal = {
        name: (rec.biz || 'Unnamed') + (rec.placement ? ` — ${rec.placement}` : ''),
        amount: rec.volume ? Number(String(rec.volume).replace(/[^0-9.]/g, '')) || 0 : 0,
        contacts_added_list: contactId ? [contactId] : undefined
      };
      const stageId = this.stageId(env, rec.stage);
      if (stageId) deal.deal_stage_id = stageId;
      const saved = rec.crm && rec.crm.freshsales;
      const url = saved && saved.dealId
        ? `${this.base(env)}/deals/${saved.dealId}`
        : `${this.base(env)}/deals`;
      const r = await fetch(url, {
        method: saved && saved.dealId ? 'PUT' : 'POST',
        headers: this.headers(env), body: JSON.stringify({ deal })
      });
    if (!r.ok) { const t = await r.text().catch(() => ''); throw new Error(`freshsales deal ${r.status}: ${t.slice(0, 300)}`); };
      const body = await r.json();
      return { ids: { contactId, dealId: (body.deal && body.deal.id) || (saved && saved.dealId) } };
    },

    // Live merchants sync as contacts only (no open deal to track).
    async pushMerchant(env, rec) {
      const contactId = await this.upsertContact(env, rec);
      return { ids: { contactId } };
    },

    // Hub deletes don't delete in the CRM — history stays there on purpose.
    async remove() { return null; }
  }
};

function activeAdapter(env) {
  const a = ADAPTERS[(env.CRM_PROVIDER || '').toLowerCase()];
  return a && a.enabled(env) ? a : null;
}

/* Fire-and-forget push after a hub save/delete. Writes CRM ids back onto
   the stored record so future saves update instead of duplicate. */
async function syncToCRM(env, kind, rec, action) {
  const adapter = activeAdapter(env);
  if (!adapter) return;
  try {
    if (action === 'delete') { await adapter.remove(env, rec); return; }
    const res = kind === 'deals'
      ? await adapter.pushDeal(env, rec)
      : await adapter.pushMerchant(env, rec);
    if (res && res.ids) {
      rec.crm = rec.crm || {};
      rec.crm[(env.CRM_PROVIDER || '').toLowerCase()] = res.ids;
      await env.DB.prepare(`UPDATE ${kind} SET data = ?2 WHERE id = ?1`)
        .bind(rec.id, JSON.stringify(rec)).run();
    }
  } catch (e) {
           console.log(`CRM sync failed (${kind}/${rec.id}): ${e.message}`);
           try {
                      rec._crmError = String(e.message).slice(0, 500);
                      await env.DB.prepare(`UPDATE ${kind} SET data = ?2 WHERE id = ?1`).bind(rec.id, JSON.stringify(rec)).run();
           } catch (e2) {}
  }

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '');
    const email = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();

    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });

    if (path === '/health') {
      // Health also requires Access so the hub's probe fails closed outside login.
      if (!email) return json({ error: 'unauthenticated' }, 401);
      return json({
        ok: true, user: email, admin: ADMINS.includes(email),
        crm: activeAdapter(env) ? (env.CRM_PROVIDER || '').toLowerCase() : null
      });
    }

    if (!email) return json({ error: 'unauthenticated — hub must sit behind Cloudflare Access' }, 401);

    const m = path.match(/^\/(deals|merchants)(?:\/([^/]+))?$/);
    if (!m) return json({ error: 'not found' }, 404);
    const kind = m[1], id = m[2] ? decodeURIComponent(m[2]) : null;
    const admin = ADMINS.includes(email);

    if (request.method === 'GET' && !id) {
      const rows = admin
        ? await env.DB.prepare(`SELECT data FROM ${kind} ORDER BY updatedAt DESC`).all()
        : await env.DB.prepare(`SELECT data FROM ${kind} WHERE agent = ? ORDER BY updatedAt DESC`).bind(email).all();
      return json(rows.results.map(r => JSON.parse(r.data)));
    }

    if (request.method === 'POST' && !id) {
      let rec;
      try { rec = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
      if (!rec || typeof rec !== 'object' || !rec.id) return json({ error: 'record needs an id' }, 400);
      // Agents write their own records; admins may write anyone's.
      const owner = admin && rec.agent ? String(rec.agent).toLowerCase() : email;
      rec.agent = owner;
      rec.updatedAt = new Date().toISOString();
      const existing = await env.DB.prepare(`SELECT agent, data FROM ${kind} WHERE id = ?`).bind(rec.id).first();
      if (existing && existing.agent !== email && !admin) return json({ error: 'forbidden' }, 403);
      // Hub pages save from their own copy, which may predate CRM ids the
      // sync wrote back — carry stored ids forward so pushes update, not duplicate.
      if (existing && !rec.crm) {
        try { const prev = JSON.parse(existing.data); if (prev.crm) rec.crm = prev.crm; } catch (e) {}
      }
      await env.DB.prepare(
        `INSERT INTO ${kind} (id, agent, data, updatedAt) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(id) DO UPDATE SET agent=?2, data=?3, updatedAt=?4`
      ).bind(rec.id, owner, JSON.stringify(rec), rec.updatedAt).run();
      ctx.waitUntil(syncToCRM(env, kind, rec, 'save'));
      return json(rec);
    }

    if (request.method === 'DELETE' && id) {
      const existing = await env.DB.prepare(`SELECT agent, data FROM ${kind} WHERE id = ?`).bind(id).first();
      if (!existing) return json({ ok: true });
      if (existing.agent !== email && !admin) return json({ error: 'forbidden' }, 403);
      await env.DB.prepare(`DELETE FROM ${kind} WHERE id = ?`).bind(id).run();
      let deleted = { id };
      try { deleted = JSON.parse(existing.data); } catch (e) { /* keep {id} */ }
      ctx.waitUntil(syncToCRM(env, kind, deleted, 'delete'));
      return json({ ok: true });
    }

    return json({ error: 'method not allowed' }, 405);
  }
};
