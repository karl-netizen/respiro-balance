
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileGestures } from "@/hooks/useMobileGestures";
import { useOnboardingWizard } from "./hooks/useOnboardingWizard";
import OnboardingProgress from "./components/OnboardingProgress";
import OnboardingActions from "./components/OnboardingActions";
import StepIcon from "./components/StepIcon";
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
  
  // Mobile gesture support
  const { handleTouchStart, handleTouchEnd, triggerHapticFeedback } = useMobileGestures({
    onSwipeLeft: () => {
      if (currentStep < totalSteps - 1) {
        triggerHapticFeedback('light');
        handleNext();
      }
    },
    onSwipeRight: () => {
      if (currentStep > 0) {
        triggerHapticFeedback('light');
        handleBack();
      }
    }
  });
  
  // Get the current step component
  const CurrentStepComponent = onboardingSteps[currentStep].component;

  // Mobile-first experience with full screen and gradients
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="fixed inset-0 m-0 p-0 border-0 bg-gradient-to-br from-secondary to-primary/20 dark:from-card dark:to-accent/20 flex flex-col h-full w-full max-w-full rounded-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">Respiro Balance Onboarding</DialogTitle>
          
          {/* Mobile Header with Brand */}
          <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">R</span>
                </div>
                <span className="font-semibold text-foreground">Respiro Balance</span>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-card/50 hover:bg-card transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex-shrink-0 px-4 pb-6">
            <OnboardingProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
          </div>

          {/* Step Header with Icon */}
          <div className="flex-shrink-0 px-4 pb-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <StepIcon stepIndex={currentStep} className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {onboardingSteps[currentStep].title}
            </h2>
            <p id="onboarding-description" className="text-muted-foreground text-sm leading-relaxed">
              {onboardingSteps[currentStep].description}
            </p>
          </div>

          {/* Step Content - Scrollable */}
          <div className="flex-1 px-4 overflow-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 h-full">
              {CurrentStepComponent}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex-shrink-0 p-4">
            <OnboardingActions
              currentStep={currentStep}
              totalSteps={totalSteps}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={skipOnboarding}
            />
            
            {/* Swipe Indicator */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
              {currentStep > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Swipe</span>
                </div>
              )}
              {currentStep < totalSteps - 1 && (
                <div className="flex items-center gap-1">
                  <span>Swipe</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop experience - compact and focused
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-6 bg-card border border-border">
        <DialogTitle className="sr-only">Onboarding</DialogTitle>
        <div className="flex flex-col space-y-6">
          {/* Progress tracking */}
          <OnboardingProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
          
          {/* Step title and description */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {onboardingSteps[currentStep].title}
            </h2>
            <p id="onboarding-description" className="text-muted-foreground">
              {onboardingSteps[currentStep].description}
            </p>
          </div>

          {/* Step content */}
          <div className="min-h-[300px] flex flex-col justify-center">
            {CurrentStepComponent}
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
