
import { MeditationStats } from '../types/meditationStats';
import { addDays, format, subDays } from 'date-fns';
import { calculateAchievements } from './achievementUtils';

// Generate default stats for when we don't have real data yet
export const getDefaultStats = (): MeditationStats => {
  const today = new Date();
  
  // Generate sample daily data for the last week
  const dailyMinutes = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const hasSession = i % 2 === 0 || i === 6; // Every other day + the last day has a session
    
    return {
      day: format(date, 'yyyy-MM-dd'),
      minutes: hasSession ? Math.floor(Math.random() * 15) + 5 : 0, // 5-20 minutes if has session
      sessions: hasSession ? 1 : 0
    };
  });
  
  // Calculate total minutes from daily data
  const totalMinutes = dailyMinutes.reduce((sum, day) => sum + day.minutes, 0);
  
  // Calculate total sessions from daily data
  const totalSessions = dailyMinutes.reduce((sum, day) => sum + day.sessions, 0);
  
  // Calculate mock weekly goal and completion
  const weeklyGoal = 5;
  const weeklyCompleted = totalSessions;
  
  // Sample achievements using the achievement utility
  const mockSessions = Array.from({ length: 5 }, (_, i) => ({
    id: `mock-${i}`,
    duration: 10,
    completed: true
  }));
  
  const achievements = calculateAchievements(mockSessions);
  
  return {
    totalSessions,
    totalMinutes,
    streak: 2, // Mock streak
    longestStreak: 5, // Mock longest streak
    weeklyGoal,
    weeklyCompleted,
    sessionsThisWeek: totalSessions,
    completionRate: 80, // Mock completion rate of 80%
    monthlyTrend: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2)),
    lastSession: 'Focus',
    lastSessionDate: 'Today',
    focusScores: [65, 70, 72, 75, 80],
    stressScores: [60, 55, 50, 45, 40],
    achievements,
    moodCorrelation: {
      withMeditation: 78,
      withoutMeditation: 52
    },
    focusCorrelation: {
      withMeditation: 82,
      withoutMeditation: 59
    },
    dailyMinutes,
    achievementProgress: {
      unlocked: achievements.filter(a => a.unlocked).length,
      total: achievements.length
    }
  };
};
