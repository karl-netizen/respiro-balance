
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
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
      <TouchFriendlyButton 
        variant="outline" 
        size="icon"
        onClick={onReset}
        className="bg-background text-foreground hover:bg-accent"
        hapticFeedback={true}
      >
        <SkipBack className="h-4 w-4" />
      </TouchFriendlyButton>
      
      <TouchFriendlyButton 
        size="icon" 
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" 
        onClick={onPlayPause}
        hapticFeedback={true}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </TouchFriendlyButton>
      
      <div className="flex items-center space-x-2">
        <TouchFriendlyButton
          variant="ghost"
          size="icon"
          onClick={onMuteToggle}
          className="text-foreground hover:bg-accent hover:text-accent-foreground"
          hapticFeedback={true}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </TouchFriendlyButton>
        
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
