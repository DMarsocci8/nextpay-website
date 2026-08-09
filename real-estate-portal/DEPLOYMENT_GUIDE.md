# Real Estate Portal - Complete Deployment Guide

## Overview

This guide walks through deploying the Real Estate Portal with all three entities (Doma Capital, Domillo Holdings, JAGG) with full Supabase backend, Google Sheets sync, and frontend features.

## Phase 1: Database Setup ✓

### 1.1 Deploy Supabase Migrations

The database schema has been created in two migration files:
- `supabase/migrations/001_initial_schema.sql` - Core tables
- `supabase/migrations/002_business_legal_info.sql` - Encrypted business info, tax documents, rent tracking

**Deploy steps:**
1. Go to https://app.supabase.com/project/bgqdwaoyaayeeweqdtxlw/sql/new
2. Copy contents of `001_initial_schema.sql` and run
3. Copy contents of `002_business_legal_info.sql` and run
4. Verify all tables are created in the Tables editor

### 1.2 Verify Entities Created

In Supabase → Tables → entities, verify these 3 records exist:
- `doma_capital` - Doma Capital (3734 Monroe Road) - Sheet: 1U_6BeT9JxCFsRNO8JD8PgKMOPhySLj7QKzbpi40XWzw
- `domillo_holdings` - Domillo Holdings - Sheet: 10u-KbmV9o8ku2c3ggfRQC43EhnA6yYPtSgSFfwJJPbo
- `jagg` - Jones & Green Group - Sheet: 1jUA0obH878JyYlYJi1fv5vLlfXWuNTOpo5grDyI6tqE

### 1.3 Configure Authentication

1. Go to Supabase → Authentication → Providers
2. Ensure Email/Password is enabled
3. Go to Auth → Users and add:
   - **dmarsocci@gmail.com** (owner@doma_capital, @domillo_holdings, @jagg)
   - **mattporillo@gmail.com** (owner@domillo_holdings, @jagg)
   - **domillollc@gmail.com** (owner@domillo_holdings)
   - **peter.pietryka@evansandbennett.com** (cpa_read_only)

## Phase 2: Google Apps Script Setup

### 2.1 Deploy Google Apps Script

1. Open Google Sheets for one entity (e.g., Domillo Holdings)
2. Go to Extensions → Apps Script
3. Copy entire content of `scripts/google-apps-script.gs`
4. Paste into the Apps Script editor
5. Click Deploy → New Deployment
6. Select type: Web app
7. Execute as: real-estate-hub-app@real-estate-hub-504623.iam.gserviceaccount.com
8. Who has access: Anyone
9. Click Deploy
10. Copy the deployment URL

### 2.2 Configure Webhook

1. In Apps Script, go to Triggers (left sidebar)
2. Click "Create trigger"
3. Choose function: `syncSheetsToSupabase`
4. Event source: Time-driven
5. Type: Every 6 hours
6. Failure notification: Email

### 2.3 Verify Service Account Has Access

Ensure this email has been shared with all three sheets:
- **real-estate-hub-app@real-estate-hub-504623.iam.gserviceaccount.com**

Grant **Viewer** access to:
- Doma Capital sheet
- Domillo Holdings sheet ✓ (already shared)
- JAGG sheet

## Phase 3: Frontend Deployment

### 3.1 Verify Environment Variables

