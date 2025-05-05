
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
    <div className="space-y-2 bg-gray-800 p-3 rounded-md">
      <div className="flex justify-between text-sm text-white font-medium">
        <span className="text-respiro-light">{formatTime(currentTime)}</span>
        <span className="text-white">{formatTime(duration)}</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-respiro-light" />
    </div>
  );
};

export default ProgressDisplay;
