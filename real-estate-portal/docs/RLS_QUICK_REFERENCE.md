# RLS Quick Reference — Common Operations

## TL;DR: Key Concepts

| What | How |
|------|-----|
| **User access** | Managed via `entity_users` junction table (not automatic) |
| **Ownership** | Only `role = 'owner'` can WRITE; others READ-ONLY |
| **Data visibility** | Users only see entities they're explicitly assigned to |
| **Revoking access** | `UPDATE entity_users SET is_active = false` (soft delete) |
| **Helper functions** | Use `grant_entity_access()`, `revoke_entity_access()`, etc. |

---

## Grant Access

### Add User as Owner
```sql
SELECT grant_entity_access(
  'entity-uuid',
  'new-user-uuid',
  'owner',          -- Full read/write control
  'full',
  'granter-user-uuid'
);
```

### Add User as CPA (Read-Only Financial)
```sql
SELECT grant_entity_access(
  'entity-uuid',
  'cpa-email@example.com',  -- User must already exist
  'cpa',            -- Read-only to financial/legal data
  'financial_only',
  'granter-user-uuid'
);
```

### Add User as Collaborator (Read-Only All)
```sql
SELECT grant_entity_access(
  'entity-uuid',
  'agent-user-uuid',
  'collaborator',   -- Read-only to all data
  'read_only',
  'granter-user-uuid'
);
```

---

## Revoke Access

### Immediately Revoke Access
```sql
SELECT revoke_entity_access(
  'entity-uuid',
  'user-uuid-to-revoke',
  'revoker-user-uuid'  -- Usually the owner
);
```

**Result**: User loses access immediately; audit trail remains.

---

## Check Permissions

### What Entities Does User X Have Access To?
```sql
SELECT * FROM get_user_entities('user-uuid');
```

**Returns**:
```
entity_id  | entity_name      | entity_slug       | user_role    | access_level      | is_active
-----------|------------------|-------------------|--------------|-------------------|----------
abc123...  | Doma Capital     | doma_capital      | owner        | full              | true
def456...  | Domillo Holdings | domillo_holdings  | cpa          | financial_only    | true
ghi789...  | JAGG LLC         | jagg              | collaborator | read_only         | false
```

### Who Has Access to Entity X?
```sql
SELECT * FROM get_entity_users('entity-uuid');
```

**Returns**:
```
user_id    | email                    | full_name       | role         | access_level      | is_active | granted_at
-----------|--------------------------|-----------------|--------------|-------------------|-----------|------------------
abc123...  | owner@example.com        | Owner Name      | owner        | full              | true      | 2026-01-15
def456...  | cpa@example.com          | CPA Name        | cpa          | financial_only    | true      | 2026-06-20
ghi789...  | agent@example.com        | Agent Name      | collaborator | read_only         | false     | 2025-11-10
```

### Is User X an Owner of Entity Y?
```sql
SELECT is_entity_owner('entity-uuid', 'user-uuid');
```

**Result**: `true` or `false`

### Can User X Write to Entity Y?
```sql
SELECT can_write_entity('entity-uuid', 'user-uuid');
```

**Result**: `true` (owner only) or `false` (read-only)

### What Role Does User X Have for Entity Y?
```sql
SELECT get_entity_user_role('entity-uuid', 'user-uuid');
```

**Result**: `'owner'`, `'cpa'`, `'collaborator'`, or `'none'`

---

## Common Scenarios

### Scenario 1: Adding a Spouse as Co-Owner

```sql
-- First, ensure the spouse is a Supabase user
-- (They must sign up or be invited)

-- Grant ownership
SELECT grant_entity_access(
  'doma-capital-uuid',
  'spouse-user-id',
  'owner',
  'full',
  auth.uid()  -- Current owner granting
);
```

### Scenario 2: Hiring a CPA

```sql
-- Invite CPA to Supabase first, get their user UUID

-- Grant CPA read-only access
SELECT grant_entity_access(
  'doma-capital-uuid',
  'cpa-user-id',
  'cpa',
  'financial_only',
  'owner-user-id'
);

-- CPA can now:
-- ✅ READ financial records
-- ✅ READ business/legal info
-- ✅ VIEW properties (but NOT edit)
-- ✅ SEE documents

-- CPA cannot:
-- ❌ UPDATE properties
-- ❌ INSERT financial records
-- ❌ MODIFY business info
```

### Scenario 3: Granting Access to Property Manager

```sql
SELECT grant_entity_access(
  'doma-capital-uuid',
  'property-manager-user-id',
  'collaborator',
  'read_only',
  'owner-user-id'
);

-- Property manager can:
-- ✅ VIEW all property details
-- ✅ READ tenant/mortgage info
-- ✅ SEE documents

-- Property manager cannot:
-- ❌ EDIT anything
-- ❌ GRANT access to others
-- ❌ DELETE properties
```

### Scenario 4: Promoting CPA to Co-Owner

```sql
-- After working together for a while, make CPA a co-owner

UPDATE entity_users
SET role = 'owner', access_level = 'full'
WHERE entity_id = 'doma-capital-uuid'
AND user_id = 'cpa-user-id';

-- Now CPA has full write access
```

### Scenario 5: Changing User from One Role to Another

```sql
-- Change from collaborator to CPA (read-only financial)
UPDATE entity_users
SET role = 'cpa', access_level = 'financial_only'
WHERE entity_id = 'doma-capital-uuid'
AND user_id = 'user-id';

-- Change from cpa to collaborator (read-only all data)
UPDATE entity_users
SET role = 'collaborator', access_level = 'read_only'
WHERE entity_id = 'doma-capital-uuid'
AND user_id = 'user-id';
```

### Scenario 6: Temporarily Suspend Access (Without Deleting)

```sql
-- CPA needs time off, suspend access for 3 months
UPDATE entity_users
SET is_active = false, revoked_at = NOW(), revoked_by = 'owner-id'
WHERE entity_id = 'doma-capital-uuid'
AND user_id = 'cpa-id';

-- When CPA returns, re-activate
UPDATE entity_users
SET is_active = true, revoked_at = NULL, revoked_by = NULL
WHERE entity_id = 'doma-capital-uuid'
AND user_id = 'cpa-id';
```

### Scenario 7: Audit Access Changes for Compliance

```sql
-- Get all access grants/revokes for an entity (last 50 changes)
SELECT * FROM get_entity_access_audit('doma-capital-uuid', 50);
```

**Returns**: Who has access, when they got it, when revoked

### Scenario 8: User Has Multiple Roles Across Entities

```sql
-- Owner for Doma Capital, CPA for JAGG, Collaborator for Domillo

SELECT * FROM get_user_entities('user-uuid');

-- Result:
-- doma-capital    | owner        | full
-- jagg            | cpa          | financial_only
-- domillo-holdings| collaborator | read_only
```

---

## Data Access Patterns by Role

### Owner (Full Access)
```sql
-- Can READ everything
SELECT * FROM properties WHERE entity_id = 'X';
SELECT * FROM financial_records WHERE entity_id = 'X';
SELECT * FROM business_legal_info WHERE entity_id = 'X';

-- Can WRITE everything
INSERT INTO properties (...) VALUES (...);
UPDATE financial_records SET ... WHERE id = 'Y';
UPDATE business_legal_info SET ... WHERE entity_id = 'X';

-- Can GRANT/REVOKE access
SELECT grant_entity_access(...);
SELECT revoke_entity_access(...);
```

### CPA (Read-Only Financial)
```sql
-- Can READ financial & legal data
SELECT * FROM financial_records WHERE entity_id = 'X';        -- ✅ Allowed
SELECT * FROM business_legal_info WHERE entity_id = 'X';      -- ✅ Allowed
SELECT * FROM properties WHERE entity_id = 'X';               -- ✅ Allowed

-- Cannot WRITE anything
INSERT INTO financial_records (...) VALUES (...);              -- ❌ RLS: Permission denied
UPDATE business_legal_info SET ... WHERE entity_id = 'X';     -- ❌ RLS: Permission denied
UPDATE properties SET ... WHERE id = 'Y';                      -- ❌ RLS: Permission denied

-- Cannot GRANT access
SELECT grant_entity_access(...);                               -- ❌ Function check fails
```

### Collaborator (Read-Only All)
```sql
-- Can READ all data
SELECT * FROM properties WHERE entity_id = 'X';               -- ✅ Allowed
SELECT * FROM tenants WHERE property_id IN (...);             -- ✅ Allowed
SELECT * FROM documents WHERE entity_id = 'X';                -- ✅ Allowed

-- Cannot WRITE anything
INSERT INTO properties (...) VALUES (...);                     -- ❌ RLS: Permission denied
UPDATE mortgages SET ... WHERE id = 'Y';                       -- ❌ RLS: Permission denied

-- Cannot GRANT access
SELECT grant_entity_access(...);                               -- ❌ Function check fails
```

