
import { onboardingStepsService } from './OnboardingStepsService';
import { onboardingProgressService } from './OnboardingProgressService';

class OnboardingGuideServiceClass {
  private static instance: OnboardingGuideServiceClass;

  private constructor() {}

  public static getInstance(): OnboardingGuideServiceClass {
    if (!OnboardingGuideServiceClass.instance) {
      OnboardingGuideServiceClass.instance = new OnboardingGuideServiceClass();
    }
    return OnboardingGuideServiceClass.instance;
  }

  calculateOverallProgress(): number {
    const sections = onboardingStepsService.getOnboardingSections();
    const totalSteps = sections.reduce((total, section) => total + section.steps.length, 0);
    const progress = onboardingProgressService.getOnboardingProgress();
    return Math.round((progress.completedSteps.length / totalSteps) * 100);
  }

  shouldShowOnboardingGuide(): boolean {
    const progress = onboardingProgressService.getOnboardingProgress();
    return progress.completedSteps.length < 16; // Show until most steps are complete
  }

  getCurrentPhaseSteps() {
    const progress = onboardingProgressService.getOnboardingProgress();
    const sections = onboardingStepsService.getOnboardingSections();
    
    return sections.find(section => section.id === progress.currentPhase)?.steps || [];
  }

  getNextRecommendedStep() {
    const progress = onboardingProgressService.getOnboardingProgress();
    const sections = onboardingStepsService.getOnboardingSections();
    
    for (const section of sections) {
      for (const step of section.steps) {
        if (!progress.completedSteps.includes(step.id)) {
          return step;
        }
      }
    }
    
    return null;
  }
}

export const onboardingGuideService = OnboardingGuideServiceClass.getInstance();
