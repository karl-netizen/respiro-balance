
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'coach' | 'enterprise';
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  lastOnboardingStep: number;
  
  notifications: {
    enabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    types: {
      reminders: boolean;
      achievements: boolean;
      social: boolean;
      marketing: boolean;
    };
  };
  
  meditation: {
    defaultDuration: number;
    preferredTechniques: string[];
    backgroundSounds: boolean;
    guidedVoice: 'male' | 'female';
    sessionReminders: boolean;
  };
  
  preferred_session_duration: number;
  
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
    dataCollection: boolean;
  };
  
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  display: {
    compactMode: boolean;
    showAchievements: boolean;
    showStreak: boolean;
    showProgress: boolean;
  };
  
  integrations: {
    healthKit: boolean;
    googleFit: boolean;
    fitbit: boolean;
    spotify: boolean;
  };

  // Work-life balance
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  lunchTime: string;
  lunchBreak: boolean;
  exerciseTime: string;
  bedTime: string;
  weekdayWakeTime: string;
  
  // User role and experience
  userRole: 'user' | 'coach' | 'admin';
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: 'low' | 'moderate' | 'high';
  workEnvironment: 'office' | 'home' | 'hybrid';
  
  // Advanced settings
  metricsOfInterest: string[];
  focusChallenges: string[];
  timeChallenges: string[];
  hasWearableDevice: boolean;
  wearableDeviceType: string;
  connectedDevices: any[];
  recommendedSessionDuration: number;
  recommendedMeditationTime: string;
  recommendedTechniques: string[];
  
  // Morning ritual
  morningRituals: RitualReminder[];
  morningActivities: string[];
  morningEnergyLevel: 'low' | 'medium' | 'high';
  morningExercise: boolean;
  
  // Business
  attributionSource: string;
}

export interface RitualReminder {
  enabled: boolean;
  time: number;
  message: string;
}

export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  type: string;
}
