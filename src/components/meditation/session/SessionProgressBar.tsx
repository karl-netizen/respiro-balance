
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SessionProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
}

const SessionProgressBar: React.FC<SessionProgressBarProps> = ({ 
  currentTime, 
  duration, 
  formatTime 
}) => {
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default SessionProgressBar;
