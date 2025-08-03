
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const isMobile = useIsMobile();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (isMobile) {
    // Mobile: Modern dots visualization
    return (
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-primary'
                : index < currentStep
                ? 'w-2 bg-primary/60'
                : 'w-2 bg-muted'
            }`}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">
          Step {currentStep + 1} of {totalSteps}, {Math.round(progress)}% complete
        </span>
      </div>
    );
  }

  // Desktop: Traditional progress bar
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="font-medium text-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-medium text-primary">
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
