
import React from "react";
import { UserPreferencesContextType } from './types';
import { UserPreferencesContext } from './UserPreferencesContext';
import { useSupabaseUserPreferences } from "@/hooks/useSupabaseUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { usePreferencesSync } from "./hooks/usePreferencesSync";
import { useDeviceConnections } from "./hooks/useDeviceConnections";
import { useUserRole } from "./hooks/useUserRole";

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Get preferences from Supabase if available
  const {
    preferences: supabasePreferences,
    updatePreferences: updateSupabasePreferences,
    isLoading,
  } = useSupabaseUserPreferences();
  
  // Initialize and sync preferences
  const { 
    preferences, 
    updatePreferences, 
    resetPreferences 
  } = usePreferencesSync(
    user, 
    supabasePreferences, 
    updateSupabasePreferences,
    isLoading
  );
  
  // User role utilities
  const { isCoach } = useUserRole(preferences);
  
  // Device connection handlers
  const { 
    connectBluetoothDevice, 
    disconnectBluetoothDevice 
  } = useDeviceConnections(preferences, updatePreferences, user?.id);

  const contextValue: UserPreferencesContextType = {
    preferences, 
    updatePreferences, 
    resetPreferences,
    isCoach,
    connectBluetoothDevice,
    disconnectBluetoothDevice
  };

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
