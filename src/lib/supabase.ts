
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Create a single supabase client for the entire app
export const supabase = createClient(
  supabaseUrl || 'https://your-project-url.supabase.co',  // Fallback URL (replace with actual URL for production)
  supabaseKey || 'your-anon-key'  // Fallback key (replace with actual key for production)
);

