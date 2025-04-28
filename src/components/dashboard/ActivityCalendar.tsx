
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { addDays, format, startOfWeek, subDays } from 'date-fns';

interface ActivityDay {
  date: Date;
  minutesCount: number;
  sessionsCount: number;
}

interface ActivityCalendarProps {
  data: ActivityDay[];
  currentMonth?: string;
  currentYear?: number;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ 
  data,
  currentMonth = format(new Date(), 'MMMM'),
  currentYear = new Date().getFullYear()
}) => {
  // Generate calendar days for current view
  const generateCalendarDays = (): ActivityDay[] => {
    const today = new Date();
    const startDate = subDays(today, 27); // Show 4 weeks (28 days)
    const calendarDays: ActivityDay[] = [];
    
    for (let i = 0; i < 28; i++) {
      const currentDate = addDays(startDate, i);
      
      // Find matching day in data or create empty entry
      const matchingDay = data.find(day => 
        format(day.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
      );
      
      calendarDays.push(matchingDay || {
        date: currentDate,
        minutesCount: 0,
        sessionsCount: 0
      });
    }
    
    return calendarDays;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Generate intensity color based on minutes count
  const getIntensityColor = (minutes: number): string => {
    if (minutes === 0) return 'bg-secondary/30';
    if (minutes < 10) return 'bg-primary/20';
    if (minutes < 20) return 'bg-primary/40';
    if (minutes < 30) return 'bg-primary/60';
    return 'bg-primary/90';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Calendar</CardTitle>
        <CardDescription>
          {currentMonth} {currentYear} - Your meditation activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={`header-${i}`} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, i) => {
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div 
                key={`day-${i}`}
                className="aspect-square relative"
              >
                <div 
                  className={`w-full h-full rounded-sm ${getIntensityColor(day.minutesCount)} flex items-center justify-center cursor-pointer transition-colors hover:bg-primary/30`}
                  title={`${format(day.date, 'MMM d')}: ${day.minutesCount} minutes, ${day.sessionsCount} sessions`}
                >
                  <span className={`text-xs ${isToday ? 'font-bold' : 'text-xs text-muted-foreground'}`}>
                    {format(day.date, 'd')}
                  </span>
                </div>
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Legend:</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary/30 rounded-sm mr-1"></div>
              <span className="text-xs text-muted-foreground">None</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary/20 rounded-sm mr-1"></div>
              <span className="text-xs text-muted-foreground">&lt;10 min</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary/40 rounded-sm mr-1"></div>
              <span className="text-xs text-muted-foreground">&lt;20 min</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary/60 rounded-sm mr-1"></div>
              <span className="text-xs text-muted-foreground">&lt;30 min</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary/90 rounded-sm mr-1"></div>
              <span className="text-xs text-muted-foreground">30+ min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
