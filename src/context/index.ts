
// Re-export all context components and hooks
export * from './UserPreferencesContext';
export * from './UserPreferencesProvider';
export * from './hooks/useUserPreferences';
export * from './hooks/useBluetoothDevices';
export * from './hooks/useFetchUserData';

// Make sure we're not exporting non-existent components
// FocusProvider and ThemeProvider are used in App.tsx but may be defined elsewhere
// For now, we'll re-export them from their respective files if they exist
export { FocusProvider } from './FocusProvider';
export { ThemeProvider } from './ThemeProvider';
