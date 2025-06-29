
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/context/types';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: 'welcome' | 'goals' | 'experience' | 'preferences' | 'first-session';
  completed: boolean;
}

interface OnboardingProfile {
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredTime: string;
  sessionDuration: number;
  interests: string[];
}

export const useIntelligentOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({
    experience: 'beginner',
    goals: [],
    preferredTime: 'morning',
    sessionDuration: 10,
    interests: []
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Respiro',
      description: 'Your journey to mindfulness begins here',
      component: 'welcome',
      completed: false
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      description: 'What would you like to achieve?',
      component: 'goals',
      completed: false
    },
    {
      id: 'experience',
      title: 'Your Experience',
      description: 'Tell us about your meditation background',
      component: 'experience',
      completed: false
    },
    {
      id: 'preferences',
      title: 'Personal Preferences',
      description: 'Customize your meditation experience',
      component: 'preferences',
      completed: false
    },
    {
      id: 'first-session',
      title: 'Your First Session',
      description: 'Let\'s start with a guided meditation',
      component: 'first-session',
      completed: false
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Convert onboarding profile to user preferences format
      const preferences: Partial<UserPreferences> = {
        notifications: {
          enabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          types: {
            reminders: true,
            achievements: true,
            social: false,
            marketing: false
          }
        },
        meditation: {
          defaultDuration: profile.sessionDuration,
          preferredTechniques: profile.interests,
          backgroundSounds: true,
          guidedVoice: 'female',
          sessionReminders: true
        }
      };
      
      // Here you would typically save to the database
      console.log('Saving onboarding preferences:', preferences);
      
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const skipOnboarding = () => {
    setIsCompleted(true);
  };

  return {
    currentStep,
    steps,
    profile,
    isCompleted,
    nextStep,
    previousStep,
    updateProfile,
    completeOnboarding,
    skipOnboarding,
    progress: ((currentStep + 1) / steps.length) * 100
  };
};
