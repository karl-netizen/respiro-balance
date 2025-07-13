
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MeditationSession } from './types';

export const useMeditationCRUD = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createSession = async (session: Omit<MeditationSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
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
      
      if (error) throw new Error(error.message);
      
      toast.success('Meditation session created successfully');
      return data?.[0]?.id;
    } catch (err: any) {
      toast.error('Failed to create meditation session');
      console.error('Error creating meditation session:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (id: string, updates: Partial<Omit<MeditationSession, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setIsLoading(true);
    try {
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
      
      if (error) throw new Error(error.message);
      
      toast.success('Meditation session updated successfully');
      return true;
    } catch (err: any) {
      toast.error('Failed to update meditation session');
      console.error('Error updating meditation session:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('meditation_library')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      toast.success('Meditation session deleted successfully');
      return true;
    } catch (err: any) {
      toast.error('Failed to delete meditation session');
      console.error('Error deleting meditation session:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSession,
    updateSession,
    deleteSession,
    isLoading,
  };
};
