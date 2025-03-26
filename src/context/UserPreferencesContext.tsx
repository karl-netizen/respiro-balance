import React, { createContext, useContext, useState, useEffect } from "react";

type WorkDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type WorkEnvironment = "office" | "home" | "hybrid";
type StressLevel = "low" | "moderate" | "high";
type MeditationExperience = "none" | "beginner" | "intermediate" | "advanced";
type SubscriptionTier = "Free" | "Pro" | "Team" | "Enterprise";
type BusinessAttribution = "KGP Coaching & Consulting" | "LearnRelaxation" | null;

interface UserPreferences {
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
  metricsOfInterest: string[];
  
  // Notifications
  enableSessionReminders: boolean;
  enableProgressUpdates: boolean;
  enableRecommendations: boolean;
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  
  // Onboarding Status
  hasCompletedOnboarding: boolean;
}

const defaultPreferences: UserPreferences = {
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
