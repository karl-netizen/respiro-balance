
import React, { createContext, useContext, useState, useEffect } from "react";

type WorkDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

interface UserPreferences {
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime: string;
  lunchBreak: boolean;
  lunchTime: string;
  morningExercise: boolean;
  exerciseTime: string;
  bedTime: string;
  hasCompletedOnboarding: boolean;
}

const defaultPreferences: UserPreferences = {
  workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  workStartTime: "09:00",
  workEndTime: "17:00",
  lunchBreak: true,
  lunchTime: "12:00",
  morningExercise: false,
  exerciseTime: "07:00",
  bedTime: "22:00",
  hasCompletedOnboarding: false,
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
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

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
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
