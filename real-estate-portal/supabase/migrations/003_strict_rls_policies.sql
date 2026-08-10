-- ============================================================================
-- STRICT ROW LEVEL SECURITY POLICIES - ENTITY & ROLE ISOLATION
-- ============================================================================
-- This migration implements stricter RLS policies that:
-- 1. Isolate data by entity (users only see their assigned entities)
-- 2. Enforce role-based access (owner = full CRUD, cpa/collaborator = read-only)
-- 3. Protect sensitive business/legal information
-- 4. Require explicit entity assignment via junction table
--
-- Migration date: 2026-08-09
-- ============================================================================

-- ============================================================================
-- ENTITY-USER JUNCTION TABLE (replaces implicit access)
-- ============================================================================
-- Explicitly defines which users have access to which entities
-- and what their role is within that entity

CREATE TABLE entity_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'cpa', 'collaborator')),
    -- 'owner': full CRUD on entity data
    -- 'cpa': read-only access to financial/legal records
    -- 'collaborator': read-only access to all data
  access_level TEXT NOT NULL CHECK (access_level IN ('full', 'financial_only', 'read_only')),
    -- 'full': can read & write all data
    -- 'financial_only': can read financial records only (for CPAs)
    -- 'read_only': can only read (for collaborators)
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_entity_users_entity_id ON entity_users(entity_id);
CREATE INDEX idx_entity_users_user_id ON entity_users(user_id);
CREATE INDEX idx_entity_users_active ON entity_users(is_active) WHERE is_active = true;

-- Enable RLS on junction table
ALTER TABLE entity_users ENABLE ROW LEVEL SECURITY;

-- Users can only view their own entity assignments
CREATE POLICY "users_read_own_entity_assignments" ON entity_users
  FOR SELECT
  USING (user_id = auth.uid() OR entity_id IN (
    SELECT entity_id FROM entity_users
    WHERE user_id = auth.uid() AND is_active = true
  ));

-- Only entity owners can grant/revoke access
CREATE POLICY "owners_manage_entity_users" ON entity_users
  FOR INSERT
  WITH CHECK (
    granted_by = auth.uid()
    AND entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

CREATE POLICY "owners_update_entity_users" ON entity_users
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  )
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- DROP OLD PERMISSIVE POLICIES
-- ============================================================================
-- Remove the old "allow everyone" policies before adding new strict ones

DROP POLICY IF EXISTS "users_read_all_entities" ON entities;
DROP POLICY IF EXISTS "users_read_properties" ON properties;
DROP POLICY IF EXISTS "users_read_mortgages" ON mortgages;
DROP POLICY IF EXISTS "users_read_insurance" ON insurance_policies;
DROP POLICY IF EXISTS "users_read_utilities" ON utilities;
DROP POLICY IF EXISTS "users_read_tenants" ON tenants;
DROP POLICY IF EXISTS "users_read_property_managers" ON property_managers;
DROP POLICY IF EXISTS "users_read_renovations" ON renovations;
DROP POLICY IF EXISTS "users_read_comps" ON comparable_properties;
DROP POLICY IF EXISTS "users_read_documents" ON documents;
DROP POLICY IF EXISTS "users_read_financial_records" ON financial_records;
DROP POLICY IF EXISTS "users_read_sync_logs" ON sync_logs;
DROP POLICY IF EXISTS "users_insert_legal_info" ON business_legal_info;
DROP POLICY IF EXISTS "users_update_legal_info" ON business_legal_info;
DROP POLICY IF EXISTS "users_read_own_entity_legal_info" ON business_legal_info;
DROP POLICY IF EXISTS "users_read_own_audit_logs" ON business_legal_info_audit_log;

-- ============================================================================
-- STRICT POLICIES FOR ENTITIES TABLE
-- ============================================================================

-- Users can only read entities they're assigned to
CREATE POLICY "users_read_assigned_entities" ON entities
  FOR SELECT
  USING (
    id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Only entity owners can update entity info
CREATE POLICY "owners_update_entities" ON entities
  FOR UPDATE
  USING (
    id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  )
  WITH CHECK (
    id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR PROPERTIES TABLE
-- ============================================================================

-- Users can read properties only for entities they're assigned to
CREATE POLICY "users_read_properties_of_assigned_entities" ON properties
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Only entity owners can insert/update/delete properties
CREATE POLICY "owners_insert_properties" ON properties
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

CREATE POLICY "owners_update_properties" ON properties
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  )
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

CREATE POLICY "owners_delete_properties" ON properties
  FOR DELETE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR MORTGAGES TABLE
-- ============================================================================

CREATE POLICY "users_read_mortgages_of_assigned_entities" ON mortgages
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_mortgages" ON mortgages
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_mortgages" ON mortgages
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_mortgages" ON mortgages
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR INSURANCE_POLICIES TABLE
-- ============================================================================

CREATE POLICY "users_read_insurance_of_assigned_entities" ON insurance_policies
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_insurance" ON insurance_policies
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_insurance" ON insurance_policies
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_insurance" ON insurance_policies
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR UTILITIES TABLE
-- ============================================================================

CREATE POLICY "users_read_utilities_of_assigned_entities" ON utilities
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_utilities" ON utilities
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_utilities" ON utilities
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_utilities" ON utilities
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR TENANTS TABLE
-- ============================================================================

CREATE POLICY "users_read_tenants_of_assigned_entities" ON tenants
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_tenants" ON tenants
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_tenants" ON tenants
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_tenants" ON tenants
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR PROPERTY_MANAGERS TABLE
-- ============================================================================

CREATE POLICY "users_read_property_managers_of_assigned_entities" ON property_managers
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_property_managers" ON property_managers
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_property_managers" ON property_managers
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_property_managers" ON property_managers
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR RENOVATIONS TABLE
-- ============================================================================

CREATE POLICY "users_read_renovations_of_assigned_entities" ON renovations
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_renovations" ON renovations
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_renovations" ON renovations
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_renovations" ON renovations
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR COMPARABLE_PROPERTIES TABLE
-- ============================================================================

CREATE POLICY "users_read_comps_of_assigned_entities" ON comparable_properties
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "owners_insert_comps" ON comparable_properties
  FOR INSERT
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_update_comps" ON comparable_properties
  FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

CREATE POLICY "owners_delete_comps" ON comparable_properties
  FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE entity_id IN (
        SELECT entity_id FROM entity_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
        AND is_active = true
      )
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR DOCUMENTS TABLE (READ-ONLY for collaborators/CPAs)
-- ============================================================================

CREATE POLICY "users_read_documents_of_assigned_entities" ON documents
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Only entity owners can upload/delete documents
CREATE POLICY "owners_insert_documents" ON documents
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "owners_delete_documents" ON documents
  FOR DELETE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR FINANCIAL_RECORDS TABLE (CPA READ-ONLY)
-- ============================================================================

CREATE POLICY "users_read_financial_records_of_assigned_entities" ON financial_records
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Only entity owners can insert/update/delete financial records
CREATE POLICY "owners_insert_financial_records" ON financial_records
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

CREATE POLICY "owners_update_financial_records" ON financial_records
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  )
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

CREATE POLICY "owners_delete_financial_records" ON financial_records
  FOR DELETE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR SYNC_LOGS TABLE
-- ============================================================================

CREATE POLICY "users_read_sync_logs_of_assigned_entities" ON sync_logs
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Only system/service accounts or owners can write sync logs (in practice, via app backend)
CREATE POLICY "owners_insert_sync_logs" ON sync_logs
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR BUSINESS_LEGAL_INFO TABLE (HIGHLY RESTRICTED)
-- ============================================================================

-- CPAS can read business_legal_info for entities they're assigned to (read-only)
-- Owners can read/write
CREATE POLICY "users_read_business_legal_info" ON business_legal_info
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Only entity owners can create business legal info
CREATE POLICY "owners_insert_business_legal_info" ON business_legal_info
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- Only entity owners can update business legal info
CREATE POLICY "owners_update_business_legal_info" ON business_legal_info
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  )
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- Only entity owners can delete business legal info
CREATE POLICY "owners_delete_business_legal_info" ON business_legal_info
  FOR DELETE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );

-- ============================================================================
-- STRICT POLICIES FOR BUSINESS_LEGAL_INFO_AUDIT_LOG TABLE
-- ============================================================================

CREATE POLICY "users_read_own_audit_logs_strict" ON business_legal_info_audit_log
  FOR SELECT
  USING (
    business_legal_info_id IN (
      SELECT id FROM business_legal_info
      WHERE entity_id IN (
        SELECT DISTINCT entity_id FROM entity_users
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- Audit logs are append-only for security (only app backend can insert)
-- Prevent direct user inserts via RLS
CREATE POLICY "system_insert_audit_logs" ON business_legal_info_audit_log
  FOR INSERT
  WITH CHECK (false); -- Disabled for users; use backend functions instead

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has owner role for an entity
CREATE OR REPLACE FUNCTION is_entity_owner(entity_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_users.entity_id = is_entity_owner.entity_id
    AND user_id = auth.uid()
    AND role = 'owner'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any access to an entity
CREATE OR REPLACE FUNCTION has_entity_access(entity_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_users.entity_id = has_entity_access.entity_id
    AND user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role for an entity
CREATE OR REPLACE FUNCTION get_entity_user_role(entity_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM entity_users
  WHERE entity_users.entity_id = get_entity_user_role.entity_id
  AND user_id = auth.uid()
  AND is_active = true;

  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================
--
-- BREAKING CHANGES:
-- 1. entity_users junction table is now REQUIRED for any access
-- 2. All "public read" access is removed
-- 3. Users must be explicitly assigned to entities
-- 4. CPAs/collaborators have READ-ONLY access (no writes)
--
-- REQUIRED SETUP AFTER MIGRATION:
-- 1. Populate entity_users table with existing user-entity relationships:
--    INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by)
--    SELECT entity_id, user_id, 'owner', 'full', user_id FROM users
--    WHERE role = 'owner'; -- Adjust based on your actual user-entity mapping
--
-- 2. For CPA/collaborator access:
--    INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by)
--    VALUES (entity_uuid, cpa_user_uuid, 'cpa', 'financial_only', owner_user_uuid);
--
-- TESTING CHECKLIST:
-- - Owner can see/edit all data for assigned entities
-- - CPA can see all data but not edit
-- - Collaborator can see all data but not edit
-- - Users cannot access unassigned entities
-- - Revoked access immediately denies queries
