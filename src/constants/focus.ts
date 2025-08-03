/**
 * Focus mode constants
 */

export const FOCUS_SESSION_TYPES = [
  'pomodoro',
  'deep-work',
  'break',
  'flow-state'
] as const;

export const POMODORO_DURATIONS = {
  WORK: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15
} as const;

export const PRODUCTIVITY_METRICS = [
  'focus-score',
  'distraction-count',
  'session-completion',
  'weekly-goals'
] as const;