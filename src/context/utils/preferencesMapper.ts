import { UserPreferences } from '../types';
import { UserPreferencesData } from '@/types/supabase';

// Create default preferences that include all required properties
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: 'UTC',
  subscriptionTier: 'free',
  
  // Onboarding
  has_completed_onboarding: false,
  hasCompletedOnboarding: false,
  lastOnboardingStep: 0,
  
  // Notification settings
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
      social: true,
      marketing: false,
    },
  },
  
  // Legacy notification properties
  enableSessionReminders: true,
  enableProgressUpdates: true,
  enableAchievementNotifications: true,
  enableRecommendations: true,
  notificationSettings: {},
  
  meditation: {
    defaultDuration: 10,
    preferredTechniques: ['mindfulness'],
    backgroundSounds: true,
    guidedVoice: 'female',
    sessionReminders: true,
  },
  
  // Session duration
  preferred_session_duration: 10,
  preferredSessionDuration: 10,
  
  privacy: {
    shareProgress: false,
    publicProfile: false,
    dataCollection: true,
  },
  
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    fontSize: 'medium',
  },
  
  display: {
    compactMode: false,
    showAchievements: true,
    showStreak: true,
    showProgress: true,
  },
  
  integrations: {
    healthKit: false,
    googleFit: false,
    fitbit: false,
    spotify: false,
  },

  // Work-life balance
  work_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  work_start_time: '09:00',
  work_end_time: '17:00',
  lunch_time: '12:00',
  lunch_break: true,
  exercise_time: '07:00',
  bed_time: '22:00',
  
  // Legacy compatibility
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '09:00',
  workEndTime: '17:00',
  lunchTime: '12:00',
  lunchBreak: true,
  exerciseTime: '07:00',
  bedTime: '22:00',
  weekdayWakeTime: '07:00',
  wakeTime: '07:00',
  
  // User role and experience
  userRole: 'user',
  meditation_experience: 'beginner',
  meditation_goals: ['stress_reduction'],
  stress_level: 'moderate',
  work_environment: 'office',
  
  // Legacy compatibility
  meditationExperience: 'beginner',
  meditationGoals: ['stress_reduction'],
  stressLevel: 'moderate',
  workEnvironment: 'office',
  timeManagementStyle: 'flexible',
  
  // Advanced settings
  metricsOfInterest: [],
  focusChallenges: [],
  timeChallenges: [],
  hasWearableDevice: false,
  wearableDeviceType: '',
  connected_devices: [],
  recommendedSessionDuration: 10,
  recommendedMeditationTime: '08:00',
  recommendedTechniques: ['mindfulness'],
  
  // Legacy compatibility
  connectedDevices: [],
  
  // Morning ritual
  morningRituals: [],
  morningActivities: [],
  morningEnergyLevel: 'medium',
  morning_exercise: false,
  morningDevices: '',
  
  // Legacy compatibility
  morningExercise: false,
  
  // Business
  attributionSource: '',
  
  // Coach functionality
  isCoach: false,
  
  // Additional properties
  country: 'US',
  measurementSystem: 'metric',
  location: {
    country: 'US',
    timezone: 'UTC',
    city: '',
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
  highQualityAudio: true,
  offlineAccess: false,
};

