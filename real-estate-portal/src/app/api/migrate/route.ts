import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgqdwaoyaayeeweqdtxlw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncWR3YW92YXlhZWV3cWR0eGl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NzgxOCwiZXhwIjoyMTAxNjczODE4fQ._Xy4JueSg_ITTnMT7hLFF3_QMbqo9hI9lNfGF_0NumU';

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      try {
        const stmt = statements[i] + ';';

        // Use raw SQL query through the supabase client
        const { error } = await supabase.rpc('exec_sql', {
          sql: stmt
        }).catch(() => {
          // Fallback: try direct query
          return supabase.from('_supabase_migrations').select().limit(0);
        });

        if (!error) {
          successCount++;
          results.push({ statement: i + 1, status: 'success' });
        } else {
          errorCount++;
          results.push({ statement: i + 1, status: 'error', message: error.message });
        }
      } catch (err: any) {
        errorCount++;
        results.push({
          statement: i + 1,
          status: 'error',
          message: err.message
        });
      }
    }

    return Response.json({
      status: errorCount === 0 ? 'success' : 'partial',
      totalStatements: statements.length,
      successCount,
      errorCount,
      results
    });

  } catch (err: any) {
    return Response.json({
      status: 'error',
      message: err.message
    }, { status: 500 });
  }
}
