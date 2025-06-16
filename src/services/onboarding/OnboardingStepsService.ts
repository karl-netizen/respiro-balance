
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface OnboardingSection {
  id: string;
  title: string;
  description: string;
  steps: OnboardingStep[];
  expanded: boolean;
}

class OnboardingStepsServiceClass {
  private static instance: OnboardingStepsServiceClass;

  private constructor() {}

  public static getInstance(): OnboardingStepsServiceClass {
    if (!OnboardingStepsServiceClass.instance) {
      OnboardingStepsServiceClass.instance = new OnboardingStepsServiceClass();
    }
    return OnboardingStepsServiceClass.instance;
  }

  getOnboardingSections(): OnboardingSection[] {
    return [
      {
        id: 'quick-start',
        title: 'Quick Start (First 3 Days)',
        description: 'Essential first steps to begin your wellness journey',
        expanded: true,
        steps: [
          {
            id: 'complete-assessment',
            title: 'Complete Initial Assessment',
            description: 'Set up your profile in Settings',
            completed: false,
            actionUrl: '/settings',
            actionText: 'Go to Settings'
          },
          {
            id: 'first-meditation',
            title: 'Try Your First Meditation',
            description: 'Start with "Morning Mindfulness" (10 minutes, FREE)',
            completed: false,
            actionUrl: '/meditate',
            actionText: 'Start Meditation'
          },
          {
            id: 'basic-breathing',
            title: 'Practice Basic Breathing',
            description: 'Experience "Box Breathing" for 5 minutes',
            completed: false,
            actionUrl: '/breathe',
            actionText: 'Try Breathing'
          },
          {
            id: 'morning-ritual',
            title: 'Create Simple Morning Ritual',
            description: 'Build your first daily routine',
            completed: false,
            actionUrl: '/morning-ritual',
            actionText: 'Create Ritual'
          }
        ]
      },
      {
        id: 'foundation',
        title: 'Week 1: Foundation Building',
        description: 'Explore core features and find your preferences',
        expanded: false,
        steps: [
          {
            id: 'explore-meditation',
            title: 'Explore Meditation Categories',
            description: 'Try guided, quick breaks, and focus sessions',
            completed: false,
            actionUrl: '/meditate',
            actionText: 'Explore Library'
          },
          {
            id: 'breathing-techniques',
            title: 'Experiment with Breathing',
            description: 'Test 2-3 different breathing techniques',
            completed: false,
            actionUrl: '/breathe',
            actionText: 'Try Techniques'
          },
          {
            id: 'focus-session',
            title: 'Complete First Focus Session',
            description: 'Experience Pomodoro productivity method',
            completed: false,
            actionUrl: '/focus',
            actionText: 'Start Focus'
          },
          {
            id: 'join-community',
            title: 'Join the Community',
            description: 'Introduce yourself and explore social features',
            completed: false,
            actionUrl: '/social',
            actionText: 'Explore Community'
          }
        ]
      },
      {
        id: 'habit-formation',
        title: 'Week 2-4: Habit Formation',
        description: 'Build consistency and track your progress',
        expanded: false,
        steps: [
          {
            id: 'daily-practice',
            title: 'Establish Daily Practice',
            description: 'Aim for consistency, even if sessions are brief',
            completed: false,
            actionUrl: '/dashboard',
            actionText: 'View Progress'
          },
          {
            id: 'track-progress',
            title: 'Track Your Progress',
            description: 'Monitor achievements and celebrate milestones',
            completed: false,
            actionUrl: '/progress',
            actionText: 'Check Progress'
          },
          {
            id: 'biofeedback-device',
            title: 'Connect Biofeedback Device',
            description: 'Enhance practice with real-time data (optional)',
            completed: false,
            actionUrl: '/biofeedback',
            actionText: 'Connect Device'
          },
          {
            id: 'community-participation',
            title: 'Participate in Community',
            description: 'Join challenges and connect with others',
            completed: false,
            actionUrl: '/social',
            actionText: 'Join Challenges'
          }
        ]
      },
      {
        id: 'mastery',
        title: 'Beyond: Mastery and Growth',
        description: 'Advance your practice and inspire others',
        expanded: false,
        steps: [
          {
            id: 'advanced-techniques',
            title: 'Develop Advanced Techniques',
            description: 'Explore deeper meditation practices',
            completed: false,
            actionUrl: '/meditate',
            actionText: 'Advanced Library'
          },
          {
            id: 'personalized-routines',
            title: 'Create Personalised Routines',
            description: 'Build custom morning rituals and focus strategies',
            completed: false,
            actionUrl: '/morning-ritual',
            actionText: 'Customize Rituals'
          },
          {
            id: 'share-journey',
            title: 'Share Your Journey',
            description: 'Inspire others through community engagement',
            completed: false,
            actionUrl: '/social',
            actionText: 'Share Story'
          },
          {
            id: 'premium-features',
            title: 'Explore Premium Features',
            description: 'Unlock advanced content and biofeedback integration',
            completed: false,
            actionUrl: '/subscription',
            actionText: 'View Plans'
          }
        ]
      }
    ];
  }
}

export const onboardingStepsService = OnboardingStepsServiceClass.getInstance();
