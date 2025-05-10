
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { onboardingSteps } from "../config/onboardingSteps";
import { useAuth } from "@/hooks/useAuth";
import { UserPreferences } from "@/context/types";

export const useOnboardingWizard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const [open, setOpen] = useState(!preferences.hasCompletedOnboarding);
  const [currentStep, setCurrentStep] = useState(preferences.lastOnboardingStep || 0);
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

  // Track analytics for onboarding progress
  useEffect(() => {
    if (open && currentStep > 0) {
      // Save the current step to allow resuming later
      updatePreferences({ lastOnboardingStep: currentStep });
      
      // In a real app, we might track analytics here
      console.log(`Onboarding step ${currentStep + 1}/${totalSteps} completed`);
    }
  }, [currentStep, totalSteps, open, updatePreferences]);

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
    // Generate personalized recommendations based on user preferences
    const personalizedSettings = generatePersonalizedSettings(preferences);
    
    // Update preferences with completion status and personalized settings
    updatePreferences({ 
      ...personalizedSettings,
      hasCompletedOnboarding: true,
      lastOnboardingCompleted: new Date().toISOString(),
      lastOnboardingStep: null // Clear the step as we've completed onboarding
    });
    
    setOpen(false);
    toast("Onboarding completed", {
      description: "Your personalized settings have been saved."
    });
    
    // Navigate to dashboard when onboarding completes
    navigate('/dashboard');
  };

  const skipOnboarding = () => {
    // Save the current step in case the user wants to resume later
    updatePreferences({ 
      lastOnboardingStep: currentStep,
      hasCompletedOnboarding: true,
      lastOnboardingSkipped: new Date().toISOString()
    });
    
    setOpen(false);
    toast("Onboarding skipped", {
      description: "You can resume onboarding anytime from your account settings."
    });
    
    // Navigate to dashboard when onboarding is skipped
    navigate('/dashboard');
  };

  const resumeOnboarding = () => {
    updatePreferences({ hasCompletedOnboarding: false });
    setOpen(true);
    navigate('/onboarding');
  };

  // Generate personalized settings based on user's onboarding responses
  const generatePersonalizedSettings = (userPreferences: any): Partial<UserPreferences> => {
    // This function analyzes user preferences and generates personalized recommendations
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

    // Recommend optimal meditation time based on energy pattern and work schedule
    if (userPreferences.energyPattern === 'morning') {
      personalizedSettings.recommendedMeditationTime = '06:00';
    } else if (userPreferences.energyPattern === 'evening') {
      personalizedSettings.recommendedMeditationTime = '19:00';
    } else {
      // Default to lunchtime for midday energy or undefined patterns
      personalizedSettings.recommendedMeditationTime = userPreferences.lunchTime || '12:00';
    }

    // Recommend focus techniques based on reported challenges
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
    resumeOnboarding,
    preferences,
    updatePreferences,
    totalSteps
  };
};
