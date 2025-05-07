
import { useMemo } from 'react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { format, isToday, subDays } from 'date-fns';
import { MeditationStats, SessionDay } from './types/meditationStats';
import { isWithinLastWeek } from './utils/dateUtils';
import { calculateStreak, calculateLongestStreak } from './utils/streakUtils';
import { generateMonthlyTrend, generateDailyActivity } from './utils/trendUtils';
import { calculateAchievements } from './utils/achievementUtils';
import { getDefaultStats } from './utils/defaultStats';

export type { MeditationStats, SessionDay } from './types/meditationStats';

export const useMeditationStats = () => {
  const { sessions, isLoading } = useMeditationSessions();
  const weeklyGoal = 5; // This could be from user preferences
  
  // Calculate meditation stats based on actual session data
  const meditationStats = useMemo(() => {
    if (isLoading || !sessions.length) {
      return getDefaultStats();
    }
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
    
    // Calculate total sessions and minutes
    const completedSessions = sessions.filter(session => session.completed);
    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce(
      (total, session) => total + session.duration, 0
    );
    
    // Calculate streak and longest streak
    const streak = calculateStreak(completedSessions);
    const longestStreak = calculateLongestStreak(completedSessions);
    
    // Get last session information
    const lastSession = sortedSessions[0];
    const lastSessionName = lastSession ? lastSession.session_type : "None";
    const lastSessionDate = lastSession 
      ? isToday(new Date(lastSession.started_at)) 
        ? "Today" 
        : format(new Date(lastSession.started_at), "MMM d")
      : "None";
    
    // Calculate weekly completed sessions
    const weeklyCompleted = completedSessions.filter(
      session => isWithinLastWeek(new Date(session.started_at))
    ).length;
    
    // Sessions this week (for stats)
    const sessionsThisWeek = weeklyCompleted;
    
    // Calculate completion rate
    const completionRate = sessions.length > 0 
      ? Math.round((completedSessions.length / sessions.length) * 100) 
      : 0;
    
    // Generate monthly trend (for the chart)
    const monthlyTrend = generateMonthlyTrend(completedSessions);
    
    // Generate daily activity data
    const dailyMinutes = generateDailyActivity(completedSessions);
    
    // Calculate achievement progress
    const achievements = calculateAchievements(completedSessions);
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    
    // Calculate achievement progress
    const achievementProgress = {
      unlocked: unlockedAchievements.length,
      total: achievements.length,
      recentUnlocked: unlockedAchievements.length > 0 
        ? unlockedAchievements.sort((a, b) => {
            if (!a.unlockedDate || !b.unlockedDate) return 0;
            return a.unlockedDate.localeCompare(b.unlockedDate);
          }).pop() 
        : undefined
    };
    
    // Simplified mock data for correlations (in a real app, this would come from biometric data)
    const mockedCorrelations = {
      focusScores: [65, 70, 72, 75, 80, 82, 85],
      stressScores: [60, 55, 50, 45, 40, 35, 30],
      moodCorrelation: {
        withMeditation: 78,
        withoutMeditation: 52
      },
      focusCorrelation: {
        withMeditation: 82,
        withoutMeditation: 59
      }
    };
    
    return {
      totalSessions,
      totalMinutes,
      streak,
      longestStreak,
      weeklyGoal,
      weeklyCompleted,
      sessionsThisWeek,
      completionRate,
      monthlyTrend,
      dailyMinutes,
      lastSession: lastSessionName,
      lastSessionDate,
      achievements,
      achievementProgress,
      // We'll still use mock data for these until we have real biometric data
      focusScores: mockedCorrelations.focusScores,
      stressScores: mockedCorrelations.stressScores,
      moodCorrelation: mockedCorrelations.moodCorrelation,
      focusCorrelation: mockedCorrelations.focusCorrelation
    };
  }, [sessions, isLoading]);
  
  // Generate current week's days (for the weekly progress view)
  const weekSessions = useMemo(() => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Convert to our format (0 is Monday)
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    return dayNames.map((day, index) => {
      const completed = sessions.some(session => {
        const sessionDate = new Date(session.started_at);
        const sessionDayOfWeek = sessionDate.getDay();
        const adjustedSessionDay = sessionDayOfWeek === 0 ? 6 : sessionDayOfWeek - 1;
        
        return (
          session.completed && 
          adjustedSessionDay === index && 
          isWithinLastWeek(sessionDate)
        );
      });
      
      return {
        day,
        completed,
        today: adjustedDayOfWeek === index
      };
    });
  }, [sessions]);
  
  return { 
    meditationStats: meditationStats as MeditationStats, 
    sessions: weekSessions
  };
};
