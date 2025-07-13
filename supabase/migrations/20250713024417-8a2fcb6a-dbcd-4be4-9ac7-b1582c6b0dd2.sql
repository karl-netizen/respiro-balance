-- First, temporarily disable the foreign key constraint to insert demo data
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Delete existing demo data if it exists
DELETE FROM public.user_rewards WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.user_social_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.user_preferences WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.user_profiles WHERE id = '00000000-0000-0000-0000-000000000001';

-- Insert demo user data
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
    '00000000-0000-0000-0000-000000000001',
    'demo@respiro.app',
    'Alex Demo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    now(),
    'premium',
    'active',
    999999,
    180
);

-- Insert demo user preferences
INSERT INTO public.user_preferences (
    user_id,
    has_completed_onboarding,
    theme,
    notification_settings,
    meditation_experience,
    meditation_goals,
    preferred_session_duration,
    work_days,
    work_start_time,
    work_end_time,
    lunch_time,
    exercise_time,
    bed_time,
    stress_level,
    work_environment,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    true,
    'system',
    '{"streak_alerts": true, "weekly_summary": true, "session_reminders": true, "achievement_notifications": true}'::jsonb,
    'intermediate',
    ARRAY['stress_reduction', 'better_sleep', 'focus_improvement'],
    15,
    ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    '09:00',
    '17:30',
    '12:30',
    '07:00',
    '22:30',
    'moderate',
    'hybrid',
    now()
);

-- Insert demo user social profile
INSERT INTO public.user_social_profiles (
    user_id,
    display_name,
    bio,
    avatar_url,
    level,
    total_points,
    current_streak,
    longest_streak,
    privacy_settings,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Alex Demo',
    'Finding balance in a busy world 🧘‍♂️ Premium member since day one',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    12,
    2840,
    7,
    21,
    '{"profile_visibility": "public", "activity_visibility": "public", "leaderboard_participation": true}'::jsonb,
    now()
);

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
    '00000000-0000-0000-0000-000000000001',
    450,
    1250,
    800,
    '[{"type": "streak", "level": "gold"}, {"type": "focus", "level": "silver"}, {"type": "mindfulness", "level": "bronze"}]'::jsonb,
    '[{"item": "premium_theme", "quantity": 1}, {"item": "guided_session_pack", "quantity": 3}]'::jsonb,
    now()
);