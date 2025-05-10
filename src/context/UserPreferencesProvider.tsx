import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode 
} from 'react';
import { 
  UserPreferencesData,
  BluetoothDevice
} from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { BluetoothDeviceInfo } from './types';

interface UserPreferencesContextType {
  preferences: UserPreferencesData;
  updatePreferences: (updates: Partial<UserPreferencesData>) => void;
  connectBluetoothDevice: (deviceType?: string, options?: any) => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  isCoach: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [hasWearableDevice, setHasWearableDevice] = useState<boolean>(false);
  const [role, setRole] = useState<string>('user');

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

  const connectBluetoothDevice = async (deviceType?: string, options?: any): Promise<boolean> => {
    try {
      // Simulate device connection
      const newDevice: BluetoothDeviceInfo = {
        id: 'wearable-001',
        name: 'MyWearable',
        type: deviceType || 'heart_rate_monitor'
      };

      setConnectedDevices([...connectedDevices, newDevice]);
      setHasWearableDevice(true);
      
      // Create an update object matching the UserPreferencesData type
      const updatedPreferences: Partial<UserPreferencesData> = {
        // Use only properties that exist in UserPreferencesData
        // Removed wearable_device_id and wearable_device_name since they're not in the type
      };
      
      updatePreferences(updatedPreferences);
      
      if (options?.callback && typeof options.callback === 'function') {
        options.callback(newDevice);
      }
      
      return true;
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      return false;
    }
  };

  const disconnectBluetoothDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      // Simulate device disconnection
      setConnectedDevices(connectedDevices.filter(device => device.id !== deviceId));
      
      const hasRemaining = connectedDevices.length > 1;
      setHasWearableDevice(hasRemaining);
      
      // Create an update object matching the UserPreferencesData type
      const updatedPreferences: Partial<UserPreferencesData> = {
        // Removed wearable_device_id and wearable_device_name since they're not in the type
      };
      
      updatePreferences(updatedPreferences);
      
      if (callback && typeof callback === 'function') {
        callback();
      }
    } catch (error) {
      console.error('Bluetooth disconnection failed:', error);
    }
  };

  // Return boolean directly
  const isCoach = role === 'coach';

  const value = {
    preferences,
    updatePreferences,
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

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export default UserPreferencesContext;
