
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { toast } from "sonner";
import WorkScheduleStep from "./steps/WorkScheduleStep";
import StressFocusStep from "./steps/StressFocusStep";
import MeditationExperienceStep from "./steps/MeditationExperienceStep";
import BiofeedbackStep from "./steps/BiofeedbackStep";
import NotificationPreferencesStep from "./steps/NotificationPreferencesStep";

const OnboardingWizard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [open, setOpen] = useState(!preferences.hasCompletedOnboarding);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Work Schedule",
      component: <WorkScheduleStep />,
      description: "Tell us about your typical work schedule",
    },
    {
      title: "Stress & Focus",
      component: <StressFocusStep />,
      description: "Help us understand your stress levels and focus challenges",
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
    updatePreferences({ hasCompletedOnboarding: true });
    setOpen(false);
    toast("Onboarding completed", {
      description: "Your personalized settings have been saved.",
    });
  };

  const skipOnboarding = () => {
    updatePreferences({ hasCompletedOnboarding: true });
    setOpen(false);
    toast("Onboarding skipped", {
      description: "You can update your preferences anytime in settings.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="space-y-6">
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

          <div className="py-4 min-h-[240px]">{steps[currentStep].component}</div>

          <div className="flex justify-between">
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
