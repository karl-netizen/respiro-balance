
import { UserPreferences } from './types';

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

export default defaultPreferences;
