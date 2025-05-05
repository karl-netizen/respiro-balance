
import React from 'react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import PlayerControls from './components/PlayerControls';
import VolumeControl from './components/VolumeControl';
import ProgressDisplay from './components/ProgressDisplay';
import { MeditationAudioPlayerProps } from './types';

const MeditationAudioPlayer: React.FC<MeditationAudioPlayerProps> = ({
  audioUrl,
  onComplete,
  onPlay,
  onPause,
  autoPlay = false,
}) => {
  const {
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isLoading,
    error,
    handlePlay,
    handlePause,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    formatTime
  } = useAudioPlayer(audioUrl, onComplete, onPlay, onPause, autoPlay);

  const handleSkipBackward = () => {
    handleSeek([Math.max(0, currentTime - 10)]);
  };

  const handleSkipForward = () => {
    handleSeek([Math.min(duration, currentTime + 10)]);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
            />
          </div>
          
          <ProgressDisplay
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            onSeek={handleSeek}
          />
          
          <PlayerControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onSkipBackward={handleSkipBackward}
            onSkipForward={handleSkipForward}
          />
        </>
      )}
    </div>
  );
};

export default MeditationAudioPlayer;
