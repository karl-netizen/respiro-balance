
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SessionControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayPause: () => void;
  onReset: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (values: number[]) => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onReset,
  onMuteToggle,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={onReset}
        className="bg-white text-gray-700 hover:bg-gray-100"
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button 
        size="icon" 
        className="h-12 w-12 rounded-full bg-primary text-white hover:bg-primary/90" 
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMuteToggle}
          className="text-gray-700 hover:bg-gray-100"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          className="w-24"
          onValueChange={onVolumeChange}
        />
      </div>
    </div>
  );
};

export default SessionControls;
