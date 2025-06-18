import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import SessionCompletionDialog from './SessionCompletionDialog';
import { useEnhancedSessionPlayer } from './hooks/useEnhancedSessionPlayer';
import { useMobileGestures } from './hooks/useMobileGestures';
import { OfflineSessionPlayer } from './offline/OfflineSessionPlayer';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

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
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    progress,
    sessionStarted,
    sessionCompleted,
    showCompletionDialog,
    setShowCompletionDialog,
    focusScore,
    calmScore,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    handleSkipForward,
    handleSkipBack,
    handleToggleMute,
    handleSessionComplete,
    handleFeedbackSubmit,
    handleContinue,
    formatTime
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

  // Use the new offline-capable player for both mobile and desktop
  return (
    <>
      <div ref={gestureRef} className="w-full">
        <OfflineSessionPlayer
          session={session}
          onComplete={handleSessionComplete}
          onStart={onStart}
          onPlayStateChange={onPlayStateChange}
          onAudioTimeUpdate={onAudioTimeUpdate}
        />
        
        {/* Additional session controls */}
        {sessionStarted && !sessionCompleted && !isPlaying && (
          <div className="flex space-x-2 mt-4">
            <button 
              onClick={handlePlayPause}
              className="flex-1 py-2 bg-respiro-dark text-white rounded-md text-sm font-medium hover:bg-respiro-darker transition-colors"
            >
              Resume
            </button>
            <button 
              onClick={handleSessionComplete}
              className="flex-1 py-2 bg-respiro-light text-respiro-dark rounded-md text-sm font-medium hover:bg-respiro-default hover:text-white transition-colors"
            >
              End Session
            </button>
          </div>
        )}
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
