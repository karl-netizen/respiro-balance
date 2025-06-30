
export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  types: {
    reminders: boolean;
    achievements: boolean;
    social: boolean;
    marketing: boolean;
  };
}

export interface MeditationSettings {
  defaultDuration: number;
  preferredTechniques: string[];
  backgroundSounds: boolean;
  guidedVoice: 'male' | 'female';
  sessionReminders: boolean;
}

// Morning Ritual Types
export type RecurrenceType = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualStatus = 'planned' | 'completed' | 'skipped' | 'in_progress' | 'missed';
export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface MorningRitual {
  id: string;
  title: string;
  description: string;
  date?: Date;
  startTime: string;
  timeOfDay: string;
  duration: number;
  priority: RitualPriority;
  recurrence: RecurrenceType;
  daysOfWeek: string[];
  reminderEnabled: boolean;
  reminderTime: number;
  tags: string[];
  complete: boolean;
  completed?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  status: RitualStatus;
  lastCompleted?: string;
  streak?: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  data?: any;
}

// Bluetooth Device Types
export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  connected: boolean;
  batteryLevel?: number;
  lastSeen?: Date;
}

export type DeviceType = 'heart_rate' | 'fitness_tracker' | 'smart_watch' | 'meditation_device';

// Session Flow Types
export interface SessionFlow {
  id: string;
  name: string;
  steps: string[];
  duration: number;
  type: 'meditation' | 'breathing' | 'focus';
}

// Completion Entry Types
export interface CompletionEntry {
  date: string;
  completed: boolean;
  duration?: number;
  notes?: string;
}

export interface UserPreferences {
  // Core settings
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'premium' | 'premium-plus' | 'premium-pro' | 'coach' | 'enterprise';
  
  // Notification settings
  notifications: NotificationSettings;
  
  // Meditation settings
  meditation: MeditationSettings;
  
  // Privacy settings
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
    dataCollection: boolean;
  };
  
  // Accessibility settings
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  // Display settings
  display: {
    compactMode: boolean;
    showAchievements: boolean;
    showStreak: boolean;
    showProgress: boolean;
  };
  
  // Integration settings
  integrations: {
    healthKit: boolean;
    googleFit: boolean;
    fitbit: boolean;
    spotify: boolean;
  };

  // Work-life balance settings
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  lunchTime: string;
  lunchBreak: boolean;
  exerciseTime: string;
  bedTime: string;
  
  // User role and experience
  userRole: 'user' | 'coach' | 'admin';
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: 'low' | 'moderate' | 'high';
  workEnvironment: 'office' | 'home' | 'hybrid';
  
  // Advanced settings
  metricsOfInterest: string[];
  focusChallenges: string[];
  hasWearableDevice: boolean;
  recommendedSessionDuration: number;
  recommendedMeditationTime: string;
  recommendedTechniques: string[];
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isCoach: boolean;
  isEnterprise: boolean;
  isLoading: boolean;
  connectBluetoothDevice: (deviceId: string) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
}
