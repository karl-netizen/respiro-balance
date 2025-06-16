import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import SessionCompletionDialog from './SessionCompletionDialog';
import { useEnhancedSessionPlayer } from './hooks/useEnhancedSessionPlayer';
import { useMobileGestures } from './hooks/useMobileGestures';
import { MobilePlayerLayout } from './player/components/MobilePlayerLayout';
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

  const handleSkipBack10 = () => {
    const newTime = Math.max(0, currentTime - 10);
    handleSeek([newTime]);
  };

  const handleSkipForward30 = () => {
    const newTime = Math.min(duration, currentTime + 30);
    handleSeek([newTime]);
  };

  if (deviceType === 'mobile') {
    return (
      <>
        <div ref={gestureRef} className="w-full">
          <MobilePlayerLayout
            title={session.title}
            description={session.description}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            progress={progress}
            onPlayPause={handlePlayPause}
            onSkipBack={handleSkipBack10}
            onSkipForward={handleSkipForward30}
            onToggleMute={handleToggleMute}
            onVolumeChange={handleVolumeChange}
            onSeek={handleSeek}
            formatTime={formatTime}
          >
            {/* Mobile-specific additional content */}
            {!sessionStarted && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Tap to play • Swipe left/right to skip
                </p>
              </div>
            )}
            
            {sessionStarted && !sessionCompleted && !isPlaying && (
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={handlePlayPause}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                >
                  Resume
                </button>
                <button 
                  onClick={handleSessionComplete}
                  className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                >
                  End Session
                </button>
              </div>
            )}
          </MobilePlayerLayout>
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
  }

  // Desktop layout (keep existing code)
  return (
    <>
      <Card className="w-full bg-respiro-dark text-white border-4 border-white shadow-xl overflow-hidden">
        <CardContent className="pt-6 space-y-4 bg-respiro-dark">
          <div className="py-4 px-4 bg-respiro-dark rounded-md border-4 border-white">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">{session.title}</h3>
            <p className="text-white text-lg text-center">{session.description}</p>
          </div>
          
          <ProgressDisplay 
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            progress={progress}
          />
          
          <SessionControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onPlayPause={handlePlayPause}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onToggleMute={handleToggleMute}
            onVolumeChange={handleVolumeChange}
          />
          
          <PausedActions 
            onResume={handlePlayPause}
            onEndSession={handleSessionComplete}
            show={!isPlaying && !sessionCompleted && sessionStarted}
          />
          
          {!sessionStarted && (
            <div className="text-center mt-6 pb-6">
              <button 
                onClick={handlePlayPause} 
                className="px-10 py-6 bg-white text-respiro-dark rounded-full font-bold text-2xl hover:bg-gray-200 transition-colors shadow-xl border-4 border-white"
              >
                Begin Here
              </button>
            </div>
          )}
        </CardContent>
      </Card>
      
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
