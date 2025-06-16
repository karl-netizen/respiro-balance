
import React from 'react';
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Play, Pause, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  onSkip 
}) => {
  return (
    <div className="flex items-center gap-4">
      <TouchFriendlyButton
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white text-gray-900 border-2 border-respiro-light hover:bg-respiro-light hover:text-gray-900"
        onClick={onPlayPause}
        hapticFeedback={true}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </TouchFriendlyButton>
      
      <TouchFriendlyButton
        variant="ghost"
        size="icon"
        className="text-white hover:text-respiro-light hover:bg-white/20"
        onClick={onSkip}
        hapticFeedback={true}
      >
        <SkipForward className="h-5 w-5" />
      </TouchFriendlyButton>
    </div>
  );
};

export default PlayerControls;
