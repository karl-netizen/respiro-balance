
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface MeditationSessionData {
  sessionType: string;
  duration: number;
  audioFile?: File | null;
}

interface SessionMeditationReviewData {
  rating: number;
  comment?: string;
}

export const useMeditationSession = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSession = async (sessionData: MeditationSessionData) => {
    if (!user) {
      console.log("No user is authenticated, creating anonymous session");
      // Generate temporary session ID for non-authenticated users
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setSessionId(tempId);
      return tempId;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Create a new session record in the database
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert([
          {
            user_id: user.id,
            session_type: sessionData.sessionType,
            duration: sessionData.duration,
            start_time: new Date().toISOString(),
            completed: false
          }
        ])
        .select('id')
        .single();

      if (error) throw error;

      console.log("Meditation session started:", data);
      setSessionId(data.id);
      return data.id;
    } catch (err: any) {
      console.error("Error starting meditation session:", err);
      setError(err.message || "Failed to start meditation session");
      toast.error("Could not start session", {
        description: "Please try again later"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const completeSession = async (id: string) => {
    if (!user) {
      console.log("No user is authenticated, cannot save session completion");
      return null;
    }

    if (id.startsWith('temp-')) {
      console.log("Cannot complete a temporary session");
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Update the session record to mark it as completed
      const { data, error } = await supabase
        .from('meditation_sessions')
        .update({
          completed: true,
          end_time: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Meditation session completed:", data);
      return data;
    } catch (err: any) {
      console.error("Error completing meditation session:", err);
      setError(err.message || "Failed to complete meditation session");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const rateSession = async (id: string, reviewData: SessionMeditationReviewData) => {
    if (!user) {
      console.log("No user is authenticated, cannot save session rating");
      return false;
    }

    if (id.startsWith('temp-')) {
      console.log("Cannot rate a temporary session");
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Add a rating to the session
      const { data, error } = await supabase
        .from('meditation_session_ratings')
        .insert([
          {
            session_id: id,
            user_id: user.id,
            rating: reviewData.rating,
            comment: reviewData.comment || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log("Session rated successfully:", data);
      return true;
    } catch (err: any) {
      console.error("Error rating session:", err);
      setError(err.message || "Failed to rate session");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sessionId,
    startSession,
    completeSession,
    rateSession
  };
};

export default useMeditationSession;
