
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'coach' | 'enterprise';
  
  // Onboarding - align with database schema
  has_completed_onboarding: boolean;
  hasCompletedOnboarding: boolean;
  lastOnboardingStep: number;
  
  // Notification settings - align with database schema  
  notification_settings: {
    session_reminders: boolean;
    progress_updates: boolean;
    achievement_notifications: boolean;
    recommendations: boolean;
    streak_alerts: boolean;
    weekly_summary: boolean;
  };
  
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
  
  // Legacy notification properties (for compatibility)
  enableSessionReminders: boolean;
  enableProgressUpdates: boolean;
  enableAchievementNotifications: boolean;
  enableRecommendations: boolean;
  notificationSettings: any;
  
  meditation: {
    defaultDuration: number;
    preferredTechniques: string[];
    backgroundSounds: boolean;
    guidedVoice: 'male' | 'female';
    sessionReminders: boolean;
  };
  
  // Session duration - align with database schema
  preferred_session_duration: number;
  preferredSessionDuration: number; // Legacy compatibility
  
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

  // Work-life balance - align with database schema
  work_days: WorkDay[];
  work_start_time: string;
  work_end_time: string;
  lunch_time: string;
  lunch_break: boolean;
  exercise_time: string;
  bed_time: string;
  
  // Legacy compatibility
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  lunchTime: string;
  lunchBreak: boolean;
  exerciseTime: string;
  bedTime: string;
  weekdayWakeTime: string;
  wakeTime: string;
  
  // User role and experience - align with database schema
  userRole: 'user' | 'coach' | 'admin';
  meditation_experience: 'beginner' | 'intermediate' | 'advanced';
  meditation_goals: string[];
  stress_level: 'low' | 'moderate' | 'high';
  work_environment: 'office' | 'home' | 'hybrid';
  
  // Legacy compatibility
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: 'low' | 'moderate' | 'high';
  workEnvironment: 'office' | 'home' | 'hybrid';
  timeManagementStyle: string;
  
  // Advanced settings - align with database schema
  metricsOfInterest: string[];
  focusChallenges: string[];
  timeChallenges: string[];
  hasWearableDevice: boolean;
  wearableDeviceType: string;
  connected_devices: any[];
  recommendedSessionDuration: number;
  recommendedMeditationTime: string;
  recommendedTechniques: string[];
  
  // Legacy compatibility
  connectedDevices: any[];
  
  // Morning ritual - align with database schema
  morningRituals: MorningRitual[];
  morningActivities: string[];
  morningEnergyLevel: 'low' | 'medium' | 'high';
  morning_exercise: boolean;
  morningDevices?: string;
  
  // Legacy compatibility
  morningExercise: boolean;
  
  // Business
  attributionSource: string;
  
  // Bluetooth devices
  connectBluetoothDevice?: (device: BluetoothDeviceInfo) => Promise<void>;
  disconnectBluetoothDevice?: (deviceId: string) => Promise<void>;
  
  // Coach functionality
  isCoach?: boolean;
  
  // Additional properties for compatibility
  country: string;
  measurementSystem: 'metric' | 'imperial';
  location: {
    country: string;
    timezone: string;
    city: string;
  };
  darkMode: boolean;
  reducedMotion: boolean;
  focusTimerDuration: number;
  breakTimerDuration: number;
  breakReminders: {
    enabled: boolean;
    frequency: number;
  };
  breakNotificationsEnabled: boolean;
  defaultMeditationDuration: number;
  highContrast: boolean;
  enableBackgroundAudio: boolean;
  highQualityAudio: boolean;
  offlineAccess: boolean;
}

export interface RitualReminder {
  enabled: boolean;
  time: number;
  message?: string;
}

export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  type: string;
}

// Morning Ritual Types
export interface MorningRitual {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  timeOfDay: string;
  duration: number;
  recurrence: RitualRecurrence;
  days_of_week?: string[];
  daysOfWeek: string[];
  reminder_enabled: boolean;
  reminder_time?: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  reminders: RitualReminder[];
  status: RitualStatus;
  streak: number;
  last_completed?: string;
  lastCompleted?: string;
  created_at: string;
  updated_at: string;
  complete?: boolean;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  date?: Date;
}

export type RitualStatus = 'planned' | 'active' | 'completed' | 'skipped' | 'archived' | 'in_progress' | 'missed';

export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface CompletionEntry {
  id: string;
  ritual_id: string;
  completed_at: string;
  notes?: string;
  mood_before?: number;
  mood_after?: number;
}

// Notification Types - align with database schema
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
  
  // Legacy compatibility properties
  type: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

// Session Flow Types
export interface SessionFlow {
  id: string;
  name: string;
  steps: SessionFlowStep[];
  duration: number;
  type: 'meditation' | 'breathing' | 'focus';
  
  // Additional properties for compatibility
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'completed' | 'paused';
  estimatedDuration: number;
  currentModule: {
    name: string;
    duration: number;
  };
}

export interface SessionFlowStep {
  id: string;
  type: 'meditation' | 'breathing' | 'break';
  duration: number;
  instructions?: string;
}

// Context Types
export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
  error: string | null;
  connectBluetoothDevice?: (device: BluetoothDeviceInfo) => Promise<void>;
  disconnectBluetoothDevice?: (deviceId: string) => Promise<void>;
  isCoach?: boolean;
}

// Device Types  
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
