
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface SessionControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onSkipForward: () => void;
  onMuteToggle: () => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isPlaying,
  isMuted,
  onPlayPause,
  onRestart,
  onSkipForward,
  onMuteToggle
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onRestart}
        title="Restart"
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      
      <Button 
        size="icon"
        onClick={onPlayPause}
        title={isPlaying ? "Pause" : "Play"}
        className="h-12 w-12 rounded-full bg-primary"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onSkipForward}
        title="Skip 30s"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMuteToggle}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default SessionControls;
