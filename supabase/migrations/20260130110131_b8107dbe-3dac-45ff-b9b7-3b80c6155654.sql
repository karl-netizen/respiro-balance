-- Fix STORAGE_EXPOSURE: Make meditation-audio bucket private

-- Update bucket to be private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'meditation-audio';

-- Drop the public SELECT policy that allows anyone to view
DROP POLICY IF EXISTS "Anyone can view meditation audio" ON storage.objects;

-- Create new policy that requires authentication for access
CREATE POLICY "Authenticated users can access audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'meditation-audio'
    AND auth.uid() IS NOT NULL
  );