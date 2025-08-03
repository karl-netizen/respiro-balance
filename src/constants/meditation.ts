/**
 * Meditation-related constants
 */

export const MEDITATION_CATEGORIES = [
  'guided',
  'unguided',
  'body-scan',
  'breathing',
  'mindfulness',
  'focus',
  'sleep',
  'movement'
] as const;

export const MEDITATION_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

export const MEDITATION_DURATIONS = [
  5, 10, 15, 20, 30, 45, 60
] as const;

export const SESSION_TYPES = [
  'guided-meditation',
  'breathing-exercise',
  'body-scan',
  'mindfulness',
  'focus-training',
  'sleep-meditation'
] as const;