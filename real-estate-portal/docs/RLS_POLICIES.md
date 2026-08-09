# Row-Level Security (RLS) Policies — Strict Entity & Role Isolation

## Overview

This document describes the stricter RLS policies that enforce:
- **Entity isolation**: Users only see data for entities they're assigned to
- **Role-based access**: `owner` (full CRUD) vs `cpa`/`collaborator` (read-only)
- **Sensitive data protection**: Business/legal information restricted to owners
- **Explicit access control**: No implicit access; all users must be added to `entity_users`

## Key Changes from Previous RLS

### Before (Permissive)
```sql
-- ❌ INSECURE: Everyone can read everything
CREATE POLICY "users_read_all_entities" ON entities FOR SELECT USING (true);
CREATE POLICY "users_read_properties" ON properties FOR SELECT USING (true);
```

### After (Strict)
```sql
-- ✅ SECURE: Users only see assigned entities
CREATE POLICY "users_read_assigned_entities" ON entities
  FOR SELECT
  USING (
    id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
```

---

## Access Control Model

### User Roles in `entity_users` Junction Table

| Role | Access Level | Permissions |
|------|--------------|-------------|
| **owner** | Full | Can READ & WRITE all entity data, GRANT/REVOKE other users |
| **cpa** | Financial Only | Can READ-ONLY financial records & business legal info |
| **collaborator** | Read-Only | Can READ-ONLY all entity data |

### Access Levels (Stored in `entity_users.access_level`)

| Level | CRUD Permissions | Use Case |
|-------|------------------|----------|
| **full** | Create, Read, Update, Delete | Entity owner |
| **financial_only** | Read only financial data | CPA/accountant |
| **read_only** | Read all data | Property manager, agent |

---

## Entity-Users Junction Table

The new `entity_users` table explicitly defines access relationships:

```sql
CREATE TABLE entity_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'cpa', 'collaborator')),
  access_level TEXT NOT NULL CHECK (access_level IN ('full', 'financial_only', 'read_only')),
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id), -- Who granted this access
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES users(id), -- Who revoked it
  UNIQUE(entity_id, user_id)
);
```

### Why This Matters

1. **Explicit over implicit**: Access is granted explicitly, not inferred
2. **Audit trail**: `granted_by`, `granted_at`, `revoked_by`, `revoked_at` track history
3. **Soft delete**: `is_active = false` allows revoking access without data loss
4. **Multi-entity support**: Users can have different roles across multiple entities

---

## RLS Policy Strategy

### Pattern 1: Owner-Only Write, Anyone (in entity) Read

Used for tables like `properties`, `mortgages`, `insurance_policies`, etc.

```sql
-- READ: Anyone with entity access
CREATE POLICY "users_read_X_of_assigned_entities" ON X
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- WRITE: Only owners
CREATE POLICY "owners_insert_X" ON X
  FOR INSERT
  WITH CHECK (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );
```

### Pattern 2: Sensitive Data (Owner Read/Write Only)

Used for `business_legal_info` — CPAs can only read, never write:

```sql
-- READ: Anyone with entity access (but can only see decrypted if privileged)
CREATE POLICY "users_read_business_legal_info" ON business_legal_info
  FOR SELECT
  USING (
    entity_id IN (
      SELECT DISTINCT entity_id FROM entity_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- WRITE: Only owners
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
  WITH CHECK (...);
```

---

## Covered Tables & Their Policies

### Entities Table
- **READ**: Users assigned to entity
- **UPDATE**: Only owners
- **DELETE**: ❌ Blocked (no policy)

### Properties Table
- **READ**: All assigned users
- **INSERT/UPDATE/DELETE**: Only owners

### Child Tables (mortgages, insurance, utilities, tenants, property_managers, renovations, comparable_properties)
- **READ**: All assigned users
- **WRITE**: Only owners
- **Pattern**: Check `entity_id` via `properties` FK

### Documents Table
- **READ**: All assigned users
- **INSERT**: Only owners (require `uploaded_by = auth.uid()`)
- **DELETE**: Only owners

### Financial_Records Table
- **READ**: All assigned users
- **WRITE**: Only owners

### Business_Legal_Info Table (SENSITIVE)
- **READ**: All assigned users
- **WRITE**: Only owners

### Business_Legal_Info_Audit_Log Table
- **READ**: All assigned users
- **INSERT**: ❌ Blocked for users (only backend service account)
- **Rationale**: Audit logs must be immutable, appended by backend only

### Sync_Logs Table
- **READ**: All assigned users
- **WRITE**: Only owners (in practice, backend service)

---

## Security Features

### 1. Encryption at Rest
Business legal info uses pgcrypto for sensitive fields:
- Tax ID
- Bank routing/account numbers
- Principal owner SSN, name, email
- Personal phone

