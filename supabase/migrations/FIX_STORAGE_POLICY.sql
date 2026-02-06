-- Fix storage policy to allow uploads for Direct Auth (custom auth) users
-- Since we are using custom auth, Supabase sees users as 'anon', so we must allow anon uploads 
-- or rely on client-side logic (which is less secure but necessary if bypassing Supabase Auth).

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;

-- Create a new permissive policy for uploads
-- Note: In a production environment with Direct Auth, you would ideally secure this 
-- via a database function or edge function that validates the custom session token,
-- but for now, allowing public uploads to this specific bucket is the practical fix.
CREATE POLICY "Public can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
);

-- Ensure public read access is still there (should be, but good to confirm)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
