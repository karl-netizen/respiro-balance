/**
 * Export all utility functions from their respective modules
 */

// Time utility functions
export {
  formatTimeDisplay,
  getTimeDifferenceInMinutes,
  getRitualTimeFromPreferences
} from './timeUtils';

// Date utility functions
export {
  wasCompletedOnDate,
  wasCompletedToday,
  shouldDoRitualToday,
  shouldDoRitualYesterday
} from './dateUtils';

// Ritual utility functions
export {
  generateRitualId,
  getSuggestedActivities,
  updateRitualStatuses
} from './ritualUtils';

// Biometric utility functions
export {
  calculateBiometricChange,
  getBiometricDataFromDevices
} from './biometricUtils';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
