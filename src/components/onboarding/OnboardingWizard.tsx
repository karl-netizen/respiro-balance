
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOnboardingWizard } from "./hooks/useOnboardingWizard";
import OnboardingProgress from "./components/OnboardingProgress";
import OnboardingActions from "./components/OnboardingActions";
import { onboardingSteps } from "./config/onboardingSteps";

const OnboardingWizard = () => {
  const isMobile = useIsMobile();
  const {
    open,
    setOpen,
    currentStep,
    handleNext,
    handleBack,
    skipOnboarding,
    totalSteps
  } = useOnboardingWizard();
  
  // Get the current step component
  const CurrentStepComponent = onboardingSteps[currentStep].component;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={`${
          isMobile 
            ? 'w-[95vw] h-[90vh] max-w-[95vw] max-h-[90vh] p-4 m-2' 
            : 'sm:max-w-[500px] p-6'
        } bg-white dark:bg-gray-800 flex flex-col`}
        style={{ 
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? '5vh' : 'auto',
          left: isMobile ? '50%' : 'auto',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          zIndex: 9999,
        }}
        aria-describedby="onboarding-description"
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Progress tracking */}
          <div className="flex-shrink-0">
            <OnboardingProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
          </div>
          
          {/* Step title and description */}
          <div className={`text-center flex-shrink-0 ${isMobile ? 'py-2' : 'py-4'}`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold text-gray-900 dark:text-white`}>
              {onboardingSteps[currentStep].title}
            </h2>
            <p id="onboarding-description" className={`text-muted-foreground mt-1 text-gray-600 dark:text-gray-300 ${isMobile ? 'text-sm' : ''}`}>
              {onboardingSteps[currentStep].description}
            </p>
          </div>

          {/* Step content - scrollable area */}
          <div className={`flex-1 overflow-auto text-gray-800 dark:text-gray-100 ${isMobile ? 'py-2' : 'py-4'}`}>
            <div className="h-full">
              {CurrentStepComponent}
            </div>
          </div>

          {/* Actions - fixed at bottom */}
          <div className="flex-shrink-0 mt-auto">
            <OnboardingActions
              currentStep={currentStep}
              totalSteps={totalSteps}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={skipOnboarding}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
