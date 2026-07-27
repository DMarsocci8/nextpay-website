# Sales Hub restructure — hub.nextpaypos.com

The restructured Sales Hub lives in **`hub/`** in this repo: a self-contained
static app with a **left sidebar** navigation, built around the way agents
actually work — walk in with a business type, get questions → product fit →
pricing → statement beat → proposal → submission, plus a built-in CRM,
merchant book, and calendar embeds. It deploys as its own site on
**hub.nextpaypos.com**, staying behind the existing Cloudflare Access login
(see `docs/cloudflare-access-ops.md`).

## Structure (sidebar order)

| Section | Page | What it does |
|---|---|---|
| Work a deal | `index.html` | Dashboard: quick actions, pipeline stats, next steps due, the 8-step process map |
| | `deal-navigator.html` | **The core flow.** 6-step guided wizard: business type → discovery questions → best-fit products → pricing → statement/projections → proposal & submit. Saves into the CRM at any point; deep-linkable (`?industry=convenience`, `?deal=<id>`) |
| | `crm.html` | My Pipeline: kanban by stage, deal editor, quick-add, export/import JSON, "mark installed" promotes a deal into My Merchants |
| | `statement-review.html` | Meet-or-beat: how to read a statement, effective-rate + savings calculator, play-picker table, startup projections worksheet |
| | `pricing.html` | Pricing models, editable buy-rate/Schedule A worksheet (browser-local), residual calculator, verified price points, proposal guide, NextLink internal pricing |
| | `submit-deal.html` | Per-placement submission checklists (SkyTab, Clover, Square, Quantic, Korona, NRS, PAYS, SumUp, terminal+gateway, invoicing, high-risk) + universal doc list + what-happens-next |
| Learn | `training.html` | First-week onboarding path, core sales motion, objection handling, glossary |
| | `products.html` | Product library (POS/terminals/gateways/invoicing) with selling points + links to public pages |
| | `industries.html` | Playbook index; "Work this industry" deep-links into the Navigator |
| My business | `merchants.html` | Signed-merchant book: contact, product, **where placed** (SkyTab/Clover/Next2Pay/Square…), rate/program, MID, docs links, status |
| | `compensation.html` | Comp structure, money-flow explainer, document links |
| | `calendar.html` | Google Calendar + Calendly embeds (agent pastes their links once; stored per browser) |
| Admin | `admin.html` | Dom & Alexander only: all agents' deals + merchants, filter by agent, import agent JSON exports |

Shared assets: `hub/css/hub.css` (shell + components), `hub/js/hub.js`
(sidebar/topbar injection, identity), `hub/js/hub-data.js` (industry
playbooks, product library, submission checklists — **the content file to
edit**), `hub/js/hub-store.js` (CRM data layer).

## Identity & roles

- `hub.js` reads the logged-in agent from Cloudflare Access
  (`/cdn-cgi/access/get-identity`) — no separate login. Outside Access
  (local preview) it falls back to a manually entered email.
- Admins are hard-coded in `hub/js/hub.js` and `workers/hub-crm-api.js`:
  `dom@nextpaypos.com`, `alexander@nextpaypos.com`. They see the Admin
  sidebar section and, with the API deployed, **all** agents' records.

## CRM storage — two modes

- **Local mode (default, zero setup):** deals/merchants persist in each
  agent's browser (`localStorage`). Export/Import JSON lets agents hand
  their book to admin manually. Pages show a "Local mode" banner.
- **API mode (recommended):** deploy `workers/hub-crm-api.js` as a
  Cloudflare Worker with a D1 binding and route it at
  `hub.nextpaypos.com/api/*` (full step-by-step in the file header).
  The pages probe `/api/health` and switch automatically — agents see
  their own records from any device, admins see everyone's. Identity is
  the Access email header, so there are no passwords or API keys.

**Fresh Sales CRM:** nothing here blocks keeping Freshsales in parallel;
the hub CRM covers the agent workflow (pipeline + merchant book +
admin visibility). If two-way Freshsales sync is wanted later, it would be
an extension of the same Worker (Freshsales REST API) — not built yet.

## Deploying the hub

Current hub.nextpaypos.com content is a separate deployment (not in this
repo). To ship this restructure:

1. Create a Cloudflare Pages project (e.g. `nextpay-hub`) from this repo
   with **build output directory = `hub`** (no build command).
2. Point the custom domain `hub.nextpaypos.com` at that Pages project.
3. The existing Cloudflare Access app ("hub") keeps protecting the domain —
   nothing to change; login flow, session length and the login digest
   Worker are untouched.
4. `hub/_redirects` maps the legacy URLs (`/SalesHub`, `/agentpayplan`) to
   the new pages, so links from nextpaypos.com keep working.
5. Optional: deploy `workers/hub-crm-api.js` (instructions in the file) to
   turn on central CRM storage.

Nothing in the public site (nextpaypos.com) was modified.

## Notes

- Calculators never store buy rates anywhere shared; the buy-rate
  worksheet on Pricing is per-browser by design.
- Calendar embeds are per-agent (each pastes their own Google embed URL +
  Calendly link once per browser).
- All hub pages carry `noindex,nofollow` and link out to the public site
  for merchant-facing collateral.
