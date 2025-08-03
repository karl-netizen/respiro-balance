-- Fix remaining RLS and password security issues

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable leaked password protection for better security
-- This requires updating the auth.config table
-- Note: This setting might require manual configuration in Supabase dashboard