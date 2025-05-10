
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { user, isLoading } = useAuth();
  
  // Redirect if not authenticated or if onboarding is completed without resume intent
  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        navigate('/landing');
        return;
      }
      
      // If user has completed onboarding and there's no resume intent, redirect to dashboard
      if (preferences.hasCompletedOnboarding && !window.location.search.includes('resume=true')) {
        navigate('/dashboard');
      }
    }
  }, [user, preferences.hasCompletedOnboarding, navigate, isLoading]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 dark:from-background dark:to-background/90 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show nothing if user should be redirected
  if (!user || (preferences.hasCompletedOnboarding && !window.location.search.includes('resume=true'))) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 dark:from-background dark:to-background/90 flex items-center justify-center p-4">
      <OnboardingWizard />
    </div>
  );
};

export default OnboardingPage;
