
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
    <div className={`space-y-2 bg-gray-800 p-4 rounded-md border border-gray-600 shadow-lg ${className}`}>
      <div className="flex justify-between text-sm font-medium">
        <span className="text-respiro-light font-bold">{timeFormatter(currentTime)}</span>
        <span className="text-white font-bold">{timeFormatter(duration)}</span>
      </div>
      
      {/* Custom progress bar implementation */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-700 border border-gray-600">
        <div
          className="absolute left-0 top-0 h-full bg-respiro-light transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressDisplay;
