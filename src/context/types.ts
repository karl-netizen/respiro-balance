
export interface MorningRitual {
  id: string;
  title: string;
  description: string;
  timeOfDay: string;
  duration: number;
  recurrence: RitualRecurrence;
  priority: RitualPriority;
  tags: string[];
  status: RitualStatus;
  streak: number;
  lastCompleted?: string;
  createdAt: Date;
  reminderEnabled: boolean;
  reminderTime: number;
  completionHistory: CompletionEntry[];
  daysOfWeek?: WorkDay[];
}

export type RitualStatus = 'planned' | 'completed' | 'skipped' | 'in_progress' | 'missed';
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualPriority = 'low' | 'medium' | 'high';
export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface CompletionEntry {
  date: string;
  success: boolean;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'streak' | 'suggestion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  time?: Date;
  action?: () => void;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  focusMode: boolean;
  morningRituals: MorningRitual[];
  wakeUpTime: string;
  sleepGoal: number;
  hydrationGoal: number;
  notificationSettings: NotificationSettings;
  isPremium: boolean;
  lastSync?: string;
  userName: string;
  userAvatar: string;
  dailyQuote: boolean;
  quoteCategory: string;
  affirmationsEnabled: boolean;
  affirmationsList: string[];
  journalPromptsEnabled: boolean;
  journalPromptsList: string[];
  gratitudeList: string[];
  mindfulnessExercises: string[];
  focusTechniques: string[];
  energyLevels: number[];
  moodStates: string[];
  stressManagementTechniques: string[];
  productivityHacks: string[];
  userRole?: 'user' | 'coach' | 'admin';
  connectedDevices?: BluetoothDeviceInfo[];
  hasWearableDevice?: boolean;
  wearableDeviceType?: string;
  wearableDeviceId?: string;
  lastSyncDate?: string;
  workDays?: string[];
  meditationGoals?: string[];
  focusChallenges?: string[];
  metricsOfInterest?: string[];
  preferredSessionDuration?: number;
  preferred_session_duration?: number;
  meditationExperience?: string;
  stressLevel?: number;
  workEnvironment?: string;
  workStartTime?: string;
  workEndTime?: string;
  lunchBreak?: boolean;
  lunchTime?: string;
  morningExercise?: boolean;
  exerciseTime?: string;
  bedTime?: string;
  recommendedSessionDuration?: number;
  recommendedMeditationTime?: number;
  recommendedTechniques?: string[];
  subscriptionTier?: string;
  businessAttribution?: string;
  hasCompletedOnboarding?: boolean;
  morningActivities?: string[];
  weekdayWakeTime?: string;
  morningEnergyLevel?: number;
  ritualDependencies?: any[];
  weatherAlternatives?: any[];
  
  // Onboarding-related properties
  lastOnboardingStep?: number;
  lastOnboardingCompleted?: boolean;
  timeChallenges?: string[];
  attributionSource?: string;
  enableSessionReminders?: boolean;
  enableProgressUpdates?: boolean;
  enableRecommendations?: boolean;
  morningDevices?: string;
  
  // Work-life balance properties
  focusTimerDuration?: number;
  breakTimerDuration?: number;
  breakReminders?: any[];
  breakNotificationsEnabled?: boolean;
  
  // Time management
  timeManagementStyle?: string;
  
  // Additional onboarding
  wakeTime?: string;
}

export interface NotificationSettings {
  morningReminder: boolean;
  eveningReflection: boolean;
  focusPrompts: boolean;
  customReminders: CustomReminder[];
}

export interface CustomReminder {
  id: string;
  time: string;
  message: string;
  days: string[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface Affirmation {
  id: string;
  text: string;
}

export interface JournalPrompt {
  id: string;
  text: string;
}

export interface GratitudeItem {
  id: string;
  text: string;
}

export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export interface FocusTechnique {
  id: string;
  title: string;
  description: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  type: DeviceType;
  connected: boolean;
  batteryLevel?: number;
  lastSync?: Date;
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  rssi?: number;
  services?: string[];
}

export type DeviceType = 'heart_rate' | 'fitness_tracker' | 'smartwatch' | 'headband' | 'other';

export interface RitualReminder {
  enabled: boolean;
  time: number; // minutes before ritual
  message?: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isCoach: boolean;
  connectBluetoothDevice: (device: BluetoothDeviceInfo) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
}
