
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from './types';
import defaultPreferences from './defaultPreferences';

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

  const connectBluetoothDevice = async (deviceId: string): Promise<boolean> => {
    // Implement Bluetooth connection logic
    return true;
  };

  const disconnectBluetoothDevice = async (deviceId: string): Promise<boolean> => {
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
