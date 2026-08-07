# Real Estate Portfolio Management Hub

A comprehensive real estate portfolio management platform for organizing properties, documents, finances, and operations across multiple legal entities (Doma Capital, Domillo Holdings, Jones & Green Group).

## 🎯 Project Overview

This is a **private, internal operations portal** (not customer-facing) designed to consolidate all real estate operations into one centralized hub. It reads live data from Google Sheets (serving as the single source of truth) and provides a modern web interface for managing:

- **Properties**: Full property profiles with financials, mortgages, insurance, utilities, tenant info
- **Documents**: Centralized document management (closing docs, leases, appraisals, tax docs, etc.)
- **Financials**: Income, expenses, PITI payments, property taxes, utilities tracking
- **Business & Legal Info**: EIN, bank accounts, vendor contacts (entity-level)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Vercel Functions (Next.js API Routes)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **File Storage**: Google Cloud Storage + Supabase Storage
- **Data Sync**: Google Sheets API (bidirectional sync)
- **Hosting**: Vercel

### Key Components

```
real-estate-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page (entity selector)
│   │   ├── login/page.tsx            # Auth pages
│   │   ├── signup/page.tsx
│   │   ├── [entity]/                  # Dynamic entity routes
│   │   │   ├── layout.tsx            # Entity sidebar layout
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── properties/            # Property management
│   │   │   ├── documents/             # Document center
│   │   │   ├── financials/            # Financial records
│   │   │   └── settings/              # Entity settings
│   │   └── api/                       # Backend endpoints
│   │       ├── auth/
│   │       ├── properties/
│   │       ├── sync/sheets            # Google Sheets sync
│   │       └── search/
│   ├── components/                    # Reusable components
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client
│   │   ├── google-sheets.ts          # Google Sheets API
│   │   ├── utils.ts                  # Utilities, constants
│   │   └── database.types.ts         # TypeScript types
│   ├── types/
│   │   └── index.ts                  # All TypeScript types
│   └── styles/
│       └── globals.css               # Global styles
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Database schema
├── .env.local.example                # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Google Cloud account with Sheets API enabled
- Vercel account (for deployment)

### Setup Steps

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd real-estate-portal
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Fill in your credentials:
   # - Supabase URL & keys
   # - Google Cloud credentials
   # - Google Sheets IDs
   ```

3. **Database Setup**
   - Create Supabase project
   - Run migrations: `supabase db push`
   - Or manually run `supabase/migrations/001_initial_schema.sql`

4. **Google Cloud Setup**
   - Enable Google Sheets API
   - Create service account
   - Share Google Sheets with service account email
   - Download service account JSON key

5. **Local Development**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

6. **Deploy to Vercel**
   ```bash
   vercel deploy
   # Configure environment variables in Vercel dashboard
   ```

## 📊 Database Schema

### Core Tables
- **entities**: Doma Capital, Domillo Holdings, JAGG
- **properties**: All real estate properties
- **mortgages**: Loan information per property
- **insurance_policies**: Insurance policies per property
- **utilities**: Utility providers and billing info
- **tenants**: Tenant contact & lease info
- **property_managers**: Property management companies
- **renovations**: Renovation history & costs
- **comparable_properties**: Market comps for valuation
- **documents**: All uploaded/managed documents
- **financial_records**: Income, expenses, financial transactions
- **sync_logs**: Google Sheets sync history
- **users**: User accounts

See `supabase/migrations/001_initial_schema.sql` for full schema.

## 🔐 Sensitive Data Handling

**IMPORTANT**: The following fields are treated as sensitive and should NEVER be auto-populated:
- EIN numbers
- Bank account numbers
- Routing numbers
- Credit card numbers

These fields appear as **blank input fields** where you manually enter values. No AI agents or automation will generate these values.

## 🔄 Google Sheets Integration

### Sync Strategy
- **Real-time bidirectional sync** (goal)
- Sheets serve as single source of truth for financial data
- Portal provides modern UI on top of Sheets data
- Changes in either direction update the other

### Supported Data
- Property overview & basic info
- Rent collection & income tracking
- Utility billing & expenses
- PITI payments & loan information
- Renovation expenses
- Capital contributions
- Financial records by type

### Setup
1. Google Sheets must be shared with service account
2. Service account email: `real-estate-hub-app@real-estate-hub-504623.iam.gserviceaccount.com`
3. Trigger sync: POST `/api/sync/sheets` with `entityId` and `sheetId`

## 🎨 UI/UX

