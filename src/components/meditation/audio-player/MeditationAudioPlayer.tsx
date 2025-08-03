import React from 'react';
import { useMobileAudio } from '../hooks/useMobileAudio';
import { MobilePlayerLayout } from '../player/components/MobilePlayerLayout';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';
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
  const { deviceType } = useDeviceDetection();
  
  const {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume
  } = useMobileAudio({
    audioUrl,
    onPlay,
    onPause,
    onComplete
  });

  const [volume, setVolumeState] = React.useState(70);
  const [isMuted, setIsMuted] = React.useState(false);

  const handlePlay = () => {
    play();
  };

  const handlePause = () => {
    pause();
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? volume : 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSkipBackward = () => {
    seek(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    seek(Math.min(duration, currentTime + 10));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} audioUrl={audioUrl} />;
  }

  if (deviceType === 'mobile') {
    return (
      <MobilePlayerLayout
        title="Audio Player"
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        progress={progress}
        onPlayPause={isPlaying ? handlePause : handlePlay}
        onSkipBack={handleSkipBackward}
        onSkipForward={handleSkipForward}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        formatTime={formatTime}
      />
    );
  }

  // Desktop layout (keep existing code)
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
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
    </div>
  );
};

export default MeditationAudioPlayer;
