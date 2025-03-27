
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserPreferencesRecord } from '@/types/supabase';
import { useAuth } from './useAuth';
import { UserPreferences } from '@/context/types';
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
    return {
      ...defaultPreferences,
      ...record.preferences_data,
      // Convert any properties that need special handling
      hasCompletedOnboarding: true,
      // Reset device properties since they are stored elsewhere
      connectedDevices: [],
      hasWearableDevice: false,
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
