-- Storage setup for product images
-- This migration creates the storage bucket and sets up RLS policies

-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own uploaded images
CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = owner
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid()::text = owner
);

-- Policy: Users can delete their own uploaded images
CREATE POLICY "Users can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = owner
);

-- Optional: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_objects_bucket_id 
ON storage.objects(bucket_id);

CREATE INDEX IF NOT EXISTS idx_objects_owner 
ON storage.objects(owner);
