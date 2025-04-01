
import { 
  format, 
  isToday, 
  parseISO, 
  differenceInDays, 
  isSameDay,
  subWeeks,
  isAfter
} from 'date-fns';

// Helper function to check if a date is within the last week
export function isWithinLastWeek(date: Date): boolean {
  const oneWeekAgo = subWeeks(new Date(), 1);
  return isAfter(date, oneWeekAgo);
}

// Helper function to format date to check if it's today or a specific date
export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return isToday(date) ? "Today" : format(date, "MMM d");
}
