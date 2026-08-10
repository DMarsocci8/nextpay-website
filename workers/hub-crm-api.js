/* NextPay Sales Hub — CRM API (Cloudflare Worker + D1)
   Backs the hub's built-in CRM (My Pipeline / My Merchants / All Agent Deals)
   with central storage so every agent's book is visible to Dom & Alexander.

   Identity comes from Cloudflare Access: the hub sits behind Access, and
   Cloudflare injects the verified `Cf-Access-Authenticated-User-Email`
   header on every request for the hub-facing endpoints below. Two extra
   endpoints (leads intake + Freshsales reverse sync) are reachable from
   outside Access on this Worker's own workers.dev URL and are instead
   gated by shared-secret headers, since Make.com and Freshsales workflow
   automations cannot complete an Access login. See notes further down.

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
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, source TEXT, biz TEXT, contactName TEXT, phone TEXT,
        email TEXT, industry TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'unassigned',
        assignedTo TEXT, assignedAt TEXT, dealId TEXT, raw TEXT,
        createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sync_state (key TEXT PRIMARY KEY, value TEXT);
      CREATE INDEX IF NOT EXISTS deals_agent ON deals(agent);
      CREATE INDEX IF NOT EXISTS merchants_agent ON merchants(agent);
      CREATE INDEX IF NOT EXISTS leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS leads_assignedTo ON leads(assignedTo);
   4. Route it on the hub domain so same-origin fetches work:
      Worker → Settings → Domains & Routes → Add route
      hub.nextpaypos.com/api/* (zone: nextpaypos.com)
      IMPORTANT: also add the same path to the Cloudflare Access "hub"
      application (or a second Access app for hub.nextpaypos.com/api) so
      /api/* stays behind login — the Worker refuses requests without the
      Access header either way.
   5. Done — the hub pages auto-detect /api/health and switch from
      local-browser storage to central storage.

   ── CRM integration (Freshsales, bidirectional) ────────────────────────
   The hub is the system of record. Every save/delete below also calls
   syncToCRM(), which pushes the record to Freshsales through the adapter
   below (fire-and-forget, ctx.waitUntil — never slows down or fails a
   hub save because Freshsales is down). Freshsales ids are written back
   onto the hub record (rec.crm.freshsales) so re-saves update the same
   CRM records instead of duplicating them.
   Config (Worker → Settings → Variables and Secrets):
     CRM_PROVIDER        freshsales
     FRESHSALES_DOMAIN   nextpayllc (the part before .myfreshworks.com)
     FRESHSALES_API_KEY  <secret> (Freshsales → Settings → API)
     FRESHSALES_STAGE_MAP JSON mapping hub stage → Freshsales numeric
       deal_stage id, e.g. {"prospect":127003238462,"installed":127003238467}

   Reverse sync (Freshsales → hub): this Worker polls Freshsales itself on
   a Cron Trigger (see wrangler.toml [triggers]) every 5 minutes — there's
   no webhook action available in Freshsales Workflows on this plan, so
   pulling from our side is the reliable path. Each run asks Freshsales for
   deals sorted by updated_at desc, stops once it reaches deals already
   seen last time (a bookmark kept in the `sync_state` table), matches
   each one to a hub deal by its stored Freshsales deal id, and updates
   only that deal's stage — a direct D1 write that never calls
   syncToCRM(), so a Freshsales-originated change flows into the hub
   exactly once and cannot bounce back and forth in a loop.
   POST /api/sync/freshsales (header X-Freshsales-Sync-Key, matching the
   FRESHSALES_SYNC_KEY secret) still exists for pushing a single deal id +
   stage id immediately. POST /api/sync/freshsales/poll-now (same header)
   runs the full poll on demand — handy for testing without waiting for
   the cron.

   Leads intake (Gmail → Make.com → hub): POST new leads as JSON to this
   Worker's workers.dev URL at /api/leads/intake, with header
   X-Lead-Intake-Key matching the LEAD_INTAKE_KEY secret. Creates a row in
   the leads pool with status "unassigned" for Ann (or any signed-in hub
   user) to assign to an agent from the Leads Pool page.
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
}

// Freshsales numeric deal_stage id → hub stage, built by inverting
// FRESHSALES_STAGE_MAP. Several hub stages can map to one Freshsales
// stage (e.g. proposal/submitted/underwriting all → "Negotiation"), so
// this direction is necessarily lossy — a documented, accepted limit.
function reverseStageMap(env) {
     const map = {};
     try {
            const fwd = JSON.parse(env.FRESHSALES_STAGE_MAP || '{}');
            for (const [hubStage, fsId] of Object.entries(fwd)) map[String(fsId)] = hubStage;
     } catch (e) {}
     return map;
}

// Polls Freshsales for recently updated deals and mirrors stage changes
// into the hub's D1 `deals` table. Runs on the Cron Trigger (scheduled())
// and is also reachable on demand via POST /api/sync/freshsales/poll-now.
// Bookmarks the newest `updated_at` seen in `sync_state` so each run only
// looks at what changed since last time (scans up to 5 pages of 50 the
// first time it's ever run, when there's no bookmark yet).
async function dealsViewId(env) {
  const adapter = ADAPTERS.freshsales;
  const r = await fetch(`${adapter.base(env)}/deals/filters`, { headers: adapter.headers(env) });
  if (!r.ok) return null;
  const body = await r.json().catch(() => ({}));
  const filters = body.filters || [];
  const all = filters.find(f => /all/i.test(f.name)) || filters.find(f => f.is_default) || filters[0];
  return all ? all.id : null;
}

async function pollFreshsalesDeals(env) {
  const adapter = ADAPTERS.freshsales;
  if (!adapter.enabled(env)) return { skipped: 'freshsales not configured' };
  const viewId = await dealsViewId(env);
  if (!viewId) return { error: 'could not resolve a Freshsales deals view id' };

  const rev = reverseStageMap(env);
     const stateRow = await env.DB.prepare(`SELECT value FROM sync_state WHERE key = 'freshsales_last_poll'`).first();
     const since = stateRow ? stateRow.value : null;

  const rows = await env.DB.prepare(`SELECT id, data FROM deals`).all();
     const hubDeals = [];
     for (const row of rows.results) {
            try { hubDeals.push({ id: row.id, data: JSON.parse(row.data) }); } catch (e) { /* skip unparsable row */ }
     }

  let newest = since;
     let updatedCount = 0;
     let scanned = 0;
     let stop = false;

  for (let page = 1; page <= 8 && !stop; page++) {
    const r = await fetch(`${adapter.base(env)}/deals/view/${viewId}?sort=updated_at&sort_type=desc&page=${page}`, {
      headers: adapter.headers(env)
    });
         if (!r.ok) {
                  const t = await r.text().catch(() => '');
                  console.log(`freshsales poll fetch failed ${r.status}: ${t.slice(0, 300)}`);
                  break;
         }
         const body = await r.json().catch(() => ({}));
         const deals = body.deals || [];
         if (!deals.length) break;

       for (const fsDeal of deals) {
                scanned++;
                const updatedAt = fsDeal.updated_at;
                if (since && updatedAt && new Date(updatedAt) <= new Date(since)) { stop = true; break; }
                if (!newest || (updatedAt && new Date(updatedAt) > new Date(newest))) newest = updatedAt;

           const stageId = fsDeal.deal_stage_id ?? (fsDeal.deal_stage && fsDeal.deal_stage.id);
                const hubStage = stageId != null ? rev[String(stageId)] : null;
                if (!hubStage) continue;

           const match = hubDeals.find(h => h.data.crm && h.data.crm.freshsales && String(h.data.crm.freshsales.dealId) === String(fsDeal.id));
                if (!match || match.data.stage === hubStage) continue;

           match.data.stage = hubStage;
                match.data.updatedAt = new Date().toISOString();
                await env.DB.prepare(`UPDATE deals SET data = ?2, updatedAt = ?3 WHERE id = ?1`)
                  .bind(match.id, JSON.stringify(match.data), match.data.updatedAt).run();
                updatedCount++;
       }
  }

  if (newest) {
         await env.DB.prepare(
                  `INSERT INTO sync_state (key, value) VALUES ('freshsales_last_poll', ?1)
                         ON CONFLICT(key) DO UPDATE SET value = ?1`
                ).bind(newest).run();
  }

  return { ok: true, viewId, scanned, updated: updatedCount, newest };
}

