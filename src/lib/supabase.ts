
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    message: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR'
  };
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
