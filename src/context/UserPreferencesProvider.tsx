
import React, { 
  useState, 
  useEffect,
  ReactNode 
} from 'react';
import { 
  UserPreferencesData,
} from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { UserPreferencesContext } from './UserPreferencesContext';
import { useBluetoothDevices } from './hooks/useBluetoothDevices';
import { mapDbToUiPreferences, mapUiToDbPreferences } from './utils/preferencesMapper';
import defaultPreferences from './defaultPreferences';

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferencesData>({
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
    morning_exercise: true,
    exercise_time: '07:00',
    bed_time: '22:00',
    has_completed_onboarding: false,
  });
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [role, setRole] = useState<string>('user');

  // Use the extracted bluetooth device hook
  const { 
    hasWearableDevice, 
    connectBluetoothDevice, 
    disconnectBluetoothDevice 
  } = useBluetoothDevices({
    userId: user?.id,
    updatePreferences: (updates) => {
      if (user) {
        updatePreferences(updates);
      }
    }
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user preferences:', error);
        } else if (data) {
          setPreferences(data);
        }
      }
    };

    const fetchUserProfile = async () => {
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('subscription_tier, role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profile) {
          setSubscriptionTier(profile.subscription_tier || 'free');
          setRole(profile.role || 'user');
        }
      }
    };

    fetchPreferences();
    fetchUserProfile();
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferencesData>) => {
    if (user) {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ ...preferences, ...updates, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Error updating user preferences:', error);
      } else if (data) {
        setPreferences(data);
      }
    } else {
      setPreferences({ ...preferences, ...updates });
    }
  };

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
    
    setPreferences(defaultPrefs);
    if (user) {
      updatePreferences(defaultPrefs);
    }
  };

  // Map database preferences to UI preferences
  const uiPreferences = mapDbToUiPreferences(
    preferences,
    subscriptionTier,
    hasWearableDevice,
    role
  );

  // Handle UI preference updates by mapping back to DB format
  const handleUpdatePreferences = (updates: Partial<typeof uiPreferences>) => {
    const dbUpdates = mapUiToDbPreferences(updates);
    updatePreferences(dbUpdates);
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
