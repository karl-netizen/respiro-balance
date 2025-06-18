
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { useEnhancedSessionPlayer } from '../hooks/useEnhancedSessionPlayer';
import { OfflineSessionPlayer } from '../offline/OfflineSessionPlayer';
import { EnhancedPlayerControls } from './EnhancedPlayerControls';

interface EnhancedPlayerCoreProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onAudioTimeUpdate?: (currentTime: number, duration: number) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

export const EnhancedPlayerCore: React.FC<EnhancedPlayerCoreProps> = ({
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  onAudioTimeUpdate,
  biometricData = {}
}) => {
  const {
    isPlaying,
    currentTime,
    duration,
    sessionStarted,
    sessionCompleted,
    handlePlayPause,
    handleSessionComplete,
  } = useEnhancedSessionPlayer({
    session,
    onComplete,
    onStart,
    onPlayStateChange,
    onAudioTimeUpdate,
    biometricData
  });

  return (
    <div className="w-full">
      <OfflineSessionPlayer
        session={session}
        onComplete={handleSessionComplete}
        onStart={onStart}
        onPlayStateChange={onPlayStateChange}
        onAudioTimeUpdate={onAudioTimeUpdate}
      />
      
      <EnhancedPlayerControls
        session={session}
        isPlaying={isPlaying}
        sessionStarted={sessionStarted}
        sessionCompleted={sessionCompleted}
        onPlayPause={handlePlayPause}
        onSessionComplete={handleSessionComplete}
      />
    </div>
  );
};
