
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { MeditationSession } from './types';

export const useMeditationFetch = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('meditation_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const formattedSessions: MeditationSession[] = data.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        duration: session.duration,
        category: session.category,
        imageUrl: session.image_url,
        audioUrl: session.audio_url,
        instructor: session.instructor,
        tags: session.tags || [],
        isFeatured: session.is_featured,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
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
        .from('meditation_library')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        imageUrl: data.image_url,
        audioUrl: data.audio_url,
        instructor: data.instructor,
        tags: data.tags || [],
        isFeatured: data.is_featured,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
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
