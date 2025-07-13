
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFetch = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const formattedSessions: MeditationSession[] = data.map(session => ({
        id: session.id,
        user_id: '', // Content isn't user-specific
        title: session.title,
        description: session.description || '',
        duration: session.duration,
        category: session.category,
        session_type: session.category, // Map category to session_type
        level: session.difficulty_level || 'beginner',
        instructor: session.instructor || '',
        tags: session.tags || [],
        image_url: session.thumbnail_url,
        audio_url: session.audio_file_url,
        started_at: session.created_at,
        completed: false,
        completed_at: null,
        rating: null,
        favorite: false,
        premium: session.subscription_tier === 'premium',
      }));
      
      setSessions(formattedSessions);
    } catch (err: any) {
      setError(err);
      toast.error('Failed to fetch meditation sessions');
      console.error('Error fetching meditation sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionById = async (id: string): Promise<MeditationSession | null> => {
    try {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        user_id: '', // Content isn't user-specific
        title: data.title,
        description: data.description || '',
        duration: data.duration,
        category: data.category,
        session_type: data.category, // Map category to session_type
        level: data.difficulty_level || 'beginner',
        instructor: data.instructor || '',
        tags: data.tags || [],
        image_url: data.thumbnail_url,
        audio_url: data.audio_file_url,
        started_at: data.created_at,
        completed: false,
        completed_at: null,
        rating: null,
        favorite: false,
        premium: data.subscription_tier === 'premium',
      };
    } catch (err: any) {
      console.error('Error fetching meditation session:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    getSessionById,
  };
};
