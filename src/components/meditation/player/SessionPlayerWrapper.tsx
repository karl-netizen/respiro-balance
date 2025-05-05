
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
    <div className="max-w-lg mx-auto shadow-xl">
      <SessionPlayerCard
        session={session}
        onComplete={onComplete}
        onStart={onStart}
        onPlayStateChange={onPlayStateChange}
        biometricData={biometricData}
        onAudioTimeUpdate={handleAudioTimeUpdate}
      />
    </div>
  );
};

export default SessionPlayerWrapper;
