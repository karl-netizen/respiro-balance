/**
 * Core application constants
 */

export const APP_CONFIG = {
  name: 'Respiro Balance',
  version: '1.0.0',
  description: 'Mindfulness and wellness platform with biofeedback integration',
  author: 'Respiro Team',
  contact: 'hello@respiro.app'
} as const;

export const STORAGE_KEYS = {
  MEDITATION_FAVORITES: 'meditation-favorites',
  RECENTLY_PLAYED: 'meditation-recently-played',
  USER_PREFERENCES: 'user-preferences',
  ONBOARDING_COMPLETED: 'onboarding-completed',
  THEME_MODE: 'theme-mode'
} as const;

export const DEFAULT_LIMITS = {
  RECENT_SESSIONS: 4,
  SEARCH_RESULTS: 50,
  PAGINATION_SIZE: 20
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;