/**
 * Application route definitions
 */

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },

  // Meditation
  MEDITATION: {
    INDEX: '/meditate',
    SESSION: '/meditate/:id',
    LIBRARY: '/meditate/library',
    FAVORITES: '/meditate/favorites',
    RECENT: '/meditate/recent'
  },

  // Focus Mode
  FOCUS: {
    INDEX: '/focus',
    SESSION: '/focus/session',
    ANALYTICS: '/focus/analytics',
    CALENDAR: '/focus/calendar'
  },

  // Breathing
  BREATHING: {
    INDEX: '/breathe',
    TECHNIQUES: '/breathe/techniques',
    SESSION: '/breathe/session/:technique'
  },

  // Biofeedback
  BIOFEEDBACK: {
    INDEX: '/biofeedback',
    DEVICES: '/biofeedback/devices',
    ANALYTICS: '/biofeedback/analytics'
  },

  // Progress
  PROGRESS: {
    INDEX: '/progress',
    OVERVIEW: '/progress/overview',
    INSIGHTS: '/progress/insights',
    EXPORT: '/progress/export'
  },

  // Social
  SOCIAL: {
    INDEX: '/social',
    FEED: '/social/feed',
    LEADERBOARDS: '/social/leaderboards',
    CHALLENGES: '/social/challenges',
    GROUPS: '/social/groups'
  },

  // Settings
  SETTINGS: {
    INDEX: '/settings',
    PROFILE: '/settings/profile',
    PREFERENCES: '/settings/preferences',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy'
  },

  // Onboarding
  ONBOARDING: '/onboarding'
} as const;