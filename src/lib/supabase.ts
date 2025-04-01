
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag to enable demo mode when credentials are missing
const isDemoMode = !supabaseUrl || !supabaseKey;

// Display clear message about missing configuration
if (isDemoMode) {
  console.warn(
    "⚠️ Supabase credentials missing: Running in demo mode. Authentication operations will be simulated."
  );
  
  // Only show this toast in development to avoid showing to end users
  if (import.meta.env.DEV) {
    toast("Running in demo mode", {
      description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment for full functionality.",
      duration: 6000
    });
  }
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',  // Fallback URL for development
  supabaseKey || 'placeholder-key'  // Fallback key for development
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !isDemoMode;
};

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: Error, fallbackMessage: string = "An error occurred") => {
  console.error("Supabase error:", error);
  
  // Check if this is a connection error (which is common when keys are not set)
  const isConnectionError = error.message.includes("Failed to fetch") || 
                           error.message.includes("NetworkError");
  
  let errorMessage = isConnectionError && isDemoMode
    ? "Demo mode active: This operation would connect to Supabase in production."
    : error.message || fallbackMessage;
  
  toast(isConnectionError && isDemoMode ? "Demo Mode" : fallbackMessage, {
    description: errorMessage
  });
  
  return errorMessage;
};

// In demo mode, provides mock auth functions with simulated responses
export const demoAuth = {
  isDemo: isDemoMode,
  mockSuccessResponse: (data = {}) => ({
    data: { user: { email: "demo@example.com", id: "demo-user-id" }, ...data },
    error: null
  }),
  mockErrorResponse: (message: string) => ({
    data: null,
    error: { message }
  })
};
