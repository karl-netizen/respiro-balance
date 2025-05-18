
import React from "react";
import { Button } from "@/components/ui/button";

interface OnboardingActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const OnboardingActions = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
}: OnboardingActionsProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between pt-4 border-t border-border dark:border-gray-600">
      <div>
        {!isFirstStep && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </Button>
        )}
      </div>
      <div className="space-x-2">
        {!isLastStep && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onSkip}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Skip
          </Button>
        )}
        <Button 
          type="button"
          onClick={onNext}
          className="bg-respiro-dark hover:bg-respiro-darker text-white"
        >
          {isLastStep ? "Complete" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingActions;
