
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/environment';

export const isSupabaseConfigured = () => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    message: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR'
  };
};

// Singleton pattern to prevent multiple Supabase instances
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }
    
    supabaseInstance = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
})();
