
import { format, subDays } from 'date-fns';

// Generate monthly trend data for charts
export const generateMonthlyTrend = (sessions: any[]): number[] => {
  const today = new Date();
  const lastMonth = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  // Create a map of dates to session counts
  const sessionsByDate: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (!session.started_at) return;
    
    const dateKey = format(new Date(session.started_at), 'yyyy-MM-dd');
    sessionsByDate[dateKey] = (sessionsByDate[dateKey] || 0) + 1;
  });
  
  // Map the sessions to the last 30 days
  return lastMonth.map(dateStr => sessionsByDate[dateStr] || 0);
};

// Generate daily activity data for detailed charts
export const generateDailyActivity = (sessions: any[]): Array<{ day: string; minutes: number; sessions: number }> => {
  const today = new Date();
  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date,
      day: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE')
    };
  });
  
  // Initialize the result with zero values
  const result = lastWeek.map(day => ({
    day: day.day,  // This is the dateStr we need
    dayName: day.dayName,
    minutes: 0,
    sessions: 0
  }));
  
  // Aggregate session data by day
  sessions.forEach(session => {
    if (!session.started_at || !session.completed) return;
    
    const sessionDate = new Date(session.started_at);
    const dayIndex = lastWeek.findIndex(day => 
      format(day.date, 'yyyy-MM-dd') === format(sessionDate, 'yyyy-MM-dd')
    );
    
    if (dayIndex !== -1) {
      result[dayIndex].minutes += session.duration;
      result[dayIndex].sessions += 1;
    }
  });
  
  // Format the final result
  return result.map(item => ({
    day: item.day,
    minutes: item.minutes,
    sessions: item.sessions
  }));
};
