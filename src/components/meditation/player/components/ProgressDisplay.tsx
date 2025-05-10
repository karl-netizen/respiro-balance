
import React from 'react';

export interface ProgressDisplayProps {
  currentTime: number;
  duration: number;
  progress: number;
  formatTime: (timeInSeconds: number) => string;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentTime,
  duration,
  progress,
  formatTime
}) => {
  return (
    <div className="space-y-1">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress * 100}%` }} 
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressDisplay;
