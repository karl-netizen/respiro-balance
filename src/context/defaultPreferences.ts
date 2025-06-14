
import { UserPreferences } from './types';

const defaultPreferences: UserPreferences = {
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '09:00',
  workEndTime: '17:00',
  lunchTime: '12:00',
  exerciseTime: '07:00',
  bedTime: '22:00',
  lunchBreak: true,
  morningExercise: false,
  meditationExperience: 'beginner',
  meditationGoals: ['stress_reduction', 'better_sleep'],
  stressLevel: 'moderate',
  workEnvironment: 'office',
  preferredSessionDuration: 10,
  hasCompletedOnboarding: false,
  notificationSettings: {
    sessionReminders: true,
    achievementNotifications: true,
    streakAlerts: true,
    weeklyNotifications: true
  },
  connectedDevices: [],
  hasWearableDevice: false,
  subscriptionTier: 'free',
  theme: 'system',
  // New location and measurement preferences
  country: undefined,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  measurementSystem: 'metric',
  location: undefined
};

export default defaultPreferences;
