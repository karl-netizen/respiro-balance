import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUserPreferences } from '@/context';
import { FocusSettings, FocusSession, FocusTimerState, FocusStats } from '@/components/focus-mode/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

interface FocusContextType {
  isActive: boolean;
  currentSession: Partial<FocusSession> | null;
  timerState: FocusTimerState;
  settings: FocusSettings;
  stats: FocusStats | null;
  elapsed: number;
  remaining: number;
  currentInterval: number;
  progress: number;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipInterval: () => void;
  updateSettings: (newSettings: Partial<FocusSettings>) => void;
  logDistraction: () => void;
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

const defaultStats: FocusStats = {
  totalSessions: 0,
  totalFocusTime: 0,
  weeklyFocusTime: 0,
  averageFocusScore: 0,
  longestStreak: 0,
  currentStreak: 0,
  completionRate: 0,
  mostProductiveDay: '',
  mostProductiveTime: '',
  weeklyFocusGoal: 600, // 10 hours per week
  weeklyFocusProgress: 0,
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [settings, setSettings] = useState<FocusSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('focusSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Error parsing saved focus settings:', e);
      }
    }
    return {
      ...defaultSettings,
      workDuration: preferences.focusTimerDuration || defaultSettings.workDuration,
      breakDuration: preferences.breakTimerDuration || defaultSettings.breakDuration,
    };
  });

  const [stats, setStats] = useState<FocusStats | null>(null);
  const [timerState, setTimerState] = useState<FocusTimerState>('idle');
  const [currentSession, setCurrentSession] = useState<Partial<FocusSession> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const distractionsRef = useRef<number>(0);
  
  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('focusSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      // Using type assertion to fix Supabase typing issue
      const { data, error } = await supabase
        .from('focus_sessions' as any)
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Calculate stats from sessions - using type assertion since we know the shape of our data
        const sessionsData = data as unknown as Array<{
          completed: boolean;
          duration: number;
          start_time: string;
          focus_score: number;
        }>;
        
        const totalSessions = sessionsData.length;
        const completedSessions = sessionsData.filter(s => s.completed).length;
        const totalMinutes = sessionsData.reduce((sum, session) => sum + (session.duration || 0), 0);
        
        // Calculate weekly focus time
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyData = sessionsData.filter(session => 
          new Date(session.start_time) >= oneWeekAgo
        );
        
        const weeklyMinutes = weeklyData.reduce((sum, session) => 
          sum + (session.duration || 0), 0
        );
        
        // Calculate streak
        // (simplified - in a real app you'd have more complex logic for streaks)
        let currentStreak = 0;
        let longestStreak = 0;
        
        setStats({
          totalSessions,
          totalFocusTime: totalMinutes,
          weeklyFocusTime: weeklyMinutes,
          averageFocusScore: sessionsData.reduce((sum, s) => sum + (s.focus_score || 0), 0) / totalSessions,
          longestStreak,
          currentStreak,
          completionRate: (completedSessions / totalSessions) * 100,
          mostProductiveDay: 'Monday', // This would need more complex calculation
          mostProductiveTime: 'Morning', // This would need more complex calculation
          weeklyFocusGoal: preferences.focusChallenges?.includes('deepWork') ? 900 : 600,
          weeklyFocusProgress: (weeklyMinutes / (preferences.focusChallenges?.includes('deepWork') ? 900 : 600)) * 100,
          sessionsThisWeek: weeklyData.length,
        });
      } else {
        setStats({
          ...defaultStats,
          sessionsThisWeek: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching focus stats:', error);
      setStats({
        ...defaultStats,
        sessionsThisWeek: 0,
      });
    }
  };

  const startSession = () => {
    if (timerState !== 'idle' && timerState !== 'completed') {
      return; // Session already in progress
    }
    
    const newSession: Partial<FocusSession> = {
      id: uuidv4(),
      userId: user?.id,
      startTime: new Date().toISOString(),
      workDuration: settings.workDuration,
      breakDuration: settings.breakDuration,
      workIntervals: 0,
      breakIntervals: 0,
      duration: 0,
      completed: false,
      distractions: 0,
    };
    
    setCurrentSession(newSession);
    setTimerState('work');
    setElapsed(0);
    setRemaining(settings.workDuration * 60);
    setCurrentInterval(1);
    setProgress(0);
    distractionsRef.current = 0;
    sessionStartTimeRef.current = new Date();
    
    // Start the timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setElapsed(prev => prev + 1);
      setRemaining(prev => {
        const newRemaining = prev - 1;
        setProgress(((settings.workDuration * 60 - newRemaining) / (settings.workDuration * 60)) * 100);
        
        // Check if timer completed
        if (newRemaining <= 0) {
          handleIntervalCompleted();
        }
        
        return Math.max(0, newRemaining);
      });
    }, 1000);
    
    // Show notification to user
    toast.success("Focus session started", {
      description: `${settings.workDuration} minute work interval has started`
    });
  };

  const handleIntervalCompleted = () => {
    // Clear the existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Update current session data
    if (timerState === 'work') {
      setCurrentSession(prev => ({
        ...prev,
        workIntervals: (prev?.workIntervals || 0) + 1
      }));
      
      // Determine if it's time for a regular break or a long break
      const isLongBreak = currentInterval % settings.longBreakAfterIntervals === 0;
      const nextBreakDuration = isLongBreak ? settings.longBreakDuration : settings.breakDuration;
      
      // Set state for the break
      setTimerState(isLongBreak ? 'long-break' : 'break');
      setRemaining(nextBreakDuration * 60);
      setProgress(0);
      
      // Play sound if enabled
      if (settings.enableSounds) {
        // Play sound logic would go here
      }
      
      // Show notification
      if (settings.enableNotifications) {
        toast.info(
          isLongBreak ? "Time for a long break!" : "Break time!", 
          { description: `Take a ${nextBreakDuration} minute break` }
        );
      }
      
      // Auto-start break if setting is enabled
      if (settings.autoStartBreaks) {
        startBreak(isLongBreak);
      }
    } else if (timerState === 'break' || timerState === 'long-break') {
      setCurrentSession(prev => ({
        ...prev,
        breakIntervals: (prev?.breakIntervals || 0) + 1
      }));
      
      // Update current interval
      setCurrentInterval(prev => prev + 1);
      
      // Set state for the next work interval
      setTimerState('work');
      setRemaining(settings.workDuration * 60);
      setProgress(0);
      
      // Play sound if enabled
      if (settings.enableSounds) {
        // Play sound logic would go here
      }
      
      // Show notification
      if (settings.enableNotifications) {
        toast.info("Break completed", { 
          description: `Ready to start the next ${settings.workDuration} minute work interval?` 
        });
      }
      
      // Auto-start work interval if setting is enabled
      if (settings.autoStartWork) {
        startWorkInterval();
      }
    }
  };

  const startBreak = (isLong = false) => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    const breakDuration = isLong ? settings.longBreakDuration : settings.breakDuration;
    
    timerRef.current = window.setInterval(() => {
      setElapsed(prev => prev + 1);
      setRemaining(prev => {
        const newRemaining = prev - 1;
        setProgress(((breakDuration * 60 - newRemaining) / (breakDuration * 60)) * 100);
        
        if (newRemaining <= 0) {
          handleIntervalCompleted();
        }
        
        return Math.max(0, newRemaining);
      });
    }, 1000);
  };

  const startWorkInterval = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setElapsed(prev => prev + 1);
      setRemaining(prev => {
        const newRemaining = prev - 1;
        setProgress(((settings.workDuration * 60 - newRemaining) / (settings.workDuration * 60)) * 100);
        
        if (newRemaining <= 0) {
          handleIntervalCompleted();
        }
        
        return Math.max(0, newRemaining);
      });
    }, 1000);
  };

  const pauseSession = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    pausedTimeRef.current = elapsed;
    setTimerState('paused');
    
    toast.info("Focus session paused", {
      description: "Take the time you need, then resume when ready"
    });
  };

  const resumeSession = () => {
    const currentTimerState = timerState === 'paused' 
      ? (currentInterval % 2 === 0 ? 'break' : 'work')
      : timerState;
      
    setTimerState(currentTimerState);
    
    if (currentTimerState === 'work') {
      startWorkInterval();
    } else {
      startBreak(currentTimerState === 'long-break');
    }
    
    toast.success("Focus session resumed");
  };

  const completeSession = async () => {
    // Stop the timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate total duration
    const endTime = new Date();
    const durationInMinutes = sessionStartTimeRef.current 
      ? Math.round((endTime.getTime() - sessionStartTimeRef.current.getTime()) / 60000)
      : 0;
    
    // Update session data
    const completedSession: Partial<FocusSession> = {
      ...currentSession,
      endTime: endTime.toISOString(),
      duration: durationInMinutes,
      completed: true,
      distractions: distractionsRef.current,
      // Calculate a simple focus score based on distractions and completion
      focusScore: Math.max(0, 100 - (distractionsRef.current * 5))
    };
    
    setCurrentSession(completedSession);
    setTimerState('completed');
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        // Using type assertion to fix Supabase typing issue
        const { error } = await supabase
          .from('focus_sessions' as any)
          .insert({
            id: completedSession.id,
            user_id: user.id,
            start_time: completedSession.startTime,
            end_time: completedSession.endTime,
            duration: completedSession.duration,
            completed: completedSession.completed,
            work_intervals: completedSession.workIntervals,
            break_intervals: completedSession.breakIntervals,
            focus_score: completedSession.focusScore,
            distractions: completedSession.distractions,
            notes: completedSession.notes,
            tags: completedSession.tags,
          });
          
        if (error) throw error;
        
        // Refresh stats
        fetchUserStats();
        
      } catch (error) {
        console.error('Error saving focus session:', error);
        toast.error("Failed to save session", {
          description: "Your session data couldn't be saved to the cloud"
        });
      }
    }
    
    // Show completion toast
    toast.success("Focus session completed!", {
      description: `You completed ${completedSession.workIntervals} work intervals (${durationInMinutes} minutes)`
    });
    
    // Check for achievements (simplified logic)
    checkForAchievements(completedSession);
  };

  const skipInterval = () => {
    handleIntervalCompleted();
    toast.info("Skipped to next interval");
  };

  const updateSettings = (newSettings: Partial<FocusSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const logDistraction = () => {
    distractionsRef.current += 1;
    setCurrentSession(prev => ({
      ...prev,
      distractions: distractionsRef.current
    }));
    
    // Simple notification
    toast.info("Distraction logged", {
      description: "Don't worry, just refocus and continue"
    });
  };
  
  const checkForAchievements = (session: Partial<FocusSession>) => {
    // This is a simplified achievement check
    // In a real app, you'd have more complex logic and store achievements in the database
    
    if (!stats) return;
    
    const newTotalSessions = stats.totalSessions + 1;
    const newTotalFocusTime = stats.totalFocusTime + (session.duration || 0);
    
    // First session achievement
    if (newTotalSessions === 1) {
      toast.success("Achievement Unlocked: First Focus!", {
        description: "You completed your first focus session"
      });
    }
    
    // 5 hours total achievement
    if (stats.totalFocusTime < 300 && newTotalFocusTime >= 300) {
      toast.success("Achievement Unlocked: Focus Apprentice", {
        description: "You've focused for over 5 hours total"
      });
    }
    
    // Perfect session (no distractions)
    if (session.distractions === 0 && (session.workIntervals || 0) >= 2) {
      toast.success("Achievement Unlocked: Laser Focus", {
        description: "You completed a session with no distractions"
      });
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const value = {
    isActive: timerState !== 'idle' && timerState !== 'completed',
    currentSession,
    timerState,
    settings,
    stats,
    elapsed,
    remaining,
    currentInterval,
    progress,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipInterval,
    updateSettings,
    logDistraction
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusMode = () => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusProvider');
  }
  return context;
};
