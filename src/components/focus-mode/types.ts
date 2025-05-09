// Define all the types needed for Focus Mode with consistent naming

export interface FocusSession {
  id: string;
  userId: string; // Use camelCase for consistency with your components
  startTime: string; // Use string for dates to avoid type mismatches
  endTime?: string;
  duration?: number; // in minutes
  label?: string; // Add this field
  tags?: string[]; // Add this field
  taskCompleted: boolean; // Using camelCase
  distractionCount: number; // Using camelCase
  focusScore?: number; // Add this field
  notes?: string;
}

export interface FocusStats {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  mostProductiveDay: string; // Required field
  mostProductiveTime: string; // Required field
  highestFocusScore: number;
  weeklyMinutes: number[];
  distractionRate: number;
  completionRate: number;
  streak: number;
  // Other fields from your implementation
  totalDays?: number;
  averageFocusTime?: number;
  longestStreak?: number;
  currentStreak?: number;
  weeklyFocusTime?: number;
  weeklyFocusProgress?: number;
  totalFocusTime?: number;
  averageFocusScore?: number;
  weeklyFocusGoal?: number;
}

export interface FocusSettings {
  defaultDuration: number;
  breakInterval: number;
  breakDuration: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  distractionBlocking: boolean;
  autoStartBreaks: boolean;
}

export type FocusMode = 'pomodoro' | 'deep' | 'flexible';

export interface FocusTimerState {
  isActive: boolean;
  isPaused: boolean;
  isBreak: boolean;
  timeRemaining: number;
  totalTime: number;
  mode: FocusMode;
}

// Add missing types used in the components
export interface FocusAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  unlockedAt?: string;
  criteria: {
    type: string;
    threshold: number;
  };
}

export interface FocusActivityEntry {
  date: string;
  minutesSpent: number;
  sessions: number;
  averageScore?: number;
}
