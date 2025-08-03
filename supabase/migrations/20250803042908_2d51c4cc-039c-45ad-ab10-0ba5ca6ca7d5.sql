-- Update meditation_content to match actual storage files
UPDATE meditation_content 
SET 
  audio_file_path = '5-Minute Stress Relief.mp4',
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/5-Minute%20Stress%20Relief.mp4'
WHERE id = '3a0c65e5-6cb8-4866-8911-28d79c5272c8';

UPDATE meditation_content 
SET 
  audio_file_path = 'Introduction to Meditation Mindfulness.mp4',
  audio_file_url = 'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Introduction%20to%20Meditation%20Mindfulness.mp4'
WHERE id = '0ce0bd2e-bdfe-4970-b085-d30d9275f1e8';

-- Remove the entry that doesn't have a matching file in storage
DELETE FROM meditation_content 
WHERE id = '1befa040-fd41-438f-bb6c-55eac21ad151' AND title = '5-Minute Relaxation';