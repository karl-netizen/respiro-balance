
import { UserPreferencesRecord } from '@/types/supabase';
import { UserPreferences, UserRole, WorkEnvironment, StressLevel, MeditationExperience, SubscriptionTier, MorningRitual } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';

// Convert from local UserPreferences to database UserPreferencesRecord format
export const convertToDbFormat = (prefs: UserPreferences, userId: string): Partial<UserPreferencesRecord> => {
  return {
    user_id: userId,
    preferences_data: {
      userRole: prefs.userRole === 'user' ? 'client' : prefs.userRole, // Map 'user' to 'client' for DB
      workDays: prefs.workDays,
      workStartTime: prefs.workStartTime,
      workEndTime: prefs.workEndTime,
      workEnvironment: prefs.workEnvironment === 'variable' ? 'hybrid' : prefs.workEnvironment, // Map 'variable' to 'hybrid' for DB
      stressLevel: prefs.stressLevel === 'very_high' ? 'high' : prefs.stressLevel, // Map 'very_high' to 'high' for DB
      focusChallenges: prefs.focusChallenges,
      energyPattern: prefs.energyPattern,
      lunchBreak: prefs.lunchBreak,
      lunchTime: prefs.lunchTime,
      morningExercise: prefs.morningExercise,
      exerciseTime: prefs.exerciseTime,
      bedTime: prefs.bedTime,
      meditationExperience: prefs.meditationExperience,
      meditationGoals: prefs.meditationGoals,
      preferredSessionDuration: prefs.preferredSessionDuration,
      metricsOfInterest: prefs.metricsOfInterest,
      subscriptionTier: prefs.subscriptionTier,
      morningRituals: prefs.morningRituals || [],
    }
  };
};

// Convert from database UserPreferencesRecord to local UserPreferences format
export const convertToLocalFormat = (record: UserPreferencesRecord): UserPreferences => {
  // Map DB userRole 'client' to local 'user'
  const userRole: UserRole = record.preferences_data.userRole === 'client' ? 'user' : 
    (record.preferences_data.userRole as 'coach' | 'admin');
  
  const workDays = record.preferences_data.workDays as string[];
  
  // Map DB workEnvironment 'hybrid' to local format
  const workEnvironment: WorkEnvironment = record.preferences_data.workEnvironment as WorkEnvironment;
  
  // Map DB stressLevel
  const stressLevel: StressLevel = record.preferences_data.stressLevel as StressLevel;
  
  const meditationExperience = record.preferences_data.meditationExperience as MeditationExperience;
  const subscriptionTier = record.preferences_data.subscriptionTier as SubscriptionTier;
  
  // Handle morningRituals with proper type casting
  const morningRituals = record.preferences_data.morningRituals as MorningRitual[] || [];

  return {
    ...defaultPreferences,
    userRole,
    workDays,
    workStartTime: record.preferences_data.workStartTime,
    workEndTime: record.preferences_data.workEndTime,
    workEnvironment,
    stressLevel,
    focusChallenges: record.preferences_data.focusChallenges || defaultPreferences.focusChallenges,
    energyPattern: record.preferences_data.energyPattern,
    lunchBreak: record.preferences_data.lunchBreak,
    lunchTime: record.preferences_data.lunchTime,
    morningExercise: record.preferences_data.morningExercise,
    exerciseTime: record.preferences_data.exerciseTime,
    bedTime: record.preferences_data.bedTime,
    meditationExperience,
    meditationGoals: record.preferences_data.meditationGoals || defaultPreferences.meditationGoals,
    preferredSessionDuration: record.preferences_data.preferredSessionDuration,
    metricsOfInterest: record.preferences_data.metricsOfInterest || defaultPreferences.metricsOfInterest,
    subscriptionTier,
    morningRituals,
    // Properties not stored in the database
    hasCompletedOnboarding: true,
    connectedDevices: [],
    hasWearableDevice: false,
    enableSessionReminders: defaultPreferences.enableSessionReminders,
    enableProgressUpdates: defaultPreferences.enableProgressUpdates,
    enableRecommendations: defaultPreferences.enableRecommendations,
    businessAttribution: defaultPreferences.businessAttribution
  };
};
