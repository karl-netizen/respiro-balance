
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { toast } from "sonner";
import WorkScheduleStep from "./steps/WorkScheduleStep";
import LunchBreakStep from "./steps/LunchBreakStep";
import ExerciseStep from "./steps/ExerciseStep";
import SleepStep from "./steps/SleepStep";
import FinalStep from "./steps/FinalStep";

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
      title: "Lunch Break",
      component: <LunchBreakStep />,
      description: "Do you take regular lunch breaks?",
    },
    {
      title: "Exercise Routine",
      component: <ExerciseStep />,
      description: "Tell us about your exercise habits",
    },
    {
      title: "Sleep Schedule",
      component: <SleepStep />,
      description: "When do you typically go to bed?",
    },
    {
      title: "All Set!",
      component: <FinalStep />,
      description: "Your personalized experience is ready",
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
      <DialogContent className="sm:max-w-[500px]" showClose={false}>
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-primary/10 inline-flex p-2 rounded-full mb-4">
              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                {currentStep + 1}
              </div>
            </div>
            <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
          </div>

          <div className="py-4">{steps[currentStep].component}</div>

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
