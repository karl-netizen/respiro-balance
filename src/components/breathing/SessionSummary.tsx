
import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SessionSummaryProps {
  duration: number;
  formatTime: (seconds: number) => string;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ 
  duration,
  formatTime 
}) => {
  return (
    <div className="w-full mb-6 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Session Completed</h3>
        <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
      </div>
      <Progress value={100} className="h-2" />
      {duration < 30 ? (
        <div className="flex items-center gap-2 mt-4 text-sm text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>Sessions under 30 seconds aren't tracked. Try again for longer!</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
          <Clock className="h-4 w-4" />
          <span>Great job! This session has been added to your stats.</span>
        </div>
      )}
    </div>
  );
};

export default SessionSummary;
