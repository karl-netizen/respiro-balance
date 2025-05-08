
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
}

const initialStats: FocusStats = {
  totalSessions: 0,
  totalMinutes: 0,
  totalDays: 0,
  averageFocusTime: 0,
  longestStreak: 0,
  currentStreak: 0
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timerState, setTimerState] = useState<'idle' | 'work' | 'break' | 'long-break' | 'paused' | 'completed'>('idle');
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // Default focus time: 25 minutes
  const [stats, setStats] = useState<FocusStats>(initialStats);
  
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
    setTimeRemaining(25 * 60); // 25 minutes for work interval
  };
  
  // Pause the current session
  const pauseSession = () => {
    if (timerState !== 'idle' && timerState !== 'completed') {
      setTimerState('paused');
    }
  };
  
  // Resume the current session
  const resumeSession = () => {
    if (timerState === 'paused') {
      setTimerState('work'); // Assume we resume to work state
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
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + durationMinutes
      }));
    }
  };
  
  // Skip the current interval (work or break)
  const skipInterval = () => {
    if (timerState === 'work') {
      setTimerState('break');
      setTimeRemaining(5 * 60); // 5 minutes for break
    } else if (timerState === 'break' || timerState === 'long-break') {
      setTimerState('work');
      setTimeRemaining(25 * 60); // 25 minutes for work
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
    addSessionNote
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
