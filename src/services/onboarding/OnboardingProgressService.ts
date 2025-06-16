
export interface OnboardingProgress {
  currentPhase: 'quick-start' | 'foundation' | 'habit-formation' | 'mastery';
  completedSteps: string[];
  lastUpdated: string;
}

class OnboardingProgressServiceClass {
  private static instance: OnboardingProgressServiceClass;

  private constructor() {}

  public static getInstance(): OnboardingProgressServiceClass {
    if (!OnboardingProgressServiceClass.instance) {
      OnboardingProgressServiceClass.instance = new OnboardingProgressServiceClass();
    }
    return OnboardingProgressServiceClass.instance;
  }

  getOnboardingProgress(): OnboardingProgress {
    const saved = localStorage.getItem('onboardingProgress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentPhase: 'quick-start',
      completedSteps: [],
      lastUpdated: new Date().toISOString()
    };
  }

  updateOnboardingProgress(progress: OnboardingProgress): void {
    localStorage.setItem('onboardingProgress', JSON.stringify(progress));
  }

  markStepComplete(stepId: string): void {
    const progress = this.getOnboardingProgress();
    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
      progress.lastUpdated = new Date().toISOString();
      this.updateOnboardingProgress(progress);
    }
  }
}

export const onboardingProgressService = OnboardingProgressServiceClass.getInstance();
