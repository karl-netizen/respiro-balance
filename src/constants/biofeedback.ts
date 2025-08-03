/**
 * Biofeedback and device constants
 */

export const DEVICE_TYPES = [
  'heart-rate',
  'stress',
  'eeg',
  'breath'
] as const;

export const BIOMETRIC_THRESHOLDS = {
  HEART_RATE: {
    LOW: 60,
    NORMAL: 100,
    HIGH: 120
  },
  STRESS: {
    LOW: 30,
    NORMAL: 50,
    HIGH: 70
  },
  HRV: {
    LOW: 20,
    NORMAL: 40,
    HIGH: 60
  }
} as const;

export const MEASUREMENT_INTERVALS = {
  REAL_TIME: 1000,
  FREQUENT: 5000,
  NORMAL: 10000,
  SLOW: 30000
} as const;