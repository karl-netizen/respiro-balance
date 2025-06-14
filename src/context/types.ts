import { MorningRitual } from '@/components/morning-ritual/types';

// Use unified Bluetooth types
export { BluetoothDeviceInfo, BluetoothDevice, DeviceType } from '@/types/bluetooth';

export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type StressLevelType = 'low' | 'moderate' | 'high';
export type Theme = 'light' | 'dark' | 'system';

export interface NotificationSettings {
  sessionReminders: boolean;
  achievementNotifications: boolean;
  streakAlerts: boolean;
  weeklyNotifications: boolean;
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
  
  // Wellness preferences
  lunchBreak: boolean;
  morningExercise: boolean;
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: StressLevelType;
  workEnvironment: 'office' | 'home' | 'hybrid';
  preferredSessionDuration: number;
  preferred_session_duration?: number;
  
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
