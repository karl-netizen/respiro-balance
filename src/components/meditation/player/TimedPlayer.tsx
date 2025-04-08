
import React from 'react';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import PlayerControls from './PlayerControls';

interface TimedPlayerProps {
  remainingTime: number;
  progress: number;
  isPlaying: boolean;
  togglePlayPause: () => void;
  skipToEnd: () => void;
}

const TimedPlayer: React.FC<TimedPlayerProps> = ({
  remainingTime,
  progress,
  isPlaying,
  togglePlayPause,
  skipToEnd
}) => {
  return (
    <div className="flex flex-col items-center">
      <ProgressBar progress={progress} />
      <Timer remainingTime={remainingTime} />
      <PlayerControls 
        isPlaying={isPlaying} 
        onPlayPause={togglePlayPause} 
        onSkip={skipToEnd} 
      />
    </div>
  );
};

export default TimedPlayer;
