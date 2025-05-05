
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import SessionPlayerWrapper from './player/SessionPlayerWrapper';

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
    <div className="bg-respiro-dark p-5 rounded-lg shadow-xl border-4 border-white">
      <SessionPlayerWrapper
        session={session}
        onComplete={onComplete}
        onStart={onStart}
        onPlayStateChange={onPlayStateChange}
        biometricData={biometricData}
      />
    </div>
  );
};

export default MeditationSessionPlayer;
