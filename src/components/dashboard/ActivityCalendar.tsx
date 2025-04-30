
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, subDays, isValid } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ActivityEntry {
  date: string;
  value: number;
  type?: string;
}

export interface ActivityCalendarProps {
  data: ActivityEntry[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  // Generate last 30 days if no data provided
  const calendarData = data.length > 0 ? data : generateMockData();
  
  // Group by week for display
  const weeks = groupByWeek(calendarData);
  
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
                  // Ensure we have a valid date string before parsing
                  const dateObj = typeof day.date === 'string' 
                    ? parseISO(day.date) 
                    : day.date instanceof Date 
                      ? day.date 
                      : new Date();
                      
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
  const weeks: ActivityEntry[][] = [];
  let currentWeek: ActivityEntry[] = [];
  
  entries.forEach((entry, index) => {
    // Ensure date is a proper string before parsing
    const entryDate = typeof entry.date === 'string'
      ? parseISO(entry.date)
      : entry.date instanceof Date
        ? entry.date
        : new Date();
        
    if (!isValid(entryDate)) {
      console.warn(`Invalid date encountered in ActivityCalendar: ${entry.date}`);
      return; // Skip this entry if date is invalid
    }
    
    const dayOfWeek = entryDate.getDay();
    
    // If it's the first day (Sunday) and not the first entry, start a new week
    if (dayOfWeek === 0 && index > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(entry);
    
    // If it's the last entry, push the current week
    if (index === entries.length - 1) {
      weeks.push([...currentWeek]);
    }
  });
  
  return weeks;
}

// Helper function to get color based on activity value
function getActivityColor(value: number): string {
  if (value === 0) return 'bg-primary/10';
  if (value < 15) return 'bg-primary/30';
  if (value < 30) return 'bg-primary/60';
  return 'bg-primary/90';
}

export default ActivityCalendar;
