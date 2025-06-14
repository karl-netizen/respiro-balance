
// Re-export all context components and hooks
export { UserPreferencesProvider } from './UserPreferencesProvider';
export { useUserPreferences } from './hooks/useUserPreferences';
export * from './hooks/useBluetoothDevices';
export * from './hooks/useFetchUserData';

// Export types for use in other components
export * from './types';

// For now, create placeholder providers that will be implemented later
export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
