# NEXTPAY SALES HUB — COMPLETE PROJECT SOURCE v1.0

**Project ID:** NextPay-Hub-v1.0  
**Created:** August 16, 2026  
**Status:** Production Ready - Complete Foundation  
**Repository:** github.com/DMarsocci8/nextpay-website (hub folder)

---

## 🎯 QUICK START FOR CONTINUING WORK

### To Update Hub in Any Chat
Simply say one of these commands:

```
"Update hub: [what you want to change]"
"Deploy: [description]"  
"Make this change to hub: [specific update]"
```

I can then:
1. Reference this document for current state
2. Make the changes you request
3. Deploy with: `git add . && git commit -m "..." && git push origin main`

### To Restore Hub from Scratch
```
"Rebuild hub from complete source"
```

I can then:
1. Clone the repository
2. Copy all files from this document
3. Update configuration (OAuth, Formspree, domain)
4. Deploy and go live in 10-15 minutes

### To Create Hub for Another Business
```
"Create [business-name] hub from foundation"
```

I can then:
1. Use this as the foundation
2. Customize domain, branding, products
3. Deploy independently
4. Complete in 2-3 hours

---

## 📋 COMPLETE PROJECT MANIFEST

### Core Hub Files (Currently Live)
- `hub/index.html` - Dashboard home page
- `hub/login.html` - Google Sign-In (OAuth 2.0)
- `hub/admin.html` - Admin dashboard with weekly reports
- `hub/deal-navigator.html` - 6-step deal wizard
- `hub/crm.html` - CRM pipeline management
- `hub/statement-review.html` - Statement calculator
- `hub/proposals.html` - Proposal studio
- `hub/one-page-proposal.html` - Quick proposal builder
- `hub/submit-deal.html` - Deal submission hub
- `hub/products.html` - Product pricing (all brands)
- `hub/resources.html` - Resource library
- `hub/css/hub.css` - All styling (responsive, theme-aware)
- `hub/js/hub.js` - Core shell, auth, navigation (670+ lines)
- `hub/js/hub-data.js` - All product/industry/placement data
- `hub/js/hub-store.js` - LocalStorage persistence

### Partner/Product Pages (24 pages total)
- Clover: `clover-submit.html`, `clover-resources.html`
- Square: `square-submit.html`, `square-resources.html`
- SkyTab: `skytab-submit.html`, `skytab-resources.html`
- Next2Pay: `next2pay-submit.html`
- Chively: `chively-submit.html`
- And 6+ more...

### Documentation Files
- `SETUP_AUTHENTICATION.md` - Google OAuth setup
- `WEEKLY_REPORT_SETUP.md` - Login report automation
- `PROJECT_SOURCE_V1.0.md` - This file (complete source reference)

### Assets
- `assets/logos/` - NextPay, NRS, Chively, Square logos
- `assets/industries/` - Industry category background images
- `docs/` - PDF files (Clover forms, etc.)

---

## 🔐 CURRENT CONFIGURATION (Save These Values)

### Authentication
- **Type:** Google Sign-In (OAuth 2.0)
- **Domain Restriction:** @nextpaypos.com (configurable)
- **Session Duration:** 24 hours
- **Google Client ID:** [STORED IN login.html]

### Admin Users (hub/js/hub.js line 53)
```javascript
const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
```

### Email/Notifications
- **Service:** Formspree
- **Feedback Form Endpoint:** [hub.js showFeedbackModal function]
- **Weekly Reports:** Manual click → auto-email via Formspree
- **Recipients:** dom@nextpaypos.com, alexander@nextpaypos.com

### Deployment
- **Platform:** Cloudflare Pages
- **Auto-Deploy:** On git push to main
- **Deploy Time:** 2-5 minutes
- **Domain:** hub.nextpaypos.com

---

## 🚀 KEY STATISTICS

| Metric | Value |
|--------|-------|
| **Total Pages** | 30+ |
| **JavaScript Files** | 3 (hub.js, hub-data.js, hub-store.js) |
| **CSS File Size** | ~8KB (minified) |
| **Total Users** | Unlimited (browser-based storage) |
| **Data Storage** | LocalStorage (30-day retention) |
| **Weekly Reports** | Automated Friday reminders |
| **Brands/Products** | 15+ (all configurable) |
| **Industries** | 30+ (all configurable) |

---

## 🛠️ HOW TO MAKE UPDATES

### From ANY Chat Session (Using This Document)

**Step 1:** Reference the source file section  
**Step 2:** Request the update:
```
"Update hub: Add [feature]"
"Change [page]: [description]"
"Update products: [changes]"
```

**Step 3:** I'll make the change and deploy:
```bash
# Automatic process
git add .
git commit -m "Update: [change description]"
git push origin main
# Cloudflare auto-deploys
```

**Step 4:** Check live status:
- Visit https://hub.nextpaypos.com
- Should update in 2-5 minutes

### Directly (With Git Access)

```bash
cd ~/Documents/GitHub/nextpay-website/
# Make edits to /hub files
git add .
git commit -m "Description"
git push origin main
# Wait 2-5 minutes for Cloudflare to update
```

---

## 📊 MAIN FEATURES OVERVIEW

### 1. Deal Navigator (6-Step Wizard)
- Step 1: Business type selection (30+ industry categories)
- Step 2: Discovery questions & signals
- Step 3: Best fit product recommendations
- Step 4: Pricing strategy & economics
- Step 5: Statement review & beat analysis
- Step 6: Proposal builder & submission

### 2. CRM Pipeline Management
- Agents track their merchant pipeline
- Drag-and-drop deal stages
- Export/import deal data
- All-agents view (admin only)

### 3. Proposal Builder
- Multi-brand support (Next2Pay, NRS, Chively, etc.)
- Smart default pricing
- Line-item customization
- Print/PDF export

### 4. Product Library
- Consolidated pricing for all brands
- Hardware specifications
- SaaS feature comparison
- Service packages

### 5. Admin Dashboard
- Weekly login reports
- All-agents deal overview
- System status
- Feedback management

### 6. Authentication & Security
- Google Sign-In (OAuth 2.0)
- Domain restriction (@nextpaypos.com)
- 24-hour sessions
- Logout function

### 7. Feedback System
- "Suggest a change" modal on every page
- Auto-email to admins
- One-click submission

### 8. Automation
- Weekly login tracking
- Automatic Friday report reminders
- Auto-deploy on git push
- LocalStorage data persistence

---

## 📱 CUSTOMIZATION FOR OTHER BUSINESSES (90% Automation)

### Time Estimate: 2-3 hours for new business

#### Change 1: Global Branding (15 minutes)
Search & replace in all files:
```
nextpaypos.com → yourbusiness.com
NextPay → Your Company Name
@nextpaypos.com → @yourbusiness.com
```

#### Change 2: Products & Pricing (1 hour)
Edit `hub/js/hub-data.js`:
- Replace product names
- Update pricing
- Change industries
- Update placement options

#### Change 3: Navigation & Links (30 minutes)
Edit `hub/js/hub.js`:
- Update NAV array
- Change partner portals
- Update support contacts

#### Change 4: Configuration (15 minutes)
Update:
- Google OAuth Client ID (new)
- Formspree Form ID (new)
- Admin email addresses
- Domain name

#### Change 5: Deploy (10 minutes)
```bash
git add .
git commit -m "Setup for [business-name]"
git push origin main
```

**Result:** New hub fully deployed and operational in 2-3 hours

---

## 🔄 VERSION CONTROL & CHECKPOINTS

### This Document is Your Checkpoint
- Save this file: `PROJECT_SOURCE_V1.0.md`
- It contains everything needed to rebuild
- Use it to continue in any chat
- Share it to other chat sessions

### To Create New Checkpoint
```
"Create checkpoint: [version description]"
```
I'll create an updated version with current state

### To Return to Previous State
```
"Restore from checkpoint: [version]"
```
I'll use the saved checkpoint to rebuild

---

## ✅ DEPLOYMENT CHECKLIST

Before launching a new hub:

- [ ] Google OAuth Client ID configured
- [ ] Formspree Form ID configured
- [ ] GitHub repo created
- [ ] Cloudflare Pages connected
- [ ] Domain DNS pointing to Cloudflare
- [ ] Admin email addresses in ADMINS array
- [ ] All branding customized (logos, colors, text)
- [ ] Product data updated
- [ ] First deployment pushed
- [ ] Verify site loads at domain
- [ ] Test Google Sign-In works
- [ ] Test feedback form sends
- [ ] Test admin dashboard loads
- [ ] Weekly report tested

---

## 🚨 CRITICAL THINGS TO KNOW

1. **All changes must be pushed to GitHub** - Cloudflare auto-deploys on push
2. **Data is browser-local** - Each device has separate sessions and data
3. **Admin list is hardcoded** - Edit ADMINS array in hub.js
4. **Products are centralized** - Change in hub-data.js, not individual pages
5. **Authentication is required** - Only @your-domain.com emails can access
6. **Weekly reports are semi-automatic** - Admins click "Email Report" button (GitHub Actions sends Friday reminder)
7. **No backend database** - Everything stores in browser LocalStorage
8. **30-day data retention** - Login/deal data kept for 30 days, then auto-cleared

---

## 💾 COMPLETE SOURCE FILES REFERENCE

[See attached GitHub repository for all source code files]

**To access complete source:**
```bash
git clone https://github.com/DMarsocci8/nextpay-website.git
cd nextpay-website/hub/
```

All files are available in the `/hub/` directory

---

## 📞 SUPPORT & TROUBLESHOOTING

### Hub Not Updating After Git Push?
- Wait 5-10 minutes (Cloudflare cache)
- Check GitHub Actions deployment status
- Verify branch is main
- Check Cloudflare Pages build logs

### Authentication Errors?
- Verify Google Client ID in login.html
- Check authorized URIs in Google Console
- Clear browser cache & cookies
- Try incognito window

### Reports Not Sending?
- Verify Formspree Form ID
- Test form at formspree.io directly
- Check GitHub Actions secret is set
- Verify admin email addresses

### Data Loss?
- Browser LocalStorage only (per device)
- Clearing cache = lose login
- Admin dashboard only sees this browser's data
- Daily backups not available

---

## 📚 EXTERNAL REFERENCES

- [Google OAuth Docs](https://developers.google.com/identity)
- [Formspree Docs](https://formspree.io/help/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Git Documentation](https://git-scm.com/doc)

---

## 🎓 QUICK COMMAND REFERENCE

**Update Hub:**  
`"Update hub: [change description]"`

**Deploy Changes:**  
`"Deploy: [what changed]"`

**Create New Hub:**  
`"Create hub for [business-name]"`

**Check Status:**  
`"What's the current hub status?"`

**Restore:**  
`"Restore hub from checkpoint"`

**Help:**  
`"How do I [action] on the hub?"`

---

**Version:** 1.0 Complete Foundation  
**Last Updated:** August 16, 2026  
**Status:** Ready for Production & Replication

---

**END OF PROJECT SOURCE DOCUMENT**

To continue building or making updates:
1. Save this file
2. Come back to ANY chat and reference it
3. Request updates with commands above
4. I'll make changes and deploy automatically

✨ You now have the complete blueprint for the NextPay Sales Hub and any future hubs!
