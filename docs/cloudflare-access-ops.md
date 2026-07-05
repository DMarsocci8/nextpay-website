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
| **Brand the login screen** | **Reusable components → Custom pages → Access login page → Manage** (direct link: <https://dash.cloudflare.com/18d8222b69e682e0dc68c45bc43ad4f9/one/reusable-components/custom-pages>). Saved values below. Ignore the "Account Gateway block page" card on the same screen — that's a different product (device web filtering), not in use. |
| **Team name** | Settings → General. Renamed from `square-butterfly-e4e0` to **`nextpaypos`** — agents log in at `nextpaypos.cloudflareaccess.com`. |

### Login page branding (saved values)

| Form field | Value |
|---|---|
| Your organization's name | `NextPay Sales Hub` |
| Logo URL | `https://nextpaypos.com/assets/logos/nextpay-color.png` (new logo, navy+teal — reads on the white card; `nextpay.png` is the same artwork since Jul 2026) |
| Header text | `Sign in with your work email to access the Sales Hub.` |
| Message | Three lines: `Agent access only.` ⏎ `Questions?` ⏎ `hello@nextpaypos.com` |
| Background color | `#0C1B2A` (navy; teal alternative `#14A18C`) |

Not customizable: the email-input placeholder text and the small
"Cloudflare Access" mark (free plan). `hello@nextpaypos.com` is a Google
Group that forwards to dom@ + alexander@ (admin.google.com → Directory →
Groups; "Who can post" must be **Anyone on the internet**).

## Weekly login digest (Cloudflare Worker)

`workers/agent-login-digest.js` in this repo emails **dom@nextpaypos.com and
alexander@nextpaypos.com** a weekly summary of hub logins — one line per
agent email with their login times in ET (that per-agent visibility is the
main point of the digest).

Current settings (v4, constants at the top of the file):
- Recipients: `SEND_TO = ['dom@nextpaypos.com', 'alexander@nextpaypos.com']`
- Sender: `NextPay Sales Hub <digest@nextpaypos.com>` — requires
  **nextpaypos.com verified in Resend** (Resend → Domains → Add Domain →
  copy the DNS records into Cloudflare DNS). Until verified, Resend's free
  tier only sends to the account owner from `onboarding@resend.dev`.
- Window: `HOURS_BACK = 168` (7 days) — pair with the weekly cron below.

Deploy/maintain:
1. **Workers & Pages → Create Worker** named `agent-login-digest`, paste the file's contents, Deploy.
2. Worker → Settings → Variables and Secrets:
   - `CF_API_TOKEN` — API token with **Account → Access: Audit Logs → Read** (create under My Profile → API Tokens → Custom Token).
   - `DIGEST_KEY` — any made-up password; protects the manual-test URL (currently `payments`).
   - `RESEND_API_KEY` — API key from resend.com (account: dom@nextpaypos.com). Emails send via Resend; FormSubmit is only a fallback (it 429-rate-limits Workers).
3. Worker → Settings → Triggers → Cron: `0 22 * * 5` (Fridays ~6pm ET).
4. Test: `https://agent-login-digest.dom-18d.workers.dev/?key=DIGEST_KEY&send=1` — returns JSON and sends the email. Expect `"sent": true, "via": "resend"`.

Behavior: emails only if the week had ≥1 login (flip `SEND_WHEN_EMPTY` in
the file to change); times shown in ET. v3 (daily, dom@ only, sent from
onboarding@resend.dev) verified working Jul 3 2026 (sent via Resend,
status 200); v4 is the weekly two-recipient upgrade.

## Limits to remember
- Access logs **authentications only** — not time spent inside the hub.
  Per-agent time tracking would need a custom heartbeat (hub pages +
  `Cf-Access-Authenticated-User-Email` header via a Worker) — not built yet.
- Session duration = max time between logins, set per-application (see table).
