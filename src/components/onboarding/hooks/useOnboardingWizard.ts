
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { onboardingSteps } from "../config/onboardingSteps";

export const useOnboardingWizard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [open, setOpen] = useState(!preferences.hasCompletedOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const totalSteps = onboardingSteps.length;

  // Add effect to reinitialize preferences for onboarding if needed
  useEffect(() => {
    // Check if we need to prepare preferences for onboarding
    if (!preferences.hasCompletedOnboarding && open) {
      // Ensure all required arrays are initialized
      const requiredArrays = {
        workDays: preferences.workDays || [],
        focusChallenges: preferences.focusChallenges || [],
        meditationGoals: preferences.meditationGoals || [],
        metricsOfInterest: preferences.metricsOfInterest || [],
        connectedDevices: preferences.connectedDevices || [],
        morningActivities: preferences.morningActivities || [],
        timeChallenges: preferences.timeChallenges || []
      };
      
      // Update preferences if any arrays need initialization
      const needsUpdate = Object.entries(requiredArrays).some(
        ([key, value]) => !Array.isArray(preferences[key]) || preferences[key].length === 0
      );
      
      if (needsUpdate) {
        updatePreferences(requiredArrays);
      }
    }
  }, [preferences, open, updatePreferences]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    updatePreferences({ 
      hasCompletedOnboarding: true,
      lastOnboardingCompleted: new Date().toISOString()
    });
    setOpen(false);
    toast("Onboarding completed", {
      description: "Your personalized settings have been saved."
    });
    // Navigate to dashboard when onboarding completes
    navigate('/dashboard');
  };

  const skipOnboarding = () => {
    updatePreferences({ hasCompletedOnboarding: true });
    setOpen(false);
    toast("Onboarding skipped", {
      description: "You can update your preferences anytime in settings."
    });
    // Navigate to dashboard when onboarding is skipped
    navigate('/dashboard');
  };

  return {
    open,
    setOpen,
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    completeOnboarding,
    skipOnboarding,
    preferences,
    updatePreferences,
    totalSteps
  };
};
