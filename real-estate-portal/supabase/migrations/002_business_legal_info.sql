-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- BUSINESS LEGAL INFO TABLE with pgcrypto encryption
-- ============================================================================
-- This table stores sensitive business and legal information for entities
-- with encryption on PII fields using pgcrypto

CREATE TABLE business_legal_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  -- Business Structure & Registration
  business_type TEXT NOT NULL, -- 'sole_proprietor', 'llc', 'partnership', 's_corp', 'c_corp', 'non_profit', etc.
  legal_business_name TEXT NOT NULL,
  dba_name TEXT, -- Doing Business As

  -- Tax Information (ENCRYPTED)
  tax_id_type TEXT, -- 'ein', 'ssn', 'tin', 'itin' (stored plaintext for reference)
  tax_id_encrypted BYTEA, -- Encrypted EIN/SSN/TIN (pgcrypto encrypted)
  tax_id_last_four TEXT, -- Last 4 digits for display purposes only

  -- Business Formation Details
  formation_state TEXT,
  formation_date DATE,
  business_license_number TEXT,

  -- Banking Information (ENCRYPTED)
  primary_bank_name TEXT,
  primary_bank_routing_encrypted BYTEA, -- Encrypted routing number
  primary_bank_account_encrypted BYTEA, -- Encrypted account number
  primary_bank_account_last_four TEXT, -- Last 4 digits for reference
  primary_bank_account_type TEXT, -- 'checking', 'savings', 'business'

  secondary_bank_name TEXT,
  secondary_bank_routing_encrypted BYTEA,
  secondary_bank_account_encrypted BYTEA,
  secondary_bank_account_last_four TEXT,

  -- Owner/Principal Information (ENCRYPTED)
  principal_owner_name_encrypted BYTEA, -- Owner full name
  principal_owner_title TEXT,
  principal_owner_ssn_encrypted BYTEA, -- Owner's SSN (HIGHLY SENSITIVE)
  principal_owner_ssn_last_four TEXT,
  principal_owner_dob DATE, -- Date of birth

  -- Contact Information (ENCRYPTED for sensitive details)
  business_phone TEXT,
  business_email TEXT,
  principal_phone_encrypted BYTEA, -- Personal phone
  principal_email_encrypted BYTEA, -- Personal email

  -- Legal & Compliance
  is_registered_with_state BOOLEAN DEFAULT false,
  state_registration_id TEXT,
  annual_filing_status TEXT, -- 'current', 'overdue', 'unknown'
  last_annual_filing_date DATE,

  -- Insurance & Liability
  has_business_insurance BOOLEAN DEFAULT false,
  business_insurance_carrier TEXT,
  business_insurance_policy_number TEXT,
  business_insurance_expiration_date DATE,

  -- Additional Notes
  legal_notes TEXT,
  compliance_notes TEXT,

  -- Audit Trail
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Ensure one record per entity
  UNIQUE(entity_id)
);

