
import React from 'react';
import { Button } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  timeRemaining: number;
  totalDuration: number;
  volume: number;
  onPlayPause: () => void;
  onReset: () => void;
  onVolumeChange: (volume: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  timeRemaining,
  totalDuration,
  volume,
  onPlayPause,
  onReset,
  onVolumeChange
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full bg-secondary h-2 rounded-full">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeRemaining / (totalDuration * 60)) * 100}%` }}
        />
      </div>
      
      <div className="text-3xl font-mono">
        {formatTime(timeRemaining)}
      </div>
      
      <div className="flex items-center justify-center space-x-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onReset}
          disabled={isPlaying && timeRemaining === totalDuration * 60}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full" 
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-foreground/70" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
