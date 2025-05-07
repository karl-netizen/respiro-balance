import { createContext, useContext } from "react";
import { UserPreferencesContextType } from './types';
import { UserPreferencesProvider } from './UserPreferencesProvider';
import { AuthProvider } from './AuthProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SubscriptionProvider } from './SubscriptionProvider';
import { FocusProvider } from './FocusProvider';
import { ThemeProvider } from 'styled-components';

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

// Import Focus Provider
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <SubscriptionProvider>
              <FocusProvider>
                {children}
              </FocusProvider>
            </SubscriptionProvider>
          </NotificationsProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