Check `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://bgqdwaoyaayeeweqdtxlw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Build & Test Locally

```bash
cd real-estate-portal
npm install
npm run build
npm run dev
```

Visit http://localhost:3000 to verify:
- Home page shows 3 entities
- Can click into each entity
- Dashboard page loads
- Navigation works

### 3.3 Deploy to Vercel

1. Go to https://vercel.com/dmarsocci8
2. Create new project from github: `nextpay-website`
3. Set root directory: `real-estate-portal`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bgqdwaoyaayeeweqdtxlw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Click Deploy
6. Once deployed, add custom domain: `real-estate-portal.vercel.app` (default)

## Phase 4: Data Migration

### 4.1 Initial Data Import from Sheets

Data will be automatically synced through the Google Apps Script within 6 hours, OR manually:

1. Open Google Apps Script for any entity
2. Run function: `syncSheetsToSupabase`
3. Check Supabase tables to verify data imported

**Tables that will be populated:**
- properties (addresses, bedrooms, bathrooms, etc.)
- tenants (names, emails, lease dates, rent amounts)
- rent_payments (payment history)
- maintenance_records (maintenance log)
- utilities (water, electric, gas, etc.)
- mortgages (if data exists in sheets)
- insurance_policies (if data exists in sheets)

### 4.2 Verify Data in Supabase

Go to each table in Supabase and verify records:
1. `properties` - Should see all properties from all 3 entities
2. `tenants` - Should see all tenant records
3. `rent_payments` - Should see payment history
4. `maintenance_records` - Should see maintenance logs

## Phase 5: CPA Access Setup

### 5.1 Create CPA User

1. Go to Supabase → Authentication → Users
2. Invite: **peter.pietryka@evansandbennett.com**
3. Set role: `cpa_read_only` (only access to tax_documents table)

### 5.2 Generate CPA Access Token

1. Go to portal: `real-estate-portal.vercel.app`
2. Login as dmarsocci@gmail.com
3. Navigate to each entity → Taxes tab
4. Click "Generate CPA Access Link"
5. Share the link with Peter (valid for 30 days)

## Phase 6: Test All Features

### Frontend Pages to Test

Each entity has these routes:
- **`/{entity}/`** - Dashboard (properties, metrics, quick actions)
- **`/{entity}/dashboard`** - Detailed dashboard
- **`/{entity}/tenants`** - Tenant management
- **`/{entity}/rent-tracking`** - Rent roll and payment tracking
- **`/{entity}/maintenance`** - Maintenance log
- **`/{entity}/documents`** - Document management
- **`/{entity}/taxes`** - Tax documents and CPA sharing
- **`/{entity}/settings`** - Business legal info, users, security

### Test Cases

1. **Authentication**
   - [ ] Can login with dmarsocci@gmail.com
   - [ ] Can login with mattporillo@gmail.com
   - [ ] Can login with domillollc@gmail.com
   - [ ] CPA cannot login (view-only access)

2. **Entity Isolation**
   - [ ] Each user only sees their entities
   - [ ] Data is properly isolated per entity

3. **Dashboard**
   - [ ] Metrics load correctly
   - [ ] Quick action buttons work
   - [ ] Recent activity displays

4. **Tenants**
   - [ ] Can view all tenants
   - [ ] Can filter by status
   - [ ] Can add new tenant
   - [ ] Lease expiration alerts work

5. **Rent Tracking**
   - [ ] Monthly rent roll displays
   - [ ] Payment status updates
   - [ ] Outstanding amounts calculate
   - [ ] Can send rent roll email

6. **Maintenance**
   - [ ] Can view maintenance history
   - [ ] Can log new maintenance
   - [ ] Priority and status filters work
   - [ ] Cost tracking works

7. **Tax Documents**
   - [ ] Can upload tax documents
   - [ ] Checklist tracks completion
   - [ ] CPA access token generates
   - [ ] Token expires after 30 days

8. **Settings**
   - [ ] Can enter business info
   - [ ] Sensitive fields are encrypted
   - [ ] Can add users
   - [ ] Can enable 2FA

### Google Sheets Sync Test

1. Add a new property to Google Sheets
2. Wait 6 hours OR run manual sync
3. Check Supabase - property should appear
4. Verify in portal - should see new property

## Phase 7: 2FA Setup (Optional - Phase 5)

To enable 2FA:
1. Go to Settings → Security
2. Click "Enable 2FA"
3. Scan QR code with authenticator app
4. Enter verification code
5. Save backup codes securely

## Monitoring & Maintenance

### Sync Monitoring

Check Google Apps Script execution:
1. Apps Script → Execution Log
2. Look for "Sync completed successfully"
3. Monitor for errors

Check Supabase sync logs:
1. Supabase → sync_logs table
2. Status should be "completed"
3. records_synced should match expected

### Backups

- **Supabase automatic backups**: Daily at 2 AM UTC
- **Google Sheets**: Built-in revision history
- **Data exports**: Monthly exports recommended

### Common Issues

**Sync not working:**
1. Check service account has access to all sheets
2. Verify API keys in script are current
3. Check Supabase logs for errors
4. Run manual sync: Apps Script → "Run" → syncSheetsToSupabase

**Sensitive data appearing in Sheets:**
1. NEVER auto-populate EIN, bank accounts, routing numbers
2. Owner must enter manually in Settings
3. Encrypted in Supabase (pgcrypto)

**CPA access expired:**
1. Generate new token in Taxes tab
2. Share new link with Peter
3. Old token automatically revoked

## Emergency Procedures

### Reset Everything

If something goes wrong:

1. **Preserve Google Sheets** - never delete
2. **Backup Supabase**:
   ```
   - Go to Supabase Dashboard
   - Settings → Backups
   - Create manual backup
   ```
3. **Clear Supabase data** (if needed):
   ```
   - Tables → [table name]
   - Click "..." → "Truncate"
   ```
4. **Re-run migration**:
   - SQL editor → Copy `001_initial_schema.sql`
   - Run query
5. **Re-sync data**:
   - Apps Script → Run `syncSheetsToSupabase`

### Rollback Deployment

If frontend breaks:
1. Go to Vercel → Project → Deployments
2. Find last working deployment
3. Click → "Redeploy"

## Success Checklist

- [ ] All 3 Supabase migrations executed successfully
- [ ] 3 entities created in entities table
- [ ] Google Apps Script deployed and running
- [ ] Service account has access to all 3 sheets
- [ ] Frontend deployed to Vercel
- [ ] All 5 users can login appropriately
- [ ] Dashboard loads with metrics
- [ ] Data synced from sheets to Supabase
- [ ] CPA access token generates
- [ ] 2FA setup (optional)

## Next Steps

1. **User Training**: Show Domenico and Matt how to use each section
2. **Ongoing Sync**: Verify sync works for 1-2 weeks
3. **Tax Preparation**: Test tax document workflow before tax season
4. **CPA Feedback**: Get feedback from Peter on what else he needs
5. **Scaling**: Add features as requested

---

**Questions?** Contact support or refer to TOMORROW_CHECKLIST.md for immediate action items.
