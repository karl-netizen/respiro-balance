
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX
} from 'lucide-react';

export interface SessionControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onToggleMute,
  onVolumeChange
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipBack}
          className="rounded-full"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={onPlayPause}
          className="rounded-full w-14 h-14 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipForward}
          className="rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMute}
          className="rounded-full"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={onVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default SessionControls;
