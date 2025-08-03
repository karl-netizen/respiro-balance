import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MeditationSession } from '@/types/meditation';

interface MeditationQueryResult {
  content: any[];
  userProgress: any[];
  userPreferences: any;
}

const fetchMeditationData = async (): Promise<MeditationQueryResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const [contentResult, progressResult, preferencesResult] = await Promise.all([
    supabase
      .from('meditation_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    
    user ? supabase
      .from('user_content_progress')
      .select('*')
      .eq('user_id', user.id) : { data: [], error: null },
    
    user ? supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle() : { data: null, error: null }
  ]);

  if (contentResult.error) throw contentResult.error;
  
  return {
    content: contentResult.data || [],
    userProgress: progressResult.data || [],
    userPreferences: preferencesResult.data
  };
};

export const useMeditationQuery = () => {
  return useQuery({
    queryKey: ['meditation-data'],
    queryFn: fetchMeditationData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransformedMeditationSessions = () => {
  const { data, isLoading, error } = useMeditationQuery();
  
  const transformedSessions = React.useMemo(() => {
    if (!data?.content) return [];
    
    const progressMap = new Map(
      data.userProgress.map(p => [p.content_id, p])
    );
    
    return data.content.map(session => ({
      id: session.id,
      user_id: '',
      title: session.title,
      description: session.description || '',
      duration: session.duration,
      category: session.category,
      session_type: session.category,
      level: session.difficulty_level || 'beginner',
      instructor: session.instructor || '',
      tags: session.tags || [],
      image_url: session.thumbnail_url,
      audio_url: session.audio_file_url,
      started_at: session.created_at,
      completed: progressMap.get(session.id)?.completed || false,
      completed_at: progressMap.get(session.id)?.last_played_at || null,
      rating: progressMap.get(session.id)?.rating || null,
      favorite: progressMap.get(session.id)?.is_favorite || false,
      premium: session.subscription_tier === 'premium',
    })) as MeditationSession[];
  }, [data]);
  
  return {
    sessions: transformedSessions,
    userPreferences: data?.userPreferences,
    isLoading,
    error
  };
};