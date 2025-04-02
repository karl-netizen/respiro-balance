
import { MeditationSession } from '@/types/meditation';
import { Achievement } from '@/types/achievements';
import { calculateStreak } from '@/components/progress/utils/streakUtils';

// Calculate achievements based on user's meditation history
export const calculateAchievements = (sessions: MeditationSession[]): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: 'first-meditation',
      name: 'First Steps',
      description: 'Complete your first meditation',
      icon: 'footprints',
      unlocked: sessions.length > 0,
      progress: sessions.length > 0 ? 100 : 0,
      unlockedDate: sessions.length > 0 ? 
        getRandomUnlockDate(30) : undefined
    },
    {
      id: 'five-day-streak',
      name: 'Steady Mind',
      description: 'Meditate for 5 days in a row',
      icon: 'brain',
      unlocked: calculateStreak(sessions) >= 5,
      progress: Math.min(100, (calculateStreak(sessions) / 5) * 100),
      unlockedDate: calculateStreak(sessions) >= 5 ? 
        getRandomUnlockDate(14) : undefined
    },
    {
      id: 'focus-master',
      name: 'Focus Master',
      description: 'Complete 10 focus meditations',
      icon: 'target',
      unlocked: countSessionsByType(sessions, 'focus') >= 10,
      progress: Math.min(100, (countSessionsByType(sessions, 'focus') / 10) * 100),
      unlockedDate: countSessionsByType(sessions, 'focus') >= 10 ? 
        getRandomUnlockDate(21) : undefined
    },
    {
      id: 'breath-explorer',
      name: 'Breath Explorer',
      description: 'Try all breathing techniques',
      icon: 'wind',
      unlocked: getUniqueSessionTypes(sessions).size >= 4,
      progress: Math.min(100, (getUniqueSessionTypes(sessions).size / 4) * 100),
      unlockedDate: getUniqueSessionTypes(sessions).size >= 4 ? 
        getRandomUnlockDate(45) : undefined
    },
    {
      id: 'ten-day-streak',
      name: 'Consistency King',
      description: 'Complete a 10-day streak',
      icon: 'calendar',
      unlocked: calculateStreak(sessions) >= 10,
      progress: Math.min(100, (calculateStreak(sessions) / 10) * 100),
      unlockedDate: calculateStreak(sessions) >= 10 ? 
        getRandomUnlockDate(30) : undefined
    },
    {
      id: 'century-club',
      name: 'Century Club',
      description: 'Complete 100 meditation sessions',
      icon: 'trophy',
      unlocked: sessions.length >= 100,
      progress: Math.min(100, (sessions.length / 100) * 100),
      unlockedDate: sessions.length >= 100 ? 
        getRandomUnlockDate(60) : undefined
    },
    {
      id: 'time-traveler',
      name: 'Time Traveler',
      description: 'Accumulate 1000 minutes of meditation',
      icon: 'clock',
      unlocked: getTotalMeditationMinutes(sessions) >= 1000,
      progress: Math.min(100, (getTotalMeditationMinutes(sessions) / 1000) * 100),
      unlockedDate: getTotalMeditationMinutes(sessions) >= 1000 ? 
        getRandomUnlockDate(90) : undefined
    }
  ];
  
  return achievements;
};

// Helper function to count sessions by type
const countSessionsByType = (sessions: MeditationSession[], type: string): number => {
  return sessions.filter(session => 
    session.session_type.toLowerCase().includes(type.toLowerCase())
  ).length;
};

// Helper function to get unique session types
const getUniqueSessionTypes = (sessions: MeditationSession[]): Set<string> => {
  return new Set(sessions.map(session => session.session_type));
};

// Helper function to calculate total meditation minutes
const getTotalMeditationMinutes = (sessions: MeditationSession[]): number => {
  return sessions.reduce((total, session) => total + session.duration, 0);
};

// Helper function to generate a random unlock date within the past X days
const getRandomUnlockDate = (maxDaysAgo: number): string => {
  const daysAgo = Math.floor(Math.random() * maxDaysAgo) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  if (daysAgo <= 1) return '1 day ago';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 14) return '1 week ago';
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo < 60) return '1 month ago';
  return `${Math.floor(daysAgo / 30)} months ago`;
};
