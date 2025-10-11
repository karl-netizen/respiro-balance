import { SessionRecommendation } from './AIPersonalizationEngine';

interface CachedRecommendations {
  recommendations: SessionRecommendation[];
  timestamp: number;
  context: any;
}

const CACHE_KEY = 'respiro_ai_recommendations_cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export class RecommendationCache {
  private static instance: RecommendationCache;

  private constructor() {}

  static getInstance(): RecommendationCache {
    if (!RecommendationCache.instance) {
      RecommendationCache.instance = new RecommendationCache();
    }
    return RecommendationCache.instance;
  }

  save(recommendations: SessionRecommendation[], context: any): void {
    try {
      const cached: CachedRecommendations = {
        recommendations,
        timestamp: Date.now(),
        context
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error('Failed to cache recommendations:', error);
    }
  }

  get(currentContext: any): SessionRecommendation[] | null {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY);
      if (!cachedStr) return null;

      const cached: CachedRecommendations = JSON.parse(cachedStr);
      
      // Check if cache is expired
      if (Date.now() - cached.timestamp > CACHE_TTL) {
        this.clear();
        return null;
      }

      // Check if context has changed significantly
      if (this.contextChanged(cached.context, currentContext)) {
        return null;
      }

      return cached.recommendations;
    } catch (error) {
      console.error('Failed to retrieve cached recommendations:', error);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  private contextChanged(oldContext: any, newContext: any): boolean {
    // Significant change if mood/stress differs by more than 2 points
    const moodDiff = Math.abs((oldContext?.currentMood || 5) - (newContext?.currentMood || 5));
    const stressDiff = Math.abs((oldContext?.currentStress || 5) - (newContext?.currentStress || 5));
    
    if (moodDiff > 2 || stressDiff > 2) return true;

    // Significant change if time of day changed
    if (oldContext?.timeOfDay !== newContext?.timeOfDay) return true;

    return false;
  }
}

export const recommendationCache = RecommendationCache.getInstance();
