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
*/

const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
const KINDS = ['deals', 'merchants'];

export default {
  async fetch(request, env) {
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
      return json({ ok: true, user: email, admin: ADMINS.includes(email) });
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
      const existing = await env.DB.prepare(`SELECT agent FROM ${kind} WHERE id = ?`).bind(rec.id).first();
      if (existing && existing.agent !== email && !admin) return json({ error: 'forbidden' }, 403);
      await env.DB.prepare(
        `INSERT INTO ${kind} (id, agent, data, updatedAt) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(id) DO UPDATE SET agent=?2, data=?3, updatedAt=?4`
      ).bind(rec.id, owner, JSON.stringify(rec), rec.updatedAt).run();
      return json(rec);
    }

    if (request.method === 'DELETE' && id) {
      const existing = await env.DB.prepare(`SELECT agent FROM ${kind} WHERE id = ?`).bind(id).first();
      if (!existing) return json({ ok: true });
      if (existing.agent !== email && !admin) return json({ error: 'forbidden' }, 403);
      await env.DB.prepare(`DELETE FROM ${kind} WHERE id = ?`).bind(id).run();
      return json({ ok: true });
    }

    return json({ error: 'method not allowed' }, 405);
  }
};
