
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from './types';
import defaultPreferences from './defaultPreferences';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isCoach: boolean;
  isEnterprise: boolean;
  isLoading: boolean;
  connectBluetoothDevice: (deviceId: string) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => Promise<boolean>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session: _session } = useAuth();

  // Load preferences from database when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserPreferences(user.id);
    } else {
      setPreferences(defaultPreferences);
    }
  }, [user?.id]);

  const loadUserPreferences = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Load user preferences from database
      const { data: userPrefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error loading user preferences:', prefsError);
        return;
      }

      // Load morning rituals
      const { data: morningRituals, error: ritualsError } = await supabase
        .from('morning_rituals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ritualsError) {
        console.error('Error loading morning rituals:', ritualsError);
      }

      // Load user profile data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading user profile:', profileError);
      }

      // Merge database data with default preferences
      const mergedPreferences: UserPreferences = {
        ...defaultPreferences,
        ...userPrefs,
        morningRituals: morningRituals || [],
        subscriptionTier: profile?.subscription_tier || 'free',
        // Map database fields to frontend fields
        has_completed_onboarding: userPrefs?.has_completed_onboarding ?? false,
        hasCompletedOnboarding: userPrefs?.has_completed_onboarding ?? false,
        notification_settings: userPrefs?.notification_settings || defaultPreferences.notification_settings,
        preferred_session_duration: userPrefs?.preferred_session_duration || defaultPreferences.preferred_session_duration,
        preferredSessionDuration: userPrefs?.preferred_session_duration || defaultPreferences.preferredSessionDuration,
        work_days: userPrefs?.work_days || defaultPreferences.work_days,
        workDays: userPrefs?.work_days || defaultPreferences.workDays,
        work_start_time: userPrefs?.work_start_time || defaultPreferences.work_start_time,
        workStartTime: userPrefs?.work_start_time || defaultPreferences.workStartTime,
        work_end_time: userPrefs?.work_end_time || defaultPreferences.work_end_time,
        workEndTime: userPrefs?.work_end_time || defaultPreferences.workEndTime,
        lunch_time: userPrefs?.lunch_time || defaultPreferences.lunch_time,
        lunchTime: userPrefs?.lunch_time || defaultPreferences.lunchTime,
        lunch_break: userPrefs?.lunch_break ?? defaultPreferences.lunch_break,
        lunchBreak: userPrefs?.lunch_break ?? defaultPreferences.lunchBreak,
        exercise_time: userPrefs?.exercise_time || defaultPreferences.exercise_time,
        exerciseTime: userPrefs?.exercise_time || defaultPreferences.exerciseTime,
        bed_time: userPrefs?.bed_time || defaultPreferences.bed_time,
        bedTime: userPrefs?.bed_time || defaultPreferences.bedTime,
        meditation_experience: userPrefs?.meditation_experience || defaultPreferences.meditation_experience,
        meditationExperience: userPrefs?.meditation_experience || defaultPreferences.meditationExperience,
        meditation_goals: userPrefs?.meditation_goals || defaultPreferences.meditation_goals,
        meditationGoals: userPrefs?.meditation_goals || defaultPreferences.meditationGoals,
        stress_level: userPrefs?.stress_level || defaultPreferences.stress_level,
        stressLevel: userPrefs?.stress_level || defaultPreferences.stressLevel,
        work_environment: userPrefs?.work_environment || defaultPreferences.work_environment,
        workEnvironment: userPrefs?.work_environment || defaultPreferences.workEnvironment,
        morning_exercise: userPrefs?.morning_exercise ?? defaultPreferences.morning_exercise,
        morningExercise: userPrefs?.morning_exercise ?? defaultPreferences.morningExercise,
        connected_devices: userPrefs?.connected_devices || defaultPreferences.connected_devices,
        connectedDevices: userPrefs?.connected_devices || defaultPreferences.connectedDevices,
      };

      setPreferences(mergedPreferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Update local state immediately for responsiveness
      setPreferences(prev => ({ ...prev, ...updates }));

      // Prepare database update object by mapping frontend fields to database fields
      const dbUpdates: any = {};
      
      // Map common fields
      if (updates.has_completed_onboarding !== undefined) {
        dbUpdates.has_completed_onboarding = updates.has_completed_onboarding;
      }
      if (updates.hasCompletedOnboarding !== undefined) {
        dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding;
      }
      if (updates.notification_settings) {
        dbUpdates.notification_settings = updates.notification_settings;
      }
      if (updates.preferred_session_duration !== undefined) {
        dbUpdates.preferred_session_duration = updates.preferred_session_duration;
      }
      if (updates.preferredSessionDuration !== undefined) {
        dbUpdates.preferred_session_duration = updates.preferredSessionDuration;
      }
      if (updates.work_days) {
        dbUpdates.work_days = updates.work_days;
      }
      if (updates.workDays) {
        dbUpdates.work_days = updates.workDays;
      }
      if (updates.work_start_time) {
        dbUpdates.work_start_time = updates.work_start_time;
      }
      if (updates.workStartTime) {
        dbUpdates.work_start_time = updates.workStartTime;
      }
      if (updates.work_end_time) {
        dbUpdates.work_end_time = updates.work_end_time;
      }
      if (updates.workEndTime) {
        dbUpdates.work_end_time = updates.workEndTime;
      }
      if (updates.lunch_time) {
        dbUpdates.lunch_time = updates.lunch_time;
      }
      if (updates.lunchTime) {
        dbUpdates.lunch_time = updates.lunchTime;
      }
      if (updates.lunch_break !== undefined) {
        dbUpdates.lunch_break = updates.lunch_break;
      }
      if (updates.lunchBreak !== undefined) {
        dbUpdates.lunch_break = updates.lunchBreak;
      }
      if (updates.exercise_time) {
        dbUpdates.exercise_time = updates.exercise_time;
      }
      if (updates.exerciseTime) {
        dbUpdates.exercise_time = updates.exerciseTime;
      }
      if (updates.bed_time) {
        dbUpdates.bed_time = updates.bed_time;
      }
      if (updates.bedTime) {
        dbUpdates.bed_time = updates.bedTime;
      }
      if (updates.meditation_experience) {
        dbUpdates.meditation_experience = updates.meditation_experience;
      }
      if (updates.meditationExperience) {
        dbUpdates.meditation_experience = updates.meditationExperience;
      }
      if (updates.meditation_goals) {
        dbUpdates.meditation_goals = updates.meditation_goals;
      }
      if (updates.meditationGoals) {
        dbUpdates.meditation_goals = updates.meditationGoals;
      }
      if (updates.stress_level) {
        dbUpdates.stress_level = updates.stress_level;
      }
      if (updates.stressLevel) {
        dbUpdates.stress_level = updates.stressLevel;
      }
      if (updates.work_environment) {
        dbUpdates.work_environment = updates.work_environment;
      }
      if (updates.workEnvironment) {
        dbUpdates.work_environment = updates.workEnvironment;
      }
      if (updates.morning_exercise !== undefined) {
        dbUpdates.morning_exercise = updates.morning_exercise;
      }
      if (updates.morningExercise !== undefined) {
        dbUpdates.morning_exercise = updates.morningExercise;
      }
      if (updates.connected_devices) {
        dbUpdates.connected_devices = updates.connected_devices;
      }
      if (updates.connectedDevices) {
        dbUpdates.connected_devices = updates.connectedDevices;
      }
      if (updates.theme) {
        dbUpdates.theme = updates.theme;
      }

      // Update preferences in database
      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...dbUpdates,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error updating preferences:', error);
          // Revert local state on error
          await loadUserPreferences(user.id);
          throw error;
        }
      }

      // Handle morning rituals separately if included in updates
      if (updates.morningRituals) {
        // This would require a more complex update strategy
        // For now, just update the local state
        console.log('Morning rituals update - requires separate handling');
      }

    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const connectBluetoothDevice = async (_deviceId: string): Promise<boolean> => {
    // Implement Bluetooth connection logic
    return true;
  };

  const disconnectBluetoothDevice = async (_deviceId: string): Promise<boolean> => {
    // Implement Bluetooth disconnection logic
    return true;
  };

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    isCoach: preferences.subscriptionTier === 'coach',
    isEnterprise: preferences.subscriptionTier === 'enterprise',
    isLoading,
    connectBluetoothDevice,
    disconnectBluetoothDevice,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
