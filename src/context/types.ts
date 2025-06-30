
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'coach' | 'enterprise';
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  lastOnboardingStep: number;
  
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
  
  meditation: {
    defaultDuration: number;
    preferredTechniques: string[];
    backgroundSounds: boolean;
    guidedVoice: 'male' | 'female';
    sessionReminders: boolean;
  };
  
  preferred_session_duration: number;
  
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

  // Work-life balance
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  lunchTime: string;
  lunchBreak: boolean;
  exerciseTime: string;
  bedTime: string;
  weekdayWakeTime: string;
  
  // User role and experience
  userRole: 'user' | 'coach' | 'admin';
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: 'low' | 'moderate' | 'high';
  workEnvironment: 'office' | 'home' | 'hybrid';
  
  // Advanced settings
  metricsOfInterest: string[];
  focusChallenges: string[];
  timeChallenges: string[];
  hasWearableDevice: boolean;
  wearableDeviceType: string;
  connectedDevices: any[];
  recommendedSessionDuration: number;
  recommendedMeditationTime: string;
  recommendedTechniques: string[];
  
  // Morning ritual
  morningRituals: MorningRitual[];
  morningActivities: string[];
  morningEnergyLevel: 'low' | 'medium' | 'high';
  morningExercise: boolean;
  morningDevices?: string;
  
  // Business
  attributionSource: string;
  
  // Bluetooth devices
  connectBluetoothDevice?: (device: BluetoothDeviceInfo) => Promise<void>;
  disconnectBluetoothDevice?: (deviceId: string) => Promise<void>;
  
  // Coach functionality
  isCoach?: boolean;
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

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
}

// Session Flow Types
export interface SessionFlow {
  id: string;
  name: string;
  steps: SessionFlowStep[];
  duration: number;
  type: 'meditation' | 'breathing' | 'focus';
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
