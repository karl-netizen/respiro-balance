
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart, Clock, Share2 } from 'lucide-react';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useBiometricData } from '@/hooks/useBiometricData';
import { toast } from 'sonner';
import { 
  MeditationSessionPlayer, 
  BiometricTracker,
  SessionRatingDialog 
} from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';
import { MeditationAudioPlayer } from '@/components/meditation/MeditationAudioPlayer';
import { getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';
import { meditationSessions } from '@/data/meditationSessions';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

const MeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, completeSession } = useMeditationSessions();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { biometricData, addBiometricData } = useBiometricData();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
    };
    return mockBiometricData;
  };

  // Get audio URL from session or try to find a matching file
  useEffect(() => {
    if (session) {
      console.log("Attempting to get audio URL for session:", session.title);
      
      // If session has an explicit audio_url property
      if (session.audio_url) {
        console.log("Session has audio_url property:", session.audio_url);
        const url = getMeditationAudioUrl(session.audio_url);
        console.log("Generated audio URL:", url);
        setAudioUrl(url);
        return;
      }
      
      // Try to match by session ID
      const idBasedFileName = `${session.id}.mp3`;
      console.log("Trying to find audio by session ID:", idBasedFileName);
      const idBasedUrl = getMeditationAudioUrl(idBasedFileName);
      
      // Try to match by session title
      const titleBasedFileName = `${session.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
      console.log("Trying to find audio by session title:", titleBasedFileName);
      const titleBasedUrl = getMeditationAudioUrl(titleBasedFileName);
      
      // Set whichever URL we can find, with ID-based taking precedence
      if (idBasedUrl) {
        console.log("Using ID-based audio URL");
        setAudioUrl(idBasedUrl);
      } else if (titleBasedUrl) {
        console.log("Using title-based audio URL");
        setAudioUrl(titleBasedUrl);
      } else {
        console.log("No matching audio found for session:", session.title);
        setAudioUrl(null);
        toast.warning('No audio found for this meditation');
      }
    }
  }, [session]);
  
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
      
      // Show rating dialog
      setShowRatingDialog(true);
    }
  };
  
  const handleToggleFavorite = () => {
    toast.success('Added to favorites');
  };
  
  const handleShareSession = () => {
    navigator.clipboard.writeText(`Check out this meditation: ${window.location.href}`);
    toast.success('Link copied to clipboard');
  };
  
  const handleRatingSubmit = (sessionId: string, rating: number, feedback: string) => {
    toast.success('Thank you for your feedback!');
    setShowRatingDialog(false);
  };
  
  const handleAudioPlay = () => {
    setIsPlaying(true);
    handleSessionStart();
  };
  
  const handleAudioPause = () => {
    setIsPlaying(false);
  };
  
  const handleAudioComplete = () => {
    // Auto-complete the session when audio finishes
    handleSessionComplete();
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
            
            {audioUrl ? (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Audio Meditation</h2>
                <MeditationAudioPlayer 
                  audioUrl={audioUrl} 
                  onComplete={handleAudioComplete}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  autoPlay={false}
                />
              </div>
            ) : (
              <MeditationSessionPlayer 
                session={session} 
                onComplete={handleSessionComplete}
                onStart={handleSessionStart}
                onPlayStateChange={setIsPlaying}
              />
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Biometric Feedback</h2>
            {session && (
              <BiometricTracker
                isPlaying={isPlaying}
                sessionStarted={sessionStarted}
                timeRemaining={timeRemaining}
                sessionDuration={session.duration}
                initialBiometrics={initialBiometrics}
                setInitialBiometrics={setInitialBiometrics}
                currentBiometrics={currentBiometrics} 
                setCurrentBiometrics={setCurrentBiometrics}
                biometricChange={biometricChange}
                setBiometricChange={setBiometricChange}
                getInitialBiometrics={getInitialBiometrics}
                sessionId={sessionId || ""}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      <SessionRatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        sessionId={sessionId || ""}
        sessionTitle={session.title}
        onSubmitRating={handleRatingSubmit}
      />
    </div>
  );
};

export default MeditationSessionView;
