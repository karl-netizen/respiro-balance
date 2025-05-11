import { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type UserRole = 'client' | 'coach' | 'admin';
export type MeditationExperience = 'beginner' | 'intermediate' | 'advanced';
export type WorkEnvironment = 'office' | 'remote' | 'hybrid';
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type EnergyPattern = 'morning' | 'midday' | 'evening';
export type DeviceType = 'heart_rate_monitor' | 'smart_watch' | 'fitness_tracker' | 'custom' | 'sleep_tracker' | 'fitness_watch';
export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type RitualStatus = 'completed' | 'planned' | 'missed' | 'in_progress' | 'partially_completed';
export type RitualPriority = 'high' | 'medium' | 'low';
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface MeditationGoal {
  id: string;
  name: string;
  targetMinutes: number;
  currentMinutes: number;
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected?: boolean;
  type?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface MorningRitual {
  id: string;
  title: string;
  description?: string;
  timeOfDay: string;
  duration: number;
  status: RitualStatus;
  recurrence: RitualRecurrence;
  daysOfWeek?: WorkDay[];
  priority?: RitualPriority;
  streak: number;
  lastCompleted?: string;
  tags: string[];
  completionHistory?: CompletionRecord[];
  createdAt?: string; // Add the createdAt property
}

export interface RitualReminder {
  id: string;
  time: string;
  enabled: boolean;
  type: 'in-app' | 'email' | 'push';
}

export interface CompletionRecord {
  date: string;
  status: RitualStatus;
  completedAt?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  action?: string;
  actionUrl?: string;
}

export interface UserPreferences {
  // User role and identification
  userRole: UserRole;
  theme: Theme;
  
  // Work schedule
  workDays: WorkDay[];
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
  connectedDevices: BluetoothDeviceInfo[];
  
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
  
  // Wearable device information
  hasWearableDevice?: boolean;
  wearableDeviceType?: string;
  wearableDeviceId?: string;
  lastSyncDate?: string;
  
  // Business attribution for onboarding
  businessAttribution?: 'KGP Coaching & Consulting' | 'LearnRelaxation' | null;
  
  // Notification preferences
  enableSessionReminders?: boolean;
  enableProgressUpdates?: boolean;
  enableRecommendations?: boolean;
  
  // Time management style
  timeManagementStyle?: 'pomodoro' | 'timeblocking' | 'deadline' | 'flexible';
  
  // Any additional dynamic preferences
  [key: string]: any;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: boolean;
  connectBluetoothDevice: (deviceType?: string, options?: any) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string, callback?: () => void) => Promise<boolean>;
}
