
import type { MorningRitual as MorningRitualType } from '@/components/morning-ritual/types';

// Use unified Bluetooth types
export type { BluetoothDeviceInfo, BluetoothDevice, DeviceType } from '@/types/bluetooth';

// Export morning ritual types
export type MorningRitual = MorningRitualType;
export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualStatus = 'planned' | 'in_progress' | 'completed' | 'skipped' | 'missed';

export interface RitualReminder {
  enabled: boolean;
  time: number;
  message?: string;
}

// Notification types with correct type values
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'streak' | 'suggestion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface CompletionEntry {
  id: string;
  date: string;
  completed: boolean;
  duration?: number;
}

export interface SessionFlow {
  id: string;
  currentStep: number;
  totalSteps: number;
  estimatedDuration: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  currentModule: string;
  modules: string[];
}

export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type StressLevelType = 'low' | 'moderate' | 'high';
export type Theme = 'light' | 'dark' | 'system';
export type MeasurementSystem = 'metric' | 'imperial';
export type TimeManagementStyle = 'pomodoro' | 'timeblocking' | 'deadline' | 'flexible';
export type SubscriptionTier = 'free' | 'premium' | 'team' | 'enterprise' | 'coach';

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
  measurementSystem?: MeasurementSystem;
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
  morningEnergyLevel?: number;
  
  // App preferences
  hasCompletedOnboarding: boolean;
  lastOnboardingStep?: number;
  lastOnboardingCompleted?: string;
  lastOnboardingSkipped?: string;
  notificationSettings: NotificationSettings;
  connectedDevices: BluetoothDeviceInfo[];
  hasWearableDevice: boolean;
  subscriptionTier: SubscriptionTier;
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

  // Missing properties that were causing build errors
  wearableDeviceType?: string;
  attributionSource?: string;
  enableSessionReminders?: boolean;
  enableProgressUpdates?: boolean;
  enableRecommendations?: boolean;
  timeManagementStyle?: TimeManagementStyle;
  breakReminders?: any;
  breakNotificationsEnabled?: boolean;
  morningDevices?: string;
  focusTimerDuration?: number;
  breakTimerDuration?: number;
  
  // App Settings specific
  darkMode?: boolean;
  reducedMotion?: boolean;
  highContrast?: boolean;
  enableBackgroundAudio?: boolean;
  highQualityAudio?: boolean;
  offlineAccess?: boolean;
  
  // Format converters compatibility
  weeklyMeditationGoal?: number;
  defaultMeditationDuration?: number;
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
