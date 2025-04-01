
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
  achievements: Achievement[];
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

export interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon?: string;
}
