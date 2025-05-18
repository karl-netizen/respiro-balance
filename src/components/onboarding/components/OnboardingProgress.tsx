
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-medium text-respiro-dark dark:text-respiro-light">
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-respiro-dark dark:bg-respiro-light h-3 rounded-full transition-all duration-500 ease-in-out"
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
