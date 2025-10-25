
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface ActivityEntry {
  date: string; // YYYY-MM-DD format
  value: number;
  type?: string;
}

interface ActivityCalendarProps {
  data: ActivityEntry[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  // Get current month and year
  const now = new Date();
  const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Activity Calendar</CardTitle>
        <CardDescription>{currentMonth} {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Calendar day headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 35 }, (_, i) => {
            
            // Get the activity for this day (if exists)
            const dayOfMonth = i - 3 + 1; // Adjust based on month start day
            const hasActivity = dayOfMonth > 0 && dayOfMonth <= 31;
            
            // Find matching activity (simplified)
            const activity = data.find(d => {
              const parts = d.date.split('-');
              const day = parseInt(parts[2], 10);
              return day === dayOfMonth;
            });
            
            const intensity = activity ? Math.min(Math.floor(activity.value / 10), 4) : 0;
            
            return (
              <div 
                key={i}
                className={`
                  h-6 w-6 rounded-sm flex items-center justify-center text-[10px]
                  ${hasActivity ? '' : 'opacity-30'}
                  ${activity ? `bg-primary/20 hover:bg-primary/30` : 'bg-muted'}
                  ${intensity === 1 ? 'bg-primary/20' : ''}
                  ${intensity === 2 ? 'bg-primary/30' : ''}
                  ${intensity === 3 ? 'bg-primary/50' : ''}
                  ${intensity === 4 ? 'bg-primary/70' : ''}
                `}
              >
                {hasActivity ? dayOfMonth : ''}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-muted rounded-sm"></div>
            <span>No activity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-primary/70 rounded-sm"></div>
            <span>Active day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
