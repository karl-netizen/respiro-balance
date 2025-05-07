
import { differenceInCalendarDays, isSameDay, format, startOfDay, parseISO } from 'date-fns';

// Calculate current streak based on completed sessions
export const calculateStreak = (sessions: any[]): number => {
  if (!sessions.length) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions]
    .filter(session => session.completed)
    .sort((a, b) => {
      const dateA = new Date(a.completed_at || a.started_at);
      const dateB = new Date(b.completed_at || b.started_at);
      return dateB.getTime() - dateA.getTime();
    });
  
  if (!sortedSessions.length) return 0;
  
  const today = startOfDay(new Date());
  let currentDate = startOfDay(new Date(sortedSessions[0].completed_at || sortedSessions[0].started_at));
  
  // If the most recent session is not today or yesterday, the streak is broken
  if (differenceInCalendarDays(today, currentDate) > 1) {
    return 0;
  }
  
  let streak = 1;
  let previousDate = currentDate;
  
  // Create a map of days with completed sessions
  const completedDays = new Map<string, boolean>();
  sortedSessions.forEach(session => {
    const dateStr = format(new Date(session.completed_at || session.started_at), 'yyyy-MM-dd');
    completedDays.set(dateStr, true);
  });
  
  // Count the streak by checking each previous day
  let checkDate = startOfDay(new Date(currentDate));
  checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
  
  while (completedDays.has(format(checkDate, 'yyyy-MM-dd'))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  return streak;
};

// Calculate longest streak achieved
export const calculateLongestStreak = (sessions: any[]): number => {
  if (!sessions.length) return 0;
  
  // Sort sessions by date (oldest first)
  const sortedSessions = [...sessions]
    .filter(session => session.completed)
    .sort((a, b) => {
      const dateA = new Date(a.completed_at || a.started_at);
      const dateB = new Date(b.completed_at || b.started_at);
      return dateA.getTime() - dateB.getTime();
    });
  
  if (!sortedSessions.length) return 0;
  
  // Create a set of unique dates with completed sessions
  const uniqueDates = new Set<string>();
  sortedSessions.forEach(session => {
    const dateStr = format(new Date(session.completed_at || session.started_at), 'yyyy-MM-dd');
    uniqueDates.add(dateStr);
  });
  
  // Convert to array of dates and sort
  const dates = Array.from(uniqueDates)
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());
  
  let currentStreak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    
    if (differenceInCalendarDays(currDate, prevDate) === 1) {
      // Consecutive days
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Streak broken
      currentStreak = 1;
    }
  }
  
  return maxStreak;
};
