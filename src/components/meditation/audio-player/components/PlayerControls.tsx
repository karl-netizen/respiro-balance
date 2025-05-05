
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onSkipBackward,
  onSkipForward
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onSkipBackward}
        title="Back 10 seconds"
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      
      {isPlaying ? (
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPause}
          title="Pause"
        >
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPlay}
          title="Play"
        >
          <Play className="h-6 w-6" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={onSkipForward}
        title="Forward 10 seconds"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PlayerControls;
