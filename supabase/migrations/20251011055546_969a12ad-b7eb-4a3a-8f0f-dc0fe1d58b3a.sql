
-- Link existing audio files in storage to meditation_content
-- Create meditation content records for the 4 MP4 files in storage

-- 1. Introduction to Meditation Mindfulness
INSERT INTO meditation_content (
  title,
  description,
  duration,
  category,
  difficulty_level,
  subscription_tier,
  audio_file_path,
  audio_file_url,
  instructor,
  tags,
  is_featured,
  is_active,
  has_audio
) VALUES (
  'Introduction to Meditation Mindfulness',
  'A comprehensive introduction to meditation and mindfulness practices. Perfect for beginners looking to start their meditation journey.',
  900, -- 15 minutes (approximate)
  'Mindfulness',
  'beginner',
  'free',
  'Introduction to Meditation Mindfulness.mp4',
  'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Introduction%20to%20Meditation%20Mindfulness.mp4',
  'Respiro Guide',
  ARRAY['mindfulness', 'beginner', 'introduction', 'meditation basics'],
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 2. Evening Wind Down
INSERT INTO meditation_content (
  title,
  description,
  duration,
  category,
  difficulty_level,
  subscription_tier,
  audio_file_path,
  audio_file_url,
  instructor,
  tags,
  is_featured,
  is_active,
  has_audio
) VALUES (
  'Evening Wind Down',
  'Relax and unwind after a long day with this calming evening meditation. Perfect for transitioning into a peaceful night.',
  1200, -- 20 minutes (approximate)
  'Sleep',
  'beginner',
  'free',
  'Evening Wind Down.mp4',
  'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Evening%20Wind%20Down.mp4',
  'Respiro Guide',
  ARRAY['sleep', 'relaxation', 'evening', 'wind down'],
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 3. Basic Breathing Exercise
INSERT INTO meditation_content (
  title,
  description,
  duration,
  category,
  difficulty_level,
  subscription_tier,
  audio_file_path,
  audio_file_url,
  instructor,
  tags,
  is_featured,
  is_active,
  has_audio
) VALUES (
  'Basic Breathing Exercise',
  'Learn fundamental breathing techniques to reduce stress and increase focus. A simple yet powerful practice for all levels.',
  600, -- 10 minutes (approximate)
  'Breathing',
  'beginner',
  'free',
  'Basic Breathing Excercise.mp4',
  'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/Basic%20Breathing%20Excercise.mp4',
  'Respiro Guide',
  ARRAY['breathing', 'beginner', 'stress relief', 'quick'],
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 4. 5-Minute Stress Relief
INSERT INTO meditation_content (
  title,
  description,
  duration,
  category,
  difficulty_level,
  subscription_tier,
  audio_file_path,
  audio_file_url,
  instructor,
  tags,
  is_featured,
  is_active,
  has_audio
) VALUES (
  '5-Minute Stress Relief',
  'Quick and effective stress relief meditation for busy schedules. Find calm in just 5 minutes.',
  300, -- 5 minutes
  'Stress Relief',
  'beginner',
  'free',
  '5-Minute Stress Relief.mp4',
  'https://tlwlxlthrcgscwgmsamo.supabase.co/storage/v1/object/public/meditation-audio/5-Minute%20Stress%20Relief.mp4',
  'Respiro Guide',
  ARRAY['stress relief', 'quick', 'beginner', '5 minutes'],
  true,
  true,
  true
) ON CONFLICT DO NOTHING;
