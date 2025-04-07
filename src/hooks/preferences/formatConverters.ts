
import { UserPreferences } from '@/context/types';
import { UserPreferencesData } from '@/types/supabase';

// Convert from database format to application format
export const dbToAppFormat = (dbData: UserPreferencesData): Partial<UserPreferences> => {
  return {
    theme: dbData.theme as 'light' | 'dark' | 'system',
    weeklyMeditationGoal: 150, // Default value
    defaultMeditationDuration: dbData.preferred_session_duration,
    workDays: dbData.work_days,
    meditationExperience: dbData.meditation_experience as any,
    stressLevel: dbData.stress_level as any,
    workEnvironment: dbData.work_environment as any,
    workStartTime: dbData.work_start_time,
    workEndTime: dbData.work_end_time,
    lunchBreak: dbData.lunch_break,
    lunchTime: dbData.lunch_time,
    morningExercise: dbData.morning_exercise,
    exerciseTime: dbData.exercise_time,
    bedTime: dbData.bed_time,
    hasCompletedOnboarding: dbData.has_completed_onboarding,
  };
};

// Convert from application format to database format
export const appToDbFormat = (appData: Partial<UserPreferences>): Partial<UserPreferencesData> => {
  return {
    theme: appData.theme,
    preferred_session_duration: appData.defaultMeditationDuration,
    work_days: appData.workDays,
    meditation_experience: appData.meditationExperience as string,
    stress_level: appData.stressLevel as string,
    work_environment: appData.workEnvironment as string,
    work_start_time: appData.workStartTime,
    work_end_time: appData.workEndTime,
    lunch_break: appData.lunchBreak,
    lunch_time: appData.lunchTime,
    morning_exercise: appData.morningExercise,
    exercise_time: appData.exerciseTime,
    bed_time: appData.bedTime,
    has_completed_onboarding: appData.hasCompletedOnboarding,
  };
};

// Aliases for API compatibility
export const convertToDbFormat = appToDbFormat;
export const convertToLocalFormat = dbToAppFormat;
