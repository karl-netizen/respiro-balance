
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, subDays, isValid, isSameDay } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ActivityEntry {
  date: string | Date;
  value: number;
  type?: string;
}

export interface ActivityCalendarProps {
  data: ActivityEntry[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  // Generate last 30 days if no data provided
  const calendarData = useMemo(() => {
    return data.length > 0 ? data : generateMockData();
  }, [data]);
  
  // Group by week for display - using useMemo to optimize performance
  const weeks = useMemo(() => {
    return groupByWeek(calendarData);
  }, [calendarData]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Activity Calendar</CardTitle>
            <CardDescription>Your meditation consistency</CardDescription>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => {
                  // Ensure we have a valid date
                  const dateObj = ensureValidDate(day.date);
                  const formattedDate = isValid(dateObj) 
                    ? format(dateObj, 'MMM d') 
                    : 'Invalid date';
                    
                  return (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-7 w-7 rounded-sm ${getActivityColor(day.value)}`}
                          aria-label={`${formattedDate}: ${day.value} minutes`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{formattedDate}</p>
                        <p className="text-xs text-muted-foreground">
                          {day.value > 0 
                            ? `${day.value} minutes of meditation` 
                            : 'No meditation'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </TooltipProvider>
        
        <div className="mt-3 flex items-center justify-end gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-primary/10" />
            <span>None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-primary/30" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-primary/60" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-primary/90" />
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to convert any date format to a valid Date object
function ensureValidDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  
  if (typeof dateInput === 'string') {
    // Try different formats - first attempt ISO format
    try {
      const parsedDate = parseISO(dateInput);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      // Continue to the fallback options
    }
    
    // Try to parse as a simple date (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const parsedDate = new Date(dateInput);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
  }
  
  // Return current date as fallback if date is invalid
  console.warn(`Invalid date format: ${dateInput}`);
  return new Date();
}

// Helper function to generate mock data
function generateMockData(): ActivityEntry[] {
  const data: ActivityEntry[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    // Random value between 0 and 60
    const value = Math.random() > 0.3 ? Math.floor(Math.random() * 60) : 0;
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value,
      type: value > 0 ? 'meditation' : undefined
    });
  }
  
  return data;
}

// Helper function to group entries by week
function groupByWeek(entries: ActivityEntry[]): ActivityEntry[][] {
  const result: ActivityEntry[][] = [];
  let currentWeek: ActivityEntry[] = [];
  
  // First, sort entries by date
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = ensureValidDate(a.date);
    const dateB = ensureValidDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Group by week
  sortedEntries.forEach((entry) => {
    const entryDate = ensureValidDate(entry.date);
    
    // If this is the first entry or it belongs to a new week
    if (currentWeek.length === 0 || shouldStartNewWeek(currentWeek, entryDate)) {
      // If we have entries in the current week, add them to result
      if (currentWeek.length > 0) {
        result.push([...currentWeek]);
      }
      // Start a new week
      currentWeek = [entry];
    } else {
      // Add to the current week
      currentWeek.push(entry);
    }
  });
  
  // Add the last week if it has entries
  if (currentWeek.length > 0) {
    result.push([...currentWeek]);
  }
  
  return result;
}

// Helper function to determine if a new date should start a new week
function shouldStartNewWeek(currentWeek: ActivityEntry[], newDate: Date): boolean {
  const lastEntryDate = ensureValidDate(currentWeek[currentWeek.length - 1].date);
  
  // If the day of the week is less than the previous entry's day of the week,
  // it means we've wrapped around to a new week
  return newDate.getDay() < lastEntryDate.getDay() || 
    // Or if this date is more than 1 day after the last entry
    newDate.getTime() - lastEntryDate.getTime() > 24 * 60 * 60 * 1000;
}

// Helper function to get color based on activity value
function getActivityColor(value: number): string {
  if (value === 0) return 'bg-primary/10';
  if (value < 15) return 'bg-primary/30';
  if (value < 30) return 'bg-primary/60';
  return 'bg-primary/90';
}

export default ActivityCalendar;
