
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlwlxlthrcgscwgmsamo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2x4bHRocmNnc2N3Z21zYW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjU1NjgsImV4cCI6MjA1ODY0MTU2OH0.9clmPPt5LNlyO-dE6HN6kHSegiCxeJi1WmUgLx_CbmM';

// Singleton pattern to prevent multiple Supabase instances
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
})();
