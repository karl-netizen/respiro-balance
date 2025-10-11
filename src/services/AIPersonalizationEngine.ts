import { supabase } from '@/integrations/supabase/client';
import { recommendationCache } from './RecommendationCache';
import { FallbackRecommendations } from './FallbackRecommendations';

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
    context?: RecommendationContext,
    useCache: boolean = true
  ): Promise<SessionRecommendation[]> {
    // Check cache first
    if (useCache) {
      const cached = recommendationCache.get(context);
      if (cached) {
        console.log('Using cached recommendations');
        return cached.slice(0, count);
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          action: 'generate_recommendations',
          context: context || {}
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          console.warn('Rate limit exceeded, using fallback recommendations');
          return this.useFallback(count, context);
        }
        if (error.message?.includes('quota')) {
          console.warn('Quota exceeded, using fallback recommendations');
          return this.useFallback(count, context);
        }
        throw error;
      }

      const recommendations = data.recommendations.slice(0, count);
      
      // Cache the results
      recommendationCache.save(recommendations, context);
      
      // Track usage
      this.trackUsage('ai_generated', recommendations.length);
      
      return recommendations;
    } catch (error) {
      console.error('Failed to generate AI recommendations, using fallback:', error);
      return this.useFallback(count, context);
    }
  }

  private useFallback(count: number, context?: RecommendationContext): SessionRecommendation[] {
    const fallbackRecs = FallbackRecommendations.generate(context);
    this.trackUsage('fallback_generated', fallbackRecs.length);
    return fallbackRecs.slice(0, count);
  }

  private trackUsage(type: 'ai_generated' | 'fallback_generated', count: number): void {
    try {
      const usage = {
        type,
        count,
        timestamp: new Date().toISOString()
      };
      
      // Store in localStorage for analytics
      const usageKey = 'respiro_ai_usage';
      const existing = JSON.parse(localStorage.getItem(usageKey) || '[]');
      existing.push(usage);
      
      // Keep only last 100 entries
      if (existing.length > 100) {
        existing.shift();
      }
      
      localStorage.setItem(usageKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to track usage:', error);
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
