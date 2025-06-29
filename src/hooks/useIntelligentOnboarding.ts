
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserPreferences } from '@/context';

export interface OnboardingProfile {
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  primary_goals: string[];
  preferred_session_length: number;
  stress_level: number;
  meditation_style: string[];
  time_preferences: string[];
  health_focus: string[];
  motivation_factors: string[];
}

export interface OnboardingRecommendation {
  type: 'session' | 'goal' | 'schedule' | 'feature';
  title: string;
  description: string;
  action: string;
  priority: number;
}

export const useIntelligentOnboarding = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [recommendations, setRecommendations] = useState<OnboardingRecommendation[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Generate personalized recommendations based on profile
  const generateRecommendations = (userProfile: OnboardingProfile): OnboardingRecommendation[] => {
    const recs: OnboardingRecommendation[] = [];

    // Session recommendations based on experience
    if (userProfile.experience_level === 'beginner') {
      recs.push({
        type: 'session',
        title: 'Start with Breathing Basics',
        description: 'Perfect for beginners - learn fundamental breathing techniques',
        action: 'start_breathing_session',
        priority: 1
      });
    }

    // Goal-based recommendations
    if (userProfile.primary_goals.includes('stress_relief')) {
      recs.push({
        type: 'goal',
        title: 'Set Stress Relief Goal',
        description: 'Track your stress levels and build a consistent practice',
        action: 'set_stress_goal',
        priority: 2
      });
    }

    // Schedule recommendations
    if (userProfile.time_preferences.includes('morning')) {
      recs.push({
        type: 'schedule',
        title: 'Morning Meditation Routine',
        description: 'Start your day with a 10-minute morning meditation',
        action: 'set_morning_reminder',
        priority: 3
      });
    }

    // Feature recommendations based on stress level
    if (userProfile.stress_level >= 7) {
      recs.push({
        type: 'feature',
        title: 'Enable Stress Tracking',
        description: 'Monitor your stress patterns and get personalized insights',
        action: 'enable_stress_tracking',
        priority: 4
      });
    }

    return recs.sort((a, b) => a.priority - b.priority);
  };

  // Save onboarding profile
  const saveProfile = async (newProfile: OnboardingProfile) => {
    setProfile(newProfile);
    
    // Generate recommendations
    const recs = generateRecommendations(newProfile);
    setRecommendations(recs);

    // Update user preferences
    await updatePreferences({
      ...preferences,
      onboardingProfile: newProfile,
      preferredSessionDuration: newProfile.preferred_session_length,
      hasCompletedOnboarding: true
    });

    setIsComplete(true);
  };

  // Get quick win session for immediate value
  const getQuickWinSession = (userProfile: OnboardingProfile) => {
    if (userProfile.stress_level >= 7) {
      return {
        type: 'breathing',
        title: '5-Minute Stress Relief',
        duration: 5,
        description: 'Quick breathing exercise to reduce stress immediately'
      };
    }

    if (userProfile.experience_level === 'beginner') {
      return {
        type: 'meditation',
        title: 'First Meditation',
        duration: 3,
        description: 'Gentle introduction to mindfulness meditation'
      };
    }

    return {
      type: 'focus',
      title: 'Focus Boost',
      duration: 10,
      description: 'Enhance concentration and mental clarity'
    };
  };

  return {
    profile,
    recommendations,
    currentStep,
    isComplete,
    setCurrentStep,
    saveProfile,
    getQuickWinSession,
    generateRecommendations
  };
};
