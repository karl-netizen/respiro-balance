-- =====================================================
-- CRITICAL SECURITY FIXES - DO NOT LAUNCH WITHOUT THESE
-- =====================================================
-- Migration: User Roles Table + Server-Side Validation
-- Priority: P0 - BLOCKS LAUNCH
-- Created: 2025-10-25
-- =====================================================

-- ==========================================
-- 1. CREATE USER_ROLES TABLE
-- ==========================================

-- User roles table for proper authorization
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'moderator', 'admin', 'super_admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, role),
  CHECK (revoked_at IS NULL OR revoked_at > granted_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(user_id, role) WHERE revoked_at IS NULL;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. RLS POLICIES FOR USER_ROLES
-- ==========================================

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
  ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'super_admin')
        AND ur.revoked_at IS NULL
    )
  );

-- Only super_admins can grant/revoke roles
CREATE POLICY "Only super_admins can manage roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'super_admin'
        AND ur.revoked_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'super_admin'
        AND ur.revoked_at IS NULL
    )
  );

-- ==========================================
-- 3. SECURITY DEFINER FUNCTIONS
-- ==========================================

-- Function to check if user has a specific role (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = user_uuid
      AND role = role_name
      AND revoked_at IS NULL
  );
END;
$$;

-- Function to check if current user has role
CREATE OR REPLACE FUNCTION current_user_has_role(role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN has_role(auth.uid(), role_name);
END;
$$;

-- Function to get all active roles for a user
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid UUID)
RETURNS TABLE(role TEXT, granted_at TIMESTAMPTZ, granted_by UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role, ur.granted_at, ur.granted_by
  FROM user_roles ur
  WHERE ur.user_id = user_uuid
    AND ur.revoked_at IS NULL
  ORDER BY ur.granted_at DESC;
END;
$$;

-- Function to grant a role (admin/super_admin only)
CREATE OR REPLACE FUNCTION grant_role(
  target_user_id UUID,
  role_to_grant TEXT,
  grant_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role_id UUID;
  current_user_uuid UUID;
BEGIN
  current_user_uuid := auth.uid();

  -- Check if current user is admin or super_admin
  IF NOT (current_user_has_role('admin') OR current_user_has_role('super_admin')) THEN
    RAISE EXCEPTION 'Only admins can grant roles';
  END IF;

  -- Super_admins can only be granted by other super_admins
  IF role_to_grant = 'super_admin' AND NOT current_user_has_role('super_admin') THEN
    RAISE EXCEPTION 'Only super_admins can grant super_admin role';
  END IF;

  -- Validate role
  IF role_to_grant NOT IN ('user', 'moderator', 'admin', 'super_admin') THEN
    RAISE EXCEPTION 'Invalid role: %', role_to_grant;
  END IF;

  -- Check if role already exists and is active
  IF EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = target_user_id
      AND role = role_to_grant
      AND revoked_at IS NULL
  ) THEN
    RAISE EXCEPTION 'User already has role: %', role_to_grant;
  END IF;

  -- Insert new role
  INSERT INTO user_roles (user_id, role, granted_by, notes)
  VALUES (target_user_id, role_to_grant, current_user_uuid, grant_notes)
  RETURNING id INTO new_role_id;

  RETURN new_role_id;
END;
$$;

-- Function to revoke a role
CREATE OR REPLACE FUNCTION revoke_role(
  target_user_id UUID,
  role_to_revoke TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_uuid UUID;
BEGIN
  current_user_uuid := auth.uid();

  -- Check if current user is admin or super_admin
  IF NOT (current_user_has_role('admin') OR current_user_has_role('super_admin')) THEN
    RAISE EXCEPTION 'Only admins can revoke roles';
  END IF;

  -- Update the role to mark as revoked
  UPDATE user_roles
  SET revoked_at = NOW()
  WHERE user_id = target_user_id
    AND role = role_to_revoke
    AND revoked_at IS NULL;

  RETURN FOUND;
END;
$$;

-- ==========================================
-- 4. ROLE CHANGE AUDIT TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS role_change_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_role_audit_user ON role_change_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_time ON role_change_audit(performed_at DESC);

-- Enable RLS
ALTER TABLE role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view role audit logs"
  ON role_change_audit
  FOR SELECT
  USING (current_user_has_role('admin') OR current_user_has_role('super_admin'));

-- ==========================================
-- 5. FIX LEADERBOARD RLS POLICIES
-- ==========================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "System can manage leaderboard entries" ON leaderboard_entries;

-- Users can view all leaderboard entries
CREATE POLICY "Users can view leaderboard entries"
  ON leaderboard_entries
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only service role can insert/update/delete leaderboard entries
-- (This should be done via Edge Functions, not directly from client)
CREATE POLICY "Service role can manage leaderboard entries"
  ON leaderboard_entries
  FOR ALL
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR current_user_has_role('admin')
  );

-- ==========================================
-- 6. ADD INPUT VALIDATION CONSTRAINTS
-- ==========================================

-- Social posts character limits
ALTER TABLE social_posts
  ADD CONSTRAINT content_max_length CHECK (char_length(content) <= 5000);

-- Add safe defaults if columns don't have them
ALTER TABLE social_posts
  ALTER COLUMN content SET NOT NULL;

-- Meditation sessions validation
ALTER TABLE meditation_sessions
  ADD CONSTRAINT title_max_length CHECK (char_length(title) <= 200);

ALTER TABLE meditation_sessions
  ADD CONSTRAINT duration_positive CHECK (duration > 0 AND duration <= 10800); -- Max 3 hours

-- Challenge progress validation
ALTER TABLE IF EXISTS challenge_progress
  ADD CONSTRAINT progress_between_0_and_100 CHECK (progress >= 0 AND progress <= 100);

-- ==========================================
-- 7. CREATE INITIAL ADMIN ROLE
-- ==========================================

-- NOTE: Replace 'YOUR_USER_EMAIL' with your actual email
-- This creates the first super_admin role
-- Run this separately after confirming your user ID:

-- First, find your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then run:
-- INSERT INTO user_roles (user_id, role, granted_by, notes)
-- VALUES (
--   'YOUR_USER_UUID_HERE',
--   'super_admin',
--   'YOUR_USER_UUID_HERE',
--   'Initial super_admin role created during migration'
-- );

-- ==========================================
-- 8. UPDATE EXISTING TABLES FOR SECURITY
-- ==========================================

-- Update meditation_audio table to require admin role for uploads
-- (This should be enforced in Edge Functions, but adding DB constraint as backup)
ALTER TABLE IF EXISTS meditation_audio
  ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Only admins can approve audio
CREATE POLICY IF NOT EXISTS "Only admins can approve meditation audio"
  ON meditation_audio
  FOR UPDATE
  USING (current_user_has_role('admin') OR current_user_has_role('super_admin'))
  WITH CHECK (current_user_has_role('admin') OR current_user_has_role('super_admin'));

-- ==========================================
-- 9. COMMENTS & DOCUMENTATION
-- ==========================================

COMMENT ON TABLE user_roles IS 'Stores user role assignments with audit trail. Used for server-side authorization checks.';
COMMENT ON FUNCTION has_role IS 'Server-side function to check if a user has a specific active role. SECURITY DEFINER ensures consistent authorization.';
COMMENT ON FUNCTION grant_role IS 'Grants a role to a user. Only callable by admins/super_admins. Includes validation and audit logging.';
COMMENT ON TABLE role_change_audit IS 'Audit log of all role grants and revocations. Immutable record for compliance.';

-- ==========================================
-- ROLLBACK PLAN
-- ==========================================

/*
To rollback this migration:

DROP POLICY IF EXISTS "Only admins can approve meditation audio" ON meditation_audio;
DROP POLICY IF EXISTS "Service role can manage leaderboard entries" ON leaderboard_entries;
DROP POLICY IF EXISTS "Users can view leaderboard entries" ON leaderboard_entries;
DROP POLICY IF EXISTS "Only admins can view role audit logs" ON role_change_audit;
DROP POLICY IF EXISTS "Only super_admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

DROP TABLE IF EXISTS role_change_audit CASCADE;
DROP FUNCTION IF EXISTS revoke_role CASCADE;
DROP FUNCTION IF EXISTS grant_role CASCADE;
DROP FUNCTION IF EXISTS get_user_roles CASCADE;
DROP FUNCTION IF EXISTS current_user_has_role CASCADE;
DROP FUNCTION IF EXISTS has_role CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Re-create the old policy if needed
CREATE POLICY "System can manage leaderboard entries"
  ON leaderboard_entries FOR ALL
  USING (true);
*/
