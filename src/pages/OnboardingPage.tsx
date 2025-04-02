
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useUserPreferences } from "@/context";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useUserPreferences();
  
  // If user has already completed onboarding, redirect to dashboard
  if (preferences.hasCompletedOnboarding) {
    navigate('/dashboard');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10 flex items-center justify-center p-4">
      <OnboardingWizard standalone={true} />
    </div>
  );
};

export default OnboardingPage;
