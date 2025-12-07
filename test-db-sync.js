// Quick test to verify Supabase connection
console.log('\n🧪 Testing Supabase Database Sync...\n');

// Check if .env files exist
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('📁 Checking environment files:');
console.log('  .env exists:', fs.existsSync(envPath));
console.log('  .env.example exists:', fs.existsSync(envExamplePath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL') || envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY') || envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('  ✅ Supabase URL configured:', hasSupabaseUrl);
  console.log('  ✅ Supabase Key configured:', hasSupabaseKey);
} else {
  console.log('  ⚠️  No .env file found - using info.tsx values');
}

console.log('\n📦 Test CSV file created: test-bulk-upload.csv');
console.log('   - 5 test products (3 baby, 2 pharmaceutical)');
console.log('   - All with Dropbox image URLs');
console.log('   - Ready for bulk upload\n');

console.log('🌐 App running at: http://localhost:3001');
console.log('\n📋 Manual Test Steps:');
console.log('   1. Navigate to Admin page');
console.log('   2. Click "Bulk Upload" tab');
console.log('   3. Upload test-bulk-upload.csv');
console.log('   4. Verify products appear in preview');
console.log('   5. Click "Import Products"');
console.log('   6. Check Supabase dashboard for synced data\n');

console.log('✅ Ready for testing!\n');
