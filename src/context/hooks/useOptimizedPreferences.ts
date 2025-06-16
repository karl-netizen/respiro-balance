
import { useMemo, useCallback } from 'react';
import { usePreferencesSync } from './usePreferencesSync';
import { UserPreferences } from '../types';

export const useOptimizedPreferences = (
  user: any,
  supabasePreferences: UserPreferences,
  updateSupabasePreferences: (preferences: UserPreferences) => void,
  isLoading: boolean
) => {
  const baseHook = usePreferencesSync(user, supabasePreferences, updateSupabasePreferences, isLoading);
  
  // Memoize preferences to prevent unnecessary re-renders
  const memoizedPreferences = useMemo(() => baseHook.preferences, [baseHook.preferences]);
  
  // Stable update function
  const stableUpdatePreferences = useCallback(
    (newPreferences: Partial<UserPreferences>) => {
      baseHook.updatePreferences(newPreferences);
    },
    [baseHook.updatePreferences]
  );
  
  const stableResetPreferences = useCallback(() => {
    baseHook.resetPreferences();
  }, [baseHook.resetPreferences]);
  
  return {
    preferences: memoizedPreferences,
    updatePreferences: stableUpdatePreferences,
    resetPreferences: stableResetPreferences,
    initialized: baseHook.initialized
  };
};
