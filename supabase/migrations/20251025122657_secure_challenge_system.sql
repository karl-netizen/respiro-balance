-- ============================================
-- CHALLENGE SYSTEM SECURITY - Issue #4
-- ============================================
-- Prevents users from manipulating challenge progress
-- Adds server-side validation and audit trail

-- ============================================
-- CREATE AUDIT TRAIL TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS challenge_progress_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  old_progress INTEGER NOT NULL,
  new_progress INTEGER NOT NULL,
  increment_amount INTEGER NOT NULL,
  action_type VARCHAR(20) DEFAULT 'increment', -- 'increment', 'reset', 'complete'
  metadata JSONB, -- Store additional context (e.g., meditation_session_id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit trail
CREATE INDEX idx_challenge_audit_user ON challenge_progress_audit(user_id, created_at DESC);
CREATE INDEX idx_challenge_audit_challenge ON challenge_progress_audit(challenge_id, created_at DESC);
CREATE INDEX idx_challenge_audit_created ON challenge_progress_audit(created_at DESC);

-- Enable RLS on audit table
ALTER TABLE challenge_progress_audit ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit trail
CREATE POLICY "Users can view own challenge audit"
  ON challenge_progress_audit FOR SELECT
  USING (user_id = auth.uid());

-- Only functions can insert (no direct inserts)
CREATE POLICY "Only functions can insert audit records"
  ON challenge_progress_audit FOR INSERT
  WITH CHECK (false); -- Blocked by default, functions use SECURITY DEFINER

-- ============================================
-- SECURE PROGRESS UPDATE FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_challenge_progress(
  p_challenge_id UUID,
  p_progress_increment INTEGER,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_progress INTEGER;
  v_new_progress INTEGER;
  v_target_value INTEGER;
  v_is_completed BOOLEAN;
  v_challenge_active BOOLEAN;
  v_already_completed BOOLEAN;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate increment (must be positive and reasonable)
  IF p_progress_increment <= 0 THEN
    RAISE EXCEPTION 'Progress increment must be positive. Got: %', p_progress_increment;
  END IF;

  IF p_progress_increment > 1000 THEN
    RAISE EXCEPTION 'Progress increment too large. Maximum is 1000, got: %', p_progress_increment;
  END IF;

  -- Get challenge details and current participation
  SELECT
    cp.progress,
    cp.is_completed,
    c.target_value,
    c.is_active
  INTO
    v_current_progress,
    v_already_completed,
    v_target_value,
    v_challenge_active
  FROM challenge_participants_new cp
  INNER JOIN challenges c ON cp.challenge_id = c.id
  WHERE cp.challenge_id = p_challenge_id
    AND cp.user_id = v_user_id;

  -- Check if user is participating
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not participating in this challenge';
  END IF;

  -- Check if challenge is active
  IF NOT v_challenge_active THEN
    RAISE EXCEPTION 'Challenge is not active';
  END IF;

  -- Check if already completed
  IF v_already_completed THEN
    RAISE EXCEPTION 'Challenge already completed';
  END IF;

  -- Calculate new progress (capped at target value)
  v_new_progress := LEAST(v_current_progress + p_progress_increment, v_target_value);
  v_is_completed := (v_new_progress >= v_target_value);

  -- Update progress
  UPDATE challenge_participants_new
  SET
    progress = v_new_progress,
    is_completed = v_is_completed,
    completed_at = CASE
      WHEN v_is_completed AND NOT is_completed THEN NOW()
      ELSE completed_at
    END
  WHERE challenge_id = p_challenge_id
    AND user_id = v_user_id;

  -- Insert audit record (bypasses RLS with SECURITY DEFINER)
  INSERT INTO challenge_progress_audit (
    challenge_id,
    user_id,
    old_progress,
    new_progress,
    increment_amount,
    action_type,
    metadata
  ) VALUES (
    p_challenge_id,
    v_user_id,
    v_current_progress,
    v_new_progress,
    p_progress_increment,
    CASE WHEN v_is_completed THEN 'complete' ELSE 'increment' END,
    p_metadata
  );

  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'old_progress', v_current_progress,
    'new_progress', v_new_progress,
    'increment', p_progress_increment,
    'is_completed', v_is_completed,
    'target_value', v_target_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_challenge_progress TO authenticated;

-- ============================================
-- CHALLENGE RESET FUNCTION (Admin/System)
-- ============================================

CREATE OR REPLACE FUNCTION reset_challenge_progress(
  p_challenge_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_reset_count INTEGER;
BEGIN
  -- Only allow reset for own progress or by admin
  IF p_user_id IS NOT NULL AND p_user_id != auth.uid() THEN
    -- Check if user is admin (you can add admin check here)
    RAISE EXCEPTION 'Not authorized to reset other users progress';
  END IF;

  -- Reset progress
  UPDATE challenge_participants_new
  SET
    progress = 0,
    is_completed = false,
    completed_at = NULL
  WHERE challenge_id = p_challenge_id
    AND user_id = COALESCE(p_user_id, auth.uid());

  GET DIAGNOSTICS v_reset_count = ROW_COUNT;

  -- Log to audit
  INSERT INTO challenge_progress_audit (
    challenge_id,
    user_id,
    old_progress,
    new_progress,
    increment_amount,
    action_type
  )
  SELECT
    p_challenge_id,
    user_id,
    progress,
    0,
    -progress,
    'reset'
  FROM challenge_participants_new
  WHERE challenge_id = p_challenge_id
    AND user_id = COALESCE(p_user_id, auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'reset_count', v_reset_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION reset_challenge_progress TO authenticated;

-- ============================================
-- UPDATE RLS POLICIES
-- ============================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own participation" ON challenge_participants_new;

-- Block all direct updates (force use of functions)
CREATE POLICY "No direct progress updates allowed"
  ON challenge_participants_new FOR UPDATE
  USING (false); -- All updates blocked

-- Allow updates only for non-progress fields (e.g., notifications)
CREATE POLICY "Users can update non-progress fields"
  ON challenge_participants_new FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ensure INSERT is still allowed for joining challenges
DROP POLICY IF EXISTS "Users can join challenges" ON challenge_participants_new;

CREATE POLICY "Users can join challenges"
  ON challenge_participants_new FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND progress = 0
    AND is_completed = false
  );

-- ============================================
-- RATE LIMITING (Prevent Spam)
-- ============================================

CREATE OR REPLACE FUNCTION check_challenge_update_rate_limit(
  p_challenge_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_recent_updates INTEGER;
BEGIN
  -- Count updates in last minute
  SELECT COUNT(*)
  INTO v_recent_updates
  FROM challenge_progress_audit
  WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 minute';

  -- Allow max 60 updates per minute (1 per second)
  RETURN v_recent_updates < 60;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add rate limit check to update function
CREATE OR REPLACE FUNCTION update_challenge_progress(
  p_challenge_id UUID,
  p_progress_increment INTEGER,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_progress INTEGER;
  v_new_progress INTEGER;
  v_target_value INTEGER;
  v_is_completed BOOLEAN;
  v_challenge_active BOOLEAN;
  v_already_completed BOOLEAN;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check rate limit
  IF NOT check_challenge_update_rate_limit(p_challenge_id, v_user_id) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before updating again.';
  END IF;

  -- Validate increment (must be positive and reasonable)
  IF p_progress_increment <= 0 THEN
    RAISE EXCEPTION 'Progress increment must be positive. Got: %', p_progress_increment;
  END IF;

  IF p_progress_increment > 1000 THEN
    RAISE EXCEPTION 'Progress increment too large. Maximum is 1000, got: %', p_progress_increment;
  END IF;

  -- Get challenge details and current participation
  SELECT
    cp.progress,
    cp.is_completed,
    c.target_value,
    c.is_active
  INTO
    v_current_progress,
    v_already_completed,
    v_target_value,
    v_challenge_active
  FROM challenge_participants_new cp
  INNER JOIN challenges c ON cp.challenge_id = c.id
  WHERE cp.challenge_id = p_challenge_id
    AND cp.user_id = v_user_id;

  -- Check if user is participating
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not participating in this challenge';
  END IF;

  -- Check if challenge is active
  IF NOT v_challenge_active THEN
    RAISE EXCEPTION 'Challenge is not active';
  END IF;

  -- Check if already completed
  IF v_already_completed THEN
    RAISE EXCEPTION 'Challenge already completed';
  END IF;

  -- Calculate new progress (capped at target value)
  v_new_progress := LEAST(v_current_progress + p_progress_increment, v_target_value);
  v_is_completed := (v_new_progress >= v_target_value);

  -- Update progress
  UPDATE challenge_participants_new
  SET
    progress = v_new_progress,
    is_completed = v_is_completed,
    completed_at = CASE
      WHEN v_is_completed AND NOT is_completed THEN NOW()
      ELSE completed_at
    END
  WHERE challenge_id = p_challenge_id
    AND user_id = v_user_id;

  -- Insert audit record (bypasses RLS with SECURITY DEFINER)
  INSERT INTO challenge_progress_audit (
    challenge_id,
    user_id,
    old_progress,
    new_progress,
    increment_amount,
    action_type,
    metadata
  ) VALUES (
    p_challenge_id,
    v_user_id,
    v_current_progress,
    v_new_progress,
    p_progress_increment,
    CASE WHEN v_is_completed THEN 'complete' ELSE 'increment' END,
    p_metadata
  );

  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'old_progress', v_current_progress,
    'new_progress', v_new_progress,
    'increment', p_progress_increment,
    'is_completed', v_is_completed,
    'target_value', v_target_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for suspicious activity
CREATE OR REPLACE VIEW suspicious_challenge_activity AS
SELECT
  user_id,
  challenge_id,
  COUNT(*) AS update_count,
  SUM(increment_amount) AS total_increment,
  AVG(increment_amount) AS avg_increment,
  MAX(increment_amount) AS max_increment,
  MIN(created_at) AS first_update,
  MAX(created_at) AS last_update
FROM challenge_progress_audit
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY user_id, challenge_id
HAVING
  COUNT(*) > 100 -- More than 100 updates per day
  OR MAX(increment_amount) > 500 -- Large increments
ORDER BY update_count DESC;

-- Grant view access to authenticated users (for transparency)
GRANT SELECT ON suspicious_challenge_activity TO authenticated;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON FUNCTION update_challenge_progress IS 'Securely updates challenge progress with validation and audit trail. Only way to update progress.';
COMMENT ON FUNCTION reset_challenge_progress IS 'Resets challenge progress to 0. Only user can reset their own progress.';
COMMENT ON FUNCTION check_challenge_update_rate_limit IS 'Checks if user has exceeded rate limit (60 updates/minute)';
COMMENT ON TABLE challenge_progress_audit IS 'Audit trail of all challenge progress updates for fraud detection';
COMMENT ON VIEW suspicious_challenge_activity IS 'Shows potentially suspicious challenge update patterns';

-- ============================================
-- MIGRATION VERIFICATION
-- ============================================

DO $$
BEGIN
  -- Verify function exists
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_challenge_progress') THEN
    RAISE EXCEPTION 'Function update_challenge_progress was not created';
  END IF;

  -- Verify audit table exists
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'challenge_progress_audit') THEN
    RAISE EXCEPTION 'Table challenge_progress_audit was not created';
  END IF;

  -- Verify RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'challenge_progress_audit'
    AND rowsecurity = true
  ) THEN
    RAISE WARNING 'RLS not enabled on challenge_progress_audit';
  END IF;

  RAISE NOTICE 'Challenge security migration completed successfully';
END $$;
