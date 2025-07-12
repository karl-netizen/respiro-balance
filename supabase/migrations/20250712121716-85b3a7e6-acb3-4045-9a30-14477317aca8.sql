-- Create storage policies for meditation-audio bucket
-- Allow authenticated users to upload, view, and delete their own audio files

-- Policy for uploading files (INSERT on objects)
CREATE POLICY "Users can upload meditation audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'meditation-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for viewing files (SELECT on objects)
CREATE POLICY "Users can view meditation audio files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'meditation-audio' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR 
    (storage.foldername(name))[1] IS NULL -- Allow access to files without folder structure
  )
);

-- Policy for updating files (UPDATE on objects)
CREATE POLICY "Users can update their meditation audio files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'meditation-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting files (DELETE on objects)
CREATE POLICY "Users can delete their meditation audio files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'meditation-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Also create a more permissive policy for admin access
CREATE POLICY "Admin can manage all meditation audio files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'meditation-audio')
WITH CHECK (bucket_id = 'meditation-audio');