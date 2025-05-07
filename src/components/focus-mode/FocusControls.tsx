
import React from 'react';
import { useFocusMode } from '@/context/FocusProvider';
import { Button } from '@/components/ui/button';
import { ActivityLogs } from './ActivityLogs';
import { Play, Pause, SkipForward, Ban, Save } from 'lucide-react';

export const FocusControls: React.FC = () => {
  const { 
    timerState, 
    pauseSession, 
    resumeSession, 
    completeSession, 
    skipInterval,
    logDistraction
  } = useFocusMode();
  
  const isPaused = timerState === 'paused';
  const isActive = timerState !== 'idle' && timerState !== 'completed';

  return (
    <div className="space-y-6">
      {/* Primary controls */}
      <div className="flex justify-center space-x-4">
        {isPaused ? (
          <Button 
            className="flex-1"
            onClick={resumeSession}
          >
            <Play className="h-4 w-4 mr-2" /> Resume
          </Button>
        ) : (
          <Button 
            className="flex-1"
            variant={isActive ? "default" : "outline"}
            onClick={pauseSession}
            disabled={!isActive}
          >
            <Pause className="h-4 w-4 mr-2" /> Pause
          </Button>
        )}
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={isActive ? completeSession : undefined}
          disabled={!isActive}
        >
          <Save className="h-4 w-4 mr-2" /> Complete
        </Button>
      </div>
      
      {/* Secondary controls */}
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={skipInterval}
          disabled={!isActive}
        >
          <SkipForward className="h-4 w-4 mr-1" /> Skip
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logDistraction}
          disabled={!isActive || timerState === 'break' || timerState === 'long-break'}
        >
          <Ban className="h-4 w-4 mr-1" /> Distraction
        </Button>
      </div>
      
      {/* Activity logs panel */}
      <ActivityLogs />
    </div>
  );
};
