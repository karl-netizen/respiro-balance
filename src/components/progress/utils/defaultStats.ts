
import { MeditationStats } from '../types/meditationStats';

// Default stats for when data is loading or unavailable
export function getDefaultStats(): MeditationStats {
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
