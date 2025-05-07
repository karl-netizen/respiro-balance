import { UserPreferencesProvider } from './UserPreferencesProvider';
import { useUserPreferences } from './hooks/useUserPreferences';
import { UserPreferencesContext } from './UserPreferencesContext';
import type { UserPreferencesContextType, UserPreferences } from './types';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SubscriptionProvider } from './SubscriptionProvider';
import { FocusProvider } from './FocusProvider';

// Define RequireAuthProps type if it's not already exported from AuthProvider
interface RequireAuthProps {
  children: React.ReactNode;
}

export { 
  UserPreferencesProvider,
  useUserPreferences,
  UserPreferencesContext,
  ThemeProvider,
  AuthProvider,
  NotificationsProvider,
  SubscriptionProvider,
  FocusProvider,
};

export type {
  UserPreferencesContextType,
  UserPreferences,
  RequireAuthProps
};
