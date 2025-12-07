import { createClient } from '@jsr/supabase__supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Service role key to bypass RLS
const supabaseUrl = 'https://erxkwytqautexizleeov.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeGt3eXRxYXV0ZXhpemxlZW92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU0Nzg1MCwiZXhwIjoyMDgwMTIzODUwfQ.Ev5FXklGq71AtxbXSwmZH5PJMDHQjPt_H7jR40QaZLc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  try {
    console.log('📦 Reading migration file...');
    const sqlPath = join(__dirname, 'supabase/migrations/004_change_product_id_to_text.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    console.log('🚀 Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('Data:', data);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

runMigration();
