
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import SessionValidator from './player/components/SessionValidator';
import PlayerCore from './player/components/PlayerCore';

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
