-- Add missing columns to meditation_content
ALTER TABLE meditation_content 
ADD COLUMN IF NOT EXISTS tier text DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'premium'));

ALTER TABLE meditation_content
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true;

-- Create user meditation history table for tracking session limits
CREATE TABLE IF NOT EXISTS user_meditation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES meditation_content(id) ON DELETE CASCADE,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_meditation_history
ALTER TABLE user_meditation_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_meditation_history
CREATE POLICY "Users can view their own history"
ON user_meditation_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
ON user_meditation_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to check weekly session limit for free users
CREATE OR REPLACE FUNCTION check_weekly_session_limit(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_count integer;
BEGIN
  SELECT COUNT(*)
  INTO session_count
  FROM user_meditation_history
  WHERE user_id = p_user_id
    AND played_at >= NOW() - INTERVAL '7 days';
  
  RETURN session_count;
END;
$$;

-- Clear existing meditation content to avoid conflicts
DELETE FROM meditation_content;

-- Insert FREE TIER SESSIONS (5 sessions - all available)
INSERT INTO meditation_content (title, category, tier, duration, audio_file_path, is_available, description, is_active, is_featured, subscription_tier, difficulty_level, has_audio, play_count)
VALUES
  ('Morning Mindfulness', 'Guided', 'free', 600, 'guided-morning-1.mp3', true, 'Gentle wake-up meditation to center your mind for the day ahead', true, true, 'free', 'beginner', false, 0),
  ('Focus Improvement', 'Guided', 'free', 900, 'guided-focus-1.mp3', true, 'Concentration-building practice for enhanced mental clarity', true, true, 'free', 'beginner', false, 0),
  ('1-Minute Breather', 'Quick Breaks', 'free', 60, 'quick-breather-1.mp3', true, 'Ultra-quick reset for the busiest moments', true, false, 'free', 'beginner', false, 0),
  ('5-Minute Reset', 'Quick Breaks', 'free', 300, 'quick-break-5.mp3', true, 'Perfect lunch break meditation for mid-day renewal', true, false, 'free', 'beginner', false, 0),
  ('3-Minute Calm', 'Quick Breaks', 'free', 180, 'quick-calm-3.mp3', true, 'Instant stress relief between meetings or tasks', true, false, 'free', 'beginner', false, 0);

-- Insert STANDARD TIER SESSIONS (10 additional sessions)
INSERT INTO meditation_content (title, category, tier, duration, audio_file_path, is_available, description, is_active, is_featured, subscription_tier, difficulty_level, has_audio, play_count)
VALUES
  ('Stress Release', 'Guided', 'standard', 720, 'guided-stress-1.mp3', true, 'Targeted anxiety relief and tension reduction techniques', true, false, 'premium', 'intermediate', false, 0),
  ('Morning Clarity', 'Guided', 'standard', 600, NULL, false, 'Clear intention setting for productive daily starts', true, false, 'premium', 'intermediate', false, 0),
  ('Midday Reset', 'Guided', 'standard', 720, NULL, false, 'Perfect for lunch break rejuvenation and energy renewal', true, false, 'premium', 'intermediate', false, 0),
  ('Evening Unwinding', 'Guided', 'standard', 900, NULL, false, 'Gentle transition from work day to personal time', true, false, 'premium', 'intermediate', false, 0),
  ('Quick Focus', 'Quick Breaks', 'standard', 120, 'quick-focus-1.mp3', true, 'Rapid concentration boost for important tasks', true, false, 'premium', 'beginner', false, 0),
  ('Breath Awareness', 'Quick Breaks', 'standard', 240, 'breath-awareness-1.mp3', true, 'Simple breath observation for grounding', true, false, 'premium', 'beginner', false, 0),
  ('One-Minute Calm', 'Quick Breaks', 'standard', 60, NULL, false, 'Instant tranquility in 60 seconds', true, false, 'premium', 'beginner', false, 0),
  ('Deep Concentration', 'Deep Focus', 'standard', 1080, NULL, false, 'Extended focus training for complex tasks', true, false, 'premium', 'intermediate', false, 0),
  ('Present Awareness', 'Deep Focus', 'standard', 900, NULL, false, 'Mindfulness for sustained attention', true, false, 'premium', 'intermediate', false, 0),
  ('Sleep Relaxation', 'Sleep', 'standard', 900, 'sleep-relaxation-1.mp3', true, 'Gentle evening wind-down for peaceful sleep preparation', true, false, 'premium', 'beginner', false, 0);

-- Insert PREMIUM TIER SESSIONS (7 additional sessions)
INSERT INTO meditation_content (title, category, tier, duration, audio_file_path, is_available, description, is_active, is_featured, subscription_tier, difficulty_level, has_audio, play_count)
VALUES
  ('Body Scan Relaxation', 'Guided', 'premium', 1500, NULL, false, 'Progressive physical awareness and tension release', true, false, 'premium', 'advanced', false, 0),
  ('Gratitude Practice', 'Guided', 'premium', 1080, NULL, false, 'Loving-kindness meditation for emotional healing and positivity', true, false, 'premium', 'intermediate', false, 0),
  ('Mental Clarity', 'Deep Focus', 'premium', 1200, NULL, false, 'Advanced concentration for peak mental performance', true, false, 'premium', 'advanced', false, 0),
  ('Mindful Presence', 'Deep Focus', 'premium', 1320, NULL, false, 'Deep awareness cultivation for sustained clarity', true, false, 'premium', 'advanced', false, 0),
  ('Deep Sleep Journey', 'Sleep', 'premium', 1800, 'sleep-deep-1.mp3', true, 'Extended relaxation for deep, restorative sleep', true, true, 'premium', 'intermediate', false, 0),
  ('Sleep Anxiety Relief', 'Sleep', 'premium', 1200, 'sleep-anxiety-1.mp3', true, 'Specialized practice for those struggling with bedtime worry', true, false, 'premium', 'intermediate', false, 0),
  ('Sleep Preparation', 'Sleep', 'premium', 720, 'sleep-prep-1.mp3', true, 'Optimal pre-sleep routine for consistent sleep quality', true, false, 'premium', 'intermediate', false, 0);