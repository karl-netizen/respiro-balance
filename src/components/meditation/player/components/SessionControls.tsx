
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
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-md border-2 border-gray-500 shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 shadow"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </Button>
        
        <div className="relative w-24 p-2 bg-gray-700 rounded-full border border-gray-500">
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
          className="bg-gray-700 text-white hover:bg-gray-600 disabled:text-gray-500 border-2 border-gray-500 shadow"
        >
          <SkipBack className="h-5 w-5 text-white" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full bg-respiro-light text-gray-900 hover:bg-white shadow-xl border-2 border-white"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-7 w-7 text-gray-900" />
          ) : (
            <Play className="h-7 w-7 ml-0.5 text-gray-900" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipForward}
          disabled={false}
          className="bg-gray-700 text-white hover:bg-gray-600 disabled:text-gray-500 border-2 border-gray-500 shadow"
        >
          <SkipForward className="h-5 w-5 text-white" />
        </Button>
      </div>
      
      <div className="w-24"></div> {/* Spacer to balance layout */}
    </div>
  );
};

export default SessionControls;
