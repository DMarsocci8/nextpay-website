# Cloudflare Access ops runbook — Sales Hub (hub.nextpaypos.com)

Quick reference for managing agent access to the Sales Hub. The hub is
protected by **Cloudflare Access** (Zero Trust): agents verify their email
(one-time PIN) before entering. Account: Dom@nextpaypos.com.

## Direct links (account 18d8222b69e682e0dc68c45bc43ad4f9)

- API tokens (for the digest Worker): <https://dash.cloudflare.com/profile/api-tokens>
- Workers & Pages: <https://dash.cloudflare.com/18d8222b69e682e0dc68c45bc43ad4f9/workers-and-pages>
- Zero Trust console: <https://dash.cloudflare.com/18d8222b69e682e0dc68c45bc43ad4f9/one>
- Access applications: <https://dash.cloudflare.com/18d8222b69e682e0dc68c45bc43ad4f9/one/access-controls/apps>
- Worker code: <https://github.com/DMarsocci8/nextpay-website/blob/main/workers/agent-login-digest.js>

## Where things live (new "Cloudflare One" console, 2026 layout)

Start at **dash.cloudflare.com → Zero Trust** (or one.dash.cloudflare.com).
The hub's Access app is named **"hub"**.

| Task | Path |
|---|---|
| **Session duration** (how often agents must re-login) | Access controls → Applications → **hub** → **Application details** tab → **Details** pill → *Session Duration*. Currently set to **24 hours** (was 30 days). |
| **See who logged in** | **Insights & Logs → Access events** — every email verification: who, when, from where. |
| **Who's allowed in** | Access controls → Policies → **NextPay Agents** (allow policy). |
| **Brand the login screen** | **Settings → Custom Pages → Login page** — NextPay logo, navy `#0C1B2A` background, header text. The small Cloudflare mark can't be removed on the free plan. |
| **Team name** | Settings → General. Auto-generated as `square-butterfly-e4e0` (shows in `*.cloudflareaccess.com` URL); can be renamed (e.g. `nextpay`). |

## Daily login digest (Cloudflare Worker)

`workers/agent-login-digest.js` in this repo emails dom@nextpaypos.com a
daily summary of hub logins (via FormSubmit, same relay as the site forms).

Deploy/maintain:
1. **Workers & Pages → Create Worker** named `agent-login-digest`, paste the file's contents, Deploy.
2. Worker → Settings → Variables and Secrets:
   - `CF_API_TOKEN` — API token with **Account → Access: Audit Logs → Read** (create under My Profile → API Tokens → Custom Token).
   - `DIGEST_KEY` — any made-up password; protects the manual-test URL.
3. Worker → Settings → Triggers → Cron: `0 22 * * *` (~6pm ET daily).
4. Test: `https://agent-login-digest.<subdomain>.workers.dev/?key=DIGEST_KEY&send=1` — returns JSON and sends the email.

Behavior: emails only on days with ≥1 login (flip `SEND_WHEN_EMPTY` in the
file to change); times shown in ET; account id and app domain are constants
at the top of the file.

## Limits to remember
- Access logs **authentications only** — not time spent inside the hub.
  Per-agent time tracking would need a custom heartbeat (hub pages +
  `Cf-Access-Authenticated-User-Email` header via a Worker) — not built yet.
- Session duration = max time between logins, set per-application (see table).
