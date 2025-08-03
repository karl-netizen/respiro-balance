
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import SessionCompletionDialog from './SessionCompletionDialog';
import { useEnhancedSessionPlayer } from './hooks/useEnhancedSessionPlayer';
import { useMobileGestures } from './hooks/useMobileGestures';
import { EnhancedPlayerCore } from './enhanced-player/EnhancedPlayerCore';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface EnhancedSessionPlayerProps {
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

const EnhancedSessionPlayer: React.FC<EnhancedSessionPlayerProps> = ({ 
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  onAudioTimeUpdate,
  biometricData = {}
}) => {
  const { deviceType } = useDeviceDetection();
  
  const {
    currentTime,
    sessionStarted,
    showCompletionDialog,
    setShowCompletionDialog,
    focusScore,
    calmScore,
    handlePlayPause,
    handleSkipForward,
    handleSkipBack,
    handleFeedbackSubmit,
    handleContinue,
  } = useEnhancedSessionPlayer({
    session,
    onComplete,
    onStart,
    onPlayStateChange,
    onAudioTimeUpdate,
    biometricData
  });

  // Mobile gesture controls
  const gestureRef = useMobileGestures({
    onTap: handlePlayPause,
    onSwipeLeft: handleSkipForward,
    onSwipeRight: handleSkipBack,
    enabled: deviceType === 'mobile' && sessionStarted
  });

  return (
    <>
      <div ref={gestureRef} className="w-full">
        <EnhancedPlayerCore
          session={session}
          onComplete={onComplete}
          onStart={onStart}
          onPlayStateChange={onPlayStateChange}
          onAudioTimeUpdate={onAudioTimeUpdate}
          biometricData={biometricData}
        />
      </div>
      
      <SessionCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        session={session}
        meditationStats={{
          focusScore,
          calmScore,
          timeCompleted: currentTime
        }}
        onSubmitFeedback={handleFeedbackSubmit}
        onContinue={handleContinue}
      />
    </>
  );
};

export default EnhancedSessionPlayer;
