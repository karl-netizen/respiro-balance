import { supabase } from '@/integrations/supabase/client';

// Add error handling and retry limits to prevent infinite loops
const MAX_RETRY_ATTEMPTS = 3;
let retryCount = 0;

export const refreshTokenWithLimit = async () => {
  if (retryCount >= MAX_RETRY_ATTEMPTS) {
    console.log('Max retry attempts reached, clearing session');
    await supabase.auth.signOut();
    return null;
  }
  
  try {
    retryCount++;
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    retryCount = 0; // Reset on success
    return data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      await supabase.auth.signOut();
    }
    return null;
  }
};

export const resetRetryCount = () => {
  retryCount = 0;
};