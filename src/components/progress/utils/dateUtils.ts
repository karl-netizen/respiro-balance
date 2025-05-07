
import { subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export const isWithinLastWeek = (date: Date): boolean => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  return isAfter(date, startOfDay(sevenDaysAgo)) && isBefore(date, endOfDay(today));
};

export const isWithinLastMonth = (date: Date): boolean => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  return isAfter(date, startOfDay(thirtyDaysAgo)) && isBefore(date, endOfDay(today));
};

export const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};