**Note**: RLS + encryption = defense in depth
- RLS prevents unauthorized queries
- Encryption prevents data leakage if DB backup compromised

### 2. Audit Trail
`business_legal_info_audit_log` tracks every access:
- User ID, action, fields accessed
- IP address, user agent (if available)
- Timestamp

### 3. Active/Inactive Toggle
`entity_users.is_active = false` immediately revokes access without deletion.

```sql
UPDATE entity_users SET is_active = false WHERE id = '...'
-- User loses access immediately; historical record remains
```

### 4. Role-Based Views
Helper functions simplify frontend logic:

```sql
-- Check if current user owns entity
SELECT is_entity_owner('entity-uuid');

-- Get user's role for entity
SELECT get_entity_user_role('entity-uuid'); -- Returns 'owner', 'cpa', 'collaborator', 'none'

-- Check if user has any access
SELECT has_entity_access('entity-uuid');
```

---

## Deployment Steps

### Step 1: Backup Database
```bash
pg_dump postgres://user:pass@host/dbname > backup_$(date +%s).sql
```

### Step 2: Apply Migration
```bash
supabase migration up
# OR manually run 003_strict_rls_policies.sql
```

### Step 3: Populate `entity_users` Junction Table

**For existing owners** (assuming you have user-entity mapping):
```sql
INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by)
SELECT 
  p.entity_id,
  u.id,
  u.role,
  'full',
  u.id
FROM properties p
CROSS JOIN users u
WHERE u.role = 'owner'
ON CONFLICT (entity_id, user_id) DO NOTHING;
```

**For CPAs** (read-only access to financial data):
```sql
INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by)
VALUES 
  ('doma-capital-uuid', 'cpa-user-uuid', 'cpa', 'financial_only', 'owner-user-uuid'),
  ('domillo-holdings-uuid', 'cpa-user-uuid', 'cpa', 'financial_only', 'owner-user-uuid');
```

**For collaborators** (read-only property managers, agents):
```sql
INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by)
VALUES 
  ('doma-capital-uuid', 'agent-user-uuid', 'collaborator', 'read_only', 'owner-user-uuid');
```

### Step 4: Test Access (Per Entity)

**Test as owner (should see all)**:
```sql
SELECT * FROM entities WHERE id = 'doma-capital-uuid'; -- ✅ Returns data

SELECT * FROM properties WHERE entity_id = 'doma-capital-uuid'; -- ✅ Returns properties

INSERT INTO properties (...) VALUES (...); -- ✅ Allowed

UPDATE properties SET ... WHERE id = '...'; -- ✅ Allowed
```

**Test as CPA (should see read-only)**:
```sql
SELECT * FROM financial_records WHERE entity_id = 'doma-capital-uuid'; -- ✅ Returns

SELECT * FROM business_legal_info WHERE entity_id = 'doma-capital-uuid'; -- ✅ Returns (read-only)

INSERT INTO financial_records (...) VALUES (...); -- ❌ RLS: Permission denied

UPDATE properties SET ... WHERE id = '...'; -- ❌ RLS: Permission denied
```

**Test as unauthorized user** (should see nothing):
```sql
SELECT * FROM entities WHERE id = 'doma-capital-uuid'; -- ❌ 0 rows (RLS filtered)

SELECT * FROM properties WHERE entity_id = 'doma-capital-uuid'; -- ❌ 0 rows
```

### Step 5: Update Application Code

**Frontend can now trust RLS**:
```javascript
// OLD: Frontend had to manually filter
const visibleEntities = entities.filter(e => e.userId === currentUser.id);

// NEW: RLS guarantees this is all user can see
const visibleEntities = await supabase
  .from('entities')
  .select('*')
  // RLS automatically filters to user's assigned entities only
```

**Backend can simplify queries**:
```javascript
// No need to manually add WHERE clauses; RLS enforces them
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('entity_id', entityId);
  // RLS checks: is user assigned to this entity? If no, empty result
```

---

## Handling Special Cases

### Case 1: Multi-Entity User (Owner for 2, CPA for 1)

```sql
INSERT INTO entity_users (entity_id, user_id, role, access_level, granted_by) VALUES
  ('doma-capital-uuid', 'user-uuid', 'owner', 'full', 'user-uuid'),
  ('domillo-holdings-uuid', 'user-uuid', 'owner', 'full', 'user-uuid'),
  ('jagg-uuid', 'user-uuid', 'cpa', 'financial_only', 'jagg-owner-uuid');

-- User now has full control over Doma & Domillo, read-only on JAGG financial data
SELECT * FROM entities; -- Returns 3 entities (one as owner, others as CPA)

SELECT * FROM properties WHERE entity_id = 'jagg-uuid'; -- ❌ RLS: cannot see (CPA, not owner)
SELECT * FROM financial_records WHERE entity_id = 'jagg-uuid'; -- ✅ Can see (CPA role grants read)
```

