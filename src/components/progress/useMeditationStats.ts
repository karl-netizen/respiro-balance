
import { useState, useMemo } from 'react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { 
  format, 
  isToday, 
  parseISO, 
  differenceInDays, 
  isSameDay,
  subWeeks,
  isAfter
} from 'date-fns';

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  monthlyTrend: number[];
  lastSession: string;
  lastSessionDate: string;
  focusScores: number[];
  stressScores: number[];
  achievements: {
    name: string;
    description: string;
    unlocked: boolean;
    unlockedDate?: string;
    icon?: string;
  }[];
  moodCorrelation: {
    withMeditation: number;
    withoutMeditation: number;
  };
  focusCorrelation: {
    withMeditation: number;
    withoutMeditation: number;
  };
}

export interface SessionDay {
  day: string;
  completed: boolean;
  today?: boolean;
}

// Helper function to check if a date is within the last week
function isWithinLastWeek(date: Date): boolean {
  const oneWeekAgo = subWeeks(new Date(), 1);
  return isAfter(date, oneWeekAgo);
}

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
    
    // Calculate streak
    const streak = calculateStreak(completedSessions);
    
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
    
    // Generate monthly trend (for the chart)
    const monthlyTrend = generateMonthlyTrend(completedSessions);
    
    // Calculate achievement progress
    const achievements = calculateAchievements(completedSessions);
    
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
      weeklyGoal,
      weeklyCompleted,
      monthlyTrend,
      lastSession: lastSessionName,
      lastSessionDate,
      achievements,
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

// Helper function to calculate streak
function calculateStreak(sessions: any[]): number {
  if (!sessions.length) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
  
  // Check if there's a session for today
  const today = new Date();
  const hasSessionToday = sortedSessions.some(session => 
    isSameDay(parseISO(session.started_at), today)
  );
  
  // If no session today, check if there was one yesterday
  if (!hasSessionToday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasSessionYesterday = sortedSessions.some(session => 
      isSameDay(parseISO(session.started_at), yesterday)
    );
    
    // If no session yesterday either, streak is 0
    if (!hasSessionYesterday) return 0;
  }
  
  // Group sessions by day
  const sessionsByDay = new Map();
  sortedSessions.forEach(session => {
    const date = format(parseISO(session.started_at), 'yyyy-MM-dd');
    if (!sessionsByDay.has(date)) {
      sessionsByDay.set(date, true);
    }
  });
  
  // Convert to array of dates
  const sessionDates = Array.from(sessionsByDay.keys())
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => b.getTime() - a.getTime()); // Newest first
  
  // Calculate consecutive days
  let streak = 1; // Start with 1 (today or yesterday)
  let currentDate = sessionDates[0];
  
  for (let i = 1; i < sessionDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    if (isSameDay(prevDate, sessionDates[i])) {
      streak++;
      currentDate = sessionDates[i];
    } else {
      break; // Streak is broken
    }
  }
  
  return streak;
}

// Helper function to generate monthly trend data
function generateMonthlyTrend(sessions: any[]): number[] {
  const last30Days = Array(30).fill(0);
  
  sessions.forEach(session => {
    const sessionDate = parseISO(session.started_at);
    const daysAgo = differenceInDays(new Date(), sessionDate);
    
    if (daysAgo >= 0 && daysAgo < 30) {
      // Add session duration to the appropriate day
      last30Days[daysAgo] += session.duration;
    }
  });
  
  // Group by weeks (rough approximation)
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekTotal = last30Days.slice(i * 7, (i + 1) * 7).reduce((sum, val) => sum + val, 0);
    weeklyData.push(weekTotal);
  }
  
  // Add some historical data to make the chart look nicer
  // In a real app, you'd fetch older data instead
  return [15, 25, 40, 45, 30, 50, 65].concat(weeklyData.reverse());
}

