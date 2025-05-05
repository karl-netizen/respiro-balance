
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
    <div className={`space-y-2 bg-gray-800 p-3 rounded-md ${className}`}>
      <div className="flex justify-between text-sm text-white font-medium">
        <span className="text-respiro-light">{timeFormatter(currentTime)}</span>
        <span className="text-white">{timeFormatter(duration)}</span>
      </div>
      
      {/* Custom progress bar implementation */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className="absolute left-0 top-0 h-full bg-respiro-light transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressDisplay;
