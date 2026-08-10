# Real Estate Portal — Project Reference

## 🌐 Live Deployment
- **URL:** https://lustrous-sunflower-95cc16.netlify.app
- **Platform:** Netlify
- **Status:** Active & Live
- **Last Updated:** August 9, 2026

## 📋 Project Overview
Real Estate Portal for managing properties, tenants, financials, and documents across three legal entities:
- **Doma Capital** (single property)
- **Domillo Holdings** (multi-property portfolio)  
- **Jones & Green Group (JAGG)** (Buckner properties)

## 🔧 Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Supabase PostgreSQL with Row Level Security (RLS)
- **Storage:** Google Cloud Storage (documents)
- **Sync:** Google Apps Script ↔ Google Sheets (bi-directional, 6-hour intervals)
- **Auth:** Supabase Email/Password + optional 2FA
- **Encryption:** pgcrypto for sensitive fields (EIN, SSN, bank accounts)

## ✨ Key Features
- **Properties Dashboard:** View, manage, track all properties
- **Tenant Management:** Lease tracking, contact info, rent rolls
- **Financial Tracking:** PITI payments, utilities, repairs, property taxes
- **Document Management:** Upload/organize via Google Cloud Storage
- **Business Legal Info:** Encrypted storage for sensitive business data
- **Google Sheets Sync:** Auto-sync of properties, tenants, financials, maintenance
- **Multi-Entity Support:** Entity-level data isolation with RLS policies
- **CPA Access:** Time-limited tokens for accountant access (30-day expiration)

## 🗄️ Database
- **Migrations:** Supabase migrations deployed (001_initial_schema.sql, 002_business_legal_info.sql)
- **Tables:** 13 core tables + audit logs
- **Encryption:** EIN, SSN, bank routing/account numbers, owner contact info
- **RLS Policies:** Entity-level isolation, user-based access control

## 👥 Users to Add (Phase 1.3)
1. dmarsocci@gmail.com (owner)
2. mattporillo@gmail.com
3. domillollc@gmail.com
4. peter.pietryka@evansandbennett.com (CPA - needs time-limited token)
5. [One additional user - TBD]

## 📝 How to Request Updates
Simply say:
> "Claude, update the Real Estate Portal to [feature/change]"

Examples:
- "Add a new property type filter"
- "Change the dashboard layout"
- "Fix the tenant search"
- "Add 2FA setup for users"
- "Create custom reports for [entity]"

## 🔄 Development Workflow
1. Code changes made to `real-estate-portal/` directory
2. Build: `npm run build`
3. Deploy: Push via Netlify (drag-drop or GitHub push)
4. Changes live within 2-3 minutes

## 🚀 Next Steps
- [ ] Phase 1.3: Add 5 users to Supabase authentication
- [ ] Phase 4: Initial data migration from Google Sheets
- [ ] Phase 5: Generate CPA access tokens
- [ ] Phase 6: Complete testing suite
- [ ] Phase 7: Optional 2FA setup

## 📞 Contact
Owner: Domenico Marsocci (dmarsocci@gmail.com)

---
**Note:** This portal is completely separate from NextPay website. No cross-contamination or shared branding.