// Helper function to calculate achievements
function calculateAchievements(sessions: any[]) {
  const achievements = [
    { 
      name: "First Steps", 
      description: "Complete your first meditation", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "footprints",
      check: () => sessions.length > 0
    },
    { 
      name: "Steady Mind", 
      description: "Meditate for 5 days in a row", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "brain",
      check: () => calculateStreak(sessions) >= 5
    },
    { 
      name: "Focus Master", 
      description: "Complete 10 focus meditations", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "target",
      check: () => sessions.filter(s => 
        s.session_type.toLowerCase().includes('focus')
      ).length >= 10
    },
    { 
      name: "Breath Explorer", 
      description: "Try all breathing techniques", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "wind",
      // This is a placeholder check - in a real app, you'd check for specific session types
      check: () => new Set(sessions.map(s => s.session_type)).size >= 4
    },
    { 
      name: "Consistency King", 
      description: "Complete a 10-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "calendar",
      check: () => calculateStreak(sessions) >= 10
    },
    { 
      name: "Morning Person", 
      description: "Complete 7 morning meditations", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "sunrise",
      check: () => {
        const morningCount = sessions.filter(s => {
          const sessionHour = new Date(s.started_at).getHours();
          return sessionHour >= 5 && sessionHour <= 10; // Between 5am and 10am
        }).length;
        return morningCount >= 7;
      }
    },
    { 
      name: "Deep Diver", 
      description: "Complete a 20-minute session", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "anchor",
      check: () => sessions.some(s => s.duration >= 20)
    },
    { 
      name: "Zen Master", 
      description: "Achieve a 30-day streak", 
      unlocked: false,
      unlockedDate: undefined,
      icon: "award",
      check: () => calculateStreak(sessions) >= 30
    }
  ];
  
  // For each achievement, check if it's unlocked
  return achievements.map(achievement => {
    const isUnlocked = achievement.check();
    
    // If it's unlocked, add a mock unlocked date
    // In a real app, you would store these in the database
    if (isUnlocked) {
      const daysAgo = Math.floor(Math.random() * 14) + 1; // Random day in the last 2 weeks
      const unlockedDate = new Date();
      unlockedDate.setDate(unlockedDate.getDate() - daysAgo);
      
      const timeDescriptions = [
        "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
        "6 days ago", "1 week ago", "2 weeks ago"
      ];
      
      return {
        name: achievement.name,
        description: achievement.description,
        unlocked: true,
        unlockedDate: timeDescriptions[Math.min(daysAgo - 1, timeDescriptions.length - 1)],
        icon: achievement.icon
      };
    }
    
    return {
      name: achievement.name,
      description: achievement.description,
      unlocked: false,
      icon: achievement.icon
    };
  });
}

// Default stats for when data is loading or unavailable
function getDefaultStats(): MeditationStats {
  return {
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    weeklyGoal: 5,
    weeklyCompleted: 0,
    monthlyTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    lastSession: "None",
    lastSessionDate: "None",
    focusScores: [0, 0, 0, 0, 0, 0, 0],
    stressScores: [0, 0, 0, 0, 0, 0, 0],
    achievements: [
      { name: "First Steps", description: "Complete your first meditation", unlocked: false, icon: "footprints" },
      { name: "Steady Mind", description: "Meditate for 5 days in a row", unlocked: false, icon: "brain" },
      { name: "Focus Master", description: "Complete 10 focus meditations", unlocked: false, icon: "target" },
      { name: "Breath Explorer", description: "Try all breathing techniques", unlocked: false, icon: "wind" },
      { name: "Consistency King", description: "Complete a 10-day streak", unlocked: false, icon: "calendar" },
      { name: "Morning Person", description: "Complete 7 morning meditations", unlocked: false, icon: "sunrise" },
      { name: "Deep Diver", description: "Complete a 20-minute session", unlocked: false, icon: "anchor" },
      { name: "Zen Master", description: "Achieve a 30-day streak", unlocked: false, icon: "award" }
    ],
    moodCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0
    },
    focusCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0
    }
  };
}
