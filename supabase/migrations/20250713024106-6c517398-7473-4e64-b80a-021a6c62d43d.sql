-- Create missing user_social_profiles table
CREATE TABLE IF NOT EXISTS public.user_social_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "public", "leaderboard_participation": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_social_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can update their own social profile" 
ON public.user_social_profiles 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public social profiles" 
ON public.user_social_profiles 
FOR SELECT 
USING (
  ((privacy_settings ->> 'profile_visibility') = 'public') 
  OR (auth.uid() = user_id) 
  OR (EXISTS (
    SELECT 1 FROM user_friendships
    WHERE ((requester_id = auth.uid() AND addressee_id = user_social_profiles.user_id AND status = 'accepted')
           OR (requester_id = user_social_profiles.user_id AND addressee_id = auth.uid() AND status = 'accepted'))
  ))
);

-- Generate a proper UUID for demo user
DO $$
DECLARE
    demo_user_uuid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Insert demo user profile
    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        avatar_url,
        created_at,
        subscription_tier,
        subscription_status,
        meditation_minutes_limit,
        meditation_minutes_used
    ) VALUES (
        demo_user_uuid,
        'demo@respiro.app',
        'Demo User',
        null,
        now(),
        'premium',
        'active',
        999999,
        0
    ) ON CONFLICT (id) DO UPDATE SET
        subscription_tier = 'premium',
        subscription_status = 'active',
        full_name = 'Demo User',
        meditation_minutes_limit = 999999;

    -- Insert demo user preferences
    INSERT INTO public.user_preferences (
        user_id,
        has_completed_onboarding,
        theme,
        notification_settings,
        meditation_experience,
        meditation_goals,
        preferred_session_duration,
        created_at
    ) VALUES (
        demo_user_uuid,
        true,
        'system',
        '{"streak_alerts": true, "weekly_summary": true, "session_reminders": true, "achievement_notifications": true}'::jsonb,
        'intermediate',
        ARRAY['stress_reduction', 'better_sleep', 'focus_improvement'],
        15,
        now()
    ) ON CONFLICT (user_id) DO UPDATE SET
        has_completed_onboarding = true,
        theme = 'system',
        meditation_experience = 'intermediate';

    -- Insert demo user social profile
    INSERT INTO public.user_social_profiles (
        user_id,
        display_name,
        bio,
        level,
        total_points,
        current_streak,
        longest_streak,
        created_at
    ) VALUES (
        demo_user_uuid,
        'Demo User',
        'Welcome to Respiro Balance! This is a demo account showcasing the premium features.',
        5,
        1250,
        7,
        21,
        now()
    ) ON CONFLICT (user_id) DO UPDATE SET
        display_name = 'Demo User',
        bio = 'Welcome to Respiro Balance! This is a demo account showcasing the premium features.',
        level = 5,
        total_points = 1250,
        current_streak = 7,
        longest_streak = 21;

    -- Insert demo user rewards
    INSERT INTO public.user_rewards (
        user_id,
        coin_balance,
        total_coins_earned,
        total_coins_spent,
        active_badges,
        reward_inventory,
        created_at
    ) VALUES (
        demo_user_uuid,
        450,
        1200,
        750,
        '["early_bird", "meditation_master", "consistent_practitioner"]'::jsonb,
        '["premium_themes", "guided_meditations", "biofeedback_access"]'::jsonb,
        now()
    ) ON CONFLICT (user_id) DO UPDATE SET
        coin_balance = 450,
        total_coins_earned = 1200,
        total_coins_spent = 750,
        active_badges = '["early_bird", "meditation_master", "consistent_practitioner"]'::jsonb,
        reward_inventory = '["premium_themes", "guided_meditations", "biofeedback_access"]'::jsonb;

    -- Insert demo meditation sessions
    INSERT INTO public.meditation_sessions (
        id,
        user_id,
        duration,
        session_type,
        title,
        category,
        completed,
        completed_at,
        rating,
        started_at,
        created_at,
        favorite
    ) VALUES 
        (gen_random_uuid(), demo_user_uuid, 600, 'guided', 'Morning Mindfulness', 'mindfulness', true, now() - interval '1 day', 5, now() - interval '1 day', now() - interval '1 day', true),
        (gen_random_uuid(), demo_user_uuid, 900, 'breathing', 'Deep Breathing Session', 'breathing', true, now() - interval '2 days', 4, now() - interval '2 days', now() - interval '2 days', false),
        (gen_random_uuid(), demo_user_uuid, 1200, 'body_scan', 'Full Body Relaxation', 'relaxation', true, now() - interval '3 days', 5, now() - interval '3 days', now() - interval '3 days', true),
        (gen_random_uuid(), demo_user_uuid, 450, 'focus', 'Focus Enhancement', 'productivity', true, now() - interval '4 days', 4, now() - interval '4 days', now() - interval '4 days', false),
        (gen_random_uuid(), demo_user_uuid, 750, 'sleep', 'Better Sleep Preparation', 'sleep', true, now() - interval '5 days', 5, now() - interval '5 days', now() - interval '5 days', true)
    ON CONFLICT DO NOTHING;

    -- Insert demo focus sessions
    INSERT INTO public.focus_sessions (
        id,
        user_id,
        start_time,
        end_time,
        duration,
        completed,
        work_intervals,
        break_intervals,
        focus_score,
        distractions,
        notes,
        tags,
        created_at
    ) VALUES 
        (gen_random_uuid(), demo_user_uuid, now() - interval '1 day', now() - interval '1 day' + interval '25 minutes', 1500, true, 1, 1, 85, 2, 'Great focus session with minimal distractions', ARRAY['work', 'productivity'], now() - interval '1 day'),
        (gen_random_uuid(), demo_user_uuid, now() - interval '2 days', now() - interval '2 days' + interval '50 minutes', 3000, true, 2, 2, 92, 1, 'Excellent deep work session', ARRAY['deep-work', 'coding'], now() - interval '2 days'),
        (gen_random_uuid(), demo_user_uuid, now() - interval '3 days', now() - interval '3 days' + interval '25 minutes', 1500, true, 1, 1, 78, 3, 'Good session despite some interruptions', ARRAY['study', 'learning'], now() - interval '3 days')
    ON CONFLICT DO NOTHING;

END $$;