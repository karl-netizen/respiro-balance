
import { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type UserRole = 'client' | 'coach' | 'admin';
export type MeditationExperience = 'beginner' | 'intermediate' | 'advanced';
export type WorkEnvironment = 'office' | 'remote' | 'hybrid';
export type StressLevel = 'low' | 'moderate' | 'high';
export type EnergyPattern = 'morning' | 'midday' | 'evening';
export type DeviceType = 'heart_rate_monitor' | 'smart_watch' | 'fitness_tracker' | 'custom';

export interface MeditationGoal {
  id: string;
  name: string;
  targetMinutes: number;
  currentMinutes: number;
}

export interface UserPreferences {
  // User role and identification
  userRole: UserRole;
  theme: Theme;
  
  // Work schedule
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  workEnvironment: WorkEnvironment;
  
  // Focus and productivity
  stressLevel: StressLevel;
  focusChallenges: string[];
  energyPattern: EnergyPattern;
  
  // Daily routine
  lunchBreak: boolean;
  lunchTime: string;
  morningExercise: boolean;
  exerciseTime: string;
  bedTime: string;
  
  // Meditation preferences
  meditationExperience: MeditationExperience;
  meditationGoals: string[];
  preferredSessionDuration: number;
  defaultMeditationDuration: number;
  
  // App usage tracking
  lastActive: string;
  dailyUsageMinutes: number;
  weeklyUsageMinutes: number;
  
  // Features usage
  hasExportedData: boolean;
  hasSharedProgress: boolean;
  hasCompletedOnboarding: boolean;
  lastOnboardingCompleted: string | null;
  lastOnboardingSkipped: string | null;
  lastOnboardingStep: number | null;
  hasViewedTutorial: boolean;
  
  // Biometric tracking
  metricsOfInterest: string[];
  connectedDevices: DeviceType[];
  
  // Morning ritual
  morningActivities: string[];
  
  // UI preferences
  darkMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Time management
  timeChallenges: string[];

  // Personalization algorithm results
  recommendedSessionDuration?: number;
  recommendedMeditationTime?: string;
  recommendedTechniques?: string[];

  // Subscription
  subscriptionTier: 'free' | 'premium' | 'team';
  
  // Any additional dynamic preferences
  [key: string]: any;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: boolean;
  connectBluetoothDevice: (deviceId: string, deviceType: DeviceType) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
}
