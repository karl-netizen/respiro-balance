
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  
  // Only show this toast in development to avoid showing to end users
  if (import.meta.env.DEV) {
    toast("Supabase configuration missing", {
      description: "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.",
      variant: "destructive",
      duration: 6000
    });
  }
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',  // Fallback URL for development
  supabaseKey || 'placeholder-key'  // Fallback key for development
);

// Expose a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: Error, fallbackMessage: string = "An error occurred") => {
  console.error("Supabase error:", error);
  
  let errorMessage = fallbackMessage;
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast(fallbackMessage, {
    description: errorMessage,
    variant: "destructive"
  });
  
  return errorMessage;
};
