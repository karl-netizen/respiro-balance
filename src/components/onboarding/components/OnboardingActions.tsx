
import React from "react";
import { Button } from "@/components/ui/button";

interface OnboardingActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;  // We'll keep this in the interface to avoid changing all implementations
}

const OnboardingActions = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,  // Kept for interface compatibility but not used
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
            className="font-medium text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </Button>
        )}
      </div>
      <div>
        <Button 
          type="button"
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
        >
          {isLastStep ? "Complete" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingActions;