### Color Scheme (Gray/White/Black with Entity Accents)
- **Base**: White backgrounds, gray text, black accents
- **Entity-specific accents**:
  - Doma Capital: Deep Blue `#1E40AF`
  - Domillo Holdings: Green `#059669`
  - JAGG: Amber `#D97706`
- **Sidebar**: Accent color for each entity
- **Buttons**: Pill-shaped, consistent with NextPay design language

### Key Features
- Entity selector dropdown (top of sidebar)
- Responsive grid layouts
- Search & filter functionality
- Real-time stats & dashboards
- Document upload portal
- Tab-based detail views

## ✅ Build Status

### ✅ COMPLETED (75%+)
- [x] Database schema (13 tables, RLS policies)
- [x] Supabase setup & configuration
- [x] Authentication (login/signup)
- [x] Entity selector & routing
- [x] Sidebar navigation (entity-specific theming)
- [x] Dashboard with stats
- [x] Property listing & filtering
- [x] Property detail pages (tabs: overview, mortgage, insurance, utilities, tenant, documents)
- [x] Document upload portal
- [x] Financial records page (income/expense tracking)
- [x] Entity settings page (business & legal info)
- [x] Global styles & design system
- [x] TypeScript types
- [x] Google Sheets API integration (read)
- [x] Sync API endpoint
- [x] Search API endpoint
- [x] Property CRUD API
- [x] Environment configuration

### 🚧 REMAINING WORK (25%)

#### **Must Complete Before Launch**
1. **Google Cloud Storage Integration**
   - Document upload to GCS
   - File retrieval & download
   - Folder structure per entity

2. **Bidirectional Sync (Sheets ↔ Portal)**
   - Automatic sync when Sheets updated
   - Automatic sync when portal updated
   - Conflict resolution logic
   - Real-time sync via webhooks or polling

3. **Public Listing Page**
   - Standalone property listing (shareable URL)
   - Vacancy showcase
   - Inquiry form (optional)
   - Styled for external sharing

4. **Document Organization by Property**
   - Better document grouping
   - Document type filtering
   - Document naming conventions
   - Quick document access from property profiles

5. **Search Functionality**
   - Full-text search across documents
   - Quick find: "mortgage statement 2022", "interest paid 2024"
   - Search page/results display

#### **Polish & Optimization**
6. **UI Refinements**
   - Mobile responsiveness (currently desktop-focused)
   - Dark mode support
   - Loading states & error handling
   - Form validation & error messages
   - Modal dialogs for CRUD operations

7. **Performance**
   - Pagination (tables with 100+ rows)
   - Lazy loading for documents
   - Database query optimization
   - Caching strategy

8. **Additional Features**
   - User management (add collaborators)
   - Role-based access (owner vs collaborator)
   - Audit logs (who changed what, when)
   - Data export (CSV, PDF reports)
   - Tax document bundling for CPA
   - Vacancy notifications

#### **Testing & Deployment**
9. **Testing**
   - Unit tests (utilities, components)
   - Integration tests (API endpoints)
   - E2E tests (user flows)

10. **Deployment**
    - Vercel configuration
    - Environment secrets management
    - Monitoring & logging
    - Backup strategy

### Questions for You (When You Wake Up)

1. **Color scheme**: Keep blue/green/amber, or different accents for each entity?
2. **Google Cloud Storage**: Should I set up a test bucket, or wait for your GCS credentials?
3. **Sync frequency**: Real-time webhook (complex), hourly polling, or manual sync button?
4. **Domillo Holdings sharing**: Don't forget to share the Google Sheet with service account!
5. **User permissions**: Just you & Matt (both full access), or restrict by entity?
6. **Priority next steps**: Which features matter most for tomorrow's work?

## 📝 Notes

- All code is TypeScript for type safety
- No external icon libraries (using emoji)
- Custom CSS design system in `src/styles/globals.css`
- Utilities & constants centralized in `src/lib/utils.ts`
- Component pattern: client components where needed, server where possible
- API routes use Supabase admin client for server-side operations
- RLS policies in place for data isolation (ready for multi-user expansion)

## 🔗 Important Links

- Supabase Project: [real-estate-hub-504623](https://app.supabase.com)
- Google Sheets API Docs: https://developers.google.com/sheets/api
- Google Cloud Console: https://console.cloud.google.com/
- Vercel Dashboard: https://vercel.com/dashboard

## 📞 Support

When questions arise during final setup:
1. Check `.env.local.example` for required variables
2. Verify Google Sheets are shared with service account
3. Ensure Supabase RLS policies are enabled
4. Check browser console for API errors

---

**Last Updated**: August 7, 2026  
**Build Progress**: 75%+ complete  
**Status**: Ready for Google Cloud Storage & Sync integration