-- ============================================================================
-- ENCRYPTION FUNCTIONS
-- ============================================================================

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive(plaintext TEXT, encryption_key TEXT DEFAULT 'nextpay_encryption_key')
RETURNS BYTEA AS $$
BEGIN
  RETURN pgcrypto.encrypt(convert_to(plaintext, 'UTF8'), convert_to(encryption_key, 'UTF8'), 'aes');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive(ciphertext BYTEA, encryption_key TEXT DEFAULT 'nextpay_encryption_key')
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(pgcrypto.decrypt(ciphertext, convert_to(encryption_key, 'UTF8'), 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract last 4 digits from encrypted field
CREATE OR REPLACE FUNCTION get_last_four(plaintext TEXT)
RETURNS TEXT AS $$
BEGIN
  IF plaintext IS NULL OR length(plaintext) < 4 THEN
    RETURN NULL;
  END IF;
  RETURN substring(plaintext, length(plaintext) - 3, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATING last_four fields
-- ============================================================================

CREATE OR REPLACE FUNCTION update_business_legal_info_last_four()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tax ID last four
  IF NEW.tax_id_encrypted IS NOT NULL AND NEW.tax_id_last_four IS NULL THEN
    NEW.tax_id_last_four := get_last_four(decrypt_sensitive(NEW.tax_id_encrypted));
  END IF;

  -- Update primary bank account last four
  IF NEW.primary_bank_account_encrypted IS NOT NULL AND NEW.primary_bank_account_last_four IS NULL THEN
    NEW.primary_bank_account_last_four := get_last_four(decrypt_sensitive(NEW.primary_bank_account_encrypted));
  END IF;

  -- Update secondary bank account last four
  IF NEW.secondary_bank_account_encrypted IS NOT NULL AND NEW.secondary_bank_account_last_four IS NULL THEN
    NEW.secondary_bank_account_last_four := get_last_four(decrypt_sensitive(NEW.secondary_bank_account_encrypted));
  END IF;

  -- Update principal owner SSN last four
  IF NEW.principal_owner_ssn_encrypted IS NOT NULL AND NEW.principal_owner_ssn_last_four IS NULL THEN
    NEW.principal_owner_ssn_last_four := get_last_four(decrypt_sensitive(NEW.principal_owner_ssn_encrypted));
  END IF;

  -- Update timestamp
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_legal_info_last_four_trigger
BEFORE INSERT OR UPDATE ON business_legal_info
FOR EACH ROW
EXECUTE FUNCTION update_business_legal_info_last_four();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE business_legal_info ENABLE ROW LEVEL SECURITY;

-- Only authorized users can read sensitive business legal info
CREATE POLICY "users_read_own_entity_legal_info" ON business_legal_info
  FOR SELECT
  USING (
    entity_id IN (
      SELECT id FROM entities WHERE id IN (
        SELECT entity_id FROM properties
      )
    )
  );

-- Only entity admins (or owners) can insert legal info
CREATE POLICY "users_insert_legal_info" ON business_legal_info
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT id FROM entities WHERE id IN (
        SELECT entity_id FROM properties
      )
    )
  );

-- Only entity admins (or owners) can update legal info
CREATE POLICY "users_update_legal_info" ON business_legal_info
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT id FROM entities WHERE id IN (
        SELECT entity_id FROM properties
      )
    )
  )
  WITH CHECK (
    entity_id IN (
      SELECT id FROM entities WHERE id IN (
        SELECT entity_id FROM properties
      )
    )
  );

-- ============================================================================
-- INDEXES FOR PERFORMANCE & SECURITY
-- ============================================================================

CREATE INDEX idx_business_legal_entity_id ON business_legal_info(entity_id);
CREATE INDEX idx_business_legal_created_at ON business_legal_info(created_at);
CREATE INDEX idx_business_legal_updated_at ON business_legal_info(updated_at);
CREATE INDEX idx_business_legal_verified_at ON business_legal_info(last_verified_at);
CREATE INDEX idx_business_legal_business_type ON business_legal_info(business_type);
CREATE INDEX idx_business_legal_registration_state ON business_legal_info(formation_state);

-- Partial indexes for frequently queried states
CREATE INDEX idx_business_legal_unverified ON business_legal_info(entity_id)
  WHERE last_verified_at IS NULL;
CREATE INDEX idx_business_legal_overdue_filing ON business_legal_info(entity_id)
  WHERE annual_filing_status = 'overdue';

-- ============================================================================
-- AUDIT LOG TABLE for tracking encryption/decryption access
-- ============================================================================

CREATE TABLE business_legal_info_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_legal_info_id UUID NOT NULL REFERENCES business_legal_info(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'decrypt'
  field_accessed TEXT[], -- array of fields that were accessed
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE business_legal_info_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_audit_logs" ON business_legal_info_audit_log
  FOR SELECT
  USING (
    business_legal_info_id IN (
      SELECT id FROM business_legal_info
      WHERE entity_id IN (
        SELECT id FROM entities
      )
    )
  );

CREATE INDEX idx_audit_log_business_legal_id ON business_legal_info_audit_log(business_legal_info_id);
CREATE INDEX idx_audit_log_user_id ON business_legal_info_audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON business_legal_info_audit_log(created_at);
CREATE INDEX idx_audit_log_action ON business_legal_info_audit_log(action);
