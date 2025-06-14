
import { UserPreferences } from '../types';
import { UserPreferencesData } from '@/types/supabase';
import defaultPreferences from '../defaultPreferences';

export const mapDbToUiPreferences = (
  dbPreferences: UserPreferencesData | null,
  subscriptionTier?: string,
  hasWearableDevice?: boolean,
  role?: string
): UserPreferences => {
  if (!dbPreferences) {
    return {
      ...defaultPreferences,
      subscriptionTier: subscriptionTier || 'free',
      hasWearableDevice: hasWearableDevice || false,
      userRole: role as any || 'user'
    };
  }

  return {
    ...defaultPreferences,
    theme: dbPreferences.theme || defaultPreferences.theme,
    focusMode: false,
    morningRituals: [],
    wakeUpTime: dbPreferences.work_start_time || defaultPreferences.wakeUpTime,
    sleepGoal: 8,
    hydrationGoal: 8,
    notificationSettings: dbPreferences.notification_settings || defaultPreferences.notificationSettings,
    isPremium: subscriptionTier === 'premium' || subscriptionTier === 'pro',
    userName: '',
    userAvatar: '',
    dailyQuote: true,
    quoteCategory: 'motivation',
    affirmationsEnabled: true,
    affirmationsList: [],
    journalPromptsEnabled: true,
    journalPromptsList: [],
    gratitudeList: [],
    mindfulnessExercises: [],
    focusTechniques: [],
    energyLevels: [],
    moodStates: [],
    stressManagementTechniques: [],
    productivityHacks: [],
    userRole: role as any || 'user',
    connectedDevices: dbPreferences.connected_devices || [],
    hasWearableDevice: hasWearableDevice || false,
    workDays: dbPreferences.work_days || defaultPreferences.workDays,
    meditationGoals: dbPreferences.meditation_goals || [],
    focusChallenges: [],
    metricsOfInterest: [],
    preferredSessionDuration: dbPreferences.preferred_session_duration || defaultPreferences.preferredSessionDuration,
    preferred_session_duration: dbPreferences.preferred_session_duration || defaultPreferences.preferred_session_duration,
    meditationExperience: dbPreferences.meditation_experience || defaultPreferences.meditationExperience,
    stressLevel: 3,
    workEnvironment: dbPreferences.work_environment || defaultPreferences.workEnvironment,
    workStartTime: dbPreferences.work_start_time || defaultPreferences.workStartTime,
    workEndTime: dbPreferences.work_end_time || defaultPreferences.workEndTime,
    lunchBreak: dbPreferences.lunch_break ?? defaultPreferences.lunchBreak,
    lunchTime: dbPreferences.lunch_time || defaultPreferences.lunchTime,
    morningExercise: dbPreferences.morning_exercise ?? defaultPreferences.morningExercise,
    exerciseTime: dbPreferences.exercise_time || defaultPreferences.exerciseTime,
    bedTime: dbPreferences.bed_time || defaultPreferences.bedTime,
    hasCompletedOnboarding: dbPreferences.has_completed_onboarding ?? defaultPreferences.hasCompletedOnboarding,
    subscriptionTier: subscriptionTier || 'free',
    wakeTime: dbPreferences.work_start_time || defaultPreferences.wakeTime
  };
};

export const mapUiToDbPreferences = (uiPreferences: Partial<UserPreferences>): Partial<UserPreferencesData> => {
  return {
    theme: uiPreferences.theme,
    preferred_session_duration: uiPreferences.preferredSessionDuration || uiPreferences.preferred_session_duration,
    work_days: uiPreferences.workDays as string[],
    meditation_experience: uiPreferences.meditationExperience,
    stress_level: typeof uiPreferences.stressLevel === 'number' ? 
      uiPreferences.stressLevel.toString() : 
      uiPreferences.stressLevel,
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
    connected_devices: uiPreferences.connectedDevices,
    meditation_goals: uiPreferences.meditationGoals
  };
};
