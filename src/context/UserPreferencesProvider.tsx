
import React, { useState, useEffect } from "react";
import { UserPreferences, UserPreferencesContextType } from './types';
import defaultPreferences from './defaultPreferences';
import { connectBluetoothDevice, disconnectDevice } from './bluetoothUtils';
import { UserPreferencesContext } from './index';

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load saved preferences from localStorage if they exist
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
        
        return parsedPrefs;
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      ...newPreferences,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("userPreferences");
  };
  
  const isCoach = () => {
    return preferences.userRole === "coach" || preferences.userRole === "admin";
  };
  
  const handleConnectBluetoothDevice = async (): Promise<boolean> => {
    try {
      const result = await connectBluetoothDevice();
      
      if (result.success && result.device) {
        // Add the device to the list of connected devices
        updatePreferences({
          hasWearableDevice: true,
          wearableDeviceType: "Respiro HR Monitor",
          wearableDeviceId: result.device.id,
          lastSyncDate: new Date().toISOString(),
          connectedDevices: [...preferences.connectedDevices, result.device]
        });
        
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
    
    updatePreferences({
      connectedDevices: updatedDevices,
      hasWearableDevice: updatedDevices.length > 0
    });
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
