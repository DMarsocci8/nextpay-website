# Business Legal Info Table - Encryption Guide

## Overview

The `business_legal_info` table stores sensitive business and legal information with pgcrypto encryption for sensitive fields. This guide explains how to work with encrypted data.

## Encrypted Fields

The following fields are encrypted using pgcrypto AES encryption:

| Field | Type | Purpose |
|-------|------|---------|
| `tax_id_encrypted` | BYTEA | EIN, SSN, or other tax ID |
| `primary_bank_routing_encrypted` | BYTEA | Primary bank routing number |
| `primary_bank_account_encrypted` | BYTEA | Primary bank account number |
| `secondary_bank_routing_encrypted` | BYTEA | Secondary bank routing number |
| `secondary_bank_account_encrypted` | BYTEA | Secondary bank account number |
| `principal_owner_name_encrypted` | BYTEA | Owner's full name |
| `principal_owner_ssn_encrypted` | BYTEA | Owner's Social Security Number |
| `principal_phone_encrypted` | BYTEA | Owner's personal phone number |
| `principal_email_encrypted` | BYTEA | Owner's personal email address |

## Reference Fields (Not Encrypted)

Last-four fields are kept plaintext for display and reference purposes only:
- `tax_id_last_four` - Last 4 digits of tax ID
- `primary_bank_account_last_four` - Last 4 digits of primary account
- `secondary_bank_account_last_four` - Last 4 digits of secondary account
- `principal_owner_ssn_last_four` - Last 4 digits of owner's SSN

These are populated automatically by the `update_business_legal_info_last_four()` trigger.

## Encryption Functions

### encrypt_sensitive(plaintext TEXT, encryption_key TEXT)

Encrypts plaintext data using AES encryption with pgcrypto.

**Default encryption key:** `'nextpay_encryption_key'` (should be changed in production)

**Example:**
```sql
-- Encrypt a tax ID
SELECT encrypt_sensitive('12-3456789') as encrypted_tax_id;

-- Encrypt with custom key
SELECT encrypt_sensitive('12-3456789', 'your-custom-key') as encrypted;
```

### decrypt_sensitive(ciphertext BYTEA, encryption_key TEXT)

Decrypts encrypted data back to plaintext.

**Example:**
```sql
-- Decrypt a tax ID
SELECT decrypt_sensitive(tax_id_encrypted) 
FROM business_legal_info 
WHERE entity_id = '123e4567-e89b-12d3-a456-426614174000';

-- Decrypt with custom key
SELECT decrypt_sensitive(tax_id_encrypted, 'your-custom-key') 
FROM business_legal_info;
```

## Database Operations

### Inserting Encrypted Data

When inserting data, use the `encrypt_sensitive()` function:

```sql
INSERT INTO business_legal_info (
  entity_id,
  business_type,
  legal_business_name,
  dba_name,
  tax_id_type,
  tax_id_encrypted,
  primary_bank_name,
  primary_bank_routing_encrypted,
  primary_bank_account_encrypted,
  principal_owner_name_encrypted,
  principal_owner_ssn_encrypted
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'llc',
  'My Business LLC',
  'My Business',
  'ein',
  encrypt_sensitive('12-3456789'),
  'Chase Bank',
  encrypt_sensitive('021000021'),
  encrypt_sensitive('9876543210'),
  encrypt_sensitive('John Doe'),
  encrypt_sensitive('123-45-6789')
);

-- The trigger will automatically populate:
-- - tax_id_last_four = '6789'
-- - primary_bank_account_last_four = '3210'
-- - principal_owner_ssn_last_four = '6789'
```

### Updating Encrypted Data

```sql
UPDATE business_legal_info
SET 
  primary_bank_account_encrypted = encrypt_sensitive('1111111111'),
  updated_at = NOW()
WHERE entity_id = '123e4567-e89b-12d3-a456-426614174000';

-- The trigger will automatically update the last_four field
```

### Querying Encrypted Data

To retrieve encrypted data, you must decrypt it:

```sql
-- Decrypt and display
SELECT 
  id,
  entity_id,
  legal_business_name,
  decrypt_sensitive(tax_id_encrypted) as tax_id,
  tax_id_last_four,
  decrypt_sensitive(principal_owner_name_encrypted) as principal_owner,
  primary_bank_account_last_four
FROM business_legal_info
WHERE entity_id = '123e4567-e89b-12d3-a456-426614174000';
```

### Viewing Only Last-Four Values

To display masked data without decryption:

```sql
SELECT 
  id,
  legal_business_name,
  tax_id_type,
  tax_id_last_four,
  primary_bank_name,
  '****' || primary_bank_account_last_four as masked_account,
  'xxxx-xx-' || principal_owner_ssn_last_four as masked_ssn
FROM business_legal_info
WHERE entity_id = '123e4567-e89b-12d3-a456-426614174000';
```

## Application Layer Examples

### Using Supabase Client (JavaScript/TypeScript)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Insert with encryption
const { data, error } = await supabase
  .from('business_legal_info')
  .insert({
    entity_id: entityId,
    business_type: 'llc',
    legal_business_name: 'My Business LLC',
    tax_id_type: 'ein',
    tax_id_encrypted: await encryptData('12-3456789'),
    primary_bank_name: 'Chase',
    primary_bank_routing_encrypted: await encryptData('021000021'),
    primary_bank_account_encrypted: await encryptData('9876543210'),
  });

