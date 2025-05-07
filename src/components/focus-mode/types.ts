
import { BiometricData } from "@/components/meditation/types/BiometricTypes";

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  workIntervals: number;
  breakIntervals: number;
  workDuration: number;
  breakDuration: number;
  focusScore?: number;
  distractions?: number;
  notes?: string;
  tags?: string[];
  biometricsBefore?: Partial<BiometricData>;
  biometricsAfter?: Partial<BiometricData>;
}

export interface FocusSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakAfterIntervals: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  enableSounds: boolean;
  enableNotifications: boolean;
  blockNotifications: boolean;
}

export interface FocusStats {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  weeklyFocusTime: number; // in minutes
  averageFocusScore: number;
  longestStreak: number;
  currentStreak: number;
  completionRate: number; // percentage
  mostProductiveDay: string;
  mostProductiveTime: string;
  weeklyFocusGoal: number;
  weeklyFocusProgress: number;
}

export type FocusTimerState = 'idle' | 'work' | 'break' | 'long-break' | 'paused' | 'completed';

export interface FocusTimerContext {
  state: FocusTimerState;
  settings: FocusSettings;
  currentSession: Partial<FocusSession>;
  elapsed: number; // in seconds
  remaining: number; // in seconds
  currentInterval: number;
  totalIntervals: number;
  progress: number; // 0-100
  isActive: boolean;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  skipToNext: () => void;
  updateSettings: (settings: Partial<FocusSettings>) => void;
  logDistraction: () => void;
  addNote: (note: string) => void;
  addTags: (tags: string[]) => void;
}

export interface FocusAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
  criteria: {
    type: 'total_sessions' | 'total_time' | 'streak' | 'score' | 'completion_rate';
    threshold: number;
  };
}

export interface FocusActivityEntry {
  date: string;
  minutesSpent: number;
  sessions: number;
  averageScore?: number;
}
