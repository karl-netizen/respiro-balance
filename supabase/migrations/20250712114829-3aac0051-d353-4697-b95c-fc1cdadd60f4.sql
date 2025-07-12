-- Create meditation content management tables
CREATE TABLE public.meditation_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in seconds
  category TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  subscription_tier TEXT DEFAULT 'free', -- free, premium, premium_pro, premium_plus
  audio_file_url TEXT,
  audio_file_path TEXT,
  thumbnail_url TEXT,
  transcript TEXT,
  tags TEXT[],
  instructor TEXT,
  background_music_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  play_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create content categories table
CREATE TABLE public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color_theme TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user content progress tracking
CREATE TABLE public.user_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES meditation_content(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_count INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS
ALTER TABLE public.meditation_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for meditation_content
CREATE POLICY "Anyone can view active content" ON public.meditation_content
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage content" ON public.meditation_content
FOR ALL USING (true);

-- Create policies for content_categories
CREATE POLICY "Anyone can view active categories" ON public.content_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON public.content_categories
FOR ALL USING (true);

-- Create policies for user_content_progress
CREATE POLICY "Users can view their own progress" ON public.user_content_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_content_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_content_progress
FOR UPDATE USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.content_categories (name, description, color_theme, icon_name, sort_order) VALUES
('Stress Relief', 'Meditation sessions focused on reducing stress and tension', 'blue', 'heart', 1),
('Sleep', 'Guided meditations for better sleep and relaxation', 'purple', 'moon', 2),
('Focus', 'Sessions to improve concentration and mental clarity', 'green', 'target', 3),
('Breathing', 'Breathing exercises and pranayama techniques', 'cyan', 'wind', 4),
('Mindfulness', 'Present moment awareness and mindfulness practices', 'orange', 'eye', 5),
('Body Scan', 'Progressive relaxation and body awareness', 'pink', 'scan', 6),
('Loving Kindness', 'Compassion and loving-kindness meditations', 'red', 'heart-handshake', 7),
('Energy', 'Morning and energizing meditations', 'yellow', 'sunrise', 8);

-- Insert starter content (placeholders for now)
INSERT INTO public.meditation_content (
  title, description, duration, category, difficulty_level, 
  subscription_tier, instructor, tags
) VALUES
-- Free tier content
('Introduction to Meditation', 'A gentle introduction perfect for complete beginners', 600, 'Mindfulness', 'beginner', 'free', 'Sarah Chen', ARRAY['beginner', 'introduction']),
('5-Minute Stress Relief', 'Quick stress relief for busy schedules', 300, 'Stress Relief', 'beginner', 'free', 'Sarah Chen', ARRAY['stress', 'quick', 'workplace']),
('Basic Breathing Exercise', 'Learn fundamental breathing techniques', 480, 'Breathing', 'beginner', 'free', 'Michael Torres', ARRAY['breathing', 'basics']),
('Evening Wind Down', 'Prepare your mind and body for restful sleep', 720, 'Sleep', 'beginner', 'free', 'Sarah Chen', ARRAY['sleep', 'evening', 'relaxation']),
('Morning Energy Boost', 'Start your day with clarity and energy', 600, 'Energy', 'beginner', 'free', 'Michael Torres', ARRAY['morning', 'energy', 'motivation']),

-- Premium tier content
('Deep Stress Release', 'Advanced techniques for managing chronic stress', 1200, 'Stress Relief', 'intermediate', 'premium', 'Dr. Amanda Rivers', ARRAY['stress', 'advanced', 'chronic']),
('Anxiety Relief Session', 'Specialized meditation for anxiety management', 900, 'Stress Relief', 'intermediate', 'premium', 'Dr. Amanda Rivers', ARRAY['anxiety', 'calming']),
('Laser Focus Meditation', 'Enhance concentration and mental clarity', 1080, 'Focus', 'intermediate', 'premium', 'James Mitchell', ARRAY['focus', 'productivity', 'work']),
('Complete Body Scan', 'Full-body progressive relaxation technique', 1500, 'Body Scan', 'intermediate', 'premium', 'Sarah Chen', ARRAY['body-scan', 'relaxation', 'progressive']),
('Walking Meditation Guide', 'Mindful movement and walking practice', 900, 'Mindfulness', 'intermediate', 'premium', 'Michael Torres', ARRAY['walking', 'movement', 'outdoor']),
('Loving Kindness Practice', 'Cultivate compassion and self-love', 1080, 'Loving Kindness', 'intermediate', 'premium', 'Dr. Amanda Rivers', ARRAY['compassion', 'self-love', 'healing']),
('Advanced Breathing Mastery', 'Master complex pranayama techniques', 900, 'Breathing', 'advanced', 'premium', 'James Mitchell', ARRAY['pranayama', 'advanced', 'breathing']),
('Mindful Eating Practice', 'Transform your relationship with food', 720, 'Mindfulness', 'intermediate', 'premium', 'Sarah Chen', ARRAY['eating', 'mindful', 'awareness']),
('Power Nap Session', 'Rejuvenating rest in just 20 minutes', 1200, 'Sleep', 'intermediate', 'premium', 'Michael Torres', ARRAY['nap', 'energy', 'restoration']),
('Workplace Calm', 'Find peace during your busy workday', 300, 'Stress Relief', 'beginner', 'premium', 'James Mitchell', ARRAY['workplace', 'quick', 'professional']);

-- Create storage bucket for meditation audio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meditation-audio', 'meditation-audio', true);

-- Create storage policies for meditation audio
CREATE POLICY "Anyone can view meditation audio" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'meditation-audio');

CREATE POLICY "Authenticated users can upload meditation audio" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'meditation-audio' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their uploads" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'meditation-audio' AND auth.uid() IS NOT NULL);

-- Create function to update content play count
CREATE OR REPLACE FUNCTION public.increment_play_count(content_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.meditation_content 
  SET play_count = play_count + 1 
  WHERE id = content_id;
END;
$$;

-- Create function to update user progress
CREATE OR REPLACE FUNCTION public.update_content_progress(
  p_content_id UUID,
  p_progress_seconds INTEGER,
  p_completed BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_content_progress (
    user_id, content_id, progress_seconds, completed, last_played_at
  ) VALUES (
    auth.uid(), p_content_id, p_progress_seconds, p_completed, now()
  )
  ON CONFLICT (user_id, content_id) 
  DO UPDATE SET 
    progress_seconds = GREATEST(user_content_progress.progress_seconds, p_progress_seconds),
    completed = p_completed OR user_content_progress.completed,
    last_played_at = now(),
    completion_count = CASE 
      WHEN p_completed AND NOT user_content_progress.completed THEN user_content_progress.completion_count + 1
      ELSE user_content_progress.completion_count
    END,
    updated_at = now();
END;
$$;