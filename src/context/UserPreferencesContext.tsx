
import React, { createContext, useContext, useState, useEffect } from "react";

type WorkDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type WorkEnvironment = "office" | "home" | "hybrid";
type StressLevel = "low" | "moderate" | "high";
type MeditationExperience = "none" | "beginner" | "intermediate" | "advanced";
type SubscriptionTier = "Free" | "Pro" | "Team" | "Enterprise";
type BusinessAttribution = "KGP Coaching & Consulting" | "LearnRelaxation" | null;
type UserRole = "client" | "coach" | "admin";

interface UserPreferences {
  // User Role
  userRole: UserRole;
  coachId?: string;
  clientIds?: string[];
  
  // Business Attribution
  businessAttribution: BusinessAttribution;
  
  // Work Schedule
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  workEnvironment: WorkEnvironment;
  
  // Stress & Focus
  stressLevel: StressLevel;
  focusChallenges: string[];
  energyPattern: string;
  
  // Lunch & Breaks
  lunchBreak: boolean;
  lunchTime: string;
  
  // Exercise & Sleep
  morningExercise: boolean;
  exerciseTime: string;
  bedTime: string;
  
  // Meditation Experience
  meditationExperience: MeditationExperience;
  meditationGoals: string[];
  preferredSessionDuration: number;
  
  // Biofeedback & Tracking
  hasWearableDevice: boolean;
  wearableDeviceType?: string;
  wearableDeviceId?: string;
  lastSyncDate?: string;
  metricsOfInterest: string[];
  connectedDevices: BluetoothDevice[];
  
  // Notifications
  enableSessionReminders: boolean;
  enableProgressUpdates: boolean;
  enableRecommendations: boolean;
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  
  // Onboarding Status
  hasCompletedOnboarding: boolean;
}

// Create a mock BluetoothDevice interface since the Web Bluetooth API types aren't available
interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

const defaultPreferences: UserPreferences = {
  // User Role
  userRole: "client",
  
  // Business Attribution
  businessAttribution: null,
  
  // Work Schedule
  workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  workStartTime: "09:00",
  workEndTime: "17:00",
  workEnvironment: "office",
  
  // Stress & Focus
  stressLevel: "moderate",
  focusChallenges: ["distractions", "afternoon_slump"],
  energyPattern: "afternoon_dip",
  
  // Lunch & Breaks
  lunchBreak: true,
  lunchTime: "12:00",
  
  // Exercise & Sleep
  morningExercise: false,
  exerciseTime: "07:00",
  bedTime: "22:00",
  
  // Meditation Experience
  meditationExperience: "beginner",
  meditationGoals: ["stress_reduction", "better_focus"],
  preferredSessionDuration: 10,
  
  // Biofeedback & Tracking
  hasWearableDevice: false,
  metricsOfInterest: ["stress", "focus"],
  connectedDevices: [],
  
  // Notifications
  enableSessionReminders: true,
  enableProgressUpdates: true,
  enableRecommendations: true,
  
  // Subscription
  subscriptionTier: "Free",
  
  // Onboarding Status
  hasCompletedOnboarding: false,
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isCoach: () => boolean;
  connectBluetoothDevice: () => Promise<boolean>;
  disconnectBluetoothDevice: (deviceId: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load saved preferences from localStorage if they exist
    const savedPreferences = localStorage.getItem("userPreferences");
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
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
  
  const connectBluetoothDevice = async (): Promise<boolean> => {
    // This is a mock implementation since Web Bluetooth API may not be available
    // In a real application, you would use the Web Bluetooth API
    try {
      // Simulate device connection with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock device
      const mockDevice: BluetoothDevice = {
        id: Math.random().toString(36).substring(2, 10),
        name: "Respiro HR Monitor",
        type: "heart_rate",
        connected: true
      };
      
      // Add the device to the list of connected devices
      updatePreferences({
        hasWearableDevice: true,
        wearableDeviceType: "Respiro HR Monitor",
        wearableDeviceId: mockDevice.id,
        lastSyncDate: new Date().toISOString(),
        connectedDevices: [...preferences.connectedDevices, mockDevice]
      });
      
      return true;
    } catch (error) {
      console.error("Failed to connect Bluetooth device:", error);
      return false;
    }
  };
  
  const disconnectBluetoothDevice = (deviceId: string) => {
    const updatedDevices = preferences.connectedDevices.filter(
      device => device.id !== deviceId
    );
    
    updatePreferences({
      connectedDevices: updatedDevices,
      hasWearableDevice: updatedDevices.length > 0
    });
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreferences, 
        resetPreferences,
        isCoach,
        connectBluetoothDevice,
        disconnectBluetoothDevice
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};
