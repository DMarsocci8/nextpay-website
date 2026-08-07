#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Credentials from environment or hardcoded (for one-time execution)
const supabaseUrl = process.env.SUPABASE_URL || 'https://bgqdwaoyaayeeweqdtxlw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncWR3YW92YXlhZWV3cWR0eGl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NzgxOCwiZXhwIjoyMTAxNjczODE4fQ._Xy4JueSg_ITTnMT7hLFF3_QMbqo9hI9lNfGF_0NumU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
    console.log(`📂 Reading migration from: ${migrationPath}`);

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log(`✅ Migration file loaded (${sql.length} bytes)`);

    // Split by semicolon and filter out empty statements and comments
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements`);
    console.log('🚀 Executing migration...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' });

        if (error) {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} error:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration complete: ${successCount} succeeded, ${errorCount} failed`);

    if (errorCount === 0) {
      console.log('\n🎉 Database schema created successfully!');
      console.log('✨ Tables created: entities, users, properties, mortgages, insurance_policies, utilities, tenants, property_managers, renovations, comparable_properties, documents, financial_records, sync_logs');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Fatal error:', err.message);
    process.exit(1);
  }
}

runMigration();
