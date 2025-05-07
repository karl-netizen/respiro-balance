
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tlwlxlthrcgscwgmsamo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2x4bHRocmNnc2N3Z21zYW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjU1NjgsImV4cCI6MjA1ODY0MTU2OH0.9clmPPt5LNlyO-dE6HN6kHSegiCxeJi1WmUgLx_CbmM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
};

// Add a handleSupabaseError utility function
export const handleSupabaseError = (error: any, defaultMessage: string): void => {
  const errorMessage = error.message || error.error_description || defaultMessage;
  toast.error(errorMessage);
};

// Add toast import at the top
import { toast } from 'sonner';
