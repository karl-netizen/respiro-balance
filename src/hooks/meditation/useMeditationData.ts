import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MeditationSession } from '@/types/meditation';

export const useMeditationData = () => {
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeditationContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No meditation content found in database');
        setMeditationSessions([]);
        return;
      }

      // Transform database content to MeditationSession format
      const sessions: MeditationSession[] = data.map(content => ({
        id: content.id,
        title: content.title,
        category: content.category,
        difficulty: content.difficulty_level || 'Beginner',
        duration: content.duration,
        instructor: content.instructor || 'Unknown',
        description: content.description || '',
        image_url: content.thumbnail_url || '/placeholder.svg',
        tags: content.tags || [],
        premium: content.subscription_tier !== 'free',
        audio_url: content.audio_file_url,
        session_type: 'guided',
        level: content.difficulty_level || 'beginner'
      }));
      
      setMeditationSessions(sessions);
    } catch (err: any) {
      setError(err);
      console.error('💥 Error fetching meditation content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeditationContent();
  }, [fetchMeditationContent]);

  const getAllSessions = useCallback((): MeditationSession[] => {
    return meditationSessions;
  }, [meditationSessions]);

  return {
    sessions: meditationSessions,
    isLoading,
    error,
    getAllSessions,
    refetchSessions: fetchMeditationContent
  };
};