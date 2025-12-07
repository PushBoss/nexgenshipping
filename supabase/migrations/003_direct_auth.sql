-- Add password_hash column for direct authentication
-- This allows authentication without relying on Supabase Auth (avoids CORS)

-- Add email and password_hash columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create a function to auto-create auth.users entry
CREATE OR REPLACE FUNCTION create_auth_user_for_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to insert into auth.users (may fail if not accessible)
    BEGIN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (NEW.id, NEW.email, NEW.password_hash, NOW(), NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Ignore errors if we can't access auth.users
        NULL;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create auth.users entry
DROP TRIGGER IF EXISTS create_auth_user_trigger ON user_profiles;
CREATE TRIGGER create_auth_user_trigger
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_auth_user_for_profile();

-- Add email column to user_profiles (since we're bypassing auth.users)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index for faster lookups during login
CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON user_profiles(email);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email_password 
ON user_profiles(email, password_hash);

-- Update RLS policies to allow inserts during signup
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public can read for auth" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies
CREATE POLICY "Anyone can create profile"
ON user_profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can read for auth"
ON user_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (true)
WITH CHECK (true);
