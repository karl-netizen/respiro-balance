
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SessionTimerProps {
  sessionElapsed: number;
  formatTime: (seconds: number) => string;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ 
  sessionElapsed,
  formatTime 
}) => {
  return (
    <div className="w-full mb-6 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Session in Progress</h3>
        <span className="text-sm">{formatTime(sessionElapsed)}</span>
      </div>
      <Progress value={sessionElapsed % 60 / 60 * 100} className="h-2" />
    </div>
  );
};

export default SessionTimer;