const genId = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export default {
     async fetch(request, env, ctx) {
            const url = new URL(request.url);
            const path = url.pathname.replace(/^\/api/, '');

       const json = (body, status = 200) =>
                new Response(JSON.stringify(body), {
                           status,
                           headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
                });

       // ── External, secret-key-gated endpoints (no Cloudflare Access) ──────
       // These live on the Worker's own *.workers.dev URL, which is not
       // covered by the hub.nextpaypos.com Access application, so Make.com
       // and Freshsales workflow automations can reach them directly.

       if (path === '/leads/intake' && request.method === 'POST') {
                const key = request.headers.get('X-Lead-Intake-Key') || '';
                if (!env.LEAD_INTAKE_KEY || key !== env.LEAD_INTAKE_KEY) return json({ error: 'unauthorized' }, 401);
                let body;
                try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
                const now = new Date().toISOString();
                const rec = {
                           id: genId('lead_'),
                           source: body.source || 'unknown',
                           biz: body.biz || body.business || body.company || '',
                           contactName: body.contactName || body.name || '',
                           phone: body.phone || '',
                           email: body.email || '',
                           industry: body.industry || '',
                           notes: body.notes || body.message || '',
                           status: 'unassigned',
                           createdAt: now, updatedAt: now
                };
                await env.DB.prepare(
                           `INSERT INTO leads (id, source, biz, contactName, phone, email, industry, notes, status, raw, createdAt, updatedAt)
                                    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)`
                         ).bind(rec.id, rec.source, rec.biz, rec.contactName, rec.phone, rec.email, rec.industry, rec.notes, rec.status,
                                        JSON.stringify(body), rec.createdAt, rec.updatedAt).run();
                return json({ ok: true, id: rec.id });
       }

       if (path === '/sync/freshsales/poll-now' && request.method === 'POST') {
                const key = request.headers.get('X-Freshsales-Sync-Key') || '';
                if (!env.FRESHSALES_SYNC_KEY || key !== env.FRESHSALES_SYNC_KEY) return json({ error: 'unauthorized' }, 401);
                const result = await pollFreshsalesDeals(env);
                return json(result);
       }

       if (path === '/sync/freshsales' && request.method === 'POST') {
                const key = request.headers.get('X-Freshsales-Sync-Key') || '';
                if (!env.FRESHSALES_SYNC_KEY || key !== env.FRESHSALES_SYNC_KEY) return json({ error: 'unauthorized' }, 401);
                let body;
                try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
                const dealId = body.deal_id ?? body.id ?? (body.deal && body.deal.id);
                const stageId = body.deal_stage_id ?? body.stage_id ?? (body.deal && body.deal.deal_stage_id);
                if (dealId == null) return json({ error: 'no deal id in payload' }, 400);
                const rows = await env.DB.prepare(`SELECT id, data FROM deals`).all();
                let target = null;
                for (const r of rows.results) {
                           try {
                                        const d = JSON.parse(r.data);
                                        if (d.crm && d.crm.freshsales && String(d.crm.freshsales.dealId) === String(dealId)) { target = d; break; }
                           } catch (e) { /* skip unparsable row */ }
                }
                if (!target) return json({ ok: true, note: 'no hub deal linked to this Freshsales deal yet' });
                const rev = reverseStageMap(env);
                const hubStage = stageId != null ? rev[String(stageId)] : null;
                if (hubStage) target.stage = hubStage;
                target.updatedAt = new Date().toISOString();
                // Direct D1 write only — does NOT call syncToCRM, so this cannot loop.
              await env.DB.prepare(`UPDATE deals SET data = ?2, updatedAt = ?3 WHERE id = ?1`)
                  .bind(target.id, JSON.stringify(target), target.updatedAt).run();
                return json({ ok: true, updated: target.id, stage: target.stage || null });
       }

       // ── Everything below requires Cloudflare Access ───────────────────────
       const email = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();

       if (path === '/health') {
                // Health also requires Access so the hub's probe fails closed outside login.
              if (!email) return json({ error: 'unauthenticated' }, 401);
                return json({
                           ok: true, user: email, admin: ADMINS.includes(email),
                           crm: activeAdapter(env) ? (env.CRM_PROVIDER || '').toLowerCase() : null
                });
       }

       if (!email) return json({ error: 'unauthenticated — hub must sit behind Cloudflare Access' }, 401);
            const admin = ADMINS.includes(email);

       // ── Leads pool (any signed-in hub user can view + assign; Ann doesn't
       // need to be a hub "admin" for this — only deleting a lead requires it) ──
       const leadAssign = path.match(/^\/leads\/([^/]+)\/assign$/);
            if (leadAssign && request.method === 'POST') {
                     let body;
                     try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
                     const agent = String(body.agent || '').toLowerCase().trim();
                     if (!agent) return json({ error: 'agent required' }, 400);
                     const now = new Date().toISOString();
                     await env.DB.prepare(
                                `UPDATE leads SET assignedTo = ?2, status = 'assigned', assignedAt = ?3, updatedAt = ?3 WHERE id = ?1`
                              ).bind(decodeURIComponent(leadAssign[1]), agent, now).run();
                     return json({ ok: true });
            }

       const leadOne = path.match(/^\/leads\/([^/]+)$/);
            if (leadOne && request.method === 'DELETE') {
                     if (!admin) return json({ error: 'forbidden' }, 403);
                     await env.DB.prepare(`DELETE FROM leads WHERE id = ?`).bind(decodeURIComponent(leadOne[1])).run();
                     return json({ ok: true });
            }

       if (path === '/leads' && request.method === 'GET') {
                const rows = await env.DB.prepare(
                           `SELECT * FROM leads ORDER BY (status = 'unassigned') DESC, createdAt DESC`
                         ).all();
                return json(rows.results);
       }

       if (path === '/leads' && request.method === 'POST') {
                let rec;
                try { rec = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
                const now = new Date().toISOString();
                const isNew = !rec.id;
                rec.id = rec.id || genId('lead_');
                rec.status = rec.status || 'unassigned';
                rec.source = rec.source || 'manual';
                rec.createdAt = rec.createdAt || now;
                rec.updatedAt = now;
                await env.DB.prepare(
                           `INSERT INTO leads (id, source, biz, contactName, phone, email, industry, notes, status, assignedTo, assignedAt, dealId, raw, createdAt, updatedAt)
                                    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)
                                             ON CONFLICT(id) DO UPDATE SET source=?2, biz=?3, contactName=?4, phone=?5, email=?6, industry=?7,
                                                        notes=?8, status=?9, assignedTo=?10, assignedAt=?11, dealId=?12, updatedAt=?15`
                         ).bind(rec.id, rec.source, rec.biz || '', rec.contactName || '', rec.phone || '', rec.email || '',
                                        rec.industry || '', rec.notes || '', rec.status, rec.assignedTo || null, rec.assignedAt || null,
                                        rec.dealId || null, rec.raw || (isNew ? JSON.stringify(rec) : null), rec.createdAt, rec.updatedAt).run();
                return json(rec);
       }

       // ── Deals / Merchants (unchanged) ─────────────────────────────────────
       const m = path.match(/^\/(deals|merchants)(?:\/([^/]+))?$/);
            if (!m) return json({ error: 'not found' }, 404);
            const kind = m[1], id = m[2] ? decodeURIComponent(m[2]) : null;

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
     },

     async scheduled(event, env, ctx) {
            ctx.waitUntil(pollFreshsalesDeals(env));
     }
};
