
import React, { useState, useEffect } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressDisplay from './ProgressDisplay';

interface PlayerCoreProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  formatTime: (timeInSeconds: number) => string;
}

export const PlayerCore: React.FC<PlayerCoreProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
  formatTime,
}) => {
  // Calculate progress as a value between 0-1
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="space-y-4 w-full">
      {/* Progress bar and time display */}
      <ProgressDisplay 
        currentTime={currentTime} 
        duration={duration}
        progress={progress} 
        formatTime={formatTime}
      />
      
      {/* Playback controls */}
      <div className="flex justify-center items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSeekBackward}
          aria-label="Seek backward"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSeekForward}
          aria-label="Seek forward"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerCore;
