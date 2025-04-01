
/**
 * Date-related utility functions for Morning Ritual
 */
import { RitualRecurrence, WorkDay } from "@/context/types";

/**
 * Check if a ritual was completed on a specific date
 */
export const wasCompletedOnDate = (lastCompleted: string, date: Date): boolean => {
  const completedDate = new Date(lastCompleted);
  
  return (
    completedDate.getDate() === date.getDate() &&
    completedDate.getMonth() === date.getMonth() &&
    completedDate.getFullYear() === date.getFullYear()
  );
};

/**
 * Check if a ritual was completed today
 * @param lastCompleted The last completed timestamp
 * @returns Boolean indicating if ritual was completed today
 */
export const wasCompletedToday = (lastCompleted?: string): boolean => {
  if (!lastCompleted) {
    return false;
  }
  
  const today = new Date();
  return wasCompletedOnDate(lastCompleted, today);
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

/**
 * Check if a ritual was scheduled for yesterday
 */
export const shouldDoRitualYesterday = (
  recurrence: string,
  daysOfWeek?: string[]
): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayName = yesterday.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const isYesterdayWeekend = yesterdayName === 'saturday' || yesterdayName === 'sunday';
  
  switch (recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !isYesterdayWeekend;
    case 'weekends':
      return isYesterdayWeekend;
    case 'custom':
      return daysOfWeek ? daysOfWeek.includes(yesterdayName) : false;
    default:
      return false;
  }
};
