
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'team', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  subscription_id TEXT,
  subscription_period_end TIMESTAMP WITH TIME ZONE,
  meditation_minutes_used INTEGER DEFAULT 0,
  meditation_minutes_limit INTEGER DEFAULT 60,
  biometric_sync_enabled BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meditation Sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  rating INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometric Data table
CREATE TABLE IF NOT EXISTS biometric_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES meditation_sessions(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heart_rate INTEGER,
  hrv INTEGER,
  respiratory_rate INTEGER,
  stress_score INTEGER,
  coherence INTEGER,
  raw_data JSONB,
  device_source TEXT
);

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  work_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  work_start_time TEXT DEFAULT '09:00',
  work_end_time TEXT DEFAULT '17:00',
  lunch_break BOOLEAN DEFAULT TRUE,
  lunch_time TEXT DEFAULT '12:00',
  morning_exercise BOOLEAN DEFAULT FALSE,
  exercise_time TEXT DEFAULT '07:00',
  bed_time TEXT DEFAULT '22:00',
  meditation_experience TEXT DEFAULT 'beginner',
  meditation_goals TEXT[] DEFAULT ARRAY['stress_reduction', 'better_sleep'],
  preferred_session_duration INTEGER DEFAULT 10,
  stress_level TEXT DEFAULT 'moderate',
  work_environment TEXT DEFAULT 'office',
  connected_devices JSONB DEFAULT '[]'::JSONB,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  notification_settings JSONB DEFAULT '{
    "session_reminders": true,
    "streak_alerts": true,
    "achievement_notifications": true,
    "weekly_summary": true
  }'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Morning Rituals table
CREATE TABLE IF NOT EXISTS morning_rituals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  recurrence TEXT NOT NULL CHECK (recurrence IN ('daily', 'weekdays', 'weekends', 'custom')),
  days_of_week TEXT[],
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT[],
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_completed TIMESTAMP WITH TIME ZONE,
  streak INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'missed', 'partially_completed'))
);

-- User Achievement tracking
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0
);

-- Row Level Security Policies
-- User Profiles: Users can only read/update their own profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Meditation Sessions: Users can only read/write their own sessions
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meditation sessions"
  ON meditation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation sessions"
  ON meditation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions"
  ON meditation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Biometric Data: Users can only read/write their own data
ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own biometric data"
  ON biometric_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own biometric data"
  ON biometric_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Preferences: Users can only read/write their own preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Morning Rituals: Users can only read/write their own rituals
ALTER TABLE morning_rituals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own morning rituals"
  ON morning_rituals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own morning rituals"
  ON morning_rituals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own morning rituals"
  ON morning_rituals FOR UPDATE
  USING (auth.uid() = user_id);

-- User Achievements: Users can only read their own achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger to add a user_profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to reset monthly meditation usage limits
CREATE OR REPLACE FUNCTION reset_monthly_meditation_limits()
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles
  SET meditation_minutes_used = 0
  WHERE subscription_tier = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
