
import React from 'react';
import { formatTime } from '@/lib/utils';

interface ProgressDisplayProps {
  currentTime: number;
  duration: number;
  formatTime?: (seconds: number) => string;
  progress?: number;
  className?: string;
}

/**
 * Displays the meditation progress with a custom progress bar and time indicators
 * Uses a simple div-based progress implementation to avoid component type issues
 */
const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentTime,
  duration,
  formatTime: formatTimeProp,
  progress: progressProp,
  className = '',
}) => {
  // Use provided progress value or calculate it
  const progressPercentage = progressProp !== undefined 
    ? progressProp 
    : (duration > 0 ? (currentTime / duration) * 100 : 0);
  
  // Use provided formatter or default one
  const timeFormatter = formatTimeProp || formatTime;
  
  return (
    <div className={`space-y-2 bg-respiro-dark p-5 rounded-md border-4 border-white shadow-lg ${className}`}>
      <div className="flex justify-between text-md font-bold">
        <span className="text-white">{timeFormatter(currentTime)}</span>
        <span className="text-white">{timeFormatter(duration)}</span>
      </div>
      
      {/* Custom progress bar implementation */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-respiro-darker border-2 border-white">
        <div
          className="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressDisplay;