// Query and decrypt
const { data, error } = await supabase
  .from('business_legal_info')
  .select('*')
  .eq('entity_id', entityId)
  .single();

// Decrypt specific fields
const taxId = await decryptData(data.tax_id_encrypted);
const accountNumber = await decryptData(data.primary_bank_account_encrypted);
```

### Custom Node.js Encryption Helper

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'nextpay_encryption_key';

export async function encryptBusinessLegalInfo(info: {
  entity_id: string;
  business_type: string;
  legal_business_name: string;
  tax_id_type: string;
  tax_id: string;
  primary_bank_name: string;
  primary_bank_routing: string;
  primary_bank_account: string;
  principal_owner_name: string;
  principal_owner_ssn: string;
}) {
  // Encrypt sensitive fields via database function
  const { data, error } = await supabase
    .rpc('encrypt_sensitive', {
      plaintext: info.tax_id,
      encryption_key: ENCRYPTION_KEY
    });

  if (error) throw error;

  // Insert with encrypted data
  return supabase
    .from('business_legal_info')
    .insert({
      entity_id: info.entity_id,
      business_type: info.business_type,
      legal_business_name: info.legal_business_name,
      tax_id_type: info.tax_id_type,
      tax_id_encrypted: data,
      primary_bank_name: info.primary_bank_name,
      // ... encrypt other fields similarly
    });
}

export async function decryptBusinessLegalInfo(id: string) {
  // Get encrypted record
  const { data: record, error } = await supabase
    .from('business_legal_info')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  // Decrypt sensitive fields
  const { data: taxId } = await supabase
    .rpc('decrypt_sensitive', {
      ciphertext: record.tax_id_encrypted,
      encryption_key: ENCRYPTION_KEY
    });

  return {
    ...record,
    tax_id: taxId,
    // ... decrypt other fields
  };
}
```

## Security Best Practices

1. **Encryption Key Management**
   - Never commit the encryption key to version control
   - Store it in environment variables or a secure key management service
   - Rotate keys periodically
   - Use a strong, random encryption key (min 32 characters)

2. **Access Control**
   - RLS policies restrict read access to authorized users only
   - Only admin users should be able to decrypt sensitive data
   - Consider implementing additional application-level access controls

3. **Audit Logging**
   - The `business_legal_info_audit_log` table tracks all access to sensitive data
   - Always log who accessed what data and when
   - Review audit logs regularly for suspicious activity

4. **Data Transmission**
   - Always use HTTPS/TLS when transmitting decrypted data
   - Never log decrypted sensitive data
   - Clear decrypted data from memory after use

5. **Backup & Recovery**
   - Backup the encryption key separately from database backups
   - Test recovery procedures regularly
   - Ensure encrypted backups are stored securely

## Changing the Encryption Key

To change the encryption key, you must:

1. Decrypt all data with the old key
2. Re-encrypt with the new key
3. Update the functions to use the new key

**Example migration:**
```sql
-- Create backup table
CREATE TABLE business_legal_info_backup AS 
SELECT * FROM business_legal_info;

-- Update function with new key
CREATE OR REPLACE FUNCTION encrypt_sensitive(plaintext TEXT, encryption_key TEXT DEFAULT 'new_encryption_key')
RETURNS BYTEA AS $$
BEGIN
  RETURN pgcrypto.encrypt(convert_to(plaintext, 'UTF8'), convert_to(encryption_key, 'UTF8'), 'aes');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Re-encrypt all data
UPDATE business_legal_info
SET 
  tax_id_encrypted = encrypt_sensitive(decrypt_sensitive(tax_id_encrypted, 'old_key'), 'new_key'),
  primary_bank_routing_encrypted = encrypt_sensitive(decrypt_sensitive(primary_bank_routing_encrypted, 'old_key'), 'new_key'),
  -- ... repeat for all encrypted fields
WHERE tax_id_encrypted IS NOT NULL;
```

## Troubleshooting

### "ERROR: pgcrypto extension not found"
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Cannot decrypt data (wrong key or corrupted)
- Verify the encryption key is correct
- Check that the ciphertext is valid BYTEA format
- Ensure the data wasn't corrupted during storage

### Last-four fields not populating
- The trigger runs on INSERT/UPDATE
- Manually update the trigger:
```sql
UPDATE business_legal_info
SET updated_at = NOW()
WHERE tax_id_last_four IS NULL;
```

## Performance Considerations

- Encrypted fields are stored as BYTEA, which is larger than plaintext
- Encryption/decryption operations are CPU-intensive
- Consider caching decrypted values temporarily for display purposes
- Index on `entity_id` and other non-encrypted fields only
- Last-four fields are indexed for quick access to masked data

## Compliance

This encryption scheme supports compliance with:
- PCI DSS (for payment card data)
- SOC 2 Type II
- GDPR data protection requirements
- CCPA sensitive personal information protection

Audit logs can help demonstrate compliance with data access regulations.
