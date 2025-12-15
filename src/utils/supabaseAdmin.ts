import { createClient } from '@jsr/supabase__supabase-js';
import { projectId } from './supabase/info';

// Service role key from environment variable (bypasses RLS)
const supabaseUrl = `https://${projectId}.supabase.co`;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.warn('⚠️ Service role key not found. Admin operations may fail.');
}

/**
 * Admin client with service role key - bypasses RLS policies
 * Use ONLY for admin operations (delete, update, etc.)
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    storageKey: 'supabase-admin'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    }
  },
  db: {
    schema: 'public'
  }
});

console.log('✅ Supabase admin client created (service role)');
