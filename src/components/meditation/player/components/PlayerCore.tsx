
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import EnhancedSessionPlayer from '../../EnhancedSessionPlayer';

interface PlayerCoreProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const PlayerCore: React.FC<PlayerCoreProps> = ({
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  biometricData
}) => {
  return (
    <div className="bg-respiro-dark p-5 rounded-lg shadow-xl border-4 border-white">
      <EnhancedSessionPlayer
        session={session}
        onComplete={onComplete}
        onStart={onStart}
        onPlayStateChange={onPlayStateChange}
        biometricData={biometricData}
      />
    </div>
  );
};

export default PlayerCore;
