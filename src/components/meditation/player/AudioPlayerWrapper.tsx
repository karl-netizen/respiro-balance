
import React from 'react';
import { MeditationAudioPlayer } from '../audio-player';

interface AudioPlayerWrapperProps {
  audioUrl: string;
  onPlay: () => void;
  onPause: () => void;
  onComplete: () => void;
  autoPlay: boolean;
}

const AudioPlayerWrapper: React.FC<AudioPlayerWrapperProps> = ({
  audioUrl,
  onPlay,
  onPause,
  onComplete,
  autoPlay
}) => {
  return (
    <div className="mb-6">
      <MeditationAudioPlayer
        audioUrl={audioUrl}
        onPlay={onPlay}
        onPause={onPause}
        onComplete={onComplete}
        autoPlay={autoPlay}
      />
    </div>
  );
};

export default AudioPlayerWrapper;
