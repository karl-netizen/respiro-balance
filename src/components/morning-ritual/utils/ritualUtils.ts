
import { MorningRitual, RitualStatus } from '@/context/types';
import { CompletionEntry } from '@/context/types';

export const updateRitualStatuses = (rituals: MorningRitual[]): MorningRitual[] => {
  return rituals.map(ritual => {
    const today = new Date().toDateString();
    const lastCompleted = ritual.lastCompleted ? new Date(ritual.lastCompleted).toDateString() : null;
    
    if (lastCompleted === today) {
      return { ...ritual, status: 'completed' as RitualStatus };
    }
    
    return { ...ritual, status: 'planned' as RitualStatus };
  });
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

export const wasCompletedToday = (ritual: MorningRitual): boolean => {
  if (!ritual.lastCompleted) return false;
  
  const lastCompleted = new Date(ritual.lastCompleted);
  const today = new Date();
  
  return lastCompleted.toDateString() === today.toDateString();
};

export const wasCompletedOnDate = (lastCompleted?: string, date?: Date): boolean => {
  if (!lastCompleted || !date) return false;
  
  const completedDate = new Date(lastCompleted);
  return completedDate.toDateString() === date.toDateString();
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

export const calculateStreak = (ritual: MorningRitual): number => {
  return ritual.streak || 0;
};

export const getCompletionHistory = (ritual: MorningRitual): CompletionEntry[] => {
  const entries: CompletionEntry[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    entries.push({
      id: `${ritual.id}-${date.toISOString().split('T')[0]}`,
      ritual_id: ritual.id,
      completed_at: date.toISOString(),
      notes: '',
      mood_before: Math.floor(Math.random() * 5) + 1,
      mood_after: Math.floor(Math.random() * 5) + 1
    });
  }
  
  return entries.reverse();
};

export const getNextOccurrence = (ritual: MorningRitual): Date => {
  const now = new Date();
  const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
  
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
};

export const generateRitualId = (): string => {
  return `ritual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getSuggestedActivities = (preferences: any): string[] => {
  const suggestions = [
    'Morning Meditation',
    'Gratitude Journaling',
    'Light Exercise',
    'Breathing Practice',
    'Hydration',
    'Affirmations'
  ];
  
  return suggestions.slice(0, 3);
};
