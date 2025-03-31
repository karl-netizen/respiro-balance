
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
    focusScores: [65, 70, 72, 75, 80, 82, 85],
    stressScores: [60, 55, 50, 45, 40, 35, 30],
    achievements: [
      { 
        name: "First Steps", 
        description: "Complete your first meditation", 
        unlocked: true,
        unlockedDate: "2 weeks ago",
        icon: "footprints"
      },
      { 
        name: "Steady Mind", 
        description: "Meditate for 5 days in a row", 
        unlocked: true,
        unlockedDate: "3 days ago",
        icon: "brain"
      },
      { 
        name: "Focus Master", 
        description: "Complete 10 focus meditations", 
        unlocked: false,
        icon: "target"
      },
      { 
        name: "Breath Explorer", 
        description: "Try all breathing techniques", 
        unlocked: false,
        icon: "wind"
      },
      { 
        name: "Consistency King", 
        description: "Complete a 10-day streak", 
        unlocked: false,
        icon: "calendar"
      },
      { 
        name: "Morning Person", 
        description: "Complete 7 morning meditations", 
        unlocked: true,
        unlockedDate: "1 week ago",
        icon: "sunrise"
      },
      { 
        name: "Deep Diver", 
        description: "Complete a 20-minute session", 
        unlocked: true,
        unlockedDate: "5 days ago",
        icon: "anchor"
      },
      { 
        name: "Zen Master", 
        description: "Achieve a 30-day streak", 
        unlocked: false,
        icon: "award"
      }
    ],
    moodCorrelation: {
      withMeditation: 78,
      withoutMeditation: 52
    },
    focusCorrelation: {
      withMeditation: 82,
      withoutMeditation: 59
    }
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
