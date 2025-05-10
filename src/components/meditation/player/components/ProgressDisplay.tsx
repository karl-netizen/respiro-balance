
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/lib/utils';

interface ProgressDisplayProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentTime,
  duration,
  isPlaying
}) => {
  // Calculate progress as a percentage (0-100)
  const progressPercentage = duration > 0 
    ? Math.min((currentTime / duration) * 100, 100) 
    : 0;

  return (
    <div className="w-full space-y-2">
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>
          {isPlaying ? 
            <span className="text-primary">● Playing</span> : 
            <span>Paused</span>}
        </span>
        <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>
    </div>
  );
};

export default ProgressDisplay;
