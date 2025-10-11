import { useState, useEffect, useCallback } from 'react';
import { aiPersonalizationEngine, SessionRecommendation, RecommendationContext } from '@/services/AIPersonalizationEngine';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export function useAIRecommendations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<SessionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = useCallback(async (context?: RecommendationContext, useCache: boolean = true) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recs = await aiPersonalizationEngine.generateRecommendations(5, context, useCache);
      setRecommendations(recs);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to generate recommendations';
      setError(errorMsg);
      
      // No toast for fallback since fallback is automatic
      if (!errorMsg.includes('fallback')) {
        toast({
          title: 'Error',
          description: 'Failed to generate recommendations. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const recordFeedback = useCallback(async (
    recommendationId: string,
    sessionData: any,
    feedback: {
      rating: number;
      completed: boolean;
      helpful: boolean;
      comments?: string;
    }
  ) => {
    try {
      await aiPersonalizationEngine.recordSessionFeedback(
        recommendationId,
        sessionData,
        feedback
      );
    } catch (err) {
      console.error('Failed to record feedback:', err);
    }
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    generateRecommendations,
    recordFeedback,
  };
}
