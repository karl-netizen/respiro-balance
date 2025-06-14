
import { MorningRitual } from '@/context/types';

export const wasCompletedOnDate = (lastCompleted?: string, date?: Date): boolean => {
  if (!lastCompleted || !date) return false;
  
  const completedDate = new Date(lastCompleted);
  return completedDate.toDateString() === date.toDateString();
};

export const wasCompletedToday = (lastCompleted?: string): boolean => {
  if (!lastCompleted) return false;
  
  const completedDate = new Date(lastCompleted);
  const today = new Date();
  
  return completedDate.toDateString() === today.toDateString();
};

export const shouldDoRitualToday = (ritual: MorningRitual): boolean => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  switch (ritual.recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !['saturday', 'sunday'].includes(dayName);
    case 'weekends':
      return ['saturday', 'sunday'].includes(dayName);
    case 'custom':
      return ritual.daysOfWeek.includes(dayName);
    default:
      return false;
  }
};

export const shouldDoRitualYesterday = (ritual: MorningRitual): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  switch (ritual.recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return !['saturday', 'sunday'].includes(dayName);
    case 'weekends':
      return ['saturday', 'sunday'].includes(dayName);
    case 'custom':
      return ritual.daysOfWeek.includes(dayName);
    default:
      return false;
  }
};
