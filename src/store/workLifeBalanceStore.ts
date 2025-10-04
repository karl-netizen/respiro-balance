import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkSession {
  id: string;
  type: 'work' | 'break';
  duration: number;
  startedAt: Date;
}

interface WorkLifeBalanceState {
  workMinutesToday: number;
  breakMinutesToday: number;
  sessions: WorkSession[];
  
  addWorkSession: (minutes: number) => void;
  addBreakSession: (minutes: number) => void;
  getBalanceScore: () => number;
  resetDaily: () => void;
}

export const useWorkLifeBalanceStore = create<WorkLifeBalanceState>()(
  persist(
    (set, get) => ({
      workMinutesToday: 0,
      breakMinutesToday: 0,
      sessions: [],

      addWorkSession: (minutes) => {
        set(state => ({
          workMinutesToday: state.workMinutesToday + minutes,
          sessions: [...state.sessions, {
            id: `work-${Date.now()}`,
            type: 'work',
            duration: minutes,
            startedAt: new Date()
          }]
        }));
      },

      addBreakSession: (minutes) => {
        set(state => ({
          breakMinutesToday: state.breakMinutesToday + minutes,
          sessions: [...state.sessions, {
            id: `break-${Date.now()}`,
            type: 'break',
            duration: minutes,
            startedAt: new Date()
          }]
        }));
      },

      getBalanceScore: () => {
        const { workMinutesToday, breakMinutesToday } = get();
        const total = workMinutesToday + breakMinutesToday;
        return total > 0 ? (breakMinutesToday / total) * 100 : 0;
      },

      resetDaily: () => {
        set({ workMinutesToday: 0, breakMinutesToday: 0, sessions: [] });
      }
    }),
    { name: 'respiro-work-life-balance' }
  )
);
