
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
  const dayName = today.toLocaleDateString('en-US', { weekday: 'lowercase' });
  
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

export const calculateStreak = (ritual: MorningRitual): number => {
  // Simple streak calculation - could be enhanced with completion history
  return ritual.streak || 0;
};

export const getCompletionHistory = (ritual: MorningRitual): CompletionEntry[] => {
  // Generate mock completion history for now
  const entries: CompletionEntry[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    entries.push({
      id: `${ritual.id}-${date.toISOString().split('T')[0]}`,
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.3, // 70% completion rate
      duration: ritual.duration
    });
  }
  
  return entries.reverse();
};

export const getNextOccurrence = (ritual: MorningRitual): Date => {
  const now = new Date();
  const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
  
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  
  // If the time has passed today, schedule for tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
};
