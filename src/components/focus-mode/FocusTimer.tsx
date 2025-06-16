
import React from 'react';
import { useFocus } from '@/context/FocusProvider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export const FocusTimer: React.FC = () => {
  const { 
    timerState, 
    remaining, 
    progress, 
    currentInterval,
    settings
  } = useFocus();
  
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

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <Badge variant="outline" className={`${getStateColor()} border-none px-2 sm:px-3 py-1 text-sm`}>
          {getStateLabel()}
        </Badge>
        
        <Badge variant="outline" className="bg-muted text-muted-foreground border-none px-2 sm:px-3 py-1 text-xs sm:text-sm">
          Interval {currentInterval} {timerState === 'long-break' && `(Long Break)`}
        </Badge>
      </div>
      
      <div className="text-center py-6 sm:py-10">
        <div className="relative mx-auto w-32 h-32 sm:w-48 sm:h-48 rounded-full flex items-center justify-center border-4 sm:border-8 border-muted">
          <div className="text-2xl sm:text-5xl font-mono font-bold">
            {formatTime(remaining)}
          </div>
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="8"
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
                } stroke-current`}
                strokeWidth="8"
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
          className="h-2"
        />
        <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground gap-1 sm:gap-0">
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
