-- ============================================================================
-- ENTITY ACCESS MANAGEMENT HELPER FUNCTIONS & PROCEDURES
-- ============================================================================
-- Common operations for managing entity-user relationships and permissions
-- Use these in your application backend when granting/revoking access
--
-- Example Usage:
--   SELECT grant_entity_access('doma-capital-uuid', 'new-user-uuid', 'owner', 'full', 'granter-uuid');
--   SELECT revoke_entity_access('doma-capital-uuid', 'user-uuid', 'revoker-uuid');
--   SELECT get_user_entity_role('doma-capital-uuid', 'user-uuid');
--
-- ============================================================================

-- ============================================================================
-- GRANT ACCESS PROCEDURES
-- ============================================================================

-- Grant entity access to a user (insert or update)
CREATE OR REPLACE FUNCTION grant_entity_access(
  p_entity_id UUID,
  p_user_id UUID,
  p_role TEXT,
  p_access_level TEXT,
  p_granted_by UUID
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_existing_record UUID;
BEGIN
  -- Validate inputs
  IF p_role NOT IN ('owner', 'cpa', 'collaborator') THEN
    RAISE EXCEPTION 'Invalid role: %. Must be owner, cpa, or collaborator.', p_role;
  END IF;

  IF p_access_level NOT IN ('full', 'financial_only', 'read_only') THEN
    RAISE EXCEPTION 'Invalid access_level: %. Must be full, financial_only, or read_only.', p_access_level;
  END IF;

  -- Check if entity exists
  IF NOT EXISTS (SELECT 1 FROM entities WHERE id = p_entity_id) THEN
    RAISE EXCEPTION 'Entity not found: %', p_entity_id;
  END IF;

  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;

  -- Check if granter has permission (must be owner of entity)
  IF NOT is_entity_owner(p_entity_id) AND p_granted_by != auth.uid() THEN
    RAISE EXCEPTION 'Only entity owners can grant access';
  END IF;

  -- Insert or update entity_users
  INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by, is_active)
  VALUES (p_entity_id, p_user_id, p_role, p_access_level, p_granted_by, true)
  ON CONFLICT (entity_id, user_id) DO UPDATE
  SET
    role = p_role,
    access_level = p_access_level,
    is_active = true,
    revoked_at = NULL,
    revoked_by = NULL,
    granted_by = p_granted_by,
    granted_at = NOW(),
    updated_at = NOW();

  -- Log the action
  SELECT jsonb_build_object(
    'status', 'success',
    'message', format('Granted %s access to user %s for entity %s', p_role, p_user_id, p_entity_id),
    'entity_id', p_entity_id,
    'user_id', p_user_id,
    'role', p_role,
    'access_level', p_access_level
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- REVOKE ACCESS PROCEDURES
-- ============================================================================

-- Soft-delete access (sets is_active = false)
CREATE OR REPLACE FUNCTION revoke_entity_access(
  p_entity_id UUID,
  p_user_id UUID,
  p_revoked_by UUID
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_rows_affected INT;
BEGIN
  -- Check if revoker has permission
  IF NOT is_entity_owner(p_entity_id) AND p_revoked_by != auth.uid() THEN
    RAISE EXCEPTION 'Only entity owners can revoke access';
  END IF;

  -- Soft delete
  UPDATE entity_users
  SET
    is_active = false,
    revoked_at = NOW(),
    revoked_by = p_revoked_by,
    updated_at = NOW()
  WHERE entity_id = p_entity_id
  AND user_id = p_user_id
  AND is_active = true;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

  IF v_rows_affected = 0 THEN
    SELECT jsonb_build_object(
      'status', 'not_found',
      'message', 'Access record not found or already revoked'
    ) INTO v_result;
  ELSE
    SELECT jsonb_build_object(
      'status', 'success',
      'message', format('Revoked access for user %s to entity %s', p_user_id, p_entity_id),
      'entity_id', p_entity_id,
      'user_id', p_user_id,
      'revoked_at', NOW()
    ) INTO v_result;
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- QUERY HELPERS
-- ============================================================================

-- Get all entities a user has access to
CREATE OR REPLACE FUNCTION get_user_entities(p_user_id UUID DEFAULT NULL)
RETURNS TABLE(entity_id UUID, entity_name TEXT, entity_slug TEXT, user_role TEXT, access_level TEXT, is_active BOOLEAN) AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN QUERY
  SELECT
    eu.entity_id,
    e.name,
    e.slug,
    eu.role,
    eu.access_level,
    eu.is_active
  FROM entity_users eu
  JOIN entities e ON e.id = eu.entity_id
  WHERE eu.user_id = p_user_id
  ORDER BY eu.is_active DESC, e.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all users with access to an entity
CREATE OR REPLACE FUNCTION get_entity_users(p_entity_id UUID)
RETURNS TABLE(user_id UUID, email TEXT, full_name TEXT, role TEXT, access_level TEXT, is_active BOOLEAN, granted_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.full_name,
    eu.role,
    eu.access_level,
    eu.is_active,
    eu.granted_at
  FROM entity_users eu
  JOIN users u ON u.id = eu.user_id
  WHERE eu.entity_id = p_entity_id
  ORDER BY eu.is_active DESC, u.email ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's role for a specific entity
CREATE OR REPLACE FUNCTION get_entity_user_role(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  SELECT role INTO v_role
  FROM entity_users
  WHERE entity_id = p_entity_id
  AND user_id = p_user_id
  AND is_active = true;

  RETURN COALESCE(v_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's access level for a specific entity
CREATE OR REPLACE FUNCTION get_entity_user_access_level(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  v_access_level TEXT;
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  SELECT access_level INTO v_access_level
  FROM entity_users
  WHERE entity_id = p_entity_id
  AND user_id = p_user_id
  AND is_active = true;

  RETURN COALESCE(v_access_level, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PERMISSION CHECKING FUNCTIONS
-- ============================================================================

-- Check if user has owner role for an entity
CREATE OR REPLACE FUNCTION is_entity_owner(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_id = p_entity_id
    AND user_id = p_user_id
    AND role = 'owner'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is CPA for an entity
CREATE OR REPLACE FUNCTION is_entity_cpa(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_id = p_entity_id
    AND user_id = p_user_id
    AND role = 'cpa'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has any active access to an entity
CREATE OR REPLACE FUNCTION has_entity_access(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_id = p_entity_id
    AND user_id = p_user_id
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can write to an entity (owner role)
CREATE OR REPLACE FUNCTION can_write_entity(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_id = p_entity_id
    AND user_id = p_user_id
    AND role = 'owner'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can read financial data (owner or cpa)
CREATE OR REPLACE FUNCTION can_read_financial(p_entity_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  p_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM entity_users
    WHERE entity_id = p_entity_id
    AND user_id = p_user_id
    AND role IN ('owner', 'cpa')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STATISTICS & AUDIT FUNCTIONS
-- ============================================================================

-- Get entity access statistics
CREATE OR REPLACE FUNCTION get_entity_access_stats(p_entity_id UUID)
RETURNS TABLE(total_users INT, active_users INT, owners INT, cpas INT, collaborators INT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT user_id)::INT,
    COUNT(DISTINCT CASE WHEN is_active THEN user_id END)::INT,
    COUNT(DISTINCT CASE WHEN role = 'owner' AND is_active THEN user_id END)::INT,
    COUNT(DISTINCT CASE WHEN role = 'cpa' AND is_active THEN user_id END)::INT,
    COUNT(DISTINCT CASE WHEN role = 'collaborator' AND is_active THEN user_id END)::INT
  FROM entity_users
  WHERE entity_id = p_entity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get recent access changes for an entity
CREATE OR REPLACE FUNCTION get_entity_access_audit(p_entity_id UUID, p_limit INT DEFAULT 50)
RETURNS TABLE(user_id UUID, email TEXT, role TEXT, action TEXT, timestamp TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT
    eu.user_id,
    u.email,
    eu.role,
    CASE
      WHEN eu.is_active THEN 'granted'
      WHEN eu.revoked_at IS NOT NULL THEN 'revoked'
      ELSE 'unknown'
    END,
    GREATEST(eu.granted_at, COALESCE(eu.revoked_at, eu.granted_at))
  FROM entity_users eu
  JOIN users u ON u.id = eu.user_id
  WHERE eu.entity_id = p_entity_id
  ORDER BY GREATEST(eu.granted_at, COALESCE(eu.revoked_at, eu.granted_at)) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CLEANUP & MAINTENANCE FUNCTIONS
-- ============================================================================

-- Permanently delete revoked access records (use with caution!)
CREATE OR REPLACE FUNCTION cleanup_revoked_access(p_entity_id UUID DEFAULT NULL, p_days_ago INT DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
  v_rows_deleted INT;
BEGIN
  DELETE FROM entity_users
  WHERE is_active = false
  AND revoked_at < NOW() - (p_days_ago || ' days')::INTERVAL
  AND (p_entity_id IS NULL OR entity_id = p_entity_id);

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;

  RETURN jsonb_build_object(
    'status', 'success',
    'message', format('Permanently deleted %s revoked access records', v_rows_deleted),
    'rows_deleted', v_rows_deleted,
    'days_old_threshold', p_days_ago
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*

-- Example 1: Grant owner access to a new user
SELECT grant_entity_access(
  'doma-capital-uuid',
  'new-owner-uuid',
  'owner',
  'full',
  'existing-owner-uuid'
);

-- Example 2: Add a CPA with read-only financial access
SELECT grant_entity_access(
  'doma-capital-uuid',
  'cpa-user-uuid',
  'cpa',
  'financial_only',
  'owner-uuid'
);

-- Example 3: Check what entities a user has access to
SELECT * FROM get_user_entities('user-uuid');

-- Example 4: Get all users in an entity
SELECT * FROM get_entity_users('doma-capital-uuid');

-- Example 5: Check if user is owner
SELECT is_entity_owner('doma-capital-uuid', 'user-uuid');

-- Example 6: Revoke access
SELECT revoke_entity_access(
  'doma-capital-uuid',
  'old-user-uuid',
  'revoker-uuid'
);

-- Example 7: Get access statistics
SELECT * FROM get_entity_access_stats('doma-capital-uuid');

-- Example 8: Get recent changes
SELECT * FROM get_entity_access_audit('doma-capital-uuid', 10);

-- Example 9: Check if user can write
SELECT can_write_entity('doma-capital-uuid', 'user-uuid');

-- Example 10: Cleanup old revoked records (30+ days old)
SELECT cleanup_revoked_access(NULL, 30);

*/

-- ============================================================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================================================

-- Allow authenticated users to call these functions
GRANT EXECUTE ON FUNCTION grant_entity_access TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_entity_access TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_entities TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_user_access_level TO authenticated;
GRANT EXECUTE ON FUNCTION is_entity_owner TO authenticated;
GRANT EXECUTE ON FUNCTION is_entity_cpa TO authenticated;
GRANT EXECUTE ON FUNCTION has_entity_access TO authenticated;
GRANT EXECUTE ON FUNCTION can_write_entity TO authenticated;
GRANT EXECUTE ON FUNCTION can_read_financial TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_access_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_access_audit TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_revoked_access TO authenticated;

-- Restrict sensitive functions to owners (in application logic)
-- Note: These are DEFINER functions, so they run with full privileges
-- Your app should still check role before calling grant_entity_access
