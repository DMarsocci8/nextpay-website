# Claude Code Usage Guide
## How to Request Changes to Your Business Sites (Forever)

---

## The Big Picture

You can now request ANY change to your business sites and have it deployed in 5-15 minutes **without needing a developer.**

All you do is:
1. Open Claude Code
2. Tell it what you want
3. It makes the change
4. Review the preview
5. Click merge
6. **Done** (site updates automatically in 30 seconds)

---

## Setup (One Time, 5 Minutes)

### Step 1: Open Claude Code
Go to: https://claude.ai/code

### Step 2: Create a Session for Each Site
For each repo you have:
- Click **"New Session"**
- Select your GitHub repository
- Wait for it to load

### Step 3: Enable Permissions
- Click **Settings** (⚙️ icon)
- Enable all permissions:
  - ✅ Read/Write Files
  - ✅ Run Commands
  - ✅ Git Operations
  - ✅ Create Pull Requests
- Save

### Step 4: Bookmark Sessions
Create bookmarks for quick access:
- **NextPay Hub**: https://claude.ai/code?repo=nextpay-website&path=hub
- **Real Estate Hub**: https://claude.ai/code?repo=real-estate-hub
- **[Next Site]**: https://claude.ai/code?repo=[site-name]

---

## How to Make Requests

### Format Your Request
Tell Claude Code **what** you want, not **how** to do it.

**✅ Good requests:**
- "Update SkyTab pricing from $29.99 to $32.99 per month"
- "Add a new product resource page for Quantic POS"
- "Create a merchant pipeline report showing active deals by industry"
- "Fix the mobile layout on the merchants CRM page"
- "Add a new column 'Last Contact Date' to the merchant table"

**❌ Vague requests:**
- "Make it better"
- "Update the dashboard"
- "Fix stuff"

---

## Example: Real Request Workflow

### Request
```
"The NextPay Sales Hub pricing table for SkyTab is outdated.
Update it from:
  - Base bundle: $29.99/mo
  - Air handheld: $29.99/mo
To:
  - Base bundle: $32.99/mo
  - Air handheld: $32.99/mo

Also add a note: 'Prices effective August 2026'

Send me a preview link when it's ready."
```

### What Claude Code Does
```
1. ✓ Reads the SkyTab resource guide
2. ✓ Finds the pricing table
3. ✓ Updates the values
4. ✓ Adds the note
5. ✓ Tests it looks good
6. ✓ Commits: "Update SkyTab pricing for August 2026"
7. ✓ Creates a pull request
8. ✓ Sends you preview link
```

### What You Do
```
1. ✓ Review the preview (click the preview link)
2. ✓ Check that prices look correct
3. ✓ Click "Approve" if good
4. ✓ Merge the pull request
```

### What Happens Next
```
Automatically:
1. ✓ GitHub receives the merge
2. ✓ Cloudflare Pages/Vercel sees the change
3. ✓ Site redeploys (30 seconds)
4. ✓ Your site is updated
5. ✓ Change is tracked in git forever (reversible)
```

**Total time: 5-15 minutes** from your request to live website

---

## Types of Requests You Can Make

### Content Updates (Most Common)
- "Update the pricing for [product]"
- "Add new merchant to the roster"
- "Change team member photo/bio"
- "Update product descriptions"
- "Add new FAQ entry"

### New Pages
- "Create a new resource guide for [product]"
- "Build a new report page showing [metric]"
- "Add a training materials page"

### Feature Requests
- "Add a filter to the merchant table"
- "Create a status update feature"
- "Add email notifications"

### Bug Fixes
- "The mobile view looks broken on [page]"
- "The form is not submitting"
- "The dashboard chart isn't showing correctly"

### Design Changes
- "Update colors to [new brand colors]"
- "Change fonts to [new font]"
- "Reorganize the navigation"
- "Improve mobile responsiveness"

### Data & Reports
- "Create a report showing [metric] by [dimension]"
- "Add a chart for [data]"
- "Export merchant list to CSV"

---

## Common Requests & Examples

### Example 1: Update Pricing
```
"In the NextPay Sales Hub, update the SkyTab pricing table:
- Change base bundle from $29.99 to $32.99/mo
- Change Air handheld from $29.99 to $32.99/mo
- Keep everything else the same"
```

### Example 2: Add New Product
```
"Create a new resource guide page for Quantic POS.
Use the SkyTab resource guide as a template.
Update:
- Title: Quantic POS Resource Guide
- Pricing: Pro $60 first/$50 addl, Enterprise $90/$80
- Description: [your description]
- Link to apply: [URL]

Put it at: /hub/quantic-resources.html"
```

