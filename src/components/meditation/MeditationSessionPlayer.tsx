
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import AudioPlayerWrapper from './player/AudioPlayerWrapper';
import TimedPlayer from './player/TimedPlayer';
import { useSessionPlayer } from './hooks/useSessionPlayer';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const MeditationSessionPlayer: React.FC<MeditationSessionPlayerProps> = ({ 
  session, 
  onComplete,
  onStart,
  onPlayStateChange
}) => {
  const {
    isPlaying,
    remainingTime,
    progress,
    audioUrl,
    togglePlayPause,
    skipToEnd,
    handleAudioPlay,
    handleAudioPause,
    handleAudioComplete,
  } = useSessionPlayer({
    session,
    onComplete,
    onStart,
    onPlayStateChange
  });

  return (
    <Card>
      <CardContent className="pt-6">
        {audioUrl ? (
          <AudioPlayerWrapper
            audioUrl={audioUrl}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
            onComplete={handleAudioComplete}
            autoPlay={isPlaying}
          />
        ) : (
          <TimedPlayer
            remainingTime={remainingTime}
            progress={progress}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            skipToEnd={skipToEnd}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MeditationSessionPlayer;
