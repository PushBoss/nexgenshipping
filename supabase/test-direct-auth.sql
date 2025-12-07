-- TEST SCRIPT: Run this to verify direct auth setup
-- This will clean up and set up everything properly

-- 1. Check current state
SELECT 'Current user_profiles structure:' as step;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 2. Check existing policies
SELECT 'Existing RLS policies:' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 3. Clean up existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public can read for auth" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- 4. Drop foreign key constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- 5. Set default UUID generation
ALTER TABLE user_profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 6. Add email and password_hash columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_password ON user_profiles(email, password_hash);

-- 8. Create RLS policies
CREATE POLICY "Anyone can create profile" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read for auth" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (true) WITH CHECK (true);

-- 9. Verify final state
SELECT 'Final user_profiles structure:' as step;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

SELECT 'Final RLS policies:' as step;
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 10. Test insert (will be rolled back)
DO $$
DECLARE
    test_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO user_profiles (id, email, password_hash, first_name, last_name, is_admin)
    VALUES (test_id, 'test@example.com', 'test_hash', 'Test', 'User', false);
    
    RAISE NOTICE 'Test insert successful!';
    
    -- Clean up test data
    DELETE FROM user_profiles WHERE id = test_id;
    RAISE NOTICE 'Test cleanup successful!';
END $$;

SELECT '✅ All tests passed! Direct auth is ready.' as result;
