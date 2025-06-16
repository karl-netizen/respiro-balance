
import { onboardingStepsService, OnboardingStep, OnboardingSection } from './onboarding/OnboardingStepsService';
import { onboardingProgressService, OnboardingProgress } from './onboarding/OnboardingProgressService';
import { onboardingGuideService } from './onboarding/OnboardingGuideService';

// Re-export types for backward compatibility
export type { OnboardingStep, OnboardingSection, OnboardingProgress };

class OnboardingNotificationServiceClass {
  private static instance: OnboardingNotificationServiceClass;

  private constructor() {}

  public static getInstance(): OnboardingNotificationServiceClass {
    if (!OnboardingNotificationServiceClass.instance) {
      OnboardingNotificationServiceClass.instance = new OnboardingNotificationServiceClass();
    }
    return OnboardingNotificationServiceClass.instance;
  }

  // Delegate to smaller services
  getOnboardingSections(): OnboardingSection[] {
    return onboardingStepsService.getOnboardingSections();
  }

  getOnboardingProgress(): OnboardingProgress {
    return onboardingProgressService.getOnboardingProgress();
  }

  updateOnboardingProgress(progress: OnboardingProgress): void {
    onboardingProgressService.updateOnboardingProgress(progress);
  }

  markStepComplete(stepId: string): void {
    onboardingProgressService.markStepComplete(stepId);
  }

  calculateOverallProgress(): number {
    return onboardingGuideService.calculateOverallProgress();
  }

  shouldShowOnboardingGuide(): boolean {
    return onboardingGuideService.shouldShowOnboardingGuide();
  }
}

export const onboardingNotificationService = OnboardingNotificationServiceClass.getInstance();
