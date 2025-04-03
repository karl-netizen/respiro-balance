
-- Function to increment meditation usage minutes for a user
-- To be deployed as a Supabase RPC function

CREATE OR REPLACE FUNCTION increment_meditation_usage(user_id_param UUID, minutes_used INT)
RETURNS VOID AS $$
BEGIN
  -- Update the user's meditation minutes usage
  UPDATE user_profiles
  SET 
    meditation_minutes_used = meditation_minutes_used + minutes_used,
    last_active = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_meditation_usage(UUID, INT) TO authenticated;
