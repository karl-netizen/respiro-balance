
import { MorningRitual, RitualStatus, CompletionEntry } from '@/context/types';

export const generateRitualId = (): string => {
  return `ritual_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const getSuggestedActivities = (): string[] => {
  return [
    'Meditation',
    'Journaling',
    'Exercise',
    'Reading',
    'Stretching',
    'Hydration',
    'Breathing exercises',
    'Gratitude practice',
    'Planning the day',
    'Healthy breakfast'
  ];
};

export const updateRitualStatuses = (rituals: MorningRitual[]): MorningRitual[] => {
  const today = new Date().toDateString();
  
  return rituals.map(ritual => {
    const lastCompleted = ritual.lastCompleted ? new Date(ritual.lastCompleted).toDateString() : null;
    const isCompletedToday = lastCompleted === today;
    
    let status: RitualStatus = 'planned';
    let streak = ritual.streak || 0;
    let completionHistory = [...ritual.completionHistory];
    
    // Check if ritual time has passed
    const now = new Date();
    const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
    const ritualTime = new Date();
    ritualTime.setHours(hours, minutes, 0, 0);
    
    if (isCompletedToday) {
      status = 'completed';
    } else if (now > ritualTime) {
      status = 'missed';
      // Add missed entry if not already recorded
      const todayEntry = completionHistory.find(entry => entry.date === today);
      if (!todayEntry) {
        completionHistory.push({
          date: today,
          success: false,
          notes: 'Automatically marked as missed'
        });
      }
    }
    
    return {
      ...ritual,
      status,
      streak,
      completionHistory
    };
  });
};

export const completeRitual = (
  ritual: MorningRitual, 
  notes?: string,
  completionLevel: 'completed' | 'partial' = 'completed'
): MorningRitual => {
  const today = new Date().toDateString();
  const now = new Date();
  
  // Update completion history
  const updatedHistory = ritual.completionHistory.filter(entry => entry.date !== today);
  const newEntry: CompletionEntry = {
    date: today,
    success: completionLevel === 'completed',
    notes: notes || undefined
  };
  updatedHistory.push(newEntry);
  
  // Calculate new streak
  let newStreak = ritual.streak || 0;
  if (completionLevel === 'completed') {
    newStreak = calculateStreak(updatedHistory);
  }
  
  return {
    ...ritual,
    status: completionLevel as RitualStatus,
    lastCompleted: now.toISOString(),
    streak: newStreak,
    completionHistory: updatedHistory
  };
};

export const calculateStreak = (completionHistory: CompletionEntry[]): number => {
  if (!completionHistory.length) return 0;
  
  // Sort by date descending
  const sortedHistory = [...completionHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    const entryDate = new Date(entry.date);
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If this entry is from today or yesterday and successful, continue streak
    if (daysDiff <= i && entry.success) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getRitualProgress = (ritual: MorningRitual, days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const recentHistory = ritual.completionHistory.filter(entry => 
    new Date(entry.date) >= startDate
  );
  
  const totalDays = days;
  const completedDays = recentHistory.filter(entry => entry.success).length;
  const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  
  return {
    completedDays,
    totalDays,
    completionRate: Math.round(completionRate),
    currentStreak: ritual.streak || 0
  };
};

export const getWeeklyProgress = (rituals: MorningRitual[]) => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date.toDateString();
  });
  
  return weekDays.map(day => {
    const dayRituals = rituals.map(ritual => {
      const dayEntry = ritual.completionHistory.find(entry => entry.date === day);
      return {
        ritual: ritual.title,
        completed: dayEntry?.success || false,
        notes: dayEntry?.notes
      };
    });
    
    const completed = dayRituals.filter(r => r.completed).length;
    const total = rituals.length;
    
    return {
      date: day,
      rituals: dayRituals,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  });
};
