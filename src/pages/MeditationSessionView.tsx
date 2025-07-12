
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { toast } from 'sonner';
import { MeditationSessionPlayer } from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';
import SessionCompletionDialog from '@/components/meditation/SessionCompletionDialog';
import { 
  BiometricDisplay, 
  LoadingState, 
  NotFoundState, 
  SessionInfo,
  useBiometrics,
  useSessionActions
} from '@/components/meditation/session-view';

const MeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { sessions } = useMeditationSessions();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [session, setSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const {
    initialBiometrics,
    currentBiometrics,
    biometricChange,
    sessionStarted,
    handleSessionStart,
    handleAudioTimeUpdate
  } = useBiometrics();
  
  const {
    handleBackToLibrary,
    handleSessionComplete,
    handleToggleFavorite,
    handleShareSession,
    handleFeedbackSubmit,
    handleContinueWithoutFeedback,
    submitBiometricData
  } = useSessionActions(sessionId);
  
  // Find the session from our local data first
  useEffect(() => {
    if (sessionId) {
      // Look in the meditationSessions array first
      let foundSession = meditationSessions.find(s => s.id === sessionId);
      
      if (foundSession) {
        console.log("Found session in local data:", foundSession);
        setSession(foundSession);
        if (foundSession.duration) {
          setTimeRemaining(foundSession.duration * 60);
        }
      } else if (sessions?.length > 0) {
        // Fallback to API sessions if not found locally
        foundSession = sessions.find(s => s.id === sessionId) as unknown as MeditationSession;
        if (foundSession) {
          console.log("Found session in API data:", foundSession);
          setSession(foundSession);
          if (foundSession.duration) {
            setTimeRemaining(foundSession.duration * 60);
          }
        }
      }
      
      if (!foundSession) {
        console.error("Session not found:", sessionId);
        toast.error('Session not found');
        handleBackToLibrary();
      }
    }
  }, [sessionId, sessions]);
  
  const onSessionComplete = () => {
    if (sessionId) {
      handleSessionComplete();
      
      // Add biometric data
      if (currentBiometrics) {
        submitBiometricData(sessionId, currentBiometrics);
      }
      
      // Show completion dialog
      setShowCompletionDialog(true);
    }
  };
  
  if (!session) {
    return <NotFoundState />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-white hover:bg-gray-800" 
          onClick={handleBackToLibrary}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Library
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <SessionInfo 
              session={session}
              onToggleFavorite={handleToggleFavorite}
              onShareSession={handleShareSession}
            />
            
            <MeditationSessionPlayer 
              session={session} 
              onComplete={onSessionComplete}
              onStart={handleSessionStart}
              onPlayStateChange={setIsPlaying}
              biometricData={{
                focusScore: currentBiometrics?.focus_score,
                calmScore: currentBiometrics?.calm_score
              }}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Biometric Feedback</h2>
            
            <BiometricDisplay
              currentBiometrics={currentBiometrics}
              initialBiometrics={initialBiometrics}
              biometricChange={biometricChange}
              isPlaying={isPlaying}
              sessionStarted={sessionStarted}
            />
          </div>
        </div>
      </main>
      
      
      
      <SessionCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        session={session}
        meditationStats={{
          focusScore: currentBiometrics?.focus_score,
          calmScore: currentBiometrics?.calm_score,
          timeCompleted: session.duration * 60 - timeRemaining
        }}
        onSubmitFeedback={handleFeedbackSubmit}
        onContinue={handleContinueWithoutFeedback}
      />
    </div>
  );
};

export default MeditationSessionView;
