
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
    <div className="space-y-2 bg-respiro-dark p-3 rounded-md border-2 border-white">
      <div className="flex justify-between text-md font-bold text-white">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Progress value={progress} className="h-3 bg-respiro-darker border border-white" />
    </div>
  );
};

export default SessionProgressBar;
