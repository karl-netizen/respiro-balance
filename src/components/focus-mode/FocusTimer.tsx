
import React from 'react';
import { useFocus } from '@/context/FocusProvider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const FocusTimer: React.FC = () => {
  const { 
    timerState, 
    remaining, 
    progress, 
    currentInterval,
    settings
  } = useFocus();
  
  const { deviceType } = useDeviceDetection();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getStateLabel = () => {
    switch (timerState) {
      case 'work':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
      case 'paused':
        return 'Paused';
      default:
        return 'Ready';
    }
  };
  
  const getStateColor = () => {
    switch (timerState) {
      case 'work':
        return 'bg-primary text-primary-foreground';
      case 'break':
        return 'bg-green-500 text-white';
      case 'long-break':
        return 'bg-blue-500 text-white';
      case 'paused':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Responsive sizing based on device type
  const getCircleSize = () => {
    switch (deviceType) {
      case 'mobile':
        return 'w-24 h-24 sm:w-32 sm:h-32';
      case 'tablet':
        return 'w-32 h-32 md:w-40 md:h-40';
      default:
        return 'w-48 h-48';
    }
  };

  const getTextSize = () => {
    switch (deviceType) {
      case 'mobile':
        return 'text-lg sm:text-xl';
      case 'tablet':
        return 'text-xl md:text-2xl';
      default:
        return 'text-2xl sm:text-5xl';
    }
  };

  const getContainerPadding = () => {
    return deviceType === 'mobile' ? 'py-4 sm:py-6' : 'py-6 sm:py-10';
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <Badge variant="outline" className={`${getStateColor()} border-none px-3 py-1.5 text-sm font-medium`}>
          {getStateLabel()}
        </Badge>
        
        <Badge variant="outline" className="bg-muted text-muted-foreground border-none px-3 py-1.5 text-xs sm:text-sm">
          Interval {currentInterval} {timerState === 'long-break' && `(Long Break)`}
        </Badge>
      </div>
      
      <div className={`text-center ${getContainerPadding()}`}>
        <div className={`relative mx-auto ${getCircleSize()} rounded-full flex items-center justify-center border-4 sm:border-6 md:border-8 border-muted`}>
          <div className={`${getTextSize()} font-mono font-bold text-center leading-tight`}>
            {formatTime(remaining)}
          </div>
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={`${
                  timerState === 'work'
                    ? 'text-primary' 
                    : timerState === 'break'
                    ? 'text-green-500'
                    : timerState === 'long-break'
                    ? 'text-blue-500'
                    : 'text-muted-foreground'
                } stroke-current transition-all duration-300`}
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 42 * progress / 100} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-2 sm:h-3"
        />
        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-muted-foreground gap-1">
          <span className="text-center sm:text-left">
            {timerState === 'work' && `${settings.workDuration} min work`}
            {timerState === 'break' && `${settings.breakDuration} min break`}
            {timerState === 'long-break' && `${settings.longBreakDuration} min break`}
          </span>
          <span className="flex items-center justify-center sm:justify-end gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(remaining)} remaining
          </span>
        </div>
      </div>
    </div>
  );
};
