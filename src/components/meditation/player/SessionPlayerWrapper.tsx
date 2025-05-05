
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import SessionPlayerCard from './components/SessionPlayerCard';
import { useSessionPlayer } from '../hooks/useSessionPlayer';

interface SessionPlayerWrapperProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const SessionPlayerWrapper: React.FC<SessionPlayerWrapperProps> = ({
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  biometricData
}) => {
  const {
    handleAudioTimeUpdate
  } = useSessionPlayer({
    session,
    onComplete,
    onStart,
    onPlayStateChange
  });

  return (
    <SessionPlayerCard
      session={session}
      onComplete={onComplete}
      onStart={onStart}
      onPlayStateChange={onPlayStateChange}
      biometricData={biometricData}
      onAudioTimeUpdate={handleAudioTimeUpdate}
    />
  );
};

export default SessionPlayerWrapper;
