
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MobileProgressDisplayProps {
  currentTime: number;
  duration: number;
  progress: number;
  formatTime: (time: number) => string;
  onSeek?: (value: number[]) => void;
}

export const MobileProgressDisplay: React.FC<MobileProgressDisplayProps> = ({
  currentTime,
  duration,
  progress,
  formatTime,
  onSeek
}) => {
  const { deviceType } = useDeviceDetection();
  
  const handleSeek = (values: number[]) => {
    if (onSeek) {
      onSeek(values);
    }
  };

  return (
    <div className="space-y-4">
      {/* Time display */}
      <div className={`flex items-center justify-between ${
        deviceType === 'mobile' ? 'text-lg font-semibold' : 'text-base'
      }`}>
        <span className="text-foreground">
          {formatTime(currentTime)}
        </span>
        <span className="text-muted-foreground">
          {formatTime(duration)}
        </span>
      </div>
      
      {/* Progress bar with enhanced touch area */}
      <div className="relative">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className={`w-full ${
            deviceType === 'mobile' 
              ? '[&>span:first-child]:h-3 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6' 
              : ''
          }`}
          aria-label="Seek position"
        />
      </div>
      
      {/* Progress percentage for mobile */}
      {deviceType === 'mobile' && (
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
      )}
    </div>
  );
};
