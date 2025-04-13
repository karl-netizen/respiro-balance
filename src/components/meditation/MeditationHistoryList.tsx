
import React from 'react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

export const MeditationHistoryList = () => {
  const { sessions, isLoading } = useMeditationSessions();
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-muted/50">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No meditation sessions yet.</p>
          <p className="text-sm text-muted-foreground">Complete your first session to see it here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const date = new Date(session.started_at);
        const isToday = new Date().toDateString() === date.toDateString();
        const displayDate = isToday 
          ? formatDistanceToNow(date, { addSuffix: true }) 
          : format(date, 'MMM d, yyyy');
        
        return (
          <Card key={session.id} className={session.completed ? 'border-green-200' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{session.session_type}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{displayDate}</span>
                    <Clock className="h-3 w-3 ml-2 mr-1" />
                    <span>{session.duration} min</span>
                  </div>
                </div>
                
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {session.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MeditationHistoryList;
