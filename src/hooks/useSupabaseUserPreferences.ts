
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, demoAuth, isSupabaseConfigured } from '@/lib/supabase';
import { UserPreferencesRecord, BluetoothDevice } from '@/types/supabase';
import { useAuth } from './useAuth';
import { UserPreferences, UserRole, WorkDay, WorkEnvironment, StressLevel, MeditationExperience, SubscriptionTier, MorningRitual } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';
import { toast } from 'sonner';

export function useSupabaseUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Offline sync queue
  const getSyncQueue = () => {
    const queue = localStorage.getItem('preferenceSyncQueue');
    return queue ? JSON.parse(queue) : [];
  };
  
  const addToSyncQueue = (preferences: UserPreferences) => {
    const queue = getSyncQueue();
    queue.push({
      preferences,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('preferenceSyncQueue', JSON.stringify(queue));
  };
  
  const clearSyncQueue = () => {
    localStorage.removeItem('preferenceSyncQueue');
  };

  // Convert from local to database format
  const convertToDbFormat = (prefs: UserPreferences): Partial<UserPreferencesRecord> => {
    return {
      user_id: user?.id || '',
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

  // Convert from database to local format
  const convertToLocalFormat = (record: UserPreferencesRecord): UserPreferences => {
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

  // Process any pending offline sync items
  const processOfflineSync = async () => {
    if (!user || !isSupabaseConfigured()) return;
    
    const queue = getSyncQueue();
    if (queue.length === 0) return;
    
    console.log(`Processing ${queue.length} offline preference updates`);
    
    let success = true;
    
    for (const item of queue) {
      try {
        await updateUserPreferences(item.preferences);
      } catch (error) {
        console.error("Error processing offline sync item:", error);
        success = false;
        break;
      }
    }
    
    if (success) {
      clearSyncQueue();
      toast("Sync complete", {
        description: `Successfully synchronized ${queue.length} offline changes`
      });
    }
  };

  // Fetch user preferences
  const fetchUserPreferences = async (): Promise<UserPreferences> => {
    if (!user) return defaultPreferences;
    
    // If not connected to Supabase, return from localStorage
    if (!isSupabaseConfigured()) {
      const localPrefs = localStorage.getItem("userPreferences");
      if (localPrefs) {
        try {
          return JSON.parse(localPrefs);
        } catch (e) {
          return defaultPreferences;
        }
      }
      return defaultPreferences;
    }

    try {
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

      const prefs = convertToLocalFormat(data as UserPreferencesRecord);
      
      // Store in localStorage as offline backup
      localStorage.setItem("userPreferences", JSON.stringify(prefs));
      
      // Process any pending offline changes
      await processOfflineSync();
      
      return prefs;
    } catch (error) {
      console.error("Failed to fetch preferences from Supabase:", error);
      
      // Fall back to localStorage if available
      const localPrefs = localStorage.getItem("userPreferences");
      if (localPrefs) {
        try {
          return JSON.parse(localPrefs);
        } catch (e) {
          return defaultPreferences;
        }
      }
      
      return defaultPreferences;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: UserPreferences): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    // Always update localStorage
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    // If Supabase is not configured, add to sync queue and return
    if (!isSupabaseConfigured()) {
      addToSyncQueue(preferences);
      return;
    }

    const dbRecord = convertToDbFormat(preferences);
    
    try {
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
          // Add to sync queue for later
          addToSyncQueue(preferences);
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_preferences')
          .insert(dbRecord);

        if (error) {
          console.error('Error creating user preferences:', error);
          // Add to sync queue for later
          addToSyncQueue(preferences);
          throw error;
        }
      }
    } catch (error) {
      console.error("Failed to update preferences in Supabase:", error);
      // Add to sync queue for later retry
      addToSyncQueue(preferences);
      throw error;
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
