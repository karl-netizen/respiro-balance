-- ============================================
-- PRIVACY CONTROLS - Security Issue #3
-- ============================================
-- Adds comprehensive privacy controls to protect user activity data
-- from being exposed to stalkers and competitors

-- ============================================
-- UPDATE PRIVACY SETTINGS DEFAULTS
-- ============================================

-- Ensure all existing users have privacy settings (if column exists)
-- Default to 'friends' for better privacy
UPDATE user_social_profiles
SET privacy_settings = COALESCE(
  privacy_settings,
  '{"profile_visibility": "friends", "activity_visibility": "friends", "stats_visibility": "private", "leaderboard_participation": true}'::jsonb
)
WHERE privacy_settings IS NULL OR privacy_settings = '{}'::jsonb;

-- Update default for new users
ALTER TABLE user_social_profiles
ALTER COLUMN privacy_settings SET DEFAULT '{"profile_visibility": "friends", "activity_visibility": "friends", "stats_visibility": "private", "leaderboard_participation": true}'::jsonb;

-- Create index on privacy_settings for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_social_profiles_privacy
ON user_social_profiles USING gin(privacy_settings);

-- ============================================
-- HELPER FUNCTION: Check if User is Friend
-- ============================================

CREATE OR REPLACE FUNCTION is_friend_of(target_user_id UUID, requester_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friendships
    WHERE (
      (user_id = requester_id AND friend_id = target_user_id)
      OR
      (user_id = target_user_id AND friend_id = requester_id)
    )
    AND status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check Profile Visibility
-- ============================================

CREATE OR REPLACE FUNCTION can_view_profile(target_user_id UUID, requester_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  visibility TEXT;
BEGIN
  -- User can always view their own profile
  IF target_user_id = requester_id THEN
    RETURN TRUE;
  END IF;

  -- Get privacy setting
  SELECT privacy_settings->>'profile_visibility'
  INTO visibility
  FROM user_social_profiles
  WHERE user_id = target_user_id;

  -- Handle different visibility levels
  IF visibility = 'public' THEN
    RETURN TRUE;
  ELSIF visibility = 'friends' THEN
    RETURN is_friend_of(target_user_id, requester_id);
  ELSE -- 'private'
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check Activity Visibility
-- ============================================

CREATE OR REPLACE FUNCTION can_view_activity(target_user_id UUID, requester_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  visibility TEXT;
BEGIN
  -- User can always view their own activity
  IF target_user_id = requester_id THEN
    RETURN TRUE;
  END IF;

  -- Get privacy setting
  SELECT privacy_settings->>'activity_visibility'
  INTO visibility
  FROM user_social_profiles
  WHERE user_id = target_user_id;

  -- Handle different visibility levels
  IF visibility = 'public' THEN
    RETURN TRUE;
  ELSIF visibility = 'friends' THEN
    RETURN is_friend_of(target_user_id, requester_id);
  ELSE -- 'private'
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- UPDATE RLS POLICIES
-- ============================================

-- Drop existing challenge participants policy
DROP POLICY IF EXISTS "Users can view challenge participants" ON challenge_participants_new;

-- Create new privacy-aware policy
CREATE POLICY "Users can view challenge participants with privacy"
  ON challenge_participants_new FOR SELECT
  USING (
    -- User can always see their own participation
    user_id = auth.uid()
    OR
    -- Or if the participating user's activity is visible
    can_view_activity(user_id, auth.uid())
  );

-- Update social posts policy if it exists
DROP POLICY IF EXISTS "Users can view posts" ON social_posts;

CREATE POLICY "Users can view posts with privacy"
  ON social_posts FOR SELECT
  USING (
    -- User can see their own posts
    user_id = auth.uid()
    OR
    -- Or posts marked as public
    privacy_level = 'public'
    OR
    -- Or posts from users whose activity is visible
    (privacy_level = 'friends' AND can_view_activity(user_id, auth.uid()))
  );

-- ============================================
-- CREATE ACTIVITY LOG TABLE (for audit trail)
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'meditation', 'challenge_join', 'achievement_unlock'
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_type ON user_activity_log(activity_type);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Only user can view their own activity log
CREATE POLICY "Users can view own activity log"
  ON user_activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity"
  ON user_activity_log FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- MEDITATION STATS PRIVACY
-- ============================================

-- Create privacy-aware view for meditation stats
CREATE OR REPLACE VIEW public_meditation_stats AS
SELECT
  up.user_id,
  up.display_name,
  up.avatar_url,
  up.level,
  up.current_streak,
  up.longest_streak,
  up.total_points,
  -- Only show detailed stats if activity visibility allows
  CASE
    WHEN up.privacy_settings->>'stats_visibility' = 'public' THEN jsonb_build_object(
      'total_minutes', COALESCE(SUM(ms.duration_minutes), 0),
      'total_sessions', COALESCE(COUNT(ms.id), 0),
      'avg_session_length', COALESCE(AVG(ms.duration_minutes), 0)
    )
    WHEN up.privacy_settings->>'stats_visibility' = 'friends' THEN jsonb_build_object(
      'total_minutes', CASE WHEN is_friend_of(up.user_id, auth.uid()) THEN COALESCE(SUM(ms.duration_minutes), 0) ELSE NULL END,
      'total_sessions', CASE WHEN is_friend_of(up.user_id, auth.uid()) THEN COALESCE(COUNT(ms.id), 0) ELSE NULL END
    )
    ELSE jsonb_build_object() -- private
  END AS stats
FROM user_social_profiles up
LEFT JOIN meditation_sessions ms ON up.user_id = ms.user_id
GROUP BY up.user_id, up.display_name, up.avatar_url, up.level, up.current_streak, up.longest_streak, up.total_points, up.privacy_settings;

-- ============================================
-- CHALLENGE LEADERBOARD PRIVACY
-- ============================================

-- Create privacy-aware leaderboard view
CREATE OR REPLACE VIEW challenge_leaderboard AS
SELECT
  c.id AS challenge_id,
  c.name AS challenge_name,
  cp.user_id,
  up.display_name,
  up.avatar_url,
  cp.progress,
  cp.is_completed,
  cp.completed_at,
  cp.joined_at,
  ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY cp.progress DESC, cp.completed_at ASC) AS rank
FROM challenges c
INNER JOIN challenge_participants_new cp ON c.id = cp.challenge_id
INNER JOIN user_social_profiles up ON cp.user_id = up.user_id
WHERE
  c.is_active = true
  AND (
    -- User's own participation
    cp.user_id = auth.uid()
    OR
    -- User has leaderboard participation enabled
    (up.privacy_settings->>'leaderboard_participation')::boolean = true
  )
  AND (
    -- Activity is visible
    can_view_activity(cp.user_id, auth.uid())
  );

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public_meditation_stats TO authenticated;
GRANT SELECT ON challenge_leaderboard TO authenticated;

-- ============================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN user_social_profiles.privacy_settings IS 'JSON object containing privacy preferences: profile_visibility (public/friends/private), activity_visibility (public/friends/private), stats_visibility (public/friends/private), leaderboard_participation (boolean)';

COMMENT ON FUNCTION can_view_profile(UUID, UUID) IS 'Checks if requester can view target user profile based on privacy settings';

COMMENT ON FUNCTION can_view_activity(UUID, UUID) IS 'Checks if requester can view target user activity (challenges, stats) based on privacy settings';

COMMENT ON TABLE user_activity_log IS 'Audit trail of user activities for privacy and security compliance';

-- ============================================
-- MIGRATION VERIFICATION
-- ============================================

-- Verify privacy settings were applied
DO $$
DECLARE
  users_without_privacy INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO users_without_privacy
  FROM user_social_profiles
  WHERE privacy_settings IS NULL OR privacy_settings = '{}'::jsonb;

  IF users_without_privacy > 0 THEN
    RAISE WARNING 'Warning: % users still have empty privacy settings', users_without_privacy;
  ELSE
    RAISE NOTICE 'Success: All users have privacy settings configured';
  END IF;
END $$;
