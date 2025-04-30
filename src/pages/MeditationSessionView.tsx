
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart, Clock, Share2 } from 'lucide-react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useBiometricData } from '@/hooks/useBiometricData';
import { toast } from 'sonner';
import { MeditationSessionPlayer } from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';
import { useMeditationFeedback } from '@/hooks/useMeditationFeedback';
import SessionCompletionDialog from '@/components/meditation/SessionCompletionDialog';

const MeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, completeSession } = useMeditationSessions();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const { biometricData, addBiometricData } = useBiometricData();
  const { addFeedback } = useMeditationFeedback();
  const [session, setSession] = useState<MeditationSession | null>(null);
  const [initialBiometrics, setInitialBiometrics] = useState<any>(null);
  const [currentBiometrics, setCurrentBiometrics] = useState<any>(null);
  const [biometricChange, setBiometricChange] = useState<any>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
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
        navigate('/meditate');
      }
    }
  }, [sessionId, sessions, navigate]);

  // Generate mock biometric data when the session starts
  const getInitialBiometrics = () => {
    const mockBiometricData = {
      heart_rate: Math.floor(Math.random() * 15) + 70, // 70-85
      hrv: Math.floor(Math.random() * 20) + 40, // 40-60
      respiratory_rate: Math.floor(Math.random() * 5) + 12, // 12-17
      stress_score: Math.floor(Math.random() * 20) + 50, // 50-70
      focus_score: Math.floor(Math.random() * 30) + 60, // 60-90
      calm_score: Math.floor(Math.random() * 25) + 65, // 65-90
    };
    return mockBiometricData;
  };
  
  const handleBackToLibrary = () => {
    navigate('/meditate');
  };
  
  const handleSessionStart = () => {
    if (!sessionStarted) {
      const initialData = getInitialBiometrics();
      setInitialBiometrics(initialData);
      setCurrentBiometrics(initialData);
      setSessionStarted(true);
      
      if (sessionId) {
        // Log that the session has started
        console.log("Session started:", sessionId);
      }
    }
  };
  
  const handleSessionComplete = () => {
    if (sessionId) {
      completeSession(sessionId);
      
      // Add biometric data
      if (currentBiometrics) {
        addBiometricData({
          ...currentBiometrics,
          sessionId
        });
      }
      
      // Show completion dialog
      setShowCompletionDialog(true);
    }
  };
  
  const handleToggleFavorite = () => {
    toast.success('Added to favorites');
  };
  
  const handleShareSession = () => {
    navigator.clipboard.writeText(`Check out this meditation: ${window.location.href}`);
    toast.success('Link copied to clipboard');
  };
  
  const handleFeedbackSubmit = (rating: number, comment: string) => {
    if (sessionId && session) {
      addFeedback(sessionId, rating, comment);
      
      toast.success('Thank you for your feedback!', {
        description: 'Your insights help improve our meditations.'
      });
      
      // Navigate back to library after a short delay
      setTimeout(() => {
        navigate('/meditate');
      }, 2000);
    }
  };
  
  const handleContinueWithoutFeedback = () => {
    navigate('/meditate');
  };
  
  const handleAudioTimeUpdate = (currentTime: number, duration: number) => {
    // Update biometrics based on session progress
    if (currentBiometrics && initialBiometrics) {
      const progress = currentTime / duration;
      
      // Simple algorithm to simulate biometric changes during meditation
      // Heart rate decreases, HRV increases, focus and calm improve
      const updatedBiometrics = {
        ...currentBiometrics,
        heart_rate: Math.max(65, initialBiometrics.heart_rate - Math.floor(10 * progress)),
        hrv: Math.min(80, initialBiometrics.hrv + Math.floor(20 * progress)),
        focus_score: Math.min(98, initialBiometrics.focus_score + Math.floor(25 * progress)),
        calm_score: Math.min(98, initialBiometrics.calm_score + Math.floor(20 * progress))
      };
      
      setCurrentBiometrics(updatedBiometrics);
      
      // Calculate changes compared to initial state
      const changes = {
        heart_rate: updatedBiometrics.heart_rate - initialBiometrics.heart_rate,
        hrv: updatedBiometrics.hrv - initialBiometrics.hrv,
        focus_score: updatedBiometrics.focus_score - initialBiometrics.focus_score,
        calm_score: updatedBiometrics.calm_score - initialBiometrics.calm_score
      };
      
      setBiometricChange(changes);
    }
  };
  
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading meditation session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBackToLibrary}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Library
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
            <p className="text-muted-foreground mb-4">{session.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{session.duration} min</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
                <Heart className="h-4 w-4 mr-1" />
                Favorite
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareSession}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <MeditationSessionPlayer 
              session={session} 
              onComplete={handleSessionComplete}
              onStart={handleSessionStart}
              onPlayStateChange={setIsPlaying}
              biometricData={{
                focusScore: currentBiometrics?.focus_score,
                calmScore: currentBiometrics?.calm_score
              }}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Biometric Feedback</h2>
            {session && sessionStarted && (
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Heart Rate</span>
                      <span className="text-sm font-medium">{currentBiometrics?.heart_rate || "--"} BPM</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: `${((currentBiometrics?.heart_rate || 70) - 50) / 100 * 100}%` }}
                      />
                    </div>
                    {biometricChange?.heart_rate && (
                      <div className={`text-xs mt-1 ${biometricChange.heart_rate < 0 ? "text-green-500" : "text-red-500"}`}>
                        {biometricChange.heart_rate < 0 ? "↓" : "↑"} {Math.abs(biometricChange.heart_rate)} BPM
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Focus Score</span>
                      <span className="text-sm font-medium">{currentBiometrics?.focus_score || "--"}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500" 
                        style={{ width: `${currentBiometrics?.focus_score || 60}%` }}
                      />
                    </div>
                    {biometricChange?.focus_score > 0 && (
                      <div className="text-xs mt-1 text-green-500">
                        ↑ {biometricChange.focus_score}%
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Calm Score</span>
                      <span className="text-sm font-medium">{currentBiometrics?.calm_score || "--"}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full transition-all duration-500" 
                        style={{ width: `${currentBiometrics?.calm_score || 65}%` }}
                      />
                    </div>
                    {biometricChange?.calm_score > 0 && (
                      <div className="text-xs mt-1 text-green-500">
                        ↑ {biometricChange.calm_score}%
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Respiratory Rate</span>
                      <span className="text-sm font-medium">{currentBiometrics?.respiratory_rate || "--"} breaths/min</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: `${((currentBiometrics?.respiratory_rate || 14) - 8) / 12 * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 text-sm text-muted-foreground italic">
                    {isPlaying ? (
                      "Biometrics updating in real-time..."
                    ) : sessionStarted ? (
                      "Session paused. Biometrics on hold."
                    ) : (
                      "Start the session to see your biometric feedback."
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!sessionStarted && (
              <div className="bg-card rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4">🧘</div>
                <h3 className="text-lg font-medium mb-2">Ready to Begin?</h3>
                <p className="text-muted-foreground mb-4">
                  Press play to start your meditation session and view your biometric feedback.
                </p>
                <Button onClick={() => {
                  handleSessionStart();
                  setIsPlaying(true);
                }}>
                  Start Meditation
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
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
