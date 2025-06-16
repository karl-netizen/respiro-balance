
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useCleanupEffect } from "@/hooks/useCleanupEffect";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { user, isLoading } = useAuth();
  
  // Use cleanup effect for proper navigation handling
  useCleanupEffect(() => {
    // Only redirect authenticated users to dashboard if onboarding is complete
    if (preferences.hasCompletedOnboarding && !window.location.search.includes('resume=true')) {
      if (user) {
        navigate('/dashboard');
      }
    }
  }, [preferences.hasCompletedOnboarding, user, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-800 dark:text-gray-200">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <OnboardingWizard />
    </div>
  );
};

export default OnboardingPage;
