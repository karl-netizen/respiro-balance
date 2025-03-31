
// Type definitions for user preferences

export type WorkDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type WorkEnvironment = "office" | "home" | "hybrid";
export type StressLevel = "low" | "moderate" | "high";
export type MeditationExperience = "none" | "beginner" | "intermediate" | "advanced";
export type SubscriptionTier = "Free" | "Pro" | "Team" | "Enterprise";
export type BusinessAttribution = "KGP Coaching & Consulting" | "LearnRelaxation" | null;
export type UserRole = "client" | "coach" | "admin";
export type TimeBlockingUsage = "yes_regularly" | "yes_occasionally" | "no";
export type WorkBoundaries = "strict" | "sometimes" | "blended";
export type TimeManagementStyle = "structured" | "flexible" | "minimalist" | "need_help";
export type MorningDevicesHabit = "phone_first" | "phone_delayed" | "no_devices";
export type RitualStatus = "completed" | "in_progress" | "missed" | "planned";
export type RitualRecurrence = "daily" | "weekdays" | "weekends" | "custom";

// Create a mock BluetoothDevice interface since the Web Bluetooth API types aren't available
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
  duration: number; // in minutes
  status: RitualStatus;
  recurrence: RitualRecurrence;
  timeOfDay: string; // HH:MM format
  streak: number;
  tags: string[];
  createdAt: string;
  lastCompleted?: string;
  daysOfWeek?: WorkDay[]; // For custom recurrence
}

export interface UserPreferences {
  // User Role
  userRole: UserRole;
  coachId?: string;
  clientIds?: string[];
  
  // Business Attribution
  businessAttribution: BusinessAttribution;
  
  // Work Schedule
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  workEnvironment: WorkEnvironment;
  
  // Stress & Focus
  stressLevel: StressLevel;
  focusChallenges: string[];
  energyPattern: string;
  
  // Lunch & Breaks
  lunchBreak: boolean;
  lunchTime: string;
  
  // Exercise & Sleep
  morningExercise: boolean;
  exerciseTime: string;
  bedTime: string;
  
  // Morning Ritual
  weekdayWakeTime?: string;
  weekendWakeTime?: string;
  morningActivities?: string[];
  morningEnergyLevel?: number;
  morningDevices?: MorningDevicesHabit;
  morningRituals?: MorningRitual[];
  
  // Time Management
  timeChallenges?: string[];
  usesTimeBlocking?: TimeBlockingUsage;
  workBoundaries?: WorkBoundaries;
  timeManagementStyle?: TimeManagementStyle;
  
  // Meditation Experience
  meditationExperience: MeditationExperience;
  meditationGoals: string[];
  preferredSessionDuration: number;
  
  // Biofeedback & Tracking
  hasWearableDevice: boolean;
  wearableDeviceType?: string;
  wearableDeviceId?: string;
  lastSyncDate?: string;
  metricsOfInterest: string[];
  connectedDevices: BluetoothDevice[];
  
  // Notifications
  enableSessionReminders: boolean;
  enableProgressUpdates: boolean;
  enableRecommendations: boolean;
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  
  // Onboarding Status
  hasCompletedOnboarding: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: () => boolean;
  connectBluetoothDevice: () => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => void;
}