### Example 3: Fix Mobile View
```
"The merchants CRM table on hub.nextpaypos.com looks broken on mobile.
The columns are too crowded and text is cut off.
Can you make it stack vertically on phones and hide some columns?
Preview: [I'll review]"
```

### Example 4: Create Report
```
"Create a new admin dashboard page that shows:
1. Total active merchants (count)
2. Merchants by industry (pie chart)
3. Pipeline value by product (bar chart)
4. Top 10 agents by deal count (table)

Make it at: /hub/SalesHub/admin-analytics.html
Update the admin.html navigation to link to it."
```

### Example 5: Bulk Update
```
"I have multiple updates for the NextPay hub:
1. Update SkyTab pricing: $32.99/mo for base & air
2. Add new agent 'John Smith' to team roster
3. Fix the typo on page X: change 'recieve' to 'receive'
4. Add a note about the 36-month commitment to SkyTab guide

Send me a preview for each one."
```

---

## What Happens in Claude Code (Behind the Scenes)

You don't need to know this, but here's what Claude does:

```
Your Request:
  "Update SkyTab pricing to $32.99"
         ↓
Claude Code:
  1. Understands your request
  2. Finds the file: hub/skytab-resources.html
  3. Searches for current pricing ($29.99)
  4. Replaces with new pricing ($32.99)
  5. Checks it looks right (validates HTML)
  6. Tests it renders correctly
  7. Creates commit message: "Update SkyTab pricing"
         ↓
Git Operations:
  1. Creates a new branch: claude/skytab-price-update-08-10
  2. Commits the change
  3. Pushes to GitHub
  4. Opens a Pull Request for you to review
         ↓
You:
  1. Review the preview (see the changes live)
  2. Click "Approve" if it looks good
  3. Merge the PR
         ↓
Automation (No Your Work):
  1. Cloudflare Pages sees the merge to main
  2. Automatically redeploys the site
  3. 30 seconds later → Site is updated
  4. Change is in git history (reversible forever)
```

---

## Tips for Success

### 1. Be Specific
❌ "Update the dashboard"  
✅ "Add a total merchant count stat at the top of the admin dashboard"

### 2. Provide Context
❌ "Fix the form"  
✅ "The contact form on hub.nextpaypos.com isn't sending emails. Can you check the FormSubmit configuration?"

### 3. Include Examples
❌ "Make it look better"  
✅ "I want the merchant table to show 5 columns: Name, Industry, Product, Status, Last Contact. Sort by Last Contact date."

### 4. Multiple Changes at Once
You can ask for several things in one request:
```
"Can you make these three updates to the NextPay hub:
1. [Change 1]
2. [Change 2]
3. [Change 3]

Send me a preview when done."
```

Claude will make all three and send you one preview to review.

### 5. Ask Questions
If something is ambiguous:
```
"I want to add a new section to the sales hub. 
Should it be:
A) A new page linked from the main navigation
B) A section within an existing page
C) A modal popup

What makes sense for your workflow?"
```

Claude will ask clarifying questions if needed.

---

## FAQ: Claude Code

### Q: Can Claude accidentally break my site?
**A**: No. Changes go through a pull request first, so you review everything before it goes live. If something breaks, you just close the PR without merging.

### Q: What if I don't like the changes?
**A**: Just close the pull request without merging. Site stays unchanged. Claude will retry if you ask.

### Q: Can Claude update multiple sites at once?
**A**: Not in one session, but you can:
- Open multiple Claude Code sessions (one per site)
- Make requests to each
- They work in parallel

### Q: How fast does it actually deploy?
**A**: After you merge the PR, Cloudflare/Vercel sees it within 30 seconds and redeploys automatically. Site is live in < 1 minute usually.

### Q: Can I undo a change after it's live?
**A**: Yes! Everything is in git history. Claude can easily revert to a previous version.

### Q: What if Claude misunderstands my request?
**A**: You review the preview before merging, so you'll catch it. Just close the PR and ask again with more details.

### Q: Can my team use this too?
**A**: Yes! Each team member can create their own Claude Code session and make requests. Just make sure they have GitHub access to the repo.

### Q: Do I need to know git or code?
**A**: No. Claude handles all the technical details. You just describe what you want in English.

---

## Workflow for Your Team

### Agents Requesting Changes
```
Agent: "Claude, add a new product resource page for Quantic"
Claude: Creates page → Sends preview
Agent: Reviews → Approves
You: Merge when ready
Result: Page is live
```

