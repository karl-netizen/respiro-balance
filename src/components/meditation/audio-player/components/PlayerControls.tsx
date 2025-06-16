
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
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
      <TouchFriendlyButton
        variant="outline"
        size="icon"
        onClick={onSkipBackward}
        title="Back 10 seconds"
        hapticFeedback={true}
      >
        <SkipBack className="h-5 w-5" />
      </TouchFriendlyButton>
      
      {isPlaying ? (
        <TouchFriendlyButton
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPause}
          title="Pause"
          hapticFeedback={true}
        >
          <Pause className="h-6 w-6" />
        </TouchFriendlyButton>
      ) : (
        <TouchFriendlyButton
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPlay}
          title="Play"
          hapticFeedback={true}
        >
          <Play className="h-6 w-6" />
        </TouchFriendlyButton>
      )}
      
      <TouchFriendlyButton
        variant="outline"
        size="icon"
        onClick={onSkipForward}
        title="Forward 10 seconds"
        hapticFeedback={true}
      >
        <SkipForward className="h-5 w-5" />
      </TouchFriendlyButton>
    </div>
  );
};

export default PlayerControls;
