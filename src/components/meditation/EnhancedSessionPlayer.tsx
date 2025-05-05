
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import SessionCompletionDialog from './SessionCompletionDialog';
import { useEnhancedSessionPlayer } from './hooks/useEnhancedSessionPlayer';
import ProgressDisplay from './player/components/ProgressDisplay';
import SessionControls from './player/components/SessionControls';
import PausedActions from './player/components/PausedActions';

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
  
  return (
    <>
      <Card className="w-full bg-gray-900 text-white border-gray-700 shadow-xl overflow-hidden">
        <CardContent className="pt-6 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="py-2 px-4 bg-gray-800 rounded-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2 text-center">{session.title}</h3>
            <p className="text-gray-300 text-center">{session.description}</p>
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
            <div className="text-center mt-4 pb-4">
              <button 
                onClick={handlePlayPause} 
                className="px-6 py-3 bg-respiro-light text-gray-900 rounded-full font-bold text-lg hover:bg-respiro-dark transition-colors shadow-xl border-2 border-white/20"
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
