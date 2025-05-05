
import React from 'react';
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, Pause, Play, VolumeX, Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface SessionControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleMute: () => void;
  onVolumeChange: (values: number[]) => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
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
    <div className="flex justify-between items-center p-4 bg-respiro-dark rounded-md border-4 border-white shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="bg-white hover:bg-gray-200 text-respiro-dark border-4 border-white shadow"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-respiro-dark" />
          ) : (
            <Volume2 className="h-4 w-4 text-respiro-dark" />
          )}
        </Button>
        
        <div className="relative w-24 p-2 bg-respiro-dark rounded-full border-2 border-white">
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            onValueChange={onVolumeChange}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipBack}
          disabled={false}
          className="bg-white text-respiro-dark hover:bg-gray-200 disabled:text-gray-500 border-4 border-white shadow"
        >
          <SkipBack className="h-5 w-5 text-respiro-dark" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-16 w-16 rounded-full bg-white text-respiro-dark hover:bg-gray-200 shadow-xl border-4 border-white"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-respiro-dark" />
          ) : (
            <Play className="h-8 w-8 ml-0.5 text-respiro-dark" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipForward}
          disabled={false}
          className="bg-white text-respiro-dark hover:bg-gray-200 disabled:text-gray-500 border-4 border-white shadow"
        >
          <SkipForward className="h-5 w-5 text-respiro-dark" />
        </Button>
      </div>
      
      <div className="w-24"></div> {/* Spacer to balance layout */}
    </div>
  );
};

export default SessionControls;
