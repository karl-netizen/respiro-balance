
-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  preferences_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Biometric Data Table
CREATE TABLE IF NOT EXISTS biometric_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  heart_rate INTEGER,
  hrv NUMERIC,
  respiratory_rate NUMERIC,
  stress_score NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meditation Sessions Table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  session_type TEXT NOT NULL,
  biometric_before UUID REFERENCES biometric_data(id),
  biometric_after UUID REFERENCES biometric_data(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Balance Metrics Table
CREATE TABLE IF NOT EXISTS balance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  work_life_ratio NUMERIC NOT NULL,
  stress_level NUMERIC NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Devices Table
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  connected BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  disconnected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- Meditation Library Table
CREATE TABLE IF NOT EXISTS meditation_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  category TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  instructor TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  meditation_id UUID NOT NULL REFERENCES meditation_library(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meditation_id)
);

-- Rating and Review Table
CREATE TABLE IF NOT EXISTS meditation_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  meditation_id UUID NOT NULL REFERENCES meditation_library(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meditation_id)
);

-- Breathing Exercise History
CREATE TABLE IF NOT EXISTS breathing_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
-- User Profiles: Users can read/update only their own profiles
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- User Preferences: Users can read/update only their own preferences  
CREATE POLICY "Users can view own preferences" 
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own preferences" 
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own preferences" 
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Biometric Data: Users can only access their own biometric data
CREATE POLICY "Users can view own biometric data" 
  ON biometric_data FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own biometric data" 
  ON biometric_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Meditation Sessions: Users can only access their own sessions
CREATE POLICY "Users can view own meditation sessions" 
  ON meditation_sessions FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own meditation sessions" 
  ON meditation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own meditation sessions" 
  ON meditation_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Balance Metrics: Users can only access their own metrics
CREATE POLICY "Users can view own balance metrics" 
  ON balance_metrics FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own balance metrics" 
  ON balance_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Devices: Users can only access their own devices
CREATE POLICY "Users can view own devices" 
  ON user_devices FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage own devices" 
  ON user_devices FOR ALL USING (auth.uid() = user_id);

-- Meditation Library: All users can view meditation library
CREATE POLICY "Anyone can view meditation library" 
  ON meditation_library FOR SELECT USING (true);

-- User Favorites: Users can only access their own favorites
CREATE POLICY "Users can view own favorites" 
  ON user_favorites FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage own favorites" 
  ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- Meditation Ratings: Users can see all ratings, but only manage their own
CREATE POLICY "Anyone can view ratings" 
  ON meditation_ratings FOR SELECT USING (true);
  
CREATE POLICY "Users can manage own ratings" 
  ON meditation_ratings FOR ALL USING (auth.uid() = user_id);

-- Breathing Exercises: Users can only access their own exercises
CREATE POLICY "Users can view own breathing exercises" 
  ON breathing_exercises FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage own breathing exercises" 
  ON breathing_exercises FOR ALL USING (auth.uid() = user_id);
