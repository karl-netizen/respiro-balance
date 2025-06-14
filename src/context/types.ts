
import { MorningRitual as MorningRitualType } from '@/components/morning-ritual/types';

// Use unified Bluetooth types
export { BluetoothDeviceInfo, BluetoothDevice, DeviceType } from '@/types/bluetooth';

// Export morning ritual types
export type MorningRitual = MorningRitualType;
export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export interface RitualReminder {
  enabled: boolean;
  time?: number;
  message?: string;
}

export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type StressLevelType = 'low' | 'moderate' | 'high';
export type Theme = 'light' | 'dark' | 'system';

export interface NotificationSettings {
  sessionReminders: boolean;
  achievementNotifications: boolean;
  streakAlerts: boolean;
  weeklyNotifications: boolean;
}

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

export interface UserPreferences {
  // Schedule preferences
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  lunchTime: string;
  exerciseTime: string;
  bedTime: string;
  wakeTime?: string;
  weekdayWakeTime?: string;
  
  // Location and internationalization
  country?: string;
  timezone?: string;
  measurementSystem?: 'metric' | 'imperial';
  location?: UserLocation;
  
  // Wellness preferences
  lunchBreak: boolean;
  morningExercise: boolean;
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: StressLevelType;
  workEnvironment: 'office' | 'home' | 'hybrid';
  preferredSessionDuration: number;
  preferred_session_duration?: number;
  morningEnergyLevel?: string;
  
  // App preferences
  hasCompletedOnboarding: boolean;
  lastOnboardingStep?: number;
  lastOnboardingCompleted?: string;
  lastOnboardingSkipped?: string;
  notificationSettings: NotificationSettings;
  connectedDevices: BluetoothDeviceInfo[];
  hasWearableDevice: boolean;
  subscriptionTier: 'free' | 'premium' | 'team' | 'enterprise' | 'coach';
  theme: Theme;
  focusMode?: boolean;
  businessAttribution?: string;
  
  // Morning ritual specific
  morningRituals?: MorningRitual[];
  
  // Onboarding specific fields
  focusChallenges?: string[];
  metricsOfInterest?: string[];
  morningActivities?: string[];
  timeChallenges?: string[];
  energyPattern?: string;
  
  // Enhanced UX fields
  recommendedSessionDuration?: number;
  recommendedMeditationTime?: string;
  recommendedTechniques?: string[];
  
  // User profile
  userName?: string;
  userAvatar?: string;
  
  // Daily inspiration
  dailyQuote?: boolean;
  quoteCategory?: string;
  
  // Affirmations
  affirmationsEnabled?: boolean;
  affirmationsList?: string[];
  
  // Journaling
  journalPromptsEnabled?: boolean;
  journalPromptsList?: string[];
  
  // Gratitude
  gratitudeList?: string[];
  
  // Mindfulness exercises
  mindfulnessExercises?: string[];
  
  // Focus techniques
  focusTechniques?: string[];
  
  // Energy levels
  energyLevels?: string[];
  
  // Mood states
  moodStates?: string[];
  
  // Stress management techniques
  stressManagementTechniques?: string[];
  
  // Productivity hacks
  productivityHacks?: string[];

  // User role
  userRole?: 'user' | 'admin' | 'coach';
  
  // Hydration and sleep goals
  sleepGoal?: number;
  hydrationGoal?: number;
  
  // Cross-module progress
  cross_module_progress?: any;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  connectBluetoothDevice: (device: BluetoothDeviceInfo) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
  isCoach: boolean;
  isEnterprise: boolean;
  isLoading: boolean;
}
