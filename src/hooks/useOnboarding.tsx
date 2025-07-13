import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOnboardingStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchOnboardingStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('has_completed_onboarding')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding status:', error);
        throw error;
      }
      
      setHasCompletedOnboarding(data?.has_completed_onboarding || false);
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ has_completed_onboarding: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        throw error;
      }
      
      setHasCompletedOnboarding(true);
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  return {
    hasCompletedOnboarding,
    isLoading,
    completeOnboarding,
    refetch: fetchOnboardingStatus
  };
};