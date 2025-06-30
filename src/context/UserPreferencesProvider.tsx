
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, BluetoothDeviceInfo } from './types';
import defaultPreferences from './defaultPreferences';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isCoach: boolean;
  isEnterprise: boolean;
  isLoading: boolean;
  connectBluetoothDevice: (deviceInfo: BluetoothDeviceInfo) => Promise<boolean>;
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

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      setPreferences(prev => ({ ...prev, ...updates }));
      // Here you would typically save to database
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const connectBluetoothDevice = async (deviceInfo: BluetoothDeviceInfo): Promise<boolean> => {
    try {
      // Update connected devices in preferences
      const updatedDevices = [...(preferences.connectedDevices || []), deviceInfo];
      await updatePreferences({ 
        connectedDevices: updatedDevices,
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
      // Remove device from connected devices
      const updatedDevices = (preferences.connectedDevices || []).filter(device => device.id !== deviceId);
      await updatePreferences({ 
        connectedDevices: updatedDevices,
        hasWearableDevice: updatedDevices.length > 0
      });
      return true;
    } catch (error) {
      console.error('Error disconnecting device:', error);
      return false;
    }
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
