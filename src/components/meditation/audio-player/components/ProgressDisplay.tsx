
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ProgressDisplayProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  onSeek: (value: number[]) => void;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentTime,
  duration,
  formatTime,
  onSeek
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.1}
        onValueChange={onSeek}
        className="mb-4"
      />
    </>
  );
};

export default ProgressDisplay;
