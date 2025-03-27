
import { createContext, useContext } from "react";
import { UserPreferencesContextType } from './types';
import { UserPreferencesProvider } from './UserPreferencesProvider';

// Create the context with undefined initial value
export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Custom hook to use the user preferences context
export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};

// Export the provider
export { UserPreferencesProvider };

// Export types for use in other components
export * from './types';
