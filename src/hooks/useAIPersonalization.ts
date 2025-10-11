import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context/UserPreferencesProvider';
import { aiPersonalizationEngine } from '@/lib/ai-personalization/AIPersonalizationEngine';
import { SessionRecommendation, SessionFeedback, SessionActivity } from '@/lib/ai-personalization/types';

interface UseAIPersonalizationProps {
  autoLoad?: boolean;
  recommendationCount?: number;
}

export const useAIPersonalization = ({
  autoLoad = true,
  recommendationCount = 5
}: UseAIPersonalizationProps = {}) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [recommendations, setRecommendations] = useState<SessionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Load user profile when user logs in
  useEffect(() => {
    if (user && autoLoad && !isProfileLoaded) {
      loadUserProfile();
    }
  }, [user, autoLoad, isProfileLoaded]);

  const loadUserProfile = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile loading timeout')), 5000)
      );
      
      const loadPromise = aiPersonalizationEngine.loadUserProfile(user.id);
      
      const result = await Promise.race([loadPromise, timeoutPromise]) as any;
      
      if (result?.tag === 'Ok' || result?.success) {
        setIsProfileLoaded(true);
      } else {
        // Even if loading fails, set profile as loaded with limited functionality
        console.warn('Profile loading failed, using fallback mode');
        setIsProfileLoaded(true);
        setError('Using fallback recommendations');
      }
    } catch (err: any) {
      console.error('Profile loading error:', err);
      // Set profile as loaded anyway to prevent infinite loading
      setIsProfileLoaded(true);
      setError('Using fallback mode');
    }

    setIsLoading(false);
  }, [user]);

  const generateRecommendations = useCallback(async (context?: {
    currentMood?: number;
    availableTime?: number;
    currentStress?: number;
    immediateGoal?: string;
  }) => {
    if (!isProfileLoaded) {
      setError('User profile not loaded');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await aiPersonalizationEngine.generateRecommendations(
      recommendationCount,
      context
    );

    if (result.tag === 'Ok') {
      setRecommendations(result.value);
    } else {
      setError(result.value);
    }

    setIsLoading(false);
  }, [isProfileLoaded, recommendationCount]);

  const recordFeedback = useCallback(async (
    recommendationId: string,
    actualSession: SessionActivity,
    feedback: SessionFeedback
  ) => {
    try {
      await aiPersonalizationEngine.recordSessionFeedback(
        recommendationId as any,
        actualSession,
        feedback
      );
    } catch (error) {
      console.error('Failed to record feedback:', error);
    }
  }, []);

  const refreshRecommendations = useCallback(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    isProfileLoaded,
    loadUserProfile,
    generateRecommendations,
    recordFeedback,
    refreshRecommendations
  };
};