
import { useEffect } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import ProgressDisplay from './ProgressDisplay';
import { MeditationSession } from '@/types/meditation';

export interface PlayerCoreProps {
  session?: MeditationSession;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
  formatTime?: (timeInSeconds: number) => string;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

export const PlayerCore: React.FC<PlayerCoreProps> = ({
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onPlay = () => {},
  onPause = () => {},
  onSeekBackward = () => {},
  onSeekForward = () => {},
  formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  onPlayStateChange,
  onStart,
  onComplete
}) => {
  // Calculate progress as a value between 0-1
  const progress = duration > 0 ? currentTime / duration : 0;
  
  // Handle play/pause with the onPlayStateChange callback
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
      if (!currentTime && onStart) {
        onStart();
      }
    }
    if (onPlayStateChange) {
      onPlayStateChange(!isPlaying);
    }
  };

  // Check if session is complete
  useEffect(() => {
    if (currentTime >= duration && duration > 0 && onComplete) {
      onComplete();
    }
  }, [currentTime, duration, onComplete]);

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
        <TouchFriendlyButton 
          variant="outline" 
          size="icon"
          onClick={onSeekBackward}
          aria-label="Seek backward"
          hapticFeedback={true}
        >
          <SkipBack className="h-5 w-5" />
        </TouchFriendlyButton>
        
        <TouchFriendlyButton 
          variant="default" 
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          hapticFeedback={true}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </TouchFriendlyButton>
        
        <TouchFriendlyButton 
          variant="outline" 
          size="icon"
          onClick={onSeekForward}
          aria-label="Seek forward"
          hapticFeedback={true}
        >
          <SkipForward className="h-5 w-5" />
        </TouchFriendlyButton>
      </div>
    </div>
  );
};

export default PlayerCore;
