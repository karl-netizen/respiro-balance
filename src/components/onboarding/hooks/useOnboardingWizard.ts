
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { onboardingSteps } from "../config/onboardingSteps";
import { useAuth } from "@/hooks/useAuth";
import { UserPreferences } from "@/context/types";
import { useCleanupEffect } from "@/hooks/useCleanupEffect";

export const useOnboardingWizard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const [open, setOpen] = useState(!preferences.hasCompletedOnboarding);
  const [currentStep, setCurrentStep] = useState(preferences.lastOnboardingStep || 0);
  const navigate = useNavigate();
  
  const totalSteps = onboardingSteps.length;

  // Use cleanup effect for initialization
  useCleanupEffect(() => {
    if (!preferences.hasCompletedOnboarding && open) {
      const requiredArrays = {
        workDays: preferences.workDays || [],
        focusChallenges: preferences.focusChallenges || [],
        meditationGoals: preferences.meditationGoals || [],
        metricsOfInterest: preferences.metricsOfInterest || [],
        connectedDevices: preferences.connectedDevices || [],
        morningActivities: preferences.morningActivities || [],
        timeChallenges: preferences.timeChallenges || []
      };
      
      const needsUpdate = Object.entries(requiredArrays).some(
        ([key, value]) => !Array.isArray(preferences[key]) || preferences[key].length === 0
      );
      
      if (needsUpdate) {
        updatePreferences(requiredArrays);
      }
    }
  }, [preferences, open, updatePreferences]);

  // Track analytics with cleanup
  useCleanupEffect(() => {
    if (open && currentStep > 0) {
      updatePreferences({ lastOnboardingStep: currentStep });
      console.log(`Onboarding step ${currentStep + 1}/${totalSteps} completed`);
    }
  }, [currentStep, totalSteps, open, updatePreferences]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeOnboarding = useCallback(() => {
    const personalizedSettings = generatePersonalizedSettings(preferences);
    
    updatePreferences({ 
      ...personalizedSettings,
      hasCompletedOnboarding: true,
      lastOnboardingCompleted: new Date().toISOString(),
      lastOnboardingStep: null
    });
    
    setOpen(false);
    toast("Onboarding completed", {
      description: "Your personalized settings have been saved."
    });
    
    navigate('/dashboard');
  }, [preferences, updatePreferences, navigate]);

  const skipOnboarding = useCallback(() => {
    updatePreferences({ 
      lastOnboardingStep: currentStep,
      hasCompletedOnboarding: true,
      lastOnboardingSkipped: new Date().toISOString()
    });
    
    setOpen(false);
    toast("Onboarding skipped", {
      description: "You can resume onboarding anytime from your account settings."
    });
    
    navigate('/dashboard');
  }, [currentStep, updatePreferences, navigate]);

  const resumeOnboarding = useCallback(() => {
    updatePreferences({ hasCompletedOnboarding: false });
    setOpen(true);
    navigate('/onboarding');
  }, [updatePreferences, navigate]);

  const generatePersonalizedSettings = useCallback((userPreferences: any): Partial<UserPreferences> => {
    const personalizedSettings: Partial<UserPreferences> = {
      recommendedSessionDuration: undefined,
      recommendedMeditationTime: undefined,
      recommendedTechniques: undefined
    };

    // Recommend meditation duration based on experience level
    if (userPreferences.meditationExperience === 'beginner') {
      personalizedSettings.recommendedSessionDuration = 5;
    } else if (userPreferences.meditationExperience === 'intermediate') {
      personalizedSettings.recommendedSessionDuration = 10;
    } else {
      personalizedSettings.recommendedSessionDuration = 15;
    }

    // Recommend optimal meditation time based on energy pattern
    if (userPreferences.energyPattern === 'morning') {
      personalizedSettings.recommendedMeditationTime = '06:00';
    } else if (userPreferences.energyPattern === 'evening') {
      personalizedSettings.recommendedMeditationTime = '19:00';
    } else {
      personalizedSettings.recommendedMeditationTime = userPreferences.lunchTime || '12:00';
    }

    // Recommend focus techniques based on challenges
    personalizedSettings.recommendedTechniques = [];
    
    if (userPreferences.focusChallenges && userPreferences.focusChallenges.length > 0) {
      if (userPreferences.focusChallenges.includes('distractions')) {
        personalizedSettings.recommendedTechniques.push('mindfulness');
      }
      if (userPreferences.focusChallenges.includes('procrastination')) {
        personalizedSettings.recommendedTechniques.push('pomodoro');
      }
    }

    return personalizedSettings;
  }, []);

  return {
    open,
    setOpen,
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    completeOnboarding,
    skipOnboarding,
    resumeOnboarding,
    preferences,
    updatePreferences,
    totalSteps
  };
};
