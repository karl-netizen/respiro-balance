-- Security Fix Migration: Enable RLS and Fix Function Security
-- Phase 1: Critical Database Security Fixes

-- 1. ENABLE ROW LEVEL SECURITY ON ALL PUBLIC TABLES
-- This fixes the critical RLS disabled errors

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morning_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;

-- 2. FIX DATABASE FUNCTION SECURITY - Add proper search_path settings
-- This prevents SQL injection attacks in security definer functions

-- Fix reset_monthly_meditation_limits function
CREATE OR REPLACE FUNCTION public.reset_monthly_meditation_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.user_profiles
  SET meditation_minutes_used = 0
  WHERE subscription_tier = 'free';
END;
$function$;

-- Fix has_premium_access function
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  is_premium BOOLEAN;
BEGIN
  SELECT 
    subscription_tier IN ('premium', 'team', 'enterprise') 
    AND subscription_status IN ('active', 'trialing')
  INTO is_premium
  FROM public.user_profiles
  WHERE id = user_id_param;
  
  RETURN COALESCE(is_premium, false);
END;
$function$;

-- Fix increment_meditation_usage function
CREATE OR REPLACE FUNCTION public.increment_meditation_usage(user_id_param uuid, minutes_used integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Update the user's meditation minutes usage
  UPDATE public.user_profiles
  SET 
    meditation_minutes_used = meditation_minutes_used + minutes_used,
    last_active = NOW()
  WHERE id = user_id_param;
END;
$function$;

-- Fix increment_play_count function
CREATE OR REPLACE FUNCTION public.increment_play_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.meditation_content 
  SET play_count = play_count + 1 
  WHERE id = content_id;
END;
$function$;

-- Fix update_group_member_counts function
CREATE OR REPLACE FUNCTION public.update_group_member_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix update_comment_counts function
CREATE OR REPLACE FUNCTION public.update_comment_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.social_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.social_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix has_exceeded_free_limits function
CREATE OR REPLACE FUNCTION public.has_exceeded_free_limits(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  has_exceeded BOOLEAN;
BEGIN
  SELECT 
    subscription_tier = 'free' 
    AND meditation_minutes_used >= meditation_minutes_limit
  INTO has_exceeded
  FROM public.user_profiles
  WHERE id = user_id_param;
  
  RETURN COALESCE(has_exceeded, false);
END;
$function$;

-- Fix update_content_progress function
CREATE OR REPLACE FUNCTION public.update_content_progress(p_content_id uuid, p_progress_seconds integer, p_completed boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_content_progress (
    user_id, content_id, progress_seconds, completed, last_played_at
  ) VALUES (
    auth.uid(), p_content_id, p_progress_seconds, p_completed, now()
  )
  ON CONFLICT (user_id, content_id) 
  DO UPDATE SET 
    progress_seconds = GREATEST(public.user_content_progress.progress_seconds, p_progress_seconds),
    completed = p_completed OR public.user_content_progress.completed,
    last_played_at = now(),
    completion_count = CASE 
      WHEN p_completed AND NOT public.user_content_progress.completed THEN public.user_content_progress.completion_count + 1
      ELSE public.user_content_progress.completion_count
    END,
    updated_at = now();
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix track_subscription_change function
CREATE OR REPLACE FUNCTION public.track_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF OLD.subscription_tier != NEW.subscription_tier OR 
     OLD.subscription_status != NEW.subscription_status THEN
    
    INSERT INTO public.subscription_history(
      user_id, 
      previous_tier, 
      new_tier, 
      previous_status, 
      new_status,
      metadata
    ) VALUES (
      NEW.id,
      OLD.subscription_tier,
      NEW.subscription_tier,
      OLD.subscription_status,
      NEW.subscription_status,
      jsonb_build_object(
        'subscription_period_end', NEW.subscription_period_end,
        'subscription_id', NEW.subscription_id
      )
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix update_meditation_content_audio function
CREATE OR REPLACE FUNCTION public.update_meditation_content_audio()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.upload_status = 'completed' THEN
      UPDATE public.meditation_content 
      SET 
        has_audio = true,
        audio_duration = NEW.duration_seconds,
        audio_file_size = NEW.file_size,
        audio_file_path = NEW.file_path,
        updated_at = NOW()
      WHERE id = NEW.meditation_content_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.meditation_content 
    SET 
      has_audio = false,
      audio_duration = null,
      audio_file_size = null,
      audio_file_path = null,
      updated_at = NOW()
    WHERE id = OLD.meditation_content_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Fix update_post_interaction_counts function
CREATE OR REPLACE FUNCTION public.update_post_interaction_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.interaction_type = 'like' THEN
      UPDATE public.social_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.interaction_type = 'share' THEN
      UPDATE public.social_posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.interaction_type = 'like' THEN
      UPDATE public.social_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.interaction_type = 'share' THEN
      UPDATE public.social_posts SET shares_count = shares_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;