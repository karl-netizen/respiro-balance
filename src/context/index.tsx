// Re-export everything from the individual context files
export { UserPreferencesProvider } from './UserPreferencesProvider';
export { useUserPreferences } from './hooks/useUserPreferences';
export { AuthProvider } from '../hooks/useAuth';
export { NotificationsProvider } from './NotificationsProvider';
export { SubscriptionProvider } from '@/features/subscription';
export { FocusProvider } from './FocusProvider';
export { ThemeProvider } from './ThemeProvider';

// Export types for use in other components
export * from './types';
