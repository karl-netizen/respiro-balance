
import { UserPreferences } from './types';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  subscriptionTier: 'free',
  
  notifications: {
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    types: {
      reminders: true,
      achievements: true,
      social: false,
      marketing: false
    }
  },
  
  meditation: {
    defaultDuration: 10,
    preferredTechniques: ['mindfulness', 'breathing'],
    backgroundSounds: true,
    guidedVoice: 'female',
    sessionReminders: true
  },
  
  privacy: {
    shareProgress: false,
    publicProfile: false,
    dataCollection: true
  },
  
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    fontSize: 'medium'
  },
  
  display: {
    compactMode: false,
    showAchievements: true,
    showStreak: true,
    showProgress: true
  },
  
  integrations: {
    healthKit: false,
    googleFit: false,
    fitbit: false,
    spotify: false
  },

  // Work-life balance defaults
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '09:00',
  workEndTime: '17:00',
  lunchTime: '12:00',
  lunchBreak: true,
  exerciseTime: '07:00',
  bedTime: '22:00',
  
  // User role and experience defaults
  userRole: 'user',
  meditationExperience: 'beginner',
  meditationGoals: ['stress_reduction', 'better_sleep'],
  stressLevel: 'moderate',
  workEnvironment: 'office',
  
  // Advanced settings defaults
  metricsOfInterest: ['stress', 'focus', 'energy'],
  focusChallenges: ['distractions', 'time_management'],
  hasWearableDevice: false,
  recommendedSessionDuration: 10,
  recommendedMeditationTime: '08:00',
  recommendedTechniques: ['mindfulness', 'breathing']
};

export default defaultPreferences;
