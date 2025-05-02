import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MeditationSessionView } from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { MeditationSession as MeditationSessionType } from '@/types/meditation';

// Create a custom hook to extend the original useMeditationSession
const useEnhancedMeditationSession = (sessionId: string) => {
  const [session, setSession] = useState<MeditationSessionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock session data
        const mockSession: MeditationSessionType = {
          id: sessionId,
          title: "Guided Morning Meditation",
          user_id: "1",
          session_type: "guided",
          duration: 10,
          started_at: new Date().toISOString(),
          completed: false,
          description: "Start your day with calm focus",
          category: "guided",
          difficulty: "beginner",
          level: "beginner",
          favorite: false,
          premium: false,
          tags: [], // Add required tags property
          instructor: "Mindful Instructor" // Add required instructor property
        };
        
        setSession(mockSession);
        setError(null);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to load meditation session");
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);
  
  const handleSessionComplete = (
    completedSession: MeditationSessionType, 
    feedback?: { rating: number; notes?: string }
  ) => {
    console.log("Session completed:", completedSession, feedback);
    // In a real app, this would call an API to update the session status
  };
  
  return {
    session,
    isLoading,
    error,
    handleSessionComplete
  };
};

const MeditationSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isPremium } = useSubscriptionContext();
  
  const { 
    session, 
    isLoading, 
    error,
    handleSessionComplete 
  } = useEnhancedMeditationSession(sessionId || '');
  
  useEffect(() => {
    // If session requires premium and user is not premium, redirect to subscription
    if (!isLoading && session && session.premium && !isPremium) {
      navigate('/subscription');
    }
  }, [session, isPremium, isLoading, navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleComplete = (completedSession: MeditationSessionType, feedback?: { rating: number; notes?: string }) => {
    if (handleSessionComplete) {
      handleSessionComplete(completedSession, feedback);
    }
    
    // Show completion dialog or redirect
    navigate('/meditate');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The meditation session you're looking for could not be found.
        </p>
        <Button onClick={() => navigate('/meditate')}>Return to Meditations</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <MeditationSessionView 
        session={session} 
        onComplete={handleComplete} 
        isPremium={isPremium}
      />
    </div>
  );
};

export default MeditationSession;
