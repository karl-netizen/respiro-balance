
import { useContext } from 'react';
import UserPreferencesContext from '../UserPreferencesContext';
import { UserPreferencesContextType } from '../types';

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};
