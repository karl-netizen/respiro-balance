import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/components/subscription/SubscriptionProvider';
import { toast } from 'sonner';

export interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty_level: string;
  subscription_tier: string;
  audio_file_url?: string;
  audio_file_path?: string;
  thumbnail_url?: string;
  transcript?: string;
  tags: string[];
  instructor: string;
  background_music_type?: string;
  is_featured: boolean;
  is_active: boolean;
  play_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  color_theme: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  last_played_at: string;
  completion_count: number;
  rating?: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export const useMeditationContent = () => {
  const [content, setContent] = useState<MeditationContent[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simple fallback for demo - replace with actual subscription context later
  const isSubscribed = true;
  const subscriptionTier = 'premium' as 'free' | 'premium' | 'premium_pro' | 'premium_plus';

  // Fetch all content
  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      toast.error('Failed to load meditation content');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Fetch user progress
  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_content_progress')
        .select('*');

      if (error) throw error;
      setUserProgress(data || []);
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
    }
  };

  // Check if user has access to content
  const hasAccessToContent = (contentItem: MeditationContent): boolean => {
    if (contentItem.subscription_tier === 'free') return true;
    
    if (!isSubscribed) return false;
    
    switch (contentItem.subscription_tier) {
      case 'premium':
        return ['premium', 'premium_pro', 'premium_plus'].includes(subscriptionTier);
      case 'premium_pro':
        return ['premium_pro', 'premium_plus'].includes(subscriptionTier);
      case 'premium_plus':
        return subscriptionTier === 'premium_plus';
      default:
        return false;
    }
  };

  // Get filtered content based on subscription
  const getAccessibleContent = (): MeditationContent[] => {
    return content.filter(hasAccessToContent);
  };

  // Get content by category
  const getContentByCategory = (categoryName: string): MeditationContent[] => {
    return getAccessibleContent().filter(item => item.category === categoryName);
  };

  // Get featured content
  const getFeaturedContent = (): MeditationContent[] => {
    return getAccessibleContent().filter(item => item.is_featured);
  };

  // Update play count
  const incrementPlayCount = async (contentId: string) => {
    try {
      const { error } = await supabase.rpc('increment_play_count', {
        content_id: contentId
      });

      if (error) throw error;
      
      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, play_count: item.play_count + 1 }
          : item
      ));
    } catch (err) {
      console.error('Failed to increment play count:', err);
    }
  };

  // Update user progress
  const updateProgress = async (
    contentId: string, 
    progressSeconds: number, 
    completed: boolean = false
  ) => {
    try {
      const { error } = await supabase.rpc('update_content_progress', {
        p_content_id: contentId,
        p_progress_seconds: progressSeconds,
        p_completed: completed
      });

      if (error) throw error;
      
      // Refresh user progress
      await fetchUserProgress();
      
      if (completed) {
        toast.success('Session completed!', {
          description: 'Great job on finishing your meditation.'
        });
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      toast.error('Failed to save progress');
    }
  };

  // Toggle favorite
  const toggleFavorite = async (contentId: string) => {
    try {
      const existingProgress = userProgress.find(p => p.content_id === contentId);
      const newFavoriteStatus = !existingProgress?.is_favorite;

      const { error } = await supabase
        .from('user_content_progress')
        .upsert({
          content_id: contentId,
          is_favorite: newFavoriteStatus,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      await fetchUserProgress();
      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      toast.error('Failed to update favorites');
    }
  };

  // Rate content
  const rateContent = async (contentId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('user_content_progress')
        .upsert({
          content_id: contentId,
          rating,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      await fetchUserProgress();
      toast.success('Rating saved!');
    } catch (err) {
      console.error('Failed to rate content:', err);
      toast.error('Failed to save rating');
    }
  };

  // Get user progress for specific content
  const getProgressForContent = (contentId: string): UserProgress | undefined => {
    return userProgress.find(p => p.content_id === contentId);
  };

  useEffect(() => {
    fetchContent();
    fetchCategories();
    fetchUserProgress();
  }, []);

  return {
    content,
    categories,
    userProgress,
    isLoading,
    error,
    hasAccessToContent,
    getAccessibleContent,
    getContentByCategory,
    getFeaturedContent,
    incrementPlayCount,
    updateProgress,
    toggleFavorite,
    rateContent,
    getProgressForContent,
    refetch: () => {
      fetchContent();
      fetchUserProgress();
    }
  };
};
