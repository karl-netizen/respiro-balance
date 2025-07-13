-- Fix broken signup flow - handle existing policies properly

-- First, drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop old function to avoid conflicts
DROP FUNCTION IF EXISTS public.create_social_profile();

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.created_at
  );
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (
    user_id,
    has_completed_onboarding,
    theme,
    notification_settings,
    created_at
  ) VALUES (
    NEW.id,
    false,
    'system',
    '{"streak_alerts": true, "weekly_summary": true, "session_reminders": true, "achievement_notifications": true}'::jsonb,
    NEW.created_at
  );
  
  -- Create user social profile
  INSERT INTO public.user_social_profiles (
    user_id,
    display_name,
    privacy_settings,
    created_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    '{"profile_visibility": "public", "activity_visibility": "public", "leaderboard_participation": true}'::jsonb,
    NEW.created_at
  );
  
  -- Create user rewards profile
  INSERT INTO public.user_rewards (
    user_id,
    coin_balance,
    total_coins_earned,
    total_coins_spent,
    active_badges,
    reward_inventory,
    created_at
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    '[]'::jsonb,
    '[]'::jsonb,
    NEW.created_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();