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
  tier?: 'free' | 'standard' | 'premium';
  is_available?: boolean;
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

// TEMPORARY: Mock data fallback for when API fails
const MOCK_SESSIONS = [
  { id: '1', title: 'Morning Mindfulness', category: 'Guided', tier: 'free', duration: 10, is_active: true, audio_file_path: 'guided-morning-1.mp3', description: 'Gentle wake-up meditation', difficulty_level: 'beginner', subscription_tier: 'free', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Calm Guide', is_available: true },
  { id: '2', title: 'Focus Improvement', category: 'Guided', tier: 'free', duration: 15, is_active: true, audio_file_path: 'guided-focus-1.mp3', description: 'Concentration practice', difficulty_level: 'beginner', subscription_tier: 'free', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Focus Master', is_available: true },
  { id: '3', title: '1-Minute Breather', category: 'Quick Breaks', tier: 'free', duration: 1, is_active: true, audio_file_path: 'quick-breather-1.mp3', description: 'Ultra-quick reset', difficulty_level: 'beginner', subscription_tier: 'free', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Quick Guide', is_available: true },
  { id: '4', title: '5-Minute Reset', category: 'Quick Breaks', tier: 'free', duration: 5, is_active: true, audio_file_path: 'quick-break-5.mp3', description: 'Lunch break meditation', difficulty_level: 'beginner', subscription_tier: 'free', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Break Guide', is_available: true },
  { id: '5', title: '3-Minute Calm', category: 'Quick Breaks', tier: 'free', duration: 3, is_active: true, audio_file_path: 'quick-calm-3.mp3', description: 'Instant stress relief', difficulty_level: 'beginner', subscription_tier: 'free', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Calm Guide', is_available: true },
  { id: '6', title: 'Stress Release', category: 'Guided', tier: 'standard', duration: 12, is_active: true, audio_file_path: 'guided-stress-1.mp3', description: 'Anxiety relief', difficulty_level: 'intermediate', subscription_tier: 'standard', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Stress Expert', is_available: true },
  { id: '7', title: 'Quick Focus', category: 'Quick Breaks', tier: 'standard', duration: 2, is_active: true, audio_file_path: 'quick-focus-1.mp3', description: 'Focus boost', difficulty_level: 'intermediate', subscription_tier: 'standard', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Focus Coach', is_available: true },
  { id: '8', title: 'Breath Awareness', category: 'Quick Breaks', tier: 'standard', duration: 4, is_active: true, audio_file_path: 'breath-awareness-1.mp3', description: 'Grounding practice', difficulty_level: 'intermediate', subscription_tier: 'standard', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Breath Master', is_available: true },
  { id: '9', title: 'Sleep Relaxation', category: 'Sleep', tier: 'standard', duration: 15, is_active: true, audio_file_path: 'sleep-relaxation-1.mp3', description: 'Evening wind-down', difficulty_level: 'beginner', subscription_tier: 'standard', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Sleep Guide', is_available: true },
  { id: '10', title: 'Deep Sleep Journey', category: 'Sleep', tier: 'premium', duration: 30, is_active: true, audio_file_path: 'sleep-deep-1.mp3', description: 'Deep restorative sleep', difficulty_level: 'advanced', subscription_tier: 'premium', is_featured: true, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Sleep Expert', is_available: true },
  { id: '11', title: 'Sleep Anxiety Relief', category: 'Sleep', tier: 'premium', duration: 20, is_active: true, audio_file_path: 'sleep-anxiety-1.mp3', description: 'Bedtime worry relief', difficulty_level: 'advanced', subscription_tier: 'premium', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Anxiety Specialist', is_available: true },
  { id: '12', title: 'Sleep Preparation', category: 'Sleep', tier: 'premium', duration: 12, is_active: true, audio_file_path: 'sleep-prep-1.mp3', description: 'Pre-sleep routine', difficulty_level: 'intermediate', subscription_tier: 'premium', is_featured: false, play_count: 0, average_rating: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tags: [], instructor: 'Sleep Coach', is_available: true },
];

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
      console.log('🔍 useMeditationContent: fetchContent started');
      console.log('🔍 Supabase client exists:', !!supabase);
      
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('📡 Supabase query completed');
      console.log('📊 Query result - data:', data);
      console.log('📊 Query result - error:', error);

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw error;
      }
      
      console.log('✅ Fetched content:', data?.length || 0, 'items');
      console.log('📊 Content by category:', 
        data?.reduce((acc: any, item: any) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {})
      );
      console.log('🎯 First 3 items:', data?.slice(0, 3));
      console.log('💾 Setting content state with', data?.length || 0, 'items');
      setContent(data || []);
      console.log('✅ Content state updated');
    } catch (err) {
      console.error('❌ Error fetching content:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      });
      
      // FALLBACK: Use mock data when API fails
      console.warn('⚠️ Using MOCK DATA as fallback due to API error');
      console.log('🧪 Loading', MOCK_SESSIONS.length, 'mock sessions');
      setContent(MOCK_SESSIONS as any);
      
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      toast.error('Using offline demo data - API connection failed');
    } finally {
      setIsLoading(false);
      console.log('✅ fetchContent completed, isLoading set to false');
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
    console.log('🚀 useMeditationContent: useEffect triggered - starting data fetch');
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
