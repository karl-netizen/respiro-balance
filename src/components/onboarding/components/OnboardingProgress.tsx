
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="text-gray-700 dark:text-gray-200">Step {currentStep + 1} of {totalSteps}</span>
        <span className="font-medium text-respiro-dark dark:text-respiro-light">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-respiro-dark h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
