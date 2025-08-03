
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface MobilePlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleMute: () => void;
  onVolumeChange: (values: number[]) => void;
}

export const MobilePlayerControls: React.FC<MobilePlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onToggleMute,
  onVolumeChange
}) => {
  const { deviceType } = useDeviceDetection();
  
  const buttonSize = deviceType === 'mobile' ? 'lg' : 'default';
  const iconSize = deviceType === 'mobile' ? 'h-6 w-6' : 'h-5 w-5';
  const playButtonSize = deviceType === 'mobile' ? 'h-16 w-16' : 'h-12 w-12';
  const playIconSize = deviceType === 'mobile' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <div className="space-y-6">
      {/* Main playback controls */}
      <div className="flex items-center justify-center space-x-6 md:space-x-4">
        <TouchFriendlyButton
          variant="outline"
          size={buttonSize}
          onClick={onSkipBack}
          className="rounded-full border-respiro-default text-respiro-dark hover:bg-respiro-light hover:border-respiro-dark"
          hapticFeedback={true}
          aria-label="Skip backward 10 seconds"
        >
          <SkipBack className={iconSize} />
        </TouchFriendlyButton>

        <TouchFriendlyButton
          variant="default"
          className={`${playButtonSize} rounded-full bg-respiro-dark hover:bg-respiro-darker text-white`}
          onClick={onPlayPause}
          hapticFeedback={true}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className={playIconSize} />
          ) : (
            <Play className={`${playIconSize} ml-1`} />
          )}
        </TouchFriendlyButton>

        <TouchFriendlyButton
          variant="outline"
          size={buttonSize}
          onClick={onSkipForward}
          className="rounded-full border-respiro-default text-respiro-dark hover:bg-respiro-light hover:border-respiro-dark"
          hapticFeedback={true}
          aria-label="Skip forward 30 seconds"
        >
          <SkipForward className={iconSize} />
        </TouchFriendlyButton>
      </div>

      {/* Volume controls */}
      <div className="flex items-center space-x-3 px-4">
        <TouchFriendlyButton
          variant="ghost"
          size="sm"
          onClick={onToggleMute}
          className="text-respiro-dark hover:bg-respiro-light"
          hapticFeedback={true}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </TouchFriendlyButton>
        
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={100}
          step={1}
          className="flex-1 [&>span:first-child]:bg-respiro-light [&_[role=slider]]:bg-respiro-dark [&_[role=slider]]:border-respiro-default"
          onValueChange={onVolumeChange}
          aria-label="Volume"
        />
        
        <span className="text-xs text-respiro-text/70 w-8 text-right font-medium">
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </div>
  );
};
