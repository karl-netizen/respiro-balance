
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
  }
};

export default defaultPreferences;
