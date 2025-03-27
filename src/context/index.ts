
import { UserPreferencesProvider } from './UserPreferencesProvider';
import { useUserPreferences } from './hooks/useUserPreferences';
import { UserPreferencesContext } from './UserPreferencesContext';
import type { UserPreferencesContextType, UserPreferences } from './types';

export { 
  UserPreferencesProvider,
  useUserPreferences,
  UserPreferencesContext
};

export type {
  UserPreferencesContextType,
  UserPreferences
};
