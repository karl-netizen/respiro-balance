import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, UserPreferencesContextType } from './types';
import { BluetoothDeviceInfo } from '@/types/bluetooth';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { mapToUserPreferences, mapToUserPreferencesData } from './utils/preferencesMapper';

// Default preferences
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

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from Supabase
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
        } else if (data) {
          const mappedPreferences = mapToUserPreferences(data);
          setPreferences({ ...defaultPreferences, ...mappedPreferences });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);

      const mappedData = mapToUserPreferencesData(newPreferences);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...mappedData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error updating preferences:', error);
        // Revert on error
        setPreferences(preferences);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setPreferences(preferences);
    }
  };

  const connectBluetoothDevice = async (device: BluetoothDeviceInfo): Promise<boolean> => {
    try {
      const newDevices = [...preferences.connectedDevices, device];
      await updatePreferences({ 
        connectedDevices: newDevices,
        hasWearableDevice: true 
      });
      return true;
    } catch (error) {
      console.error('Error connecting device:', error);
      return false;
    }
  };

  const disconnectBluetoothDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const newDevices = preferences.connectedDevices.filter(d => d.id !== deviceId);
      await updatePreferences({ 
        connectedDevices: newDevices,
        hasWearableDevice: newDevices.length > 0
      });
      return true;
    } catch (error) {
      console.error('Error disconnecting device:', error);
      return false;
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const isCoach = preferences.subscriptionTier === 'coach';
  const isEnterprise = preferences.subscriptionTier === 'enterprise';

  const contextValue: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    connectBluetoothDevice,
    disconnectBluetoothDevice,
    isCoach,
    isEnterprise,
    isLoading
  };

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
