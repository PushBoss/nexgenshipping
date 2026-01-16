import { createClient } from '@jsr/supabase__supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Using the key from run-migration.js which seemed to be the last working one
const supabaseUrl = 'https://erxkwytqautexizleeov.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeGt3eXRxYXV0ZXhpemxlZW92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU0Nzg1MCwiZXhwIjoyMDgwMTIzODUwfQ.Ev5FXklGq71AtxbXSwmZH5PJMDHQjPt_H7jR40QaZLc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  try {
    console.log('📦 Reading migration file...');
    const sqlPath = join(__dirname, '../supabase/migrations/005_create_reviews_table.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    console.log('🚀 Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      // Fallback: If exec_sql doesn't exist, we can't run it this way.
      console.log('NOTE: If this failed because of function not found, please run the SQL manually in Supabase Dashboard.');
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

runMigration();
