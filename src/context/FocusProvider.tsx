
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Define types for the focus mode
export type FocusTimerState = 'idle' | 'work' | 'break' | 'long-break' | 'paused' | 'completed';

export interface FocusSession {
  id: string;
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
}

export interface FocusSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakAfterIntervals: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  enableSounds: boolean;
  enableNotifications: boolean;
  blockNotifications: boolean;
}

export interface FocusStats {
  totalSessions: number;
  totalFocusTime: number;
  weeklyFocusTime: number;
  averageFocusScore: number;
  longestStreak: number;
  currentStreak: number;
  completionRate: number;
  mostProductiveDay: string;
  mostProductiveTime: string;
  weeklyFocusGoal: number;
  weeklyFocusProgress: number;
}

interface FocusContextType {
  isActive: boolean;
  timerState: FocusTimerState;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipInterval: () => void;
  endFocus: () => void;
  remaining: number;
  progress: number;
  currentInterval: number;
  currentSession: Partial<FocusSession> | null;
  stats: FocusStats | null;
  settings: FocusSettings;
  updateSettings: (newSettings: Partial<FocusSettings>) => void;
  logDistraction: () => void;
  addNote: (note: string) => void;
}

const defaultSettings: FocusSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakAfterIntervals: 4,
  autoStartBreaks: true,
  autoStartWork: false,
  enableSounds: true,
  enableNotifications: true,
  blockNotifications: false,
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timerState, setTimerState] = useState<FocusTimerState>('idle');
  const [isActive, setIsActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [settings, setSettings] = useState<FocusSettings>(defaultSettings);
  const [currentSession, setCurrentSession] = useState<Partial<FocusSession> | null>(null);
  const [distractions, setDistractions] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Mock stats for demo - in a real app, these would come from an API
  const [stats] = useState<FocusStats>({
    totalSessions: 12,
    totalFocusTime: 320,
    weeklyFocusTime: 120,
    averageFocusScore: 78,
    longestStreak: 5,
    currentStreak: 3,
    completionRate: 85,
    mostProductiveDay: 'Wednesday',
    mostProductiveTime: 'Morning',
    weeklyFocusGoal: 180,
    weeklyFocusProgress: 66.7,
  });

  // Calculate progress percentage
  const progress = React.useMemo(() => {
    if (timerState === 'idle') return 0;
    if (timerState === 'completed') return 100;
    
    const total = timerState === 'work' 
      ? settings.workDuration * 60 
      : timerState === 'long-break' 
        ? settings.longBreakDuration * 60 
        : settings.breakDuration * 60;
    
    return Math.round(((total - remaining) / total) * 100);
  }, [remaining, timerState, settings]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Start a focus session
  const startSession = useCallback(() => {
    setIsActive(true);
    setTimerState('work');
    setCurrentInterval(1);
    setRemaining(settings.workDuration * 60);
    setElapsed(0);
    setDistractions(0);
    
    setCurrentSession({
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      workIntervals: 0,
      breakIntervals: 0,
      workDuration: 0,
      breakDuration: 0,
      distractions: 0,
      duration: 0,
      completed: false,
    });
    
    // Start the timer
    const id = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          handleIntervalComplete();
          return 0;
        }
        return prev - 1;
      });
      
      setElapsed(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
    
    if (settings.enableNotifications) {
      toast("Focus session started", {
        description: `${settings.workDuration} minute focus session`
      });
    }
  }, [settings]);

  // Handle interval completion
  const handleIntervalComplete = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (timerState === 'work') {
      // Work interval completed
      setCurrentSession(prev => ({
        ...prev,
        workIntervals: (prev?.workIntervals || 0) + 1,
        workDuration: (prev?.workDuration || 0) + settings.workDuration,
      }));
      
      // Check if we need a long break
      const nextInterval = currentInterval + 1;
      const isLongBreak = nextInterval > 1 && (nextInterval - 1) % settings.longBreakAfterIntervals === 0;
      
      setTimerState(isLongBreak ? 'long-break' : 'break');
      setRemaining(isLongBreak ? settings.longBreakDuration * 60 : settings.breakDuration * 60);
      
      if (settings.autoStartBreaks) {
        // Start the timer for break
        const id = window.setInterval(() => {
          setRemaining(prev => {
            if (prev <= 1) {
              handleBreakComplete();
              return 0;
            }
            return prev - 1;
          });
          
          setElapsed(prev => prev + 1);
        }, 1000);
        
        setIntervalId(id);
      }
      
      if (settings.enableNotifications) {
        toast("Work interval completed", {
          description: "Time for a break!"
        });
      }
    } else {
      handleBreakComplete();
    }
  }, [timerState, settings, currentInterval, intervalId]);

  // Handle break completion
  const handleBreakComplete = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setCurrentSession(prev => ({
      ...prev,
      breakIntervals: (prev?.breakIntervals || 0) + 1,
      breakDuration: (prev?.breakDuration || 0) + 
        (timerState === 'long-break' ? settings.longBreakDuration : settings.breakDuration),
    }));
    
    setCurrentInterval(prev => prev + 1);
    setTimerState('work');
    setRemaining(settings.workDuration * 60);
    
    if (settings.autoStartWork) {
      // Start the timer for work
      const id = window.setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            handleIntervalComplete();
            return 0;
          }
          return prev - 1;
        });
        
        setElapsed(prev => prev + 1);
      }, 1000);
      
      setIntervalId(id);
    }
    
    if (settings.enableNotifications) {
      toast("Break completed", {
        description: "Back to work!"
      });
    }
  }, [timerState, settings, intervalId]);

  // Pause the session
  const pauseSession = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimerState('paused');
  }, [intervalId]);

  // Resume the session
  const resumeSession = useCallback(() => {
    const currentState = timerState === 'paused' 
      ? (currentSession?.workIntervals || 0) > (currentSession?.breakIntervals || 0) 
        ? 'work' 
        : 'break'
      : timerState;
    
    setTimerState(currentState);
    
    // Start the timer
    const id = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          handleIntervalComplete();
          return 0;
        }
        return prev - 1;
      });
      
      setElapsed(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
  }, [timerState, currentSession, handleIntervalComplete]);

  // Skip the current interval
  const skipInterval = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (timerState === 'work') {
      handleIntervalComplete();
    } else {
      handleBreakComplete();
    }
  }, [timerState, handleIntervalComplete, handleBreakComplete]);

  // Complete the session
  const completeSession = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    const totalMinutes = Math.round(elapsed / 60);
    
    setCurrentSession(prev => ({
      ...prev,
      endTime: new Date().toISOString(),
      duration: totalMinutes,
      completed: true,
      // Calculate a focus score based on distractions and completion
      focusScore: Math.max(0, Math.min(100, 100 - (distractions * 10))),
    }));
    
    setTimerState('completed');
    setIsActive(false);
    
    if (settings.enableNotifications) {
      toast("Session completed", {
        description: `You completed a ${totalMinutes} minute focus session`
      });
    }
  }, [intervalId, elapsed, distractions, settings]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<FocusSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  // Log a distraction
  const logDistraction = useCallback(() => {
    setDistractions(prev => prev + 1);
    setCurrentSession(prev => ({
      ...prev,
      distractions: (prev?.distractions || 0) + 1,
    }));
  }, []);

  // Add a note to the session
  const addNote = useCallback((note: string) => {
    setCurrentSession(prev => ({
      ...prev,
      notes: note,
    }));
  }, []);

  // End focus
  const endFocus = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setIsActive(false);
    setTimerState('idle');
    setCurrentSession(null);
    setRemaining(0);
    setElapsed(0);
    setCurrentInterval(1);
    setDistractions(0);
  }, [intervalId]);

  const value: FocusContextType = {
    isActive,
    timerState,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipInterval,
    endFocus,
    remaining,
    progress,
    currentInterval,
    currentSession,
    stats,
    settings,
    updateSettings,
    logDistraction,
    addNote,
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

// Export the hook with both names to maintain compatibility
export const useFocus = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

// Export the same hook with the name that components are expecting
export const useFocusMode = useFocus;

export default FocusContext;
