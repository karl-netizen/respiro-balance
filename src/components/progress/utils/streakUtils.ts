
import { isSameDay, parseISO, format, differenceInDays } from 'date-fns';

// Helper function to calculate current streak
export function calculateStreak(sessions: any[]): number {
  if (!sessions.length) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
  
  // Check if there's a session for today
  const today = new Date();
  const hasSessionToday = sortedSessions.some(session => 
    isSameDay(parseISO(session.started_at), today)
  );
  
  // If no session today, check if there was one yesterday
  if (!hasSessionToday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasSessionYesterday = sortedSessions.some(session => 
      isSameDay(parseISO(session.started_at), yesterday)
    );
    
    // If no session yesterday either, streak is 0
    if (!hasSessionYesterday) return 0;
  }
  
  // Group sessions by day
  const sessionsByDay = new Map();
  sortedSessions.forEach(session => {
    const date = format(parseISO(session.started_at), 'yyyy-MM-dd');
    if (!sessionsByDay.has(date)) {
      sessionsByDay.set(date, true);
    }
  });
  
  // Convert to array of dates
  const sessionDates = Array.from(sessionsByDay.keys())
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => b.getTime() - a.getTime()); // Newest first
  
  // Calculate consecutive days
  let streak = 1; // Start with 1 (today or yesterday)
  let currentDate = sessionDates[0];
  
  for (let i = 1; i < sessionDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    if (isSameDay(prevDate, sessionDates[i])) {
      streak++;
      currentDate = sessionDates[i];
    } else {
      break; // Streak is broken
    }
  }
  
  return streak;
}

// Helper function to calculate longest streak
export function calculateLongestStreak(sessions: any[]): number {
  if (!sessions.length) return 0;
  
  // Sort sessions by date (oldest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );
  
  // Group sessions by day to handle multiple sessions in a day
  const sessionsByDay = new Map<string, true>();
  sortedSessions.forEach(session => {
    const date = format(parseISO(session.started_at), 'yyyy-MM-dd');
    sessionsByDay.set(date, true);
  });
  
  // Convert to array of dates
  const sessionDates = Array.from(sessionsByDay.keys())
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => a.getTime() - b.getTime()); // Oldest first
  
  let currentStreak = 1;
  let longestStreak = 1;
  
  // Iterate through dates to find consecutive days
  for (let i = 1; i < sessionDates.length; i++) {
    const prevDate = sessionDates[i - 1];
    const currDate = sessionDates[i];
    
    // If dates are consecutive
    if (differenceInDays(currDate, prevDate) === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (differenceInDays(currDate, prevDate) > 1) {
      // Streak broken
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}
