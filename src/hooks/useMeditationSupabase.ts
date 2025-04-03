
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  imageUrl?: string;
  audioUrl?: string;
  instructor: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useMeditationSupabase = () => {
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

  // Create a new meditation session
  const createSession = async (session: Omit<MeditationSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('meditation_library')
        .insert([
          {
            title: session.title,
            description: session.description,
            duration: session.duration,
            category: session.category,
            image_url: session.imageUrl,
            audio_url: session.audioUrl,
            instructor: session.instructor,
            tags: session.tags,
            is_featured: session.isFeatured,
          }
        ])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Meditation session created successfully');
      
      // Refresh the sessions list
      fetchSessions();
      
      return data?.[0]?.id;
    } catch (err: any) {
      toast.error('Failed to create meditation session');
      console.error('Error creating meditation session:', err);
      throw err;
    }
  };

  // Update an existing meditation session
  const updateSession = async (id: string, updates: Partial<Omit<MeditationSession, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Convert to database field names
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
      if (updates.audioUrl !== undefined) dbUpdates.audio_url = updates.audioUrl;
      if (updates.instructor !== undefined) dbUpdates.instructor = updates.instructor;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
      
      const { error } = await supabase
        .from('meditation_library')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Meditation session updated successfully');
      
      // Refresh the sessions list
      fetchSessions();
      
      return true;
    } catch (err: any) {
      toast.error('Failed to update meditation session');
      console.error('Error updating meditation session:', err);
      return false;
    }
  };

  // Delete a meditation session
  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meditation_library')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Meditation session deleted successfully');
      
      // Refresh the sessions list
      fetchSessions();
      
      return true;
    } catch (err: any) {
      toast.error('Failed to delete meditation session');
      console.error('Error deleting meditation session:', err);
      return false;
    }
  };

  // Get a single meditation session by ID
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

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    getSessionById,
  };
};

export default useMeditationSupabase;
