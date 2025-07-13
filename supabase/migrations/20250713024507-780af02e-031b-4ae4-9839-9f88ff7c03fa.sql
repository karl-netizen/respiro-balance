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
    favorite,
    description,
    instructor,
    tags
) VALUES 
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 900, 'guided', 'Morning Clarity', 'mindfulness', true, now() - interval '1 day', 5, now() - interval '1 day', now() - interval '1 day', true, 'Start your day with focused awareness and clarity', 'Sarah Johnson', ARRAY['morning', 'clarity', 'focus']),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 600, 'breathing', 'Stress Release', 'stress-relief', true, now() - interval '2 days', 4, now() - interval '2 days', now() - interval '2 days', false, 'Release tension with deep breathing exercises', 'Michael Chen', ARRAY['stress', 'breathing', 'relaxation']),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 1200, 'sleep', 'Deep Sleep Preparation', 'sleep', true, now() - interval '3 days', 5, now() - interval '3 days', now() - interval '3 days', true, 'Prepare your mind and body for restful sleep', 'Emma Davis', ARRAY['sleep', 'evening', 'relaxation']),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 450, 'focus', 'Focus Enhancement', 'productivity', true, now() - interval '4 days', 4, now() - interval '4 days', now() - interval '4 days', false, 'Sharpen your concentration for work and study', 'David Kim', ARRAY['focus', 'productivity', 'work']),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 750, 'body_scan', 'Body Awareness', 'mindfulness', true, now() - interval '5 days', 5, now() - interval '5 days', now() - interval '5 days', true, 'Connect with your body through mindful scanning', 'Lisa Wong', ARRAY['body-scan', 'awareness', 'mindfulness'])
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
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', now() - interval '1 day', now() - interval '1 day' + interval '25 minutes', 1500, true, 1, 1, 85, 2, 'Great focus session with minimal distractions', ARRAY['work', 'productivity'], now() - interval '1 day'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', now() - interval '2 days', now() - interval '2 days' + interval '50 minutes', 3000, true, 2, 2, 92, 1, 'Excellent deep work session', ARRAY['deep-work', 'coding'], now() - interval '2 days'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', now() - interval '3 days', now() - interval '3 days' + interval '25 minutes', 1500, true, 1, 1, 78, 3, 'Good session despite some interruptions', ARRAY['study', 'learning'], now() - interval '3 days')
ON CONFLICT DO NOTHING;