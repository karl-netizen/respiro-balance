
/**
 * Time-related utility functions for Morning Ritual
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
 * Get the appropriate time for a ritual based on user preferences
 * @param preferences User preferences object
 * @param isWeekend Whether the ritual is for a weekend
 * @returns Appropriate time string in HH:MM format
 */
export const getRitualTimeFromPreferences = (
  preferences: { weekdayWakeTime?: string; weekendWakeTime?: string },
  isWeekend: boolean = false
): string => {
  const defaultWeekdayTime = "07:00";
  const defaultWeekendTime = "08:00";
  
  if (isWeekend) {
    return preferences.weekendWakeTime || defaultWeekendTime;
  }
  
  return preferences.weekdayWakeTime || defaultWeekdayTime;
};
