
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/context/UserPreferencesProvider';
import { useAuth } from './useAuth';

export const useOnboardingTrigger = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { user, isLoading } = useAuth();

  // Check if we should trigger onboarding
  useEffect(() => {
    // Wait until auth is loaded and we have a user
    if (isLoading || !user) return;

    // If user has not completed onboarding, redirect to onboarding page
    if (!preferences.hasCompletedOnboarding) {
      // Check for sign-up intent (e.g. from auth callback)
      const isNewSignUp = sessionStorage.getItem('newSignUp') === 'true';
      
      if (isNewSignUp) {
        // Clear the flag
        sessionStorage.removeItem('newSignUp');
        
        // Navigate to onboarding
        navigate('/onboarding');
      }
    }
  }, [user, isLoading, preferences.hasCompletedOnboarding, navigate]);
};
