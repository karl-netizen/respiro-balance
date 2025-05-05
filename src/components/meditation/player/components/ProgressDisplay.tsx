
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressDisplayProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  progress: number;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentTime,
  duration,
  formatTime,
  progress
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-white">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-700" />
    </div>
  );
};

export default ProgressDisplay;
