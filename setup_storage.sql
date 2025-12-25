-- 1. Create the 'recipe-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup RLS policies for 'recipe-images'
-- Note: We use specific policy names to avoid conflicts with other buckets

-- Public Read
DROP POLICY IF EXISTS "recipe-images-public-read" ON storage.objects;
CREATE POLICY "recipe-images-public-read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recipe-images' );

-- Auth Upload
DROP POLICY IF EXISTS "recipe-images-auth-upload" ON storage.objects;
CREATE POLICY "recipe-images-auth-upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'recipe-images' );

-- Owner Update
DROP POLICY IF EXISTS "recipe-images-owner-update" ON storage.objects;
CREATE POLICY "recipe-images-owner-update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id = 'recipe-images' );

-- Owner Delete
DROP POLICY IF EXISTS "recipe-images-owner-delete" ON storage.objects;
CREATE POLICY "recipe-images-owner-delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );
