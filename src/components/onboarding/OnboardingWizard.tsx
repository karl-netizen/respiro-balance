
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    skipOnboarding
  } = useOnboardingWizard();
  
  // Set the total number of steps
  const totalSteps = onboardingSteps.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={`sm:max-w-[500px] ${isMobile ? 'p-4' : 'p-6'}`}
        style={{ 
          maxHeight: '90vh',
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Progress tracking */}
          <OnboardingProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
          
          {/* Step title and description */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{onboardingSteps[currentStep].title}</h2>
            <p className="text-muted-foreground mt-1">{onboardingSteps[currentStep].description}</p>
          </div>

          {/* Step content */}
          <div className="py-4 flex-grow overflow-hidden min-h-0">
            {onboardingSteps[currentStep].component}
          </div>

          {/* Actions */}
          <OnboardingActions
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={skipOnboarding}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
