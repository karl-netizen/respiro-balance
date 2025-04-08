
import React from "react";
import { Button } from "@/components/ui/button";

interface OnboardingActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const OnboardingActions: React.FC<OnboardingActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip
}) => {
  return (
    <div className="flex justify-between pt-4 border-t mt-2 bg-background">
      {currentStep > 0 ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : (
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
      )}
      <Button onClick={onNext}>
        {currentStep < totalSteps - 1 ? "Continue" : "Complete"}
      </Button>
    </div>
  );
};

export default OnboardingActions;
