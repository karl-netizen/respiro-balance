
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
  sessionReminders?: boolean;
  streakAlerts?: boolean;
  achievementNotifications?: boolean;
  weeklySummary?: boolean;
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
export type RitualRecurrence = RecurrenceType; // Add this export
export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualStatus = 'planned' | 'completed' | 'skipped' | 'in_progress' | 'missed';
export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RitualReminder {
  enabled: boolean;
  time: number;
  message?: string;
}

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
  reminders: RitualReminder[];
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
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'streak' | 'suggestion';
  read: boolean;
  createdAt: Date;
  timestamp?: Date;
  actionUrl?: string;
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
  rssi?: number;
  services?: string[];
}

export type DeviceType = 'heart_rate' | 'fitness_tracker' | 'smart_watch' | 'meditation_device' | 'heart_rate_monitor';

// Session Flow Types
export interface SessionFlow {
  id: string;
  name: string;
  steps: string[];
  duration: number;
  type: 'meditation' | 'breathing' | 'focus';
  currentStep?: number;
  totalSteps?: number;
  status?: 'active' | 'paused' | 'completed';
  estimatedDuration?: number;
  currentModule?: string;
}

// Completion Entry Types
export interface CompletionEntry {
  id?: string;
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
  
  // Onboarding and setup
  hasCompletedOnboarding?: boolean;
  lastOnboardingStep?: number;
  
  // Notification settings
  notifications: NotificationSettings;
  
  // Meditation settings
  meditation: MeditationSettings;
  preferred_session_duration?: number;
  preferredSessionDuration?: number; // Added for compatibility
  defaultMeditationDuration?: number;
  
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
  weekdayWakeTime?: string;
  wakeTime?: string; // Added for compatibility
  
  // User role and experience
  userRole: 'user' | 'coach' | 'admin';
  meditationExperience: 'beginner' | 'intermediate' | 'advanced';
  meditationGoals: string[];
  stressLevel: 'low' | 'moderate' | 'high';
  workEnvironment: 'office' | 'home' | 'hybrid';
  
  // Advanced settings
  metricsOfInterest: string[];
  focusChallenges: string[];
  timeChallenges?: string[];
  hasWearableDevice: boolean;
  wearableDeviceType?: string;
  connectedDevices?: BluetoothDeviceInfo[];
  recommendedSessionDuration: number;
  recommendedMeditationTime: string;
  recommendedTechniques: string[];
  
  // Morning ritual and activities
  morningRituals?: MorningRitual[];
  morningActivities?: string[];
  morningEnergyLevel?: 'low' | 'medium' | 'high';
  morningExercise?: boolean;
  morningDevices?: string[]; // Added for compatibility
  
  // Business and attribution
  attributionSource?: string;
  
  // Additional compatibility fields
  enableSessionReminders?: boolean;
  enableProgressUpdates?: boolean;
  enableRecommendations?: boolean;
  timeManagementStyle?: string;
  notificationSettings?: NotificationSettings; // Duplicate for compatibility
  country?: string;
  measurementSystem?: 'metric' | 'imperial';
  location?: string;
  
  // App-specific settings
  darkMode?: boolean;
  reducedMotion?: boolean;
  highContrast?: boolean;
  enableBackgroundAudio?: boolean;
  highQualityAudio?: boolean;
  focusTimerDuration?: number;
  breakTimerDuration?: number;
  breakReminders?: boolean;
  breakNotificationsEnabled?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isCoach: boolean;
  isEnterprise: boolean;
  isLoading: boolean;
  connectBluetoothDevice: (deviceInfo: BluetoothDeviceInfo) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
}
