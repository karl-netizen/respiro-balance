import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FocusSessionType = 'work' | 'short_break' | 'long_break';

interface FocusSession {
  id: string;
  type: FocusSessionType;
  duration: number; // minutes
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

interface FocusModeState {
  // Current session
  isActive: boolean;
  currentSession: FocusSession | null;
  timeRemaining: number; // seconds
  
  // Settings
  workDuration: number; // minutes (default 25)
  shortBreakDuration: number; // minutes (default 5)
  longBreakDuration: number; // minutes (default 15)
  sessionsUntilLongBreak: number; // (default 4)
  
  // History
  sessions: FocusSession[];
  completedCycles: number;
  
  // Actions
  startSession: (type: FocusSessionType) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipSession: () => void;
  updateSettings: (settings: Partial<FocusModeState>) => void;
  getTodayStats: () => { totalMinutes: number; sessionsCompleted: number };
}

export const useFocusModeStore = create<FocusModeState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentSession: null,
      timeRemaining: 0,
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      sessions: [],
      completedCycles: 0,

      startSession: (type) => {
        const duration = 
          type === 'work' ? get().workDuration :
          type === 'short_break' ? get().shortBreakDuration :
          get().longBreakDuration;

        const session: FocusSession = {
          id: `session-${Date.now()}`,
          type,
          duration,
          completed: false,
          startedAt: new Date()
        };

        set({
          isActive: true,
          currentSession: session,
          timeRemaining: duration * 60 // convert to seconds
        });
      },

      pauseSession: () => {
        set({ isActive: false });
      },

      resumeSession: () => {
        set({ isActive: true });
      },

      completeSession: () => {
        const { currentSession, sessions, completedCycles } = get();
        
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            completed: true,
            completedAt: new Date()
          };

          const newCycles = currentSession.type === 'work' 
            ? completedCycles + 1 
            : completedCycles;

          set({
            isActive: false,
            currentSession: null,
            timeRemaining: 0,
            sessions: [completedSession, ...sessions],
            completedCycles: newCycles
          });
        }
      },

      skipSession: () => {
        set({
          isActive: false,
          currentSession: null,
          timeRemaining: 0
        });
      },

      updateSettings: (settings) => {
        set(settings);
      },

      getTodayStats: () => {
        const { sessions } = get();
        const today = new Date().toDateString();
        
        const todaySessions = sessions.filter(s => 
          new Date(s.startedAt).toDateString() === today && s.completed
        );

        return {
          totalMinutes: todaySessions.reduce((sum, s) => sum + s.duration, 0),
          sessionsCompleted: todaySessions.filter(s => s.type === 'work').length
        };
      }
    }),
    {
      name: 'respiro-focus-mode'
    }
  )
);
