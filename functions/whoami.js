/* Cloudflare Pages Function — served at /whoami on the hub.
   The hub is behind Cloudflare Access, which stamps every authenticated request
   with the signed-in user's email. The browser-side /cdn-cgi/access/get-identity
   endpoint isn't reliable on this Access config, so we read the identity here on
   the server and hand the email back to the page as JSON. No secrets exposed —
   it only returns the email of whoever is already logged in. */
export function onRequest(context){
  const h = context.request.headers;
  let email = h.get('Cf-Access-Authenticated-User-Email') || '';

  // Fallback: decode the Access JWT (Cf-Access-Jwt-Assertion) payload for the email.
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

  return new Response(JSON.stringify({ email: email }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
