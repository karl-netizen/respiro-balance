-- PHASE 1: CREATE COMPREHENSIVE MEDITATION AUDIO MANAGEMENT SYSTEM WITH MP4 SUPPORT

-- Create table for enhanced audio file management
CREATE TABLE IF NOT EXISTS meditation_audio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meditation_content_id UUID REFERENCES meditation_content(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('mp3', 'wav', 'mp4', 'm4a', 'aac')),
  duration_seconds INTEGER,
  bitrate INTEGER,
  sample_rate INTEGER,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meditation_audio_content_id ON meditation_audio(meditation_content_id);
CREATE INDEX IF NOT EXISTS idx_meditation_audio_upload_status ON meditation_audio(upload_status);
CREATE INDEX IF NOT EXISTS idx_meditation_audio_uploaded_by ON meditation_audio(uploaded_by);

-- Enable RLS
ALTER TABLE meditation_audio ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meditation_audio
CREATE POLICY "Public can view completed audio" ON meditation_audio
  FOR SELECT USING (upload_status = 'completed');

CREATE POLICY "Authenticated users can upload audio" ON meditation_audio
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own uploads" ON meditation_audio
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own uploads" ON meditation_audio
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Add audio-related columns to existing meditation_content table
ALTER TABLE meditation_content 
ADD COLUMN IF NOT EXISTS has_audio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS audio_duration INTEGER,
ADD COLUMN IF NOT EXISTS audio_file_size BIGINT,
ADD COLUMN IF NOT EXISTS audio_quality TEXT CHECK (audio_quality IN ('low', 'medium', 'high', 'lossless'));

-- Create function to update meditation_content when audio is uploaded
CREATE OR REPLACE FUNCTION update_meditation_content_audio()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.upload_status = 'completed' THEN
      UPDATE meditation_content 
      SET 
        has_audio = true,
        audio_duration = NEW.duration_seconds,
        audio_file_size = NEW.file_size,
        audio_file_path = NEW.file_path,
        updated_at = NOW()
      WHERE id = NEW.meditation_content_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE meditation_content 
    SET 
      has_audio = false,
      audio_duration = null,
      audio_file_size = null,
      audio_file_path = null,
      updated_at = NOW()
    WHERE id = OLD.meditation_content_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS meditation_audio_content_sync ON meditation_audio;
CREATE TRIGGER meditation_audio_content_sync
  AFTER INSERT OR UPDATE OR DELETE ON meditation_audio
  FOR EACH ROW EXECUTE FUNCTION update_meditation_content_audio();

-- Update storage bucket to support MP4 and enhanced file types
UPDATE storage.buckets 
SET 
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/aac', 'video/mp4', 'audio/x-m4a', 'audio/mp4a-latm'],
  file_size_limit = 104857600 -- 100MB limit for better quality audio
WHERE id = 'meditation-audio';

-- Enhanced storage policies for MP4 support
DROP POLICY IF EXISTS "Enhanced audio upload policy" ON storage.objects;
CREATE POLICY "Enhanced audio upload policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'meditation-audio' 
    AND auth.uid() IS NOT NULL
    AND (storage.extension(name) = ANY(ARRAY['mp3', 'wav', 'mp4', 'm4a', 'aac']))
  );

DROP POLICY IF EXISTS "Enhanced audio update policy" ON storage.objects;
CREATE POLICY "Enhanced audio update policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'meditation-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Enhanced audio delete policy" ON storage.objects;
CREATE POLICY "Enhanced audio delete policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'meditation-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );