
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';

type EnhancedMeditationSession = MeditationSession & { isFeatured?: boolean };

export const useEnhancedSession = (sessionId: string | undefined) => {
  const [session, setSession] = useState<EnhancedMeditationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        navigate('/meditate');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // This is a mock implementation - in a real app you would fetch from an API
        const mockSession: EnhancedMeditationSession = {
          id: sessionId,
          title: "Mindful Breathing",
          description: "A guided session focused on mindful breathing techniques.",
          duration: 15,
          audio_url: "/meditations/mindful-breathing.mp3",
          image_url: "/images/meditation-background.jpg",
          category: "guided",
          session_type: "guided",
          tags: ["breathing", "beginner", "relaxation"],
          level: "beginner",
          instructor: "Sarah Johnson",
          isFeatured: true
        };
        
        setSession(mockSession);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load meditation session');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId, navigate]);
  
  const handleSessionComplete = () => {
    toast.success('Meditation session completed! Great job!');
    // Here you could track completion, update stats, etc.
  };
  
  return {
    session,
    isLoading,
    handleSessionComplete
  };
};

export default useEnhancedSession;
