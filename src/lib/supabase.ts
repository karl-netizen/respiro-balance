
import { createClient } from '@supabase/supabase-js';

// Use direct values since VITE_* variables aren't supported in this environment
const supabaseUrl = 'https://tlwlxlthrcgscwgmsamo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2x4bHRocmNnc2N3Z21zYW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjU1NjgsImV4cCI6MjA1ODY0MTU2OH0.9clmPPt5LNlyO-dE6HN6kHSegiCxeJi1WmUgLx_CbmM';

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
