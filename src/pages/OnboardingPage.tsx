
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { user, isLoading } = useAuth();
  
  // Allow onboarding to proceed for any user (logged in or not)
  // This is important for our demo flow where users can try before registering
  
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
  
  // If user has completed onboarding and there's no resume intent, redirect to dashboard
  if (preferences.hasCompletedOnboarding && !window.location.search.includes('resume=true')) {
    // Only redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard');
      return null;
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <OnboardingWizard />
    </div>
  );
};

export default OnboardingPage;
