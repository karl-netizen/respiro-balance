import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MeditationContent as AdvancedMeditationContent, 
  MeditationProgress as AdvancedMeditationProgress, 
  MeditationCategory, 
  DifficultyLevel 
} from '../types/meditation.types';
import { MeditationContent as OriginalMeditationContent } from '@/hooks/useMeditationContent';
import { MeditationId, createMeditationId } from '../types/branded.types';
import { 
  ResourceState, 
  AsyncOperationState,
  createIdleState,
  createLoadingState,
  createSuccessState,
  createErrorState,
  createIdleOperation,
  createPendingOperation,
  createFulfilledOperation,
  createRejectedOperation
} from '../types/state.types';
import { 
  UseMeditationContentReturn,
  ContentByCategory
} from '../types/advanced.types';
import { useMeditationContent } from '@/hooks/useMeditationContent';
import { toast } from 'sonner';

export const useAdvancedMeditationContent = (): UseMeditationContentReturn => {
  // Use existing hook for backward compatibility
  const {
    content,
    categories,
    isLoading,
    error,
    getContentByCategory: originalGetContentByCategory,
    toggleFavorite: originalToggleFavorite,
    getProgressForContent: originalGetProgressForContent,
    incrementPlayCount: originalIncrementPlayCount
  } = useMeditationContent();

  // Advanced state management using discriminated unions
  const [state, setState] = useState<ResourceState<AdvancedMeditationContent[]>>(createIdleState());
  const [filters, setFilters] = useState({
    category: 'all' as string,
    searchQuery: '',
    difficulty: [] as DifficultyLevel[],
    duration: [0, 60] as [number, number]
  });

  // Update state based on original hook
  useEffect(() => {
    if (isLoading) {
      setState(createLoadingState());
    } else if (error) {
      setState(createErrorState(error));
    } else {
      // Convert original content to advanced content format
      const advancedContent = content.map(item => ({
        ...item,
        premium: false, // Add missing property
        tags: item.tags || [],
        play_count: item.play_count || 0
      } as AdvancedMeditationContent));
      setState(createSuccessState(advancedContent));
    }
  }, [content, isLoading, error]);

  // Computed values with proper memoization
  const computed = useMemo(() => {
    const baseContent = state.status === 'success' ? state.data : [];
    
    // Apply filters
    let filteredContent = baseContent.filter(item => {
      const matchesCategory = filters.category === 'all' || 
                             item.category === filters.category;
      const matchesSearch = !filters.searchQuery || 
                           item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesDifficulty = filters.difficulty.length === 0 || 
                               filters.difficulty.includes(item.difficulty_level);
      const matchesDuration = item.duration >= filters.duration[0] && 
                             item.duration <= filters.duration[1];
      
      return matchesCategory && matchesSearch && matchesDifficulty && matchesDuration;
    });

    // Category counts
    const categoryCounts = {
      'all': baseContent.length,
      'mindfulness': baseContent.filter(item => item.category === 'mindfulness').length,
      'stress_relief': baseContent.filter(item => item.category === 'stress_relief').length,
      'body_scan': baseContent.filter(item => item.category === 'body_scan').length,
      'focus': baseContent.filter(item => item.category === 'focus').length,
      'sleep': baseContent.filter(item => item.category === 'sleep').length,
      'breathing': baseContent.filter(item => item.category === 'breathing').length
    } as Record<string, number>;

    // Favorite content (mock implementation - would integrate with user progress)
    const favoriteContent = baseContent.filter(item => {
      const progress = originalGetProgressForContent(item.id);
      return progress?.is_favorite || false;
    });

    // Recent content (last 30 days)
    const recentContent = baseContent
      .filter(item => {
        const createdDate = new Date(item.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Recommended content (based on play count and rating)
    const recommendedContent = baseContent
      .filter(item => (item.play_count || 0) > 0 && (item.average_rating || 0) >= 4)
      .sort((a, b) => {
        const scoreA = (a.play_count || 0) * (a.average_rating || 0);
        const scoreB = (b.play_count || 0) * (b.average_rating || 0);
        return scoreB - scoreA;
      })
      .slice(0, 10);

    return {
      filteredContent,
      categoryCounts,
      favoriteContent,
      recentContent,
      recommendedContent
    };
  }, [state, filters, originalGetProgressForContent]);

  // Actions with proper error handling types
  const actions = useMemo(() => ({
    loadContent: async (): Promise<void> => {
      setState(createLoadingState());
      try {
        // The original hook handles loading automatically
        // This is just for compatibility with the new interface
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load content';
        setState(createErrorState(message));
      }
    },

    refreshContent: async (): Promise<void> => {
      setState(createLoadingState());
      try {
        // Force refresh would be implemented here
        // For now, just reset the state to trigger a reload
        setState(createIdleState());
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to refresh content';
        setState(createErrorState(message));
      }
    },

    playContent: (id: MeditationId): AsyncOperationState<void> => {
      try {
        // Convert branded type back to string for compatibility
        const stringId = id as string;
        originalIncrementPlayCount(stringId);
        toast.success('Playing meditation');
        return createFulfilledOperation(void 0);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to play content');
        return createRejectedOperation(err);
      }
    },

    toggleFavorite: (id: MeditationId): AsyncOperationState<boolean> => {
      try {
        const stringId = id as string;
        originalToggleFavorite(stringId);
        const currentStatus = originalGetProgressForContent(stringId)?.is_favorite || false;
        const newStatus = !currentStatus;
        toast.success(newStatus ? 'Added to favorites' : 'Removed from favorites');
        return { type: 'fulfilled', value: newStatus, timestamp: new Date() };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to toggle favorite');
        return createRejectedOperation(err);
      }
    },

    updateProgress: (id: MeditationId, seconds: number): AsyncOperationState<void> => {
      try {
        // This would integrate with the progress tracking system
        console.log(`Updating progress for ${id}: ${seconds} seconds`);
        return createFulfilledOperation(void 0);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to update progress');
        return createRejectedOperation(err);
      }
    },

    searchContent: (query: string): AsyncOperationState<AdvancedMeditationContent[]> => {
      try {
        const baseContent = state.status === 'success' ? state.data : [];
        const results = baseContent.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        return { type: 'fulfilled', value: results, timestamp: new Date() };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to search content');
        return createRejectedOperation(err, true);
      }
    }
  }), [originalIncrementPlayCount, originalToggleFavorite, originalGetProgressForContent, originalSearchContent]);

  // Selectors with type-safe getters
  const selectors = useMemo(() => ({
    getContentById: (id: MeditationId): AdvancedMeditationContent | undefined => {
      const stringId = id as string;
      const baseContent = state.status === 'success' ? state.data : [];
      return baseContent.find(item => item.id === stringId);
    },

    getContentByCategory: <C extends string>(category: C): AdvancedMeditationContent[] => {
      const baseContent = state.status === 'success' ? state.data : [];
      return baseContent.filter(item => item.category === category);
    },

    getProgressForContent: (id: MeditationId): AdvancedMeditationProgress | undefined => {
      const stringId = id as string;
      const originalProgress = originalGetProgressForContent(stringId);
      if (!originalProgress) return undefined;
      
      // Convert to advanced progress format
      return {
        ...originalProgress,
        play_count: originalProgress.playCount || 0,
        last_played_at: originalProgress.lastPlayedAt || new Date()
      } as AdvancedMeditationProgress;
    },

    getFavoriteStatus: (id: MeditationId): boolean => {
      const stringId = id as string;
      const progress = originalGetProgressForContent(stringId);
      return progress?.is_favorite || false;
    }
  }), [state, originalGetContentByCategory, originalGetProgressForContent]);

  // Filter controls
  const filterControls = useMemo(() => ({
    setCategory: (category: string): void => {
      setFilters(prev => ({ ...prev, category }));
    },

    setSearchQuery: (query: string): void => {
      setFilters(prev => ({ ...prev, searchQuery: query }));
    },

    setDifficultyFilter: (levels: DifficultyLevel[]): void => {
      setFilters(prev => ({ ...prev, difficulty: levels }));
    },

    setDurationRange: (range: [number, number]): void => {
      setFilters(prev => ({ ...prev, duration: range }));
    },

    clearFilters: (): void => {
      setFilters({
        category: 'all',
        searchQuery: '',
        difficulty: [],
        duration: [0, 60]
      });
    }
  }), []);

  return {
    state,
    computed,
    actions,
    selectors,
    filters: filterControls
  };
};