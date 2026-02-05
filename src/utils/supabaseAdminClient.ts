import { createClient } from '@jsr/supabase__supabase-js';
import { projectId } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Service role key - This should be stored securely in environment variables
// For now, we'll need you to add this to your environment
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRoleKey) {
  console.warn('⚠️ Service role key not found. Using standard client (RLS policies apply).');
}

// Create admin client with service role key for bypassing RLS
export const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}) : null;

if (supabaseAdmin) {
  console.log('🔧 Supabase admin client created with service role support');
}
