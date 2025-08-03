-- Update meditation content records to link to actual audio files in storage
-- First, let's match the existing content with the uploaded audio files

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Introduction to Meditation Mindfulness.mp4',
  audio_file_path = 'Introduction to Meditation Mindfulness.mp4',
  has_audio = true,
  audio_duration = 600
WHERE title ILIKE '%introduction%' OR title ILIKE '%mindfulness%' 
  OR category = 'Mindfulness'
LIMIT 1;

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/5-Minute Stress Relief.mp4',
  audio_file_path = '5-Minute Stress Relief.mp4',
  has_audio = true,
  audio_duration = 300,
  duration = 300
WHERE category = 'Stress Relief' 
  AND duration <= 600
LIMIT 1;

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Basic Breathing Excercise.mp4',
  audio_file_path = 'Basic Breathing Excercise.mp4',
  has_audio = true,
  audio_duration = 480,
  duration = 480
WHERE category = 'Focus' OR title ILIKE '%breath%' 
LIMIT 1;

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Evening Wind Down.mp4',
  audio_file_path = 'Evening Wind Down.mp4',
  has_audio = true,
  audio_duration = 900,
  duration = 900
WHERE category = 'Sleep' OR title ILIKE '%evening%' OR title ILIKE '%wind%'
LIMIT 1;

-- Also ensure some content is marked as free so users can access it
UPDATE meditation_content 
SET subscription_tier = 'free'
WHERE id IN (
  SELECT id FROM meditation_content 
  WHERE has_audio = true 
  LIMIT 2
);

-- Add some featured content
UPDATE meditation_content 
SET is_featured = true
WHERE has_audio = true
LIMIT 2;