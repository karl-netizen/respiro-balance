import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Habit {
  id: string;
  name: string;
  icon: string;
  order: number;
}

interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

interface MorningRitualsState {
  habits: Habit[];
  completions: HabitCompletion[];
  currentStreak: number;
  longestStreak: number;
  
  addHabit: (name: string, icon: string) => void;
  removeHabit: (habitId: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  getTodayCompletions: () => HabitCompletion[];
  calculateStreak: () => number;
}

export const useMorningRitualsStore = create<MorningRitualsState>()(
  persist(
    (set, get) => ({
      habits: [
        { id: '1', name: 'Meditation', icon: '🧘', order: 1 },
        { id: '2', name: 'Exercise', icon: '💪', order: 2 },
        { id: '3', name: 'Journaling', icon: '📝', order: 3 }
      ],
      completions: [],
      currentStreak: 0,
      longestStreak: 0,

      addHabit: (name, icon) => {
        const { habits } = get();
        const newHabit: Habit = {
          id: `habit-${Date.now()}`,
          name,
          icon,
          order: habits.length + 1
        };
        set({ habits: [...habits, newHabit] });
      },

      removeHabit: (habitId) => {
        set(state => ({
          habits: state.habits.filter(h => h.id !== habitId),
          completions: state.completions.filter(c => c.habitId !== habitId)
        }));
      },

      toggleHabit: (habitId, date) => {
        const { completions } = get();
        const existing = completions.find(
          c => c.habitId === habitId && c.date === date
        );

        if (existing) {
          set({
            completions: completions.map(c =>
              c.habitId === habitId && c.date === date
                ? { ...c, completed: !c.completed }
                : c
            )
          });
        } else {
          set({
            completions: [
              ...completions,
              { habitId, date, completed: true }
            ]
          });
        }

        // Recalculate streak
        const streak = get().calculateStreak();
        set(state => ({
          currentStreak: streak,
          longestStreak: Math.max(state.longestStreak, streak)
        }));
      },

      getTodayCompletions: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().completions.filter(c => c.date === today);
      },

      calculateStreak: () => {
        const { habits, completions } = get();
        let streak = 0;
        let currentDate = new Date();

        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const dayCompletions = completions.filter(c => c.date === dateStr && c.completed);
          
          // Check if all habits completed for this day
          if (dayCompletions.length === habits.length) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      }
    }),
    {
      name: 'respiro-morning-rituals'
    }
  )
);
