

import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          {!isFirstStep && (
            <TouchFriendlyButton 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="flex-1 min-h-[48px] font-medium"
            >
              Back
            </TouchFriendlyButton>
          )}
          <TouchFriendlyButton 
            type="button"
            onClick={onNext}
            className="flex-1 min-h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLastStep ? "Complete Setup" : "Continue"}
          </TouchFriendlyButton>
        </div>
        
        {!isLastStep && (
          <TouchFriendlyButton 
            type="button"
            variant="ghost"
            onClick={onSkip}
            className="w-full text-muted-foreground text-sm"
          >
            Skip for now
          </TouchFriendlyButton>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex justify-between items-center pt-4 border-t border-border">
      <div className="flex gap-2">
        {!isFirstStep && (
          <TouchFriendlyButton 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="font-medium"
          >
            Back
          </TouchFriendlyButton>
        )}
        {!isLastStep && (
          <TouchFriendlyButton 
            type="button"
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip
          </TouchFriendlyButton>
        )}
      </div>
      <TouchFriendlyButton 
        type="button"
        onClick={onNext}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
      >
        {isLastStep ? "Complete" : "Continue"}
      </TouchFriendlyButton>
    </div>
  );
};

export default OnboardingActions;
