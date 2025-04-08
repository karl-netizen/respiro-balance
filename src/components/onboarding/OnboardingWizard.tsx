
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import WorkScheduleStep from "./steps/WorkScheduleStep";
import StressFocusStep from "./steps/StressFocusStep";
import MeditationExperienceStep from "./steps/MeditationExperienceStep";
import BiofeedbackStep from "./steps/BiofeedbackStep";
import NotificationPreferencesStep from "./steps/NotificationPreferencesStep";
import SleepStep from "./steps/SleepStep";
import MorningRitualStep from "./steps/MorningRitualStep";
import TimeManagementStep from "./steps/TimeManagementStep";
import BusinessSelectionStep from "./steps/BusinessSelectionStep";
import FinalStep from "./steps/FinalStep";
import { useIsMobile } from "@/hooks/use-mobile";
import LunchBreakStep from "./steps/LunchBreakStep";
import ExerciseStep from "./steps/ExerciseStep";

const OnboardingWizard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [open, setOpen] = useState(!preferences.hasCompletedOnboarding);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();

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

  const steps = [
    {
      title: "Welcome",
      component: <BusinessSelectionStep />,
      description: "Let's personalize your Respiro Balance experience",
    },
    {
      title: "Work Schedule",
      component: <WorkScheduleStep />,
      description: "Tell us about your typical work schedule",
    },
    {
      title: "Lunch Break",
      component: <LunchBreakStep />,
      description: "Let us know about your lunch break habits",
    },
    {
      title: "Exercise",
      component: <ExerciseStep />,
      description: "Tell us about your exercise routine",
    },
    {
      title: "Time Management",
      component: <TimeManagementStep />,
      description: "How do you currently manage your time during the day?",
    },
    {
      title: "Stress & Focus",
      component: <StressFocusStep />,
      description: "Help us understand your stress levels and focus challenges",
    },
    {
      title: "Morning Ritual",
      component: <MorningRitualStep />,
      description: "How do you start your day?",
    },
    {
      title: "Sleep Patterns",
      component: <SleepStep />,
      description: "Tell us about your sleep habits",
    },
    {
      title: "Meditation Experience",
      component: <MeditationExperienceStep />,
      description: "Share your experience with meditation and goals",
    },
    {
      title: "Biofeedback & Tracking",
      component: <BiofeedbackStep />,
      description: "Customize how you track your progress",
    },
    {
      title: "Notification Preferences",
      component: <NotificationPreferencesStep />,
      description: "Set up reminders to help you stay consistent",
    },
    {
      title: "Your Profile",
      component: <FinalStep />,
      description: "Review your personalized settings",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    toast({
      title: "Onboarding completed",
      description: "Your personalized settings have been saved."
    });
  };

  const skipOnboarding = () => {
    updatePreferences({ hasCompletedOnboarding: true });
    setOpen(false);
    toast({
      title: "Onboarding skipped",
      description: "You can update your preferences anytime in settings."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={`sm:max-w-[500px] ${isMobile ? 'p-4' : 'p-6'}`}
        style={{ 
          maxHeight: '90vh',
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="h-1 bg-secondary flex-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} 
                />
              </div>
              <span className="mx-2 text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <div className="bg-primary/10 inline-flex p-2 rounded-full mb-4">
              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                {currentStep + 1}
              </div>
            </div>
            <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
          </div>

          <div className="py-4 flex-grow overflow-hidden min-h-0">
            {steps[currentStep].component}
          </div>

          <div className="flex justify-between pt-4 border-t mt-2 bg-background">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={skipOnboarding}>
                Skip for now
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? "Continue" : "Complete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