export const mapDbToUiPreferences = (
  dbPreferences: UserPreferencesData | null,
  subscriptionTier?: string,
  hasWearableDevice?: boolean,
  _role?: string
): UserPreferences => {
  if (!dbPreferences) {
    return {
      ...defaultPreferences,
      subscriptionTier: subscriptionTier as any || 'free',
      hasWearableDevice: hasWearableDevice || false
    };
  }

  return {
    ...defaultPreferences,
    theme: (dbPreferences.theme as any) || defaultPreferences.theme,
    work_days: (dbPreferences.work_days as any) || defaultPreferences.work_days,
    workDays: (dbPreferences.work_days as any) || defaultPreferences.workDays,
    work_start_time: dbPreferences.work_start_time || defaultPreferences.work_start_time,
    workStartTime: dbPreferences.work_start_time || defaultPreferences.workStartTime,
    work_end_time: dbPreferences.work_end_time || defaultPreferences.work_end_time,
    workEndTime: dbPreferences.work_end_time || defaultPreferences.workEndTime,
    lunch_time: dbPreferences.lunch_time || defaultPreferences.lunch_time,
    lunchTime: dbPreferences.lunch_time || defaultPreferences.lunchTime,
    exercise_time: dbPreferences.exercise_time || defaultPreferences.exercise_time,
    exerciseTime: dbPreferences.exercise_time || defaultPreferences.exerciseTime,
    bed_time: dbPreferences.bed_time || defaultPreferences.bed_time,
    bedTime: dbPreferences.bed_time || defaultPreferences.bedTime,
    lunch_break: dbPreferences.lunch_break ?? defaultPreferences.lunch_break,
    lunchBreak: dbPreferences.lunch_break ?? defaultPreferences.lunchBreak,
    morning_exercise: dbPreferences.morning_exercise ?? defaultPreferences.morning_exercise,
    morningExercise: dbPreferences.morning_exercise ?? defaultPreferences.morningExercise,
    meditation_experience: (dbPreferences.meditation_experience as any) || defaultPreferences.meditation_experience,
    meditationExperience: (dbPreferences.meditation_experience as any) || defaultPreferences.meditationExperience,
    meditation_goals: dbPreferences.meditation_goals || defaultPreferences.meditation_goals,
    meditationGoals: dbPreferences.meditation_goals || defaultPreferences.meditationGoals,
    stress_level: (dbPreferences.stress_level as any) || defaultPreferences.stress_level,
    stressLevel: (dbPreferences.stress_level as any) || defaultPreferences.stressLevel,
    work_environment: (dbPreferences.work_environment as any) || defaultPreferences.work_environment,
    workEnvironment: (dbPreferences.work_environment as any) || defaultPreferences.workEnvironment,
    preferred_session_duration: dbPreferences.preferred_session_duration || defaultPreferences.preferred_session_duration,
    preferredSessionDuration: dbPreferences.preferred_session_duration || defaultPreferences.preferredSessionDuration,
    has_completed_onboarding: dbPreferences.has_completed_onboarding ?? defaultPreferences.has_completed_onboarding,
    hasCompletedOnboarding: dbPreferences.has_completed_onboarding ?? defaultPreferences.hasCompletedOnboarding,
    notification_settings: dbPreferences.notification_settings || defaultPreferences.notification_settings,
    connected_devices: dbPreferences.connected_devices || defaultPreferences.connected_devices,
    connectedDevices: dbPreferences.connected_devices || defaultPreferences.connectedDevices,
    hasWearableDevice: hasWearableDevice || false,
    subscriptionTier: subscriptionTier as any || 'free'
  };
};

export const mapUiToDbPreferences = (uiPreferences: Partial<UserPreferences>): Partial<UserPreferencesData> => {
  return {
    theme: uiPreferences.theme,
    preferred_session_duration: uiPreferences.preferredSessionDuration || uiPreferences.preferred_session_duration,
    work_days: uiPreferences.workDays || uiPreferences.work_days as string[],
    meditation_experience: uiPreferences.meditationExperience || uiPreferences.meditation_experience,
    meditation_goals: uiPreferences.meditationGoals || uiPreferences.meditation_goals,
    stress_level: typeof uiPreferences.stressLevel === 'string' ? 
      uiPreferences.stressLevel : 
      String(uiPreferences.stressLevel),
    work_environment: uiPreferences.workEnvironment || uiPreferences.work_environment,
    work_start_time: uiPreferences.workStartTime || uiPreferences.work_start_time,
    work_end_time: uiPreferences.workEndTime || uiPreferences.work_end_time,
    lunch_break: uiPreferences.lunchBreak ?? uiPreferences.lunch_break,
    lunch_time: uiPreferences.lunchTime || uiPreferences.lunch_time,
    morning_exercise: uiPreferences.morningExercise ?? uiPreferences.morning_exercise,
    exercise_time: uiPreferences.exerciseTime || uiPreferences.exercise_time,
    bed_time: uiPreferences.bedTime || uiPreferences.bed_time,
    has_completed_onboarding: uiPreferences.hasCompletedOnboarding ?? uiPreferences.has_completed_onboarding,
    notification_settings: uiPreferences.notificationSettings || uiPreferences.notification_settings,
    connected_devices: uiPreferences.connectedDevices || uiPreferences.connected_devices
  };
};

// Export aliases for backward compatibility
export const mapToUserPreferences = mapDbToUiPreferences;
export const mapToUserPreferencesData = mapUiToDbPreferences;