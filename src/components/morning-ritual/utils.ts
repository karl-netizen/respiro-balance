
/**
 * Utility functions for the Morning Ritual Builder
 */

/**
 * Format time from 24-hour format to 12-hour AM/PM format
 * @param time Time in HH:MM format
 * @returns Formatted time (e.g., "7:30 AM")
 */
export const formatTimeDisplay = (time: string): string => {
  if (!time || !time.includes(':')) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate a unique ID for a new ritual
 * @returns Unique ID string
 */
export const generateRitualId = (): string => {
  return 'ritual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Calculate the time difference in minutes between two time strings
 * @param startTime Start time in HH:MM format
 * @param endTime End time in HH:MM format
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle crossing midnight
  return endTotalMinutes >= startTotalMinutes 
    ? endTotalMinutes - startTotalMinutes
    : (24 * 60) - startTotalMinutes + endTotalMinutes;
};

/**
 * Generate a suggested ritual based on user preferences
 * @param wakeTime User's wake time
 * @param morningEnergyLevel User's morning energy level
 * @param existingActivities Current morning activities
 * @returns Array of activity suggestions
 */
export const getSuggestedActivities = (
  wakeTime: string = "07:00",
  morningEnergyLevel: number = 5,
  existingActivities: string[] = []
): string[] => {
  // Base suggestions everyone should consider
  const baseSuggestions = ["hydration", "meditation"];
  
  // Energy-based suggestions
  const energyBasedSuggestions = morningEnergyLevel <= 3
    ? ["journaling", "stretching"] // Low energy
    : morningEnergyLevel >= 8
      ? ["exercise", "cold_shower"] // High energy
      : ["stretching", "planning"]; // Medium energy
  
  // Filter out activities the user is already doing
  return [...baseSuggestions, ...energyBasedSuggestions]
    .filter(activity => !existingActivities.includes(activity));
};

/**
 * Check if a ritual should be done today based on its recurrence pattern
 * @param recurrence Ritual recurrence pattern
 * @param daysOfWeek Optional specific days for custom recurrence
 * @returns Boolean indicating if ritual should be done today
 */
export const shouldDoRitualToday = (
  recurrence: string,
  daysOfWeek?: string[]
): boolean => {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
  
  switch (recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !isWeekend;
    case 'weekends':
      return isWeekend;
    case 'custom':
      return daysOfWeek ? daysOfWeek.includes(dayOfWeek) : false;
    default:
      return false;
  }
};
