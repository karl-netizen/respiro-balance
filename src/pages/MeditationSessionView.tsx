
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
  BiometricDisplay, 
  SessionRatingDialog 
} from '@/components/meditation';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';
import { MeditationAudioPlayer } from '@/components/meditation/MeditationAudioPlayer';
import { getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

const MeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, completeSession } = useMeditationSessions();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { biometricData, addBiometricData } = useBiometricData();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Find the session
  const session = sessions?.find(s => s.id === sessionId);
  
  useEffect(() => {
    if (!session && sessions?.length > 0) {
      // Session not found, redirect to meditation library
      navigate('/meditate');
      toast.error('Session not found');
    }
  }, [session, sessions, navigate]);

  // Get audio URL from session or Supabase
  useEffect(() => {
    if (session) {
      // If session has an audioUrl, try to get it from Supabase
      if (session.audioUrl) {
        const url = getMeditationAudioUrl(session.audioUrl);
        setAudioUrl(url);
      } else {
        // Try to find a matching audio file by session title or ID
        const baseFileName = `${session.title.toLowerCase().replace(/\s+/g, '-')}`;
        const potentialUrl = getMeditationAudioUrl(baseFileName);
        
        if (potentialUrl) {
          setAudioUrl(potentialUrl);
        } else {
          // Fallback to null - no audio available
          setAudioUrl(null);
        }
      }
    }
  }, [session]);
  
  const handleBackToLibrary = () => {
    navigate('/meditate');
  };
  
  const handleSessionComplete = () => {
    if (sessionId) {
      completeSession(sessionId);
      
      // Generate mock biometric data
      const mockBiometricData = {
        sessionId,
        heart_rate: Math.floor(Math.random() * 15) + 70, // 70-85
        hrv: Math.floor(Math.random() * 20) + 40, // 40-60
        respiratory_rate: Math.floor(Math.random() * 10) + 65, // 65-75
        stress_score: Math.floor(Math.random() * 20) + 50, // 50-70
      };
      
      // Add biometric data
      addBiometricData(mockBiometricData);
      
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
  
  const handleAudioComplete = () => {
    // Auto-complete the session when audio finishes
    handleSessionComplete();
  };
  
  if (!session) {
    return null; // Or a loading state
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
            <h1 className="text-2xl font-bold mb-2">{session.title || session.session_type}</h1>
            <p className="text-muted-foreground mb-4">{session.description || "No description available"}</p>
            
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
                  autoPlay={false}
                />
              </div>
            ) : (
              <MeditationSessionPlayer 
                session={session as MeditationSession} 
                onComplete={handleSessionComplete}
              />
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Biometric Feedback</h2>
            <BiometricDisplay 
              biometricData={biometricData as BiometricData} 
              sessionId={sessionId || ""}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      
      <SessionRatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        sessionId={sessionId || ""}
        onSubmitRating={handleRatingSubmit}
      />
    </div>
  );
};

export default MeditationSessionView;
