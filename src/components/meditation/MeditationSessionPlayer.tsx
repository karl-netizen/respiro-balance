
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import AudioPlayerWrapper from './player/AudioPlayerWrapper';
import TimedPlayer from './player/TimedPlayer';
import { useSessionPlayer } from './hooks/useSessionPlayer';
import EnhancedSessionPlayer from './EnhancedSessionPlayer';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const MeditationSessionPlayer: React.FC<MeditationSessionPlayerProps> = ({ 
  session, 
  onComplete,
  onStart,
  onPlayStateChange,
  biometricData
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
    handleAudioTimeUpdate
  } = useSessionPlayer({
    session,
    onComplete,
    onStart,
    onPlayStateChange
  });

  // Use the enhanced player if available
  return (
    <Card>
      <CardContent className="pt-6">
        <EnhancedSessionPlayer
          session={session}
          onComplete={onComplete}
          onStart={onStart}
          onPlayStateChange={onPlayStateChange}
          biometricData={biometricData}
          onAudioTimeUpdate={handleAudioTimeUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default MeditationSessionPlayer;
