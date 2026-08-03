/* Cloudflare Pages Function — served at /log on the hub.
   Records a hub page view tied to the signed-in agent's email. The hub sits
   behind Cloudflare Access, so the email is read SERVER-SIDE from the Access
   headers (same as whoami.js) — never trusted from the client, so it can't be
   spoofed.

   Storage:
   - Primary: a Cloudflare D1 database bound as HUB_DB (Pages project →
     Settings → Functions → D1 bindings → variable name HUB_DB → "hub-analytics").
     Rows go into the `visits` table.
   - Optional fallback: if HUB_LOG_WEBHOOK is set, the visit is also POSTed there
     (e.g. a Google Sheet logger).
   If neither is configured, this quietly does nothing. Never blocks the page. */
export async function onRequestPost(context){
  try{
    const h = context.request.headers;
    let email = h.get('Cf-Access-Authenticated-User-Email') || '';
    if(!email){
      const jwt = h.get('Cf-Access-Jwt-Assertion') || '';
      const parts = jwt.split('.');
      if(parts.length > 1){
        try{
          const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
          email = payload.email || (payload.identity && payload.identity.email) || '';
        }catch(e){ /* ignore */ }
      }
    }

    let page = '/';
    try{
      const b = await context.request.json();
      if(b && b.p) page = String(b.p).slice(0,300);
    }catch(e){ /* ignore malformed body */ }

    const ref = h.get('referer') || '';

    if(email){
      // Primary: write to D1
      if(context.env && context.env.HUB_DB){
        context.waitUntil(
          context.env.HUB_DB
            .prepare('INSERT INTO visits (email, page, ref) VALUES (?, ?, ?)')
            .bind(email, page, ref)
            .run()
            .catch(()=>{})
        );
      }
      // Optional: also forward to a webhook (Google Sheet, etc.)
      const webhook = context.env && context.env.HUB_LOG_WEBHOOK;
      if(webhook){
        context.waitUntil(fetch(webhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: email, page: page, ref: ref, ua: h.get('user-agent') || '' })
        }).catch(()=>{}));
      }
    }
  }catch(e){ /* never surface errors to the page */ }

  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

// A GET on /log just returns ok (handy for a quick health check).
export function onRequestGet(){
  return new Response('ok', { status: 200, headers: { 'cache-control': 'no-store' } });
}
