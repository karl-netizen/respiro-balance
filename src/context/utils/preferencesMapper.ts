
import { UserPreferencesData } from '@/types/supabase';
import { UserPreferences } from '../types';

export const mapDbToUiPreferences = (
  dbPreferences: UserPreferencesData, 
  subscriptionTier: string,
  hasWearableDevice: boolean,
  role: string
): UserPreferences => {
  return {
    // User role and identification
    userRole: role as any,
    theme: dbPreferences.theme as any || 'light',
    
    // Work schedule
    workDays: dbPreferences.work_days?.map(day => day.toLowerCase()) as any || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workStartTime: dbPreferences.work_start_time || '09:00',
    workEndTime: dbPreferences.work_end_time || '17:00',
    workEnvironment: dbPreferences.work_environment as any || 'office',
    
    // Focus and productivity
    stressLevel: dbPreferences.stress_level as any || 'moderate',
    focusChallenges: [],
    energyPattern: 'morning',
    
    // Daily routine
    lunchBreak: dbPreferences.lunch_break ?? true,
    lunchTime: dbPreferences.lunch_time || '13:00',
    morningExercise: dbPreferences.morning_exercise ?? false,
    exerciseTime: dbPreferences.exercise_time || '07:00',
    bedTime: dbPreferences.bed_time || '22:00',
    
    // Meditation preferences
    meditationExperience: dbPreferences.meditation_experience as any || 'beginner',
    meditationGoals: [],
    preferredSessionDuration: dbPreferences.preferred_session_duration || 10,
    defaultMeditationDuration: dbPreferences.preferred_session_duration || 10,
    
    // App usage tracking
    lastActive: new Date().toISOString(),
    dailyUsageMinutes: 0,
    weeklyUsageMinutes: 0,
    
    // Features usage
    hasExportedData: false,
    hasSharedProgress: false,
    hasCompletedOnboarding: dbPreferences.has_completed_onboarding ?? false,
    lastOnboardingCompleted: null,
    lastOnboardingSkipped: null,
    lastOnboardingStep: null,
    hasViewedTutorial: false,
    
    // Biometric tracking
    metricsOfInterest: [],
    connectedDevices: [],
    
    // Morning ritual
    morningActivities: [],
    
    // UI preferences
    darkMode: dbPreferences.theme === 'dark',
    reducedMotion: false,
    highContrast: false,
    
    // Time management
    timeChallenges: [],

    // Subscription
    subscriptionTier: subscriptionTier || 'free',
    
    // Wearable device information
    hasWearableDevice,
    
    // Notification preferences
    notifications: true,
    notificationsSound: true,
    notificationsVibration: true,
    
    // Any additional properties from the base type
  };
};

export const mapUiToDbPreferences = (
  uiPreferences: Partial<UserPreferences>
): Partial<UserPreferencesData> => {
  const result: Partial<UserPreferencesData> = {};
  
  if (uiPreferences.theme !== undefined) {
    result.theme = uiPreferences.theme;
  }
  
  if (uiPreferences.preferredSessionDuration !== undefined) {
    result.preferred_session_duration = uiPreferences.preferredSessionDuration;
  }
  
  if (uiPreferences.workDays !== undefined) {
    result.work_days = uiPreferences.workDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)) as string[];
  }
  
  if (uiPreferences.meditationExperience !== undefined) {
    result.meditation_experience = uiPreferences.meditationExperience;
  }
  
  if (uiPreferences.stressLevel !== undefined) {
    result.stress_level = uiPreferences.stressLevel;
  }
  
  if (uiPreferences.workEnvironment !== undefined) {
    result.work_environment = uiPreferences.workEnvironment;
  }
  
  if (uiPreferences.workStartTime !== undefined) {
    result.work_start_time = uiPreferences.workStartTime;
  }
  
  if (uiPreferences.workEndTime !== undefined) {
    result.work_end_time = uiPreferences.workEndTime;
  }
  
  if (uiPreferences.lunchBreak !== undefined) {
    result.lunch_break = uiPreferences.lunchBreak;
  }
  
  if (uiPreferences.lunchTime !== undefined) {
    result.lunch_time = uiPreferences.lunchTime;
  }
  
  if (uiPreferences.morningExercise !== undefined) {
    result.morning_exercise = uiPreferences.morningExercise;
  }
  
  if (uiPreferences.exerciseTime !== undefined) {
    result.exercise_time = uiPreferences.exerciseTime;
  }
  
  if (uiPreferences.bedTime !== undefined) {
    result.bed_time = uiPreferences.bedTime;
  }
  
  if (uiPreferences.hasCompletedOnboarding !== undefined) {
    result.has_completed_onboarding = uiPreferences.hasCompletedOnboarding;
  }
  
  return result;
};
