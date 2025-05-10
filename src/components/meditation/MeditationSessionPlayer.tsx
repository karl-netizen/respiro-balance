
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { SessionValidator, PlayerCore } from './player/components';

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
  return (
    <SessionValidator session={session}>
      {(validatedSession) => (
        <PlayerCore
          session={validatedSession}
          onComplete={onComplete}
          onStart={onStart}
          onPlayStateChange={onPlayStateChange}
          biometricData={biometricData}
        />
      )}
    </SessionValidator>
  );
};

export default MeditationSessionPlayer;
