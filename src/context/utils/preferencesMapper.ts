
import { UserPreferences } from '../types';
import { UserPreferencesData } from '@/types/supabase';

// Create default preferences inline since the file doesn't exist yet
const defaultPreferences: UserPreferences = {
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '09:00',
  workEndTime: '17:00',
  lunchTime: '12:00',
  exerciseTime: '07:00',
  bedTime: '22:00',
  lunchBreak: true,
  morningExercise: false,
  meditationExperience: 'beginner',
  meditationGoals: ['stress_reduction', 'better_sleep'],
  stressLevel: 'moderate',
  workEnvironment: 'office',
  preferredSessionDuration: 10,
  hasCompletedOnboarding: false,
  notificationSettings: {
    sessionReminders: true,
    achievementNotifications: true,
    streakAlerts: true,
    weeklyNotifications: true
  },
  connectedDevices: [],
  hasWearableDevice: false,
  subscriptionTier: 'free',
  theme: 'system'
};

export const mapDbToUiPreferences = (
  dbPreferences: UserPreferencesData | null,
  subscriptionTier?: string,
  hasWearableDevice?: boolean,
  role?: string
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
    workDays: (dbPreferences.work_days as any) || defaultPreferences.workDays,
    workStartTime: dbPreferences.work_start_time || defaultPreferences.workStartTime,
    workEndTime: dbPreferences.work_end_time || defaultPreferences.workEndTime,
    lunchTime: dbPreferences.lunch_time || defaultPreferences.lunchTime,
    exerciseTime: dbPreferences.exercise_time || defaultPreferences.exerciseTime,
    bedTime: dbPreferences.bed_time || defaultPreferences.bedTime,
    lunchBreak: dbPreferences.lunch_break ?? defaultPreferences.lunchBreak,
    morningExercise: dbPreferences.morning_exercise ?? defaultPreferences.morningExercise,
    meditationExperience: (dbPreferences.meditation_experience as any) || defaultPreferences.meditationExperience,
    meditationGoals: dbPreferences.meditation_goals || defaultPreferences.meditationGoals,
    stressLevel: (dbPreferences.stress_level as any) || defaultPreferences.stressLevel,
    workEnvironment: (dbPreferences.work_environment as any) || defaultPreferences.workEnvironment,
    preferredSessionDuration: dbPreferences.preferred_session_duration || defaultPreferences.preferredSessionDuration,
    hasCompletedOnboarding: dbPreferences.has_completed_onboarding ?? defaultPreferences.hasCompletedOnboarding,
    notificationSettings: dbPreferences.notification_settings || defaultPreferences.notificationSettings,
    connectedDevices: dbPreferences.connected_devices || defaultPreferences.connectedDevices,
    hasWearableDevice: hasWearableDevice || false,
    subscriptionTier: subscriptionTier as any || 'free'
  };
};

export const mapUiToDbPreferences = (uiPreferences: Partial<UserPreferences>): Partial<UserPreferencesData> => {
  return {
    theme: uiPreferences.theme,
    preferred_session_duration: uiPreferences.preferredSessionDuration,
    work_days: uiPreferences.workDays as string[],
    meditation_experience: uiPreferences.meditationExperience,
    meditation_goals: uiPreferences.meditationGoals,
    stress_level: typeof uiPreferences.stressLevel === 'string' ? 
      uiPreferences.stressLevel : 
      String(uiPreferences.stressLevel),
    work_environment: uiPreferences.workEnvironment,
    work_start_time: uiPreferences.workStartTime,
    work_end_time: uiPreferences.workEndTime,
    lunch_break: uiPreferences.lunchBreak,
    lunch_time: uiPreferences.lunchTime,
    morning_exercise: uiPreferences.morningExercise,
    exercise_time: uiPreferences.exerciseTime,
    bed_time: uiPreferences.bedTime,
    has_completed_onboarding: uiPreferences.hasCompletedOnboarding,
    notification_settings: uiPreferences.notificationSettings,
    connected_devices: uiPreferences.connectedDevices
  };
};

// Export aliases for backward compatibility
export const mapToUserPreferences = mapDbToUiPreferences;
export const mapToUserPreferencesData = mapUiToDbPreferences;
