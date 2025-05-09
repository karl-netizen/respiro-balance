
// Define all the types needed for Focus Mode

export interface FocusSession {
  id: string;
  userId: string; // Changed from user_id to follow camelCase convention
  startTime: string; // Use string for dates to avoid type mismatches
  endTime?: string;
  duration?: number; // in minutes
  label?: string;
  tags?: string[];
  task_completed: boolean;
  distraction_count: number;
  focus_score?: number;
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
