
import React from 'react';
import { useFocus } from '@/context/FocusProvider';
import { Button } from '@/components/ui/button';
import { FocusSession } from './types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface FocusSessionSummaryProps {
  session: Partial<FocusSession> | null;
}

export const FocusSessionSummary: React.FC<FocusSessionSummaryProps> = ({ session }) => {
  const { startSession } = useFocus();
  
  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Session data unavailable</p>
        <Button onClick={startSession} className="mt-4">
          Start New Session
        </Button>
      </div>
    );
  }
  
  const completedAt = session.endTime ? new Date(session.endTime) : new Date();
  const startedAt = session.startTime ? new Date(session.startTime) : new Date();
  const focusScore = session.focusScore || 0;
  
  const getDuration = () => {
    if (session.duration) {
      return `${session.duration} minutes`;
    }
    
    // Calculate duration from start/end times
    const diffMs = completedAt.getTime() - startedAt.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} minutes`;
  };
  
  const getFocusScoreClass = () => {
    if (focusScore >= 80) return "text-green-500";
    if (focusScore >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Session Completed</h3>
        <p className="text-muted-foreground text-sm">
          {formatDistanceToNow(startedAt, { addSuffix: true })}
        </p>
      </div>
      
      {/* Session stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="text-xl font-semibold">{getDuration()}</p>
        </Card>
        
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Focus Score</p>
          <p className={`text-xl font-semibold ${getFocusScoreClass()}`}>
            {focusScore}/100
          </p>
        </Card>
        
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Tasks Completed</p>
          <p className="text-xl font-semibold">{session.completed ? "Yes" : "No"}</p>
        </Card>
        
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Distractions</p>
          <p className="text-xl font-semibold">{session.distractions || 0}</p>
        </Card>
      </div>
      
      {/* Session insights */}
      <div className="bg-muted/50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Session Insights</h4>
        <ul className="space-y-2 text-sm">
          {focusScore >= 80 && (
            <li className="flex gap-2 items-start">
              <Badge className="bg-green-100 text-green-800 mt-0.5">Great</Badge>
              <span>Excellent focus! You maintained high concentration.</span>
            </li>
          )}
          
          {focusScore >= 60 && focusScore < 80 && (
            <li className="flex gap-2 items-start">
              <Badge className="bg-yellow-100 text-yellow-800 mt-0.5">Good</Badge>
              <span>Good session with some room for improvement.</span>
            </li>
          )}
          
          {focusScore < 60 && (
            <li className="flex gap-2 items-start">
              <Badge className="bg-red-100 text-red-800 mt-0.5">Challenging</Badge>
              <span>You faced some focus challenges. Try a shorter work interval next time.</span>
            </li>
          )}
          
          {(session.distractions || 0) > 2 && (
            <li className="flex gap-2 items-start">
              <Badge className="bg-orange-100 text-orange-800 mt-0.5">Tip</Badge>
              <span>Try minimizing distractions by silencing notifications.</span>
            </li>
          )}
          
          {session.completed && (
            <li className="flex gap-2 items-start">
              <Badge className="bg-blue-100 text-blue-800 mt-0.5">Achievement</Badge>
              <span>You completed your task. Great job!</span>
            </li>
          )}
        </ul>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={startSession} className="w-full">
          Start New Session
        </Button>
      </div>
    </div>
  );
};
