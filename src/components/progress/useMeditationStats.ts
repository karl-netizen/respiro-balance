
import { useState } from 'react';

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  monthlyTrend: number[];
  lastSession: string;
  lastSessionDate: string;
  achievements: {
    name: string;
    description: string;
    unlocked: boolean;
  }[];
}

export interface SessionDay {
  day: string;
  completed: boolean;
  today?: boolean;
}

export const useMeditationStats = () => {
  // In a real app, this would come from an API or local storage
  const [meditationStats] = useState<MeditationStats>({
    totalSessions: 24,
    totalMinutes: 420,
    streak: 6,
    weeklyGoal: 5,
    weeklyCompleted: 3,
    monthlyTrend: [15, 25, 40, 45, 30, 50, 65, 60, 75, 90, 120],
    lastSession: "Morning Clarity",
    lastSessionDate: "Yesterday",
    achievements: [
      { name: "First Steps", description: "Complete your first meditation", unlocked: true },
      { name: "Steady Mind", description: "Meditate for 5 days in a row", unlocked: true },
      { name: "Focus Master", description: "Complete 10 focus meditations", unlocked: false },
      { name: "Breath Explorer", description: "Try all breathing techniques", unlocked: false },
    ]
  });
  
  const [sessions] = useState<SessionDay[]>([
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: false, today: true },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false }
  ]);
  
  return { meditationStats, sessions };
};
