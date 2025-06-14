import { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type WorkDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';

export type RitualPriority = 'high' | 'medium' | 'low';

export type RitualStatus = 'planned' | 'in_progress' | 'completed' | 'missed' | 'partially_completed';

export interface CompletionRecord {
  date: string;
  status: RitualStatus;
  completedAt?: string;
  notes?: string;
}

export interface MorningRitual {
  id: string;
  title: string;
  description?: string;
  timeOfDay: string;
  duration: number;
  recurrence: RitualRecurrence;
  daysOfWeek?: WorkDay[];
  priority: RitualPriority;
  reminderEnabled: boolean;
  reminderTime: number;
  tags: string[];
  status: RitualStatus;
  lastCompleted?: string;
  streak: number;
  completionHistory?: CompletionRecord[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  points?: number;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  achievement?: Achievement;
}

export interface UserPreferences {
  theme: Theme;
  enableNotifications: boolean;
  weekdayWakeTime?: string;
  weekendWakeTime?: string;
  morningRituals?: MorningRitual[];
  dailyGoal?: number;
  lastSync?: string;
  biometricDataEnabled?: boolean;
  preferredLanguage?: string;
  enableDarkMode?: boolean;
  subscribedToNewsletter?: boolean;
  profileVisibility?: 'public' | 'private' | 'followers';
  displayCompletedRituals?: boolean;
  achievementNotifications?: boolean;
  reminderNotifications?: boolean;
  customNotificationSound?: string;
  snoozeDuration?: number;
  locationTrackingEnabled?: boolean;
  contextualRemindersEnabled?: boolean;
  ritualDependencies?: RitualDependency[];
  weatherAlternatives?: WeatherAlternative[];
  scheduleOptimization?: {
    autoOptimize: boolean;
    bufferTime: number;
    maxMorningDuration: number;
  };
}

export interface UserPreferencesContextProps {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

export interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface RitualFormData {
  id: string;
  title: string;
  description: string;
  date: Date | undefined;
  startTime: string;
  duration: number;
  priority: RitualPriority;
  recurrence: RecurrenceType;
  reminderEnabled: boolean;
  reminderTime: number;
  tags: string[];
  complete: boolean;
  createdAt: Date;
}

export type RecurrenceType = 'daily' | 'weekly' | 'monthly';

export interface RitualFormValues {
  title: string;
  description: string;
  timeOfDay: string;
  duration: number;
  recurrence: RecurrenceType;
  priority: RitualPriority;
  tags: string[];
}

export interface RitualDependency {
  id: string;
  parentId: string;
  childId: string;
  type: 'sequential' | 'conditional' | 'trigger';
  delay?: number; // minutes
  condition?: string;
}

export interface WeatherAlternative {
  id: string;
  ritualId: string;
  condition: 'rainy' | 'cold' | 'hot' | 'windy' | 'snowy';
  alternativeTitle: string;
  alternativeDuration: number;
  alternativeLocation: 'indoor' | 'covered' | 'different';
  description: string;
}
