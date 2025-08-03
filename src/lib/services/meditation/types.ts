/**
 * Meditation service types
 */

export interface SessionProgress {
  sessionId: string;
  userId: string;
  currentTime: number;
  totalDuration: number;
  completed: boolean;
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
}

export interface SessionAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completionRate: number;
  interruptions: number;
}