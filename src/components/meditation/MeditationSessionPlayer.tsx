
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
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
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
