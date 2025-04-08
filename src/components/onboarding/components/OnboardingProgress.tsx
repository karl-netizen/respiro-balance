
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-3">
        <div className="h-1 bg-secondary flex-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} 
          />
        </div>
        <span className="mx-2 text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
      
      <div className="bg-primary/10 inline-flex p-2 rounded-full mb-4">
        <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
          {currentStep + 1}
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
