/* Cloudflare Pages Function — served at /log on the hub.
   Records a hub page view tied to the signed-in agent's email. The hub sits
   behind Cloudflare Access, so the email is read SERVER-SIDE from the Access
   headers (same as whoami.js) — never trusted from the client, so it can't be
   spoofed. The visit is forwarded to a Google Sheet webhook set in the
   HUB_LOG_WEBHOOK environment variable (Cloudflare Pages → Settings → Variables).
   If that variable isn't set, this quietly does nothing. Never blocks the page. */
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

    const webhook = context.env && context.env.HUB_LOG_WEBHOOK;
    if(webhook && email){
      // fire-and-forget to the Google Sheet logger
      context.waitUntil(fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email,
          page: page,
          ref: h.get('referer') || '',
          ua: h.get('user-agent') || ''
        })
      }).catch(()=>{}));
    }
  }catch(e){ /* never surface errors to the page */ }

  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

// A GET on /log just returns ok (handy for a quick health check).
export function onRequestGet(){
  return new Response('ok', { status: 200, headers: { 'cache-control': 'no-store' } });
}
