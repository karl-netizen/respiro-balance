-- Update meditation content records to link to actual audio files in storage
-- Using proper PostgreSQL UPDATE syntax

-- Update a mindfulness/introduction meditation
UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Introduction to Meditation Mindfulness.mp4',
  audio_file_path = 'Introduction to Meditation Mindfulness.mp4',
  has_audio = true,
  audio_duration = 600
WHERE id = (
  SELECT id FROM meditation_content 
  WHERE (title ILIKE '%introduction%' OR title ILIKE '%mindfulness%' OR category = 'Mindfulness')
  AND has_audio = false
  ORDER BY created_at ASC
  LIMIT 1
);

-- Update a stress relief meditation
UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/5-Minute Stress Relief.mp4',
  audio_file_path = '5-Minute Stress Relief.mp4',
  has_audio = true,
  audio_duration = 300,
  duration = 300
WHERE id = (
  SELECT id FROM meditation_content 
  WHERE category = 'Stress Relief' 
  AND duration <= 600
  AND has_audio = false
  ORDER BY created_at ASC
  LIMIT 1
);

-- Update a breathing/focus meditation
UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Basic Breathing Excercise.mp4',
  audio_file_path = 'Basic Breathing Excercise.mp4',
  has_audio = true,
  audio_duration = 480,
  duration = 480
WHERE id = (
  SELECT id FROM meditation_content 
  WHERE (category = 'Focus' OR title ILIKE '%breath%')
  AND has_audio = false
  ORDER BY created_at ASC
  LIMIT 1
);

-- Update a sleep/evening meditation
UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Evening Wind Down.mp4',
  audio_file_path = 'Evening Wind Down.mp4',
  has_audio = true,
  audio_duration = 900,
  duration = 900
WHERE id = (
  SELECT id FROM meditation_content 
  WHERE (category = 'Sleep' OR title ILIKE '%evening%' OR title ILIKE '%wind%')
  AND has_audio = false
  ORDER BY created_at ASC
  LIMIT 1
);

-- Make some content free for testing
UPDATE meditation_content 
SET subscription_tier = 'free'
WHERE id IN (
  SELECT id FROM meditation_content 
  WHERE has_audio = true 
  ORDER BY created_at ASC
  LIMIT 2
);

-- Mark some as featured
UPDATE meditation_content 
SET is_featured = true
WHERE id IN (
  SELECT id FROM meditation_content 
  WHERE has_audio = true
  ORDER BY created_at ASC
  LIMIT 2
);