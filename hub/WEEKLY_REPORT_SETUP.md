# Weekly Login Report - Automated Setup Guide

## Overview

The Sales Hub now automatically tracks agent logins and sends weekly reports every **Friday at 9 AM EST**.

**What you need to do:** 5 minutes of setup, then it's fully automated.

---

## Quick Setup (5 minutes)

### Step 1: Create Formspree Form (2 minutes)

1. Go to **[Formspree.io](https://formspree.io/)**
2. Click **"Create"** and select **"New Form"**
3. Enter your email (e.g., `dom@nextpaypos.com`)
4. Create the form
5. Copy your **Form ID** (in URL: `https://formspree.io/f/YOUR_FORM_ID`)

### Step 2: Add GitHub Actions Secret (2 minutes)

1. Go to your GitHub repo: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `FORMSPREE_FORM_ID`
4. Value: Paste your Form ID from Step 1 (e.g., `abc123xyz`)
5. Click **"Add secret"**

### Step 3: Enable Logins (1 minute)

Done! When agents sign into the Sales Hub, logins are automatically tracked.

---

## How It Works

### Automated Process

**Every Friday at 9 AM EST:**
1. GitHub Actions sends a reminder email to admins
2. Email contains a link to the admin dashboard
3. Admins click **"📧 Email Report"** button
4. Report is automatically sent to both:
   - dom@nextpaypos.com
   - alexander@nextpaypos.com

### Manual Process (Anytime)

1. Go to **https://hub.nextpaypos.com/admin.html**
2. Scroll to **"Weekly Login Report"** section
3. See login stats for the past 7 days
4. Click **"📧 Email Report"** to send

### Report Contents

The weekly report shows:
- All agent emails who logged in
- Number of logins per agent
- Total logins for the week
- Report generation timestamp

---

## Admin Access

**Current Admins:**
- dom@nextpaypos.com
- alexander@nextpaypos.com

**To add more admins:**
1. Edit `/hub/js/hub.js`
2. Find line ~53: `const ADMINS = [...]`
3. Add email addresses:
   ```javascript
   const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com', 'newadmin@nextpaypos.com'];
   ```
4. Push to GitHub

---

## What's Tracked

### Login Data
- Agent email address
- Login timestamp
- Page accessed
- Number of logins per day

### Storage
- Stored locally in agent browser's localStorage
- Persists for 30 days
- Cleared when agent logs out

### Privacy
- Data only stored locally on agent's device
- Not sent to server (stays private)
- Only visible to logged-in admins

---

## Troubleshooting

### Reports not sending?

**Check #1: Formspree Setup**
- Confirm Form ID is in GitHub Actions secrets
- Visit your Formspree form at `https://formspree.io/f/YOUR_FORM_ID`
- Should see "Submissions" section

**Check #2: GitHub Actions**
- Go to repo **Actions** tab
- Look for "Weekly Login Report" workflow
- Check if latest run succeeded (green checkmark)

**Check #3: Manual Email**
- Admins can manually click "Email Report" on admin dashboard
- Should see status message (✅ sent or ❌ error)

### Session expires too fast?

Sessions now last **24 hours** (was 1 hour). Agents stay logged in for a full day.

### Lost login data?

Login data is stored locally in each agent's browser. It's cleared if they:
- Clear browser cache
- Clear LocalStorage
- Log out
- Browser cookies expire (24 hours)

---

## GitHub Actions Workflow

The workflow runs **automatically every Friday at 9 AM EST**.

**File:** `.github/workflows/weekly-login-report.yml`

**Schedule:** `0 14 * * FRI` (UTC time, converts to 9 AM EST)

**To manually trigger:**
1. Go to repo **Actions** tab
2. Select **"Weekly Login Report"** workflow
3. Click **"Run workflow"**
4. Workflow runs immediately

---

## Files & Configuration

| File | Purpose |
|------|---------|
| `/hub/login.html` | Google Sign-In page (24-hour session) |
| `/hub/js/hub.js` | Login tracking & report generation |
| `/hub/admin.html` | Admin dashboard with weekly report |
| `/.github/workflows/weekly-login-report.yml` | Automated Friday reminder |

---

## Summary

✅ **Done automatically:**
- Login tracking starts when agents sign in
- GitHub Actions sends Friday reminders
- Admins can view/send reports anytime

✅ **Already configured:**
- Alexander@nextpaypos.com has admin access
- 24-hour session duration
- Last 30 days of login history

✅ **5-minute setup:**
1. Create Formspree form
2. Add Form ID to GitHub Actions secrets
3. Done!

---

**Questions?** Contact dom@nextpaypos.com

Last updated: August 16, 2026