### Case 2: Revoking Access

```sql
-- Soft delete (preferred)
UPDATE entity_users
SET is_active = false, revoked_at = NOW(), revoked_by = 'owner-user-uuid'
WHERE entity_id = 'doma-capital-uuid' AND user_id = 'agent-user-uuid';

-- User immediately loses access; audit trail preserved
SELECT * FROM entities WHERE id = 'doma-capital-uuid'; -- ❌ Now returns 0 rows
```

### Case 3: Promoting CPA to Owner

```sql
UPDATE entity_users
SET role = 'owner', access_level = 'full'
WHERE entity_id = 'doma-capital-uuid' AND user_id = 'cpa-user-uuid';

-- User now has write access
INSERT INTO properties (...) VALUES (...); -- ✅ Now allowed
```

---

## Performance Considerations

### Indexes Created

```sql
CREATE INDEX idx_entity_users_entity_id ON entity_users(entity_id);
CREATE INDEX idx_entity_users_user_id ON entity_users(user_id);
CREATE INDEX idx_entity_users_active ON entity_users(is_active) WHERE is_active = true;
```

### RLS Performance Impact

RLS policies add a subquery check for each row. To minimize overhead:

1. **Use indexed columns in WHERE clauses** ✅
   ```sql
   -- GOOD: Indexes on entity_users(user_id, is_active)
   WHERE user_id = auth.uid() AND is_active = true
   ```

2. **Avoid correlated subqueries** ⚠️
   ```sql
   -- These are efficient because entity_users is indexed:
   SELECT DISTINCT entity_id FROM entity_users WHERE user_id = auth.uid()
   ```

3. **Monitor query plans**:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM properties WHERE entity_id IN (
     SELECT DISTINCT entity_id FROM entity_users
     WHERE user_id = 'user-uuid' AND is_active = true
   );
   ```

---

## Troubleshooting

### Issue: "Permission denied" on query I should have access to

**Root causes**:
1. User not in `entity_users` table → `INSERT` into `entity_users`
2. `entity_users.is_active = false` → `UPDATE` to set `is_active = true`
3. Wrong `entity_id` in query → Verify entity UUID

**Diagnosis**:
```sql
-- Check if user-entity relationship exists
SELECT * FROM entity_users
WHERE user_id = 'user-uuid'
AND entity_id = 'entity-uuid'
AND is_active = true;
-- If 0 rows, access is revoked/never granted

-- Check all entities user has access to
SELECT entity_id, role, access_level
FROM entity_users
WHERE user_id = 'user-uuid'
AND is_active = true;
```

### Issue: CPA can write to `properties` (should be read-only)

**Root cause**: RLS policies allow all roles to write if in `entity_users`

**Solution**: Add role-based CHECK:
```sql
-- Stricter policy: only 'owner' role can write
CREATE POLICY "only_owners_write_properties" ON properties
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM entity_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = true
    )
  );
```

This is already implemented in the migration.

### Issue: Audit logs showing zero rows for CPA

**Expected behavior**: CPAs can READ audit logs, but cannot INSERT.

```sql
-- CPA can read (RLS allows)
SELECT * FROM business_legal_info_audit_log WHERE business_legal_info_id = '...'; -- ✅ Returns rows

-- CPA cannot insert (RLS blocks)
INSERT INTO business_legal_info_audit_log (...) VALUES (...); -- ❌ Permission denied
```

**Workaround**: Backend service account (with `BYPASS RLS` privilege) inserts on behalf of users:
```javascript
// Backend (with elevated privileges)
const { data, error } = await supabaseAdmin
  .from('business_legal_info_audit_log')
  .insert({
    business_legal_info_id: '...',
    user_id: currentUser.id,
    action: 'view',
    field_accessed: ['tax_id_last_four'],
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
  });
```

---

## Testing Checklist

- [ ] **Owner Access**: Can read/write all data for assigned entities
- [ ] **CPA Access**: Can read financial/legal data; cannot write
- [ ] **Collaborator Access**: Can read all data; cannot write
- [ ] **Unauthorized**: Cannot see unassigned entities (0 rows returned)
- [ ] **Revoked Access**: `is_active = false` immediately denies queries
- [ ] **Promotion**: Changing role from CPA to owner grants write access
- [ ] **Audit Trail**: All access to sensitive data logged (with backend)
- [ ] **Multi-entity**: User with multiple roles sees correct data per entity

---

## References

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Migration File](../../supabase/migrations/003_strict_rls_policies.sql)
