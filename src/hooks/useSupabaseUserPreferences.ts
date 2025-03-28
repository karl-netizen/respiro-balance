
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserPreferencesRecord } from '@/types/supabase';
import { useAuth } from './useAuth';
import { UserPreferences, UserRole, WorkDay, WorkEnvironment, StressLevel, MeditationExperience, SubscriptionTier } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';

export function useSupabaseUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Convert from local to database format
  const convertToDbFormat = (prefs: UserPreferences): Partial<UserPreferencesRecord> => {
    return {
      user_id: user?.id || '',
      preferences_data: {
        userRole: prefs.userRole,
        workDays: prefs.workDays,
        workStartTime: prefs.workStartTime,
        workEndTime: prefs.workEndTime,
        workEnvironment: prefs.workEnvironment,
        stressLevel: prefs.stressLevel,
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
      }
    };
  };

  // Convert from database to local format
  const convertToLocalFormat = (record: UserPreferencesRecord): UserPreferences => {
    // Ensure type safety by explicitly casting string values to their respective types
    const userRole = record.preferences_data.userRole as UserRole;
    const workDays = record.preferences_data.workDays as WorkDay[];
    const workEnvironment = record.preferences_data.workEnvironment as WorkEnvironment;
    const stressLevel = record.preferences_data.stressLevel as StressLevel;
    const meditationExperience = record.preferences_data.meditationExperience as MeditationExperience;
    const subscriptionTier = record.preferences_data.subscriptionTier as SubscriptionTier;

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

  // Fetch user preferences
  const fetchUserPreferences = async (): Promise<UserPreferences> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }

    if (!data) {
      return defaultPreferences;
    }

    return convertToLocalFormat(data as UserPreferencesRecord);
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: UserPreferences): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const dbRecord = convertToDbFormat(preferences);
    
    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('user_preferences')
        .update(dbRecord)
        .eq('id', existingRecord.id);

      if (error) {
        console.error('Error updating user preferences:', error);
        throw error;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_preferences')
        .insert(dbRecord);

      if (error) {
        console.error('Error creating user preferences:', error);
        throw error;
      }
    }
  };

  // React Query hook for fetching
  const preferencesQuery = useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: fetchUserPreferences,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query mutation for updating
  const updatePreferencesMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userPreferences', user?.id] });
    },
  });

  return {
    preferences: preferencesQuery.data || defaultPreferences,
    isLoading: preferencesQuery.isLoading,
    isError: preferencesQuery.isError,
    error: preferencesQuery.error,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
}