### You Requesting Updates
```
You: "Update all pricing tables for August 2026 rates"
Claude: Updates all 6 product pages → Sends preview
You: Review all changes → Approve
Claude: Merge
Result: All pages updated simultaneously
```

### Admin Requests
```
Admin: "Create a report showing pipeline by agent"
Claude: Builds new report page → Sends preview
Admin: Reviews → Approves
You: Merge
Result: New analytics page available to team
```

---

## Real-World Example: Your Day

**Monday 9 AM**:
- Sales manager tells you SkyTab pricing changed
- You open Claude Code: "Update SkyTab pricing to $32.99/mo"
- 5 minutes later: Claude sends preview link
- You review: "Looks good"
- You click merge
- Site updates automatically
- **Done before your first coffee**

**Tuesday 2 PM**:
- New product launch: Quantic POS
- You: "Create a Quantic resource guide. Here's the template: [info]"
- 15 minutes later: Claude sends preview
- You review and approve
- Site updated
- **Marketing can promote the new page immediately**

**Wednesday 10 AM**:
- Customer reports form not working
- You: "The statement upload form isn't sending to [email]. Can you check the FormSubmit config?"
- Claude diagnoses and fixes
- 5 minutes later: Form works again
- **Customer issue resolved in 30 min**

**Thursday 3 PM**:
- You want analytics
- You: "Create an admin report showing: total merchants, merchants by industry pie chart, top agents by deals"
- 10 minutes later: Beautiful new analytics page
- You approve and merge
- **New insights available immediately**

---

## Remembering Your Sessions

### Bookmarks to Create
1. **Hub Session**: https://claude.ai/code?repo=nextpay-website
2. **Real Estate Session**: https://claude.ai/code?repo=real-estate-hub
3. **[Next Site]**: https://claude.ai/code?repo=[repo-name]

### Quick Access
- Pin Claude Code to your browser's home page
- Add to phone home screen (Save Page)
- Add to browser bookmarks bar

### Ongoing Usage
```
Each day:
  → Open your Claude Code session bookmark
  → Say what you want changed
  → Review preview
  → Merge when ready
  → Done in 5-15 minutes
```

---

## When to Request Changes

**Good times to request:**
- Product pricing changes (immediate)
- New product launches (urgent)
- Content updates (anytime)
- Bug fixes (ASAP)
- Feature requests (batch them up)
- Report requests (when you need data)

**Batch updates together:**
Instead of: 5 requests over a week  
Try: "Here are my 5 updates for this week: [list]"  
Result: All done in one session, review together

---

## Troubleshooting Claude Code Requests

### Issue: Claude says "I can't find that file"
**Fix**: Specify the full path or description
- ❌ "Update the pricing page"
- ✅ "Update the SkyTab pricing in /hub/skytab-resources.html"

### Issue: Preview link isn't working
**Solution**: Copy-paste the GitHub PR link instead, or wait 30 sec and refresh

### Issue: Change looks wrong in preview
**Solution**: Just close the PR without merging. Site stays as-is. Ask Claude to redo it.

### Issue: Want to revert a deployed change
**Solution**: Ask Claude: "Revert the pricing update from [date]" → It creates a PR with the old version → Merge it

---

## Summary

### Forever After:
- Any change: Open Claude Code
- Describe what you want: "Update [thing] to [value]"
- Review preview: Click the link
- Approve: Click merge
- **Done**: Site updates in 30 seconds

### Timeline:
- Your time spent: 2-5 minutes (just explaining)
- Claude execution: 5-15 minutes (making changes)
- Deployment: 30 seconds (automatic)
- **Total: 6-20 minutes from request to live**

### Cost:
- Developer cost: $0 (you do it yourself)
- Infrastructure: ~$10/month
- Speed improvement: 10-100x faster than hiring developers

### Result:
- Control your own site updates
- No developer dependency
- Changes deployed fast
- Everything reversible
- Zero technical debt

---

## Next Step

**Today:**
1. Go to https://claude.ai/code
2. Create a session for one of your repos
3. Bookmark it
4. Try making a simple request: "Update [something] to [new value]"
5. See how fast it works

**Then:**
- Create sessions for all your sites
- Share this guide with your team
- Start making requests whenever you want changes

**Forever:**
- Use this workflow for every update
- Never wait for developers again
- Launch new sites in 3 days
- Scale infinitely

---

**Claude Code + Your Sites = Developer Superpowers 🚀**

You now have a personal AI developer that works in minutes.

Use it.
