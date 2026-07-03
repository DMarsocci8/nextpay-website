/**
 * NextPay — Agent Login Digest (Cloudflare Worker)
 * ------------------------------------------------
 * Once a day, pulls the last 24h of Cloudflare Access logins for
 * hub.nextpaypos.com and emails a summary to dom@nextpaypos.com
 * (via FormSubmit, same relay the website forms use).
 *
 * Deploy: Cloudflare dashboard -> Workers & Pages -> Create Worker,
 * paste this file, then add:
 *   - Secret  CF_API_TOKEN : API token with Account -> Access: Audit Logs -> Read
 *   - Secret  DIGEST_KEY   : any password you make up (for manual test runs)
 *   - Cron trigger: 0 22 * * *   (10pm UTC = 6pm ET summer / 5pm ET winter)
 *
 * Manual test: open  https://<worker-url>/?key=YOUR_DIGEST_KEY
 * (add &send=1 to actually send the email instead of just previewing).
 */

const ACCOUNT_ID = '18d8222b69e682e0dc68c45bc43ad4f9';
const APP_DOMAIN = 'hub.nextpaypos.com';
// Requires the nextpaypos.com domain to be verified in Resend before
// multiple recipients / this from-address will work.
const SEND_TO = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
const SEND_FROM = 'NextPay Sales Hub <digest@nextpaypos.com>';
const HOURS_BACK = 168; // weekly — pair with cron 0 22 * * 5 (Fri ~6pm ET)
const SEND_WHEN_EMPTY = false; // true = also email "no logins today"

async function fetchLogins(env) {
  const since = new Date(Date.now() - HOURS_BACK * 3600 * 1000).toISOString();
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}` +
    `/access/logs/access_requests?since=${encodeURIComponent(since)}&limit=1000&direction=desc`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` } });
  const j = await r.json();
  if (!j.success) throw new Error('Cloudflare API error: ' + JSON.stringify(j.errors));
  const cutoff = Date.now() - HOURS_BACK * 3600 * 1000;
  return (j.result || []).filter(e =>
    e.allowed !== false &&
    (!e.app_domain || String(e.app_domain).includes(APP_DOMAIN)) &&
    new Date(e.created_at).getTime() >= cutoff
  );
}

function buildSummary(events) {
  const fmt = ts => new Date(ts).toLocaleString('en-US',
    { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const byUser = {};
  for (const e of events) {
    const who = e.user_email || 'unknown';
    (byUser[who] = byUser[who] || []).push(fmt(e.created_at));
  }
  const users = Object.keys(byUser).sort();
  const lines = users.map(u => `${u} — ${byUser[u].length} login${byUser[u].length > 1 ? 's' : ''} (${byUser[u].join(', ')})`);
  return {
    count: events.length,
    users: users.length,
    text: lines.join('\n') || 'No agent logins in the last 24 hours.',
  };
}

async function sendEmail(summary, env) {
  const subject = `Sales Hub logins this week — ${summary.users} agent${summary.users === 1 ? '' : 's'}, ${summary.count} login${summary.count === 1 ? '' : 's'}`;
  // Preferred: Resend (reliable from Workers). Falls back to FormSubmit if no key.
  if (env && env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: SEND_FROM,
        to: SEND_TO,
        subject,
        text: `Agents today: ${summary.users}
Total logins: ${summary.count}

${summary.text}`,
      }),
    });
    const body = await r.text().catch(() => '');
    return { ok: r.ok, status: r.status, via: 'resend', detail: body.slice(0, 300) };
  }
  const r = await fetch('https://formsubmit.co/ajax/' + SEND_TO[0], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: 'https://www.nextpaypos.com',
      Referer: 'https://www.nextpaypos.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      name: 'Sales Hub — Agent Login Digest',
      'Agents today': String(summary.users),
      'Total logins': String(summary.count),
      'Activity': summary.text,
    }),
  });
  const body = await r.text().catch(() => '');
  return { ok: r.ok, status: r.status, via: 'formsubmit', detail: body.slice(0, 300) };
}

async function runDigest(env, force) {
  const events = await fetchLogins(env);
  const summary = buildSummary(events);
  let email = { ok: false, status: 0, detail: 'not attempted' };
  if (summary.count > 0 || SEND_WHEN_EMPTY || force) email = await sendEmail(summary, env);
  return { ...summary, sent: email.ok, email };
}

export default {
  // daily cron
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDigest(env, false));
  },
  // manual test: /?key=DIGEST_KEY  (preview) or /?key=DIGEST_KEY&send=1 (send)
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.searchParams.get('key') !== env.DIGEST_KEY) return new Response('Not found', { status: 404 });
    try {
      const doSend = url.searchParams.get('send') === '1';
      const events = await fetchLogins(env);
      const summary = buildSummary(events);
      if (doSend) { const email = await sendEmail(summary, env); summary.sent = email.ok; summary.email = email; }
      return new Response(JSON.stringify(summary, null, 2), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  },
};
