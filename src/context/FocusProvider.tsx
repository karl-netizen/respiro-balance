
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for our focus context
interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
  workIntervals: number;
  breakIntervals: number;
  distractions: number;
  notes?: string;
}

interface FocusStats {
  totalSessions: number;
  totalMinutes: number;
  totalDays: number;
  averageFocusTime: number;
  longestStreak: number;
  currentStreak: number;
  weeklyFocusTime: number;
  averageFocusScore: number;
  completionRate: number;
  distractionsPerSession: number;
  totalFocusTime: number;
  workToBreakRatio: number;
  mostProductiveDay?: string;
  mostProductiveTime?: string;
  weeklyFocusGoal?: number;
  weeklyFocusProgress?: number;
}

interface FocusSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  autoStartWork?: boolean;
  enableSounds: boolean;
  enableNotifications: boolean;
  blockNotifications?: boolean;
  longBreakAfterIntervals?: number;
}

interface FocusContextType {
  timerState: 'idle' | 'work' | 'break' | 'long-break' | 'paused' | 'completed';
  currentSession: FocusSession | null;
  timeRemaining: number;
  stats: FocusStats;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipInterval: () => void;
  logDistraction: () => void;
  addSessionNote: (note: string) => void;
  settings?: FocusSettings;
  updateSettings?: (settings: Partial<FocusSettings>) => void;
  remaining?: number;
  progress?: number;
  currentInterval?: string;
  isActive?: boolean;
}

const initialStats: FocusStats = {
  totalSessions: 0,
  totalMinutes: 0,
  totalDays: 0,
  averageFocusTime: 0,
  longestStreak: 0,
  currentStreak: 0,
  weeklyFocusTime: 0,
  averageFocusScore: 85,
  completionRate: 0,
  distractionsPerSession: 0,
  totalFocusTime: 0,
  workToBreakRatio: 4,
  mostProductiveDay: 'Monday',
  mostProductiveTime: '10:00 AM',
  weeklyFocusGoal: 10,
  weeklyFocusProgress: 4
};

const initialSettings: FocusSettings = {
  workDuration: 25 * 60, // 25 minutes in seconds
  breakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  autoStartWork: false,
  enableSounds: true,
  enableNotifications: true,
  blockNotifications: false,
  longBreakAfterIntervals: 4
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timerState, setTimerState] = useState<'idle' | 'work' | 'break' | 'long-break' | 'paused' | 'completed'>('idle');
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // Default focus time: 25 minutes
  const [stats, setStats] = useState<FocusStats>(initialStats);
  const [settings, setSettings] = useState<FocusSettings>(initialSettings);
  const [progress, setProgress] = useState(0);
  const [currentInterval, setCurrentInterval] = useState('work');
  const [isActive, setIsActive] = useState(false);
  
  // Start a new focus session
  const startSession = () => {
    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      completed: false,
      workIntervals: 0,
      breakIntervals: 0,
      distractions: 0
    };
    
    setCurrentSession(newSession);
    setTimerState('work');
    setTimeRemaining(settings.workDuration);
    setCurrentInterval('work');
    setProgress(0);
    setIsActive(true);
  };
  
  // Pause the current session
  const pauseSession = () => {
    if (timerState !== 'idle' && timerState !== 'completed') {
      setTimerState('paused');
      setIsActive(false);
    }
  };
  
  // Resume the current session
  const resumeSession = () => {
    if (timerState === 'paused') {
      setTimerState('work'); // Assume we resume to work state
      setIsActive(true);
    }
  };
  
  // Mark the session as complete
  const completeSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const durationMs = endTime.getTime() - currentSession.startTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);
      
      const completedSession = {
        ...currentSession,
        endTime,
        duration: durationMinutes,
        completed: true
      };
      
      setCurrentSession(completedSession);
      setTimerState('completed');
      setIsActive(false);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + durationMinutes,
        weeklyFocusTime: prev.weeklyFocusTime + durationMinutes,
        totalFocusTime: prev.totalFocusTime + durationMinutes,
        weeklyFocusProgress: (prev.weeklyFocusProgress || 0) + durationMinutes / 60
      }));
    }
  };
  
  // Skip the current interval (work or break)
  const skipInterval = () => {
    if (timerState === 'work') {
      setTimerState('break');
      setTimeRemaining(settings.breakDuration);
      setCurrentInterval('break');
    } else if (timerState === 'break' || timerState === 'long-break') {
      setTimerState('work');
      setTimeRemaining(settings.workDuration);
      setCurrentInterval('work');
    }
  };
  
  // Log a distraction during the session
  const logDistraction = () => {
    if (currentSession && timerState === 'work') {
      setCurrentSession({
        ...currentSession,
        distractions: currentSession.distractions + 1
      });
    }
  };
  
  // Add a note to the session
  const addSessionNote = (note: string) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        notes: note
      });
    }
  };
  
  // Update settings
  const updateSettings = (newSettings: Partial<FocusSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const value: FocusContextType = {
    timerState,
    currentSession,
    timeRemaining,
    stats,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipInterval,
    logDistraction,
    addSessionNote,
    settings,
    updateSettings,
    remaining: timeRemaining,
    progress,
    currentInterval,
    isActive
  };
  
  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

// Define and export the hook for using the focus context
export const useFocus = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

// Export an alias of useFocus for backward compatibility
export const useFocusMode = useFocus;

export default FocusContext;
