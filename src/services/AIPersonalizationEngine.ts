import { supabase } from '@/integrations/supabase/client';

export type PersonalizationProfileId = string;
export type SessionRecommendationId = string;

export interface SessionRecommendation {
  id: SessionRecommendationId;
  sessionType: 'meditation' | 'breathing' | 'focus' | 'sleep' | 'stress_relief';
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioGuide?: string;
  backgroundSound?: string;
  confidence: number;
  reasoning: string[];
  expectedBenefits: {
    moodImprovement: number;
    stressReduction: number;
    focusImprovement: number;
  };
  tags: string[];
}

export interface RecommendationContext {
  currentMood?: number;
  availableTime?: number;
  currentStress?: number;
  energyLevel?: number;
  immediateGoal?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class AIPersonalizationEngine {
  private static instance: AIPersonalizationEngine;

  private constructor() {}

  static getInstance(): AIPersonalizationEngine {
    if (!AIPersonalizationEngine.instance) {
      AIPersonalizationEngine.instance = new AIPersonalizationEngine();
    }
    return AIPersonalizationEngine.instance;
  }

  async generateRecommendations(
    count: number = 5,
    context?: RecommendationContext
  ): Promise<SessionRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          action: 'generate_recommendations',
          context: context || {}
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        if (error.message?.includes('quota')) {
          throw new Error('QUOTA_EXCEEDED');
        }
        throw error;
      }

      return data.recommendations.slice(0, count);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      throw error;
    }
  }

  async recordSessionFeedback(
    recommendationId: SessionRecommendationId,
    sessionData: any,
    feedback: {
      rating: number;
      completed: boolean;
      helpful: boolean;
      comments?: string;
    }
  ): Promise<void> {
    try {
      await supabase.functions.invoke('ai-personalization', {
        body: {
          action: 'record_feedback',
          context: {
            recommendationId,
            sessionData,
            feedback
          }
        }
      });
    } catch (error) {
      console.error('Failed to record feedback:', error);
      throw error;
    }
  }
}

export const aiPersonalizationEngine = AIPersonalizationEngine.getInstance();
