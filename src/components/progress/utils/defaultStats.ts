
import { MeditationStats } from '../types/meditationStats';

export const getDefaultStats = (): MeditationStats => {
  return {
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    longestStreak: 0,
    weeklyGoal: 5,
    weeklyCompleted: 0,
    sessionsThisWeek: 0, // Added missing property
    completionRate: 0,   // Added missing property
    monthlyTrend: [0, 0, 0, 0],
    lastSession: "None",
    lastSessionDate: "None",
    focusScores: [50, 52, 54, 55],
    stressScores: [48, 46, 44, 42],
    achievements: [],
    moodCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0
    },
    focusCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0
    },
    dailyMinutes: [],
    achievementProgress: {
      unlocked: 0,
      total: 10
    }
  };
};
