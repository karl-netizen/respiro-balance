
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useUserPreferences();
  
  // If user has already completed onboarding, redirect to dashboard
  React.useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      navigate('/dashboard');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);
  
  if (preferences.hasCompletedOnboarding) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 flex items-center justify-center p-4">
      <OnboardingWizard />
    </div>
  );
};

export default OnboardingPage;
