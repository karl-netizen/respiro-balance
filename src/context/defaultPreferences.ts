
import { UserPreferences, WorkDay } from './types';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  subscriptionTier: 'free',
  
  // Onboarding - with both database and legacy names
  has_completed_onboarding: false,
  hasCompletedOnboarding: false,
  lastOnboardingStep: 0,
  
  // Notification settings - with both database and legacy names
  notification_settings: {
    session_reminders: true,
    progress_updates: true,
    achievement_notifications: true,
    recommendations: true,
    streak_alerts: true,
    weekly_summary: true,
  },
  
  notifications: {
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    types: {
      reminders: true,
      achievements: true,
      social: false,
      marketing: false
    }
  },
  
  // Legacy notification properties
  enableSessionReminders: true,
  enableProgressUpdates: true,
  enableAchievementNotifications: true,
  enableRecommendations: true,
  notificationSettings: {
    session_reminders: true,
    progress_updates: true,
    achievement_notifications: true,
  },
  
  meditation: {
    defaultDuration: 10,
    preferredTechniques: ['mindfulness', 'breathing'],
    backgroundSounds: true,
    guidedVoice: 'female',
    sessionReminders: true
  },
  
  // Session duration - with both database and legacy names
  preferred_session_duration: 10,
  preferredSessionDuration: 10,
  
  privacy: {
    shareProgress: false,
    publicProfile: false,
    dataCollection: true
  },
  
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    fontSize: 'medium'
  },
  
  display: {
    compactMode: false,
    showAchievements: true,
    showStreak: true,
    showProgress: true
  },
  
  integrations: {
    healthKit: false,
    googleFit: false,
    fitbit: false,
    spotify: false
  },

  // Work-life balance - with both database and legacy names
  work_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as WorkDay[],
  work_start_time: '09:00',
  work_end_time: '17:00',
  lunch_time: '12:00',
  lunch_break: true,
  exercise_time: '07:00',
  bed_time: '22:00',
  
  // Legacy compatibility
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as WorkDay[],
  workStartTime: '09:00',
  workEndTime: '17:00',
  lunchTime: '12:00',
  lunchBreak: true,
  exerciseTime: '07:00',
  bedTime: '22:00',
  weekdayWakeTime: '07:00',
  wakeTime: '07:00',
  
  // User role and experience - with both database and legacy names
  userRole: 'user',
  meditation_experience: 'beginner',
  meditation_goals: ['stress_reduction', 'better_sleep'],
  stress_level: 'moderate',
  work_environment: 'office',
  
  // Legacy compatibility
  meditationExperience: 'beginner',
  meditationGoals: ['stress_reduction', 'better_sleep'],
  stressLevel: 'moderate',
  workEnvironment: 'office',
  timeManagementStyle: 'pomodoro',
  
  // Advanced settings - with both database and legacy names
  metricsOfInterest: ['stress', 'focus', 'energy'],
  focusChallenges: ['distractions', 'time_management'],
  timeChallenges: ['procrastination', 'interruptions'],
  hasWearableDevice: false,
  wearableDeviceType: 'none',
  connected_devices: [],
  connectedDevices: [],
  recommendedSessionDuration: 10,
  recommendedMeditationTime: '08:00',
  recommendedTechniques: ['mindfulness', 'breathing'],
  
  // Morning ritual - with both database and legacy names
  morningRituals: [],
  morningActivities: ['meditation', 'journaling'],
  morningEnergyLevel: 'medium',
  morning_exercise: false,
  morningExercise: false,
  morningDevices: 'phone_delayed',
  
  // Additional properties for compatibility
  country: 'US',
  measurementSystem: 'metric',
  location: {
    country: 'US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    city: 'New York',
  },
  darkMode: false,
  reducedMotion: false,
  focusTimerDuration: 25,
  breakTimerDuration: 5,
  breakReminders: {
    enabled: true,
    frequency: 60,
  },
  breakNotificationsEnabled: true,
  defaultMeditationDuration: 10,
  highContrast: false,
  enableBackgroundAudio: true,
  highQualityAudio: false,
  offlineAccess: false,
  
  // Business defaults
  attributionSource: 'organic',
  
  // Coach functionality
  isCoach: false
};

export default defaultPreferences;
