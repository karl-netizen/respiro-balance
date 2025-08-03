-- Fix audio URLs for free meditation content
UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Introduction%20to%20Meditation.mp4',
  audio_file_path = 'Introduction to Meditation.mp4',
  has_audio = true
WHERE id = '0ce0bd2e-bdfe-4970-b085-d30d9275f1e8';

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/5%20Min%20Stress%20Relief.mp4',
  audio_file_path = '5 Min Stress Relief.mp4',
  has_audio = true
WHERE id = '3a0c65e5-6cb8-4866-8911-28d79c5272c8';

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Basic%20Breathing%20Exercise.mp4',
  audio_file_path = 'Basic Breathing Exercise.mp4',
  has_audio = true
WHERE id = '668a48be-ee8a-4df3-9a37-4398a4318119';

UPDATE meditation_content 
SET 
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Evening%20Wind%20Down.mp4',
  audio_file_path = 'Evening Wind Down.mp4',
  has_audio = true
WHERE id = '0424b77c-c2f3-4cab-83b3-60ef76f058d7';

UPDATE meditation_content 
SET 
  has_audio = true
WHERE id = '1befa040-fd41-438f-bb6c-55eac21ad151';