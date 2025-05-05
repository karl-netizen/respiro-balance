
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
    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="hover:bg-gray-700 text-white border border-gray-700"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <div className="relative w-24 p-2 bg-gray-900 rounded-full">
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
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipBack}
          disabled={false}
          className="text-white hover:bg-gray-700 disabled:text-gray-500 border border-gray-700"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full bg-respiro-light text-gray-900 hover:bg-respiro-dark shadow-lg"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipForward}
          disabled={false}
          className="text-white hover:bg-gray-700 disabled:text-gray-500 border border-gray-700"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-24"></div> {/* Spacer to balance layout */}
    </div>
  );
};

export default SessionControls;
