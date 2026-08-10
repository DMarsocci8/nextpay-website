# Quick Start Checklist - Launch in 3 Days

## Pre-Launch Prep (1 hour)
- [ ] Gather: Business name, logo (PNG), brand colors (hex)
- [ ] GitHub repo created (private)
- [ ] Cloudflare account ready
- [ ] Custom domain ready (e.g., hub.yourbusiness.com)

## Day 1: GitHub & Content (2-3 hours)

### Setup
```bash
git clone https://github.com/dmarsocci8/[your-business]-hub
cd [your-business]-hub

# Copy from nextpay-website:
cp -r ../nextpay-website/hub .
cp -r ../nextpay-website/workers .
cp ../nextpay-website/wrangler.toml .
cp ../nextpay-website/vercel.json .
```

### Customize
- [ ] `hub/index.html` - Update title, logo, description
- [ ] `hub/css/hub.css` - Update colors (find-replace `#0C1B2A` → your navy, `#14A18C` → your teal)
- [ ] `hub/js/hub-data.js` - Update products, pricing
- [ ] Create product pages: `hub/[product]-resources.html` (copy template)
- [ ] Update `vercel.json` - Change domain references

### Deploy
```bash
git add .
git commit -m "Initial hub setup"
git push -u origin main
```

## Day 2: Cloudflare Pages (1-2 hours)

1. **Create Pages Project**
   - https://dash.cloudflare.com → Pages → Create Project
   - Connect GitHub repo
   - Build command: (leave blank)
   - Output directory: `hub`
   - Deploy

2. **Add Custom Domain**
   - Pages project → Settings → Custom domain
   - Enter: `hub.yourbusiness.com`
   - Update nameservers at your domain registrar
   - Wait 24-48 hours for DNS

**Result**: `https://hub.yourbusiness.com` is LIVE ✅

## Day 2-3: Backend & Launch (1-2 hours)

### Create Database
```bash
npm install -g wrangler
wrangler d1 create hub-crm
# Save the database_id that prints
```

### Deploy Worker
```bash
# Edit wrangler.toml, paste database_id:
# [[d1_databases]]
# binding = "DB"
# database_name = "hub-crm"
# database_id = "PASTE-ID-HERE"

wrangler deploy
# Copy API endpoint URL
```

### Update Forms
```html
<!-- In any form: -->
<form action="https://formsubmit.co/YOUR-EMAIL@domain.com" method="POST">
  <!-- Add this to make form work -->
  <input type="hidden" name="_subject" value="New Lead">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="false">
</form>
```

### Launch
- [ ] Test all pages load
- [ ] Test form (should receive email)
- [ ] Test on mobile
- [ ] Send launch email to team

**Result**: Complete site ready for team ✅

---

## After Launch: How to Make Updates

### Tell Claude Code What to Do
Use https://claude.ai/code and say:

**"Update pricing for [product] to [new price]"**
→ Claude edits file → Deploy in 2 min

**"Add a new product resource page for [product]"**
→ Claude copies template, updates data → Deploy in 5 min

**"Create a [type] report page showing [metric]"**
→ Claude builds page → Deploy in 10 min

**"Fix [thing] on [page]"**
→ Claude debugs → Deploy in 5 min

### Why This Works
- No technical knowledge needed
- No git commands needed
- Changes live in 2-10 minutes
- 100% tracked in GitHub history
- Can rollback anytime

---

## Files to Customize for Your Business

| File | What to Change | Example |
|------|----------------|---------|
| `hub/index.html` | Title, logo, description | Change "NextPay Sales Hub" to "Your Business Hub" |
| `hub/css/hub.css` | Brand colors | Change `#0C1B2A` (navy) to your color |
| `hub/js/hub-data.js` | Products, pricing, team info | Update product list |
| `hub/SalesHub/index.html` | Dashboard title, stats | Show YOUR products instead |
| `vercel.json` | Domain redirects | Point to your domain |
| `wrangler.toml` | Database ID | Paste actual D1 database_id |

---

## Deployment Checklist Before Going Live

**Content**
- [ ] Logo uploaded
- [ ] Brand colors correct
- [ ] All pricing accurate
- [ ] Product pages complete
- [ ] Forms have your email

**Testing**
- [ ] Desktop view works
- [ ] Mobile view works
- [ ] All links clickable
- [ ] Forms send emails
- [ ] API responds (if using)

**Infrastructure**
- [ ] Cloudflare Pages deployed
- [ ] Custom domain points correctly
- [ ] HTTPS working
- [ ] Cloudflare Worker deployed
- [ ] D1 database initialized

**Launch**
- [ ] Site preview link sent to stakeholders
- [ ] Team trained on how to use
- [ ] Claude Code session created & bookmarked
- [ ] Launch email sent

---

## Commands Reference

```bash
# One-time setup
npm install -g wrangler
wrangler d1 create hub-crm

# View database
wrangler d1 info hub-crm

# Deploy Worker
wrangler deploy

# View logs
wrangler tail

# Test API
curl https://hub-crm-api.[subdomain].workers.dev/api/accounts
```

---

## Cost Breakdown (Monthly)

| Component | Cost | Notes |
|-----------|------|-------|
| Cloudflare Pages | $0 | Free, unlimited sites |
| Cloudflare Workers | $0-5 | Free tier: 100k req/day |
| Cloudflare D1 | $0 | Free tier included |
| Custom Domain | $1 | Per year (one-time) |
| Vercel | $0 | Free if static site |
| FormSubmit | $0 | Free for email forms |
| **Total** | **$0-5/month** | Minimal cost |

---

## Next Steps

1. **Create your first business site** using this checklist (3 days)
2. **Give Claude Code full access** to the repo (5 min setup, lifetime benefit)
3. **Make updates via Claude** instead of hiring developers (5-15 min per request)
4. **Repeat** for each business site you want to launch (3 days each, scales fast)

---

## When You're Stuck

**Error**: Deploy failed in Cloudflare
→ Check: Output directory set to `hub`

**Error**: Custom domain not working
→ Check: Nameservers updated at registrar (wait 24-48 hrs)

**Error**: Forms not arriving
→ Check: Email address in form action is correct

**Error**: API returns 404
→ Check: Worker deployed with `wrangler deploy`

**For anything else**: 
→ Ask Claude: "Why is [thing] not working?" with error message
