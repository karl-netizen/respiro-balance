
import { createContext } from 'react';
import { UserPreferencesContextType } from './types';
import defaultPreferences from './defaultPreferences';

export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: async () => {},
  loading: false,
  error: null,
  connectBluetoothDevice: async () => {},
  disconnectBluetoothDevice: async () => {},
  isCoach: false,
});
