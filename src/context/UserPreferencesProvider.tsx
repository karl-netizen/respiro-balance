
import React, { useState } from 'react';
import { UserPreferencesData } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { UserPreferencesContext } from './UserPreferencesContext';
import { useBluetoothDevices } from './hooks/useBluetoothDevices';
import { useFetchUserData } from './hooks/useFetchUserData';
import { mapDbToUiPreferences, mapUiToDbPreferences } from './utils/preferencesMapper';
import defaultPreferences from './defaultPreferences';

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Use the extracted fetch data hook
  const { 
    preferences: dbPreferences, 
    subscriptionTier,
    role,
    updateUserPreferences
  } = useFetchUserData(user?.id);

  // Use the extracted bluetooth device hook
  const { 
    hasWearableDevice, 
    connectBluetoothDevice, 
    disconnectBluetoothDevice 
  } = useBluetoothDevices({
    userId: user?.id,
    updatePreferences: (updates) => {
      if (user) {
        updateUserPreferences(updates);
      }
    }
  });

  const resetPreferences = () => {
    const defaultPrefs = {
      theme: 'light',
      preferred_session_duration: 10,
      work_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      meditation_experience: 'beginner',
      stress_level: 'moderate',
      work_environment: 'office',
      work_start_time: '09:00',
      work_end_time: '17:00',
      lunch_break: true,
      lunch_time: '13:00',
      morning_exercise: false,
      exercise_time: '07:00',
      bed_time: '22:00',
      has_completed_onboarding: false,
    };
    
    if (user) {
      updateUserPreferences(defaultPrefs);
    }
  };

  // Map database preferences to UI preferences
  const uiPreferences = mapDbToUiPreferences(
    dbPreferences,
    subscriptionTier,
    hasWearableDevice,
    role
  );

  // Handle UI preference updates by mapping back to DB format
  const handleUpdatePreferences = (updates: Partial<typeof uiPreferences>) => {
    const dbUpdates = mapUiToDbPreferences(updates);
    updateUserPreferences(dbUpdates);
  };

  // Return boolean directly
  const isCoach = role === 'coach';

  const value = {
    preferences: uiPreferences,
    updatePreferences: handleUpdatePreferences,
    resetPreferences,
    connectBluetoothDevice,
    disconnectBluetoothDevice,
    isCoach,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
