
export const getMoodCheckForToday = (): string | null => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('daily_mood_check');
  
  if (!stored) return null;
  
  try {
    const moodCheck = JSON.parse(stored);
    return moodCheck.date === today ? moodCheck.mood : null;
  } catch {
    return null;
  }
};

export const setMoodCheckForToday = (mood: string): void => {
  const today = new Date().toDateString();
  const moodCheck = {
    date: today,
    mood,
    timestamp: Date.now()
  };
  
  localStorage.setItem('daily_mood_check', JSON.stringify(moodCheck));
};

export const hasMoodCheckForToday = (): boolean => {
  return getMoodCheckForToday() !== null;
};

export const clearMoodCheck = (): void => {
  localStorage.removeItem('daily_mood_check');
};
