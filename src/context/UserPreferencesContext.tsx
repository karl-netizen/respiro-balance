
import { createContext } from 'react';
import { UserPreferencesContextType } from './types';
import defaultPreferences from './defaultPreferences';

export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: async () => {},
  resetPreferences: () => {},
  isCoach: false,
  isEnterprise: false,
  isLoading: false,
  connectBluetoothDevice: async () => false,
  disconnectBluetoothDevice: async () => false,
} as UserPreferencesContextType);
