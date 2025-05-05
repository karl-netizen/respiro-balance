
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
  // Ensure session has valid properties for rendering
  const safeSession = {
    ...session,
    // Use default values for critical properties if they're missing
    image_url: session.image_url || '/images/meditations/default-meditation.jpg',
    icon: session.icon || '🧘'
  };

  return (
    <div className="bg-respiro-dark p-5 rounded-lg shadow-xl border-4 border-white">
      <SessionPlayerWrapper
        session={safeSession}
        onComplete={onComplete}
        onStart={onStart}
        onPlayStateChange={onPlayStateChange}
        biometricData={biometricData}
      />
    </div>
  );
};

export default MeditationSessionPlayer;
