
export interface DailyMoodCheck {
  date: string;
  mood: string;
  timestamp: number;
}

const MOOD_CHECK_KEY = 'daily_mood_check';

export const getMoodCheckForToday = (): string | null => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(MOOD_CHECK_KEY);
  
  if (!stored) return null;
  
  try {
    const moodCheck: DailyMoodCheck = JSON.parse(stored);
    return moodCheck.date === today ? moodCheck.mood : null;
  } catch {
    return null;
  }
};

export const setMoodCheckForToday = (mood: string): void => {
  const today = new Date().toDateString();
  const moodCheck: DailyMoodCheck = {
    date: today,
    mood,
    timestamp: Date.now()
  };
  
  localStorage.setItem(MOOD_CHECK_KEY, JSON.stringify(moodCheck));
};

export const hasMoodCheckForToday = (): boolean => {
  return getMoodCheckForToday() !== null;
};

export const clearMoodCheck = (): void => {
  localStorage.removeItem(MOOD_CHECK_KEY);
};
