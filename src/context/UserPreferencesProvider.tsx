
import React, { useState, useEffect } from "react";
import { UserPreferences, UserPreferencesContextType } from './types';
import defaultPreferences from './defaultPreferences';
import { connectBluetoothDevice, disconnectDevice } from './bluetoothUtils';
import { UserPreferencesContext } from './UserPreferencesContext';
import { useSupabaseUserPreferences } from "@/hooks/useSupabaseUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [initialized, setInitialized] = useState(false);
  
  // Get preferences from Supabase if available
  const {
    preferences: supabasePreferences,
    updatePreferences: updateSupabasePreferences,
    isLoading,
  } = useSupabaseUserPreferences();
  
  // On mount and when user or supabasePreferences changes:
  // 1. First try to load from Supabase if configured
  // 2. Otherwise, check localStorage
  // 3. Fall back to default preferences
  useEffect(() => {
    const loadPreferences = async () => {
      // If Supabase is configured and we have user and preferences
      if (isSupabaseConfigured() && user && supabasePreferences && !isLoading) {
        console.log("Loading preferences from Supabase");
        setPreferences(supabasePreferences);
        setInitialized(true);
        return;
      }
      
      // If we don't have Supabase or user, try localStorage
      const loadLocalPreferences = () => {
        console.log("Loading preferences from localStorage");
        const savedPreferences = localStorage.getItem("userPreferences");
        if (savedPreferences) {
          try {
            // Parse the saved preferences and ensure all required properties exist
            const parsedPrefs = JSON.parse(savedPreferences);
            
            // Make sure connectedDevices exists to prevent "undefined.includes()" errors
            if (!parsedPrefs.connectedDevices) {
              parsedPrefs.connectedDevices = [];
            }
            
            // Make sure metricsOfInterest exists
            if (!parsedPrefs.metricsOfInterest) {
              parsedPrefs.metricsOfInterest = defaultPreferences.metricsOfInterest;
            }
            
            // Make sure focusChallenges exists
            if (!parsedPrefs.focusChallenges) {
              parsedPrefs.focusChallenges = defaultPreferences.focusChallenges;
            }
            
            // Make sure workDays exists
            if (!parsedPrefs.workDays) {
              parsedPrefs.workDays = defaultPreferences.workDays;
            }
            
            // Make sure meditationGoals exists
            if (!parsedPrefs.meditationGoals) {
              parsedPrefs.meditationGoals = defaultPreferences.meditationGoals;
            }
            
            setPreferences(parsedPrefs);
          } catch (error) {
            console.error("Error parsing saved preferences:", error);
            setPreferences(defaultPreferences);
          }
        } else {
          setPreferences(defaultPreferences);
        }
        
        setInitialized(true);
      };
      
      loadLocalPreferences();
    };
    
    if (!initialized || user) {
      loadPreferences();
    }
  }, [user, supabasePreferences, isLoading, initialized]);

  // Save preferences - to both Supabase (if available) and localStorage
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    // Update local state
    setPreferences(prevPreferences => {
      const updatedPreferences = {
        ...prevPreferences,
        ...newPreferences,
      };
      
      // Save to localStorage as backup
      localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
      
      // If Supabase is configured and we have a user, also save there
      if (isSupabaseConfigured() && user) {
        updateSupabasePreferences(updatedPreferences);
      }
      
      return updatedPreferences;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("userPreferences");
    
    // If Supabase is configured and we have a user, also reset there
    if (isSupabaseConfigured() && user) {
      updateSupabasePreferences(defaultPreferences);
    }
  };
  
  const isCoach = () => {
    return preferences.userRole === "coach" || preferences.userRole === "admin";
  };
  
  const handleConnectBluetoothDevice = async (): Promise<boolean> => {
    try {
      const result = await connectBluetoothDevice();
      
      if (result.success && result.device) {
        // Add the device to the list of connected devices
        const updatedPreferences = {
          hasWearableDevice: true,
          wearableDeviceType: "Respiro HR Monitor",
          wearableDeviceId: result.device.id,
          lastSyncDate: new Date().toISOString(),
          connectedDevices: [...preferences.connectedDevices, result.device]
        };
        
        updatePreferences(updatedPreferences);
        
        // If user is authenticated and Supabase configured, also store device in devices table
        if (isSupabaseConfigured() && user) {
          try {
            const { error } = await supabase
              .from('user_devices')
              .insert({
                user_id: user.id,
                device_id: result.device.id,
                device_name: result.device.name,
                device_type: result.device.type,
                connected_at: new Date().toISOString()
              });
              
            if (error) {
              console.error("Error storing connected device:", error);
            }
          } catch (deviceError) {
            console.error("Failed to store device info:", deviceError);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to connect Bluetooth device:", error);
      return false;
    }
  };
  
  const handleDisconnectBluetoothDevice = (deviceId: string) => {
    const updatedDevices = disconnectDevice(deviceId, preferences);
    
    const updatedPreferences = {
      connectedDevices: updatedDevices,
      hasWearableDevice: updatedDevices.length > 0
    };
    
    updatePreferences(updatedPreferences);
    
    // If user is authenticated and Supabase configured, also update device in devices table
    if (isSupabaseConfigured() && user) {
      try {
        supabase
          .from('user_devices')
          .update({
            connected: false,
            disconnected_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('device_id', deviceId);
      } catch (deviceError) {
        console.error("Failed to update device connection status:", deviceError);
      }
    }
  };

  const contextValue: UserPreferencesContextType = {
    preferences, 
    updatePreferences, 
    resetPreferences,
    isCoach,
    connectBluetoothDevice: handleConnectBluetoothDevice,
    disconnectBluetoothDevice: handleDisconnectBluetoothDevice
  };

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
