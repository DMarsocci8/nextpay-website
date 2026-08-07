-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET search_path = public;

-- ============================================================================
-- ENTITIES TABLE
-- ============================================================================
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- 'doma_capital', 'domillo_holdings', 'jagg'
  name TEXT NOT NULL,
  accent_color TEXT NOT NULL, -- hex color code
  description TEXT,
  google_sheet_id TEXT,
  ein TEXT, -- blank by default, owner fills in
  primary_bank_name TEXT,
  primary_bank_contact TEXT,
  primary_bank_phone TEXT,
  secondary_bank_name TEXT,
  secondary_bank_contact TEXT,
  secondary_bank_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'owner', -- 'owner' or 'collaborator'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  property_type TEXT, -- 'residential', 'commercial', 'mixed-use', etc.
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  square_footage DECIMAL(10,2),
  purchase_price DECIMAL(12,2),
  purchase_date DATE,
  current_estimated_value DECIMAL(12,2),
  is_occupied BOOLEAN DEFAULT true,
  is_listed BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_id, address)
);

-- ============================================================================
-- MORTGAGE/LOAN INFO TABLE
-- ============================================================================
CREATE TABLE mortgages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  loan_type TEXT, -- 'conventional', 'commercial', 'hard money', etc.
  original_balance DECIMAL(12,2),
  current_balance DECIMAL(12,2),
  interest_rate DECIMAL(5,3),
  loan_term_months INT,
  monthly_payment DECIMAL(10,2),
  loan_start_date DATE,
  loan_end_date DATE,
  account_number TEXT,
  loan_officer_name TEXT,
  loan_officer_phone TEXT,
  loan_officer_email TEXT,
  prepayment_penalty BOOLEAN DEFAULT false,
  prepayment_penalty_details TEXT,
  has_pmi BOOLEAN DEFAULT false,
  pmi_monthly_payment DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INSURANCE TABLE
-- ============================================================================
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  insurance_company TEXT NOT NULL,
  policy_type TEXT, -- 'homeowners', 'commercial', 'hazard', etc.
  policy_number TEXT,
  coverage_amount DECIMAL(12,2),
  deductible DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  monthly_payment DECIMAL(10,2),
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  policy_start_date DATE,
  policy_end_date DATE,
  renewal_reminder_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- UTILITIES TABLE
-- ============================================================================
CREATE TABLE utilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  utility_type TEXT NOT NULL, -- 'electric', 'water', 'gas', 'sewer', 'trash', etc.
  provider_name TEXT NOT NULL,
  account_number TEXT,
  billing_contact TEXT,
  billing_phone TEXT,
  billing_email TEXT,
  average_monthly_cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, utility_type, provider_name)
);

-- ============================================================================
-- TENANTS TABLE
-- ============================================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  lease_start_date DATE,
  lease_end_date DATE,
  monthly_rent DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  move_in_date DATE,
  move_out_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY MANAGERS TABLE
-- ============================================================================
CREATE TABLE property_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  management_fee_percentage DECIMAL(5,2),
  management_fee_flat DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- RENOVATIONS TABLE
-- ============================================================================
CREATE TABLE renovations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT, -- 'kitchen', 'bathroom', 'flooring', 'roof', 'hvac', etc.
  start_date DATE,
  end_date DATE,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  contractor_name TEXT,
  contractor_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- COMPARABLE PROPERTIES (COMPS) TABLE
-- ============================================================================
CREATE TABLE comparable_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  comp_address TEXT NOT NULL,
  comp_city TEXT,
  comp_state TEXT,
  comp_zip TEXT,
  sale_price DECIMAL(12,2),
  sale_date DATE,
  days_on_market INT,
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  square_footage DECIMAL(10,2),
  price_per_sqft DECIMAL(10,2),
  source TEXT, -- 'zillow', 'mls', 'manual', etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT, -- 'pdf', 'image', 'spreadsheet', etc.
  file_size INT, -- bytes
  gcs_path TEXT NOT NULL, -- path in Google Cloud Storage
  document_type TEXT NOT NULL, -- 'mortgage', 'lease', 'insurance', 'utility', 'renovation', 'appraisal', 'tax', 'other'
  document_date DATE,
  description TEXT,
  tags TEXT[], -- array of searchable tags
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- FINANCIAL RECORDS TABLE (for syncing with Google Sheets)
-- ============================================================================
CREATE TABLE financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL, -- 'piti_payment', 'utility_expense', 'repair', 'renovation', 'property_tax', 'income', 'expense', 'other'
  amount DECIMAL(12,2),
  transaction_date DATE NOT NULL,
  description TEXT,
  sheet_row_reference TEXT, -- reference to Google Sheet row for sync
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SYNC LOG TABLE (for tracking Google Sheets sync)
-- ============================================================================
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'full', 'incremental', 'property', 'financial'
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  records_synced INT DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE renovations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparable_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Users can read all entities (public info)
CREATE POLICY "users_read_all_entities" ON entities
  FOR SELECT
  USING (true);

-- Users can only read their own user profile
CREATE POLICY "users_read_own_profile" ON users
  FOR SELECT
  USING (auth.uid() = auth_id);

-- Users can only read properties and related data (allowing both to see all for now)
-- In production, you might want to restrict to specific entity admins
CREATE POLICY "users_read_properties" ON properties
  FOR SELECT
  USING (true);

-- Similar policies for all related tables
CREATE POLICY "users_read_mortgages" ON mortgages
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_insurance" ON insurance_policies
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_utilities" ON utilities
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_tenants" ON tenants
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_property_managers" ON property_managers
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_renovations" ON renovations
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_comps" ON comparable_properties
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE POLICY "users_read_documents" ON documents
  FOR SELECT
  USING (true);

CREATE POLICY "users_read_financial_records" ON financial_records
  FOR SELECT
  USING (true);

CREATE POLICY "users_read_sync_logs" ON sync_logs
  FOR SELECT
  USING (true);

-- ============================================================================
-- INSERT INITIAL ENTITIES
-- ============================================================================
INSERT INTO entities (slug, name, accent_color, description, google_sheet_id) VALUES
  ('doma_capital', 'Doma Capital', '#1E40AF', 'Single-property investment entity', '1U_6BeT9JxCFsRNO8JD8PgKMOPhySLj7QKzbpi40XWzw'),
  ('domillo_holdings', 'Domillo Holdings', '#059669', 'Multi-property portfolio', '10u-KbmV9o8ku2c3ggfRQC43EhnA6yYPtSgSFfwJJPbo'),
  ('jagg', 'Jones & Green Group', '#D97706', 'JAGG LLC - Buckner properties', '1jUA0obH878JyYlYJi1fv5vLlfXWuNTOpo5grDyI6tqE');

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_properties_entity_id ON properties(entity_id);
CREATE INDEX idx_properties_is_archived ON properties(is_archived);
CREATE INDEX idx_mortgages_property_id ON mortgages(property_id);
CREATE INDEX idx_insurance_property_id ON insurance_policies(property_id);
CREATE INDEX idx_utilities_property_id ON utilities(property_id);
CREATE INDEX idx_tenants_property_id ON tenants(property_id);
CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_documents_entity_id ON documents(entity_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_financial_records_entity_id ON financial_records(entity_id);
CREATE INDEX idx_financial_records_date ON financial_records(transaction_date);
CREATE INDEX idx_sync_logs_entity_id ON sync_logs(entity_id);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at);
