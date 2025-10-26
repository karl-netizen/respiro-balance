
import { useMeditationStatsCore } from '@/hooks/progress/useMeditationStatsCore';

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  weeklyMinutes: number;
  weeklyGoal: number;
  averageSessionLength: number;
  lastSessionDate: string;
  monthlyTrend: number[];
  completionRate: number;
  focusScores: number[];
  stressScores: number[];
  streak: number;
  weeklyCompleted: number;
  lastSession: string;
  achievements: Array<{
    name: string;
    description: string;
    unlocked: boolean;
    unlockedDate?: string;
    icon?: string;
    progress?: number;
  }>;
  achievementProgress: {
    unlocked: number;
    total: number;
    recentUnlocked?: {
      name: string;
      description: string;
      unlocked: boolean;
      unlockedDate?: string;
      icon?: string;
      progress?: number;
    };
  };
  moodCorrelation: {
    withMeditation: number;
    withoutMeditation: number;
  };
  focusCorrelation: {
    withMeditation: number;
    withoutMeditation: number;
  };
  dailyMinutes: Array<{
    day: string;
    minutes: number;
    sessions: number;
  }>;
  sessionsThisWeek: number;
}

export const useMeditationStats = () => {
  const { stats: coreStats, isLoading, refreshStats } = useMeditationStatsCore();

  // Extend core stats with additional computed properties
  const meditationStats: MeditationStats = {
    ...coreStats,
    longestStreak: Math.max(coreStats.currentStreak, 0),
    weeklyGoal: 70,
    monthlyTrend: [20, 35, 45, 30, 55, 40, 60, 45, 70, 50, 80, 65],
    focusScores: [],
    stressScores: [],
    streak: coreStats.currentStreak,
    lastSession: coreStats.lastSessionDate,
    achievements: [],
    achievementProgress: {
      unlocked: Math.min(coreStats.currentStreak, 5),
      total: 10
    },
    moodCorrelation: {
      withMeditation: 75,
      withoutMeditation: 45
    },
    focusCorrelation: {
      withMeditation: 80,
      withoutMeditation: 50
    },
    dailyMinutes: [],
    sessionsThisWeek: coreStats.weeklyCompleted
  };

  return {
    meditationStats,
    isLoading,
    refreshStats,
    sessions: [] as any[]
  };
};