---

## Troubleshooting

### Problem: User Can't See Entities
```sql
-- Check if user is in entity_users
SELECT * FROM entity_users
WHERE entity_id = 'X'
AND user_id = 'Y'
AND is_active = true;

-- If 0 rows:
-- 1. User not assigned, OR
-- 2. Access was revoked (is_active = false), OR
-- 3. Wrong entity_id/user_id

-- Solution: Grant access
SELECT grant_entity_access('X', 'Y', 'collaborator', 'read_only', 'owner-id');
```

### Problem: CPA Can Write to Properties (Should Be Read-Only)

**This shouldn't happen if migration was applied correctly.**

If it does:
1. Check user's role:
   ```sql
   SELECT role FROM entity_users
   WHERE entity_id = 'X' AND user_id = 'Y';
   ```
2. If role is not 'owner', the RLS policies should block writes
3. If write still works, there may be a bypass:
   - Check for `BYPASS RLS` privilege on the user
   - Check that RLS is enabled on the table: `SELECT relrowsecurity FROM pg_class WHERE relname = 'properties';`

### Problem: "Permission Denied" When I Should Have Access

```sql
-- Diagnosis steps

-- 1. Am I assigned to the entity?
SELECT * FROM entity_users WHERE user_id = auth.uid();

-- 2. Is my access active?
SELECT * FROM entity_users
WHERE user_id = auth.uid()
AND is_active = true;

-- 3. What role do I have?
SELECT get_entity_user_role('entity-uuid', auth.uid());

-- 4. Can I write?
SELECT can_write_entity('entity-uuid', auth.uid());
```

### Problem: Queries are Slow

RLS adds subquery checks. Optimize:

```sql
-- Check query plan
EXPLAIN ANALYZE
SELECT * FROM properties WHERE entity_id = 'X';

-- Good plan should use indexes:
-- - idx_entity_users_user_id
-- - idx_entity_users_active
-- - idx_properties_entity_id

-- If missing indexes, create them (already done in migration):
CREATE INDEX IF NOT EXISTS idx_entity_users_user_id ON entity_users(user_id);
CREATE INDEX IF NOT EXISTS idx_entity_users_active ON entity_users(is_active);
```

---

## Cheat Sheet

```sql
-- GRANT ACCESS
SELECT grant_entity_access('entity-id', 'user-id', 'owner|cpa|collaborator', 'full|financial_only|read_only', 'granter-id');

-- REVOKE ACCESS
SELECT revoke_entity_access('entity-id', 'user-id', 'revoker-id');

-- CHECK ACCESS
SELECT * FROM get_user_entities('user-id');                   -- What entities does user have?
SELECT * FROM get_entity_users('entity-id');                  -- Who can access entity?
SELECT is_entity_owner('entity-id', 'user-id');               -- Is user an owner?
SELECT can_write_entity('entity-id', 'user-id');              -- Can user write?
SELECT get_entity_user_role('entity-id', 'user-id');          -- What's user's role?
SELECT can_read_financial('entity-id', 'user-id');            -- Can user read financial?

-- STATS
SELECT * FROM get_entity_access_stats('entity-id');           -- How many users of each role?
SELECT * FROM get_entity_access_audit('entity-id', 50);       -- Recent access changes?

-- CLEANUP (30+ day old revoked records)
SELECT cleanup_revoked_access(NULL, 30);

-- RE-ACTIVATE (After suspension)
UPDATE entity_users SET is_active = true, revoked_at = NULL, revoked_by = NULL
WHERE entity_id = 'X' AND user_id = 'Y';
```

---

## Related Documentation

- **Full RLS Details**: [RLS_POLICIES.md](./RLS_POLICIES.md)
- **Setup Steps**: [RLS_POLICIES.md#deployment-steps](./RLS_POLICIES.md#deployment-steps)
- **Helper Functions**: [manage_entity_access.sql](../supabase/helpers/manage_entity_access.sql)
- **Migration File**: [003_strict_rls_policies.sql](../supabase/migrations/003_strict_rls_policies.sql)
