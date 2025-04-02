
import { Dispatch, SetStateAction } from 'react';
import { BluetoothDevice as SupabaseBluetoothDevice } from '@/types/supabase';

// Define BluetoothDevice interface to match the Supabase type
export type BluetoothDevice = SupabaseBluetoothDevice;

// Ritual types
export interface MorningRitual {
  id: string;
  title: string;
  description?: string;
  timeOfDay: string;
  duration: number;
  recurrence: RitualRecurrence;
  daysOfWeek?: WorkDay[];
  status: RitualStatus;
  streak: number;
  tags: string[];
  createdAt: string;
  lastCompleted?: string;
  
  // New fields for enhanced rituals
  priority?: RitualPriority;
  reminders?: RitualReminder[];
  isTemplate?: boolean;
  associatedGoals?: string[];
  completionHistory?: CompletionRecord[];
}

export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualStatus = 'planned' | 'in_progress' | 'completed' | 'missed' | 'partially_completed';
export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RitualReminder {
  id: string;
  time: string; // "HH:MM" format
  enabled: boolean;
  type: 'in-app' | 'email' | 'push';
}

export interface CompletionRecord {
  date: string; // ISO date string
  status: RitualStatus;
  completedAt?: string; // ISO datetime string
  notes?: string;
}

// Morning activities and related types
export type MorningDevicesHabit = 'phone_first' | 'phone_delayed' | 'no_devices';
export type UserRole = 'user' | 'coach' | 'admin';
export type TimeManagementStyle = 'pomodoro' | 'timeblocking' | 'deadline' | 'flexible';
export type WorkBoundaries = 'strict' | 'flexible' | 'blended';
export type TimeBlockingUsage = 'always' | 'sometimes' | 'never';
export type MeditationExperience = 'beginner' | 'intermediate' | 'advanced';
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type WorkEnvironment = 'office' | 'home' | 'hybrid' | 'variable';
export type SubscriptionTier = 'free' | 'premium' | 'team' | 'enterprise';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  focusMode: boolean;
  defaultMeditationDuration: number;
  preferredBreathingTechnique: string;
  showBreathingGuide: boolean;
  breathingSpeed: 'slow' | 'medium' | 'fast';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  backgroundMusic: 'nature' | 'ambient' | 'none';
  focusTimerDuration: number;
  breakTimerDuration: number;
  weeklyMeditationGoal: number;
  autoPlayNextSession: boolean;
  hasWearableDevice: boolean;
  wearableDeviceType: string;
  wearableDeviceId: string;
  lastSyncDate: string;
  connectedDevices: BluetoothDevice[];
  metricsOfInterest: string[];
  focusChallenges: string[];
  workDays: string[]; // Changed from number[] to string[] to match WorkDay type
  userRole: UserRole;
  meditationGoals: string[];
  
  // Morning ritual related
  morningRituals?: MorningRitual[];
  morningActivities?: string[];
  morningEnergyLevel?: number;
  morningDevices?: MorningDevicesHabit;
  weekdayWakeTime?: string;
  weekendWakeTime?: string;
  
  // Onboarding related
  hasCompletedOnboarding?: boolean;
  lastOnboardingCompleted?: string; // Added to fix the error
  stressLevel?: StressLevel;
  energyPattern?: string;
  workStartTime?: string;
  workEndTime?: string;
  workEnvironment?: WorkEnvironment;
  lunchBreak?: boolean;
  lunchTime?: string;
  morningExercise?: boolean;
  exerciseTime?: string;
  bedTime?: string;
  meditationExperience?: MeditationExperience;
  preferredSessionDuration?: number;
  timeChallenges?: string[];
  usesTimeBlocking?: TimeBlockingUsage;
  workBoundaries?: WorkBoundaries;
  timeManagementStyle?: TimeManagementStyle;
  
  // Notifications
  enableSessionReminders?: boolean;
  enableProgressUpdates?: boolean;
  enableRecommendations?: boolean;
  
  // Business
  businessAttribution?: string;
  subscriptionTier?: SubscriptionTier;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: () => boolean;
  connectBluetoothDevice: () => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => void;
}
