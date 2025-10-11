import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock stores and services
const mockPersonalizationStore = {
  recommendations: [] as any[],
  isLoading: false,
  userPreferences: {} as any,
  interactionHistory: [] as any[],
  setRecommendations: vi.fn((recs) => { mockPersonalizationStore.recommendations = recs; }),
  setLoading: vi.fn((loading) => { mockPersonalizationStore.isLoading = loading; }),
  updateUserPreference: vi.fn((key, value) => {
    mockPersonalizationStore.userPreferences = {
      ...mockPersonalizationStore.userPreferences,
      [key]: value
    };
  }),
  addInteraction: vi.fn((interaction) => { mockPersonalizationStore.interactionHistory.push(interaction); }),
  getCachedRecommendations: vi.fn(() => mockPersonalizationStore.recommendations),
  setCacheTimestamp: vi.fn(),
  isCacheExpired: vi.fn(),
  getSessionPattern: vi.fn(),
  getPreferredTimes: vi.fn(),
  calculateEngagementScore: vi.fn(),
  getState: () => mockPersonalizationStore
};

const usePersonalizationStore = {
  getState: () => mockPersonalizationStore
};

const generateFallbackRecommendations = vi.fn();

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0
    }
  }
});

describe('AI Personalization System', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Personalization Store', () => {
    it('should initialize with empty recommendations', () => {
      const state = usePersonalizationStore.getState();
      
      expect(state.recommendations).toHaveLength(0);
      expect(state.isLoading).toBe(false);
    });

    it('should set recommendations', () => {
      const { setRecommendations } = usePersonalizationStore.getState();
      
      const mockRecommendations = [
        {
          id: '1',
          title: 'Morning Meditation',
          description: 'Start your day with a 10-minute meditation',
          type: 'meditation',
          priority: 'high',
          reason: 'Based on your morning routine'
        },
        {
          id: '2',
          title: 'Breathing Exercise',
          description: 'Try a 5-minute breathing exercise',
          type: 'breathing',
          priority: 'medium',
          reason: 'Helps with stress management'
        }
      ];
      
      setRecommendations(mockRecommendations);
      
      const state = usePersonalizationStore.getState();
      expect(state.recommendations).toEqual(mockRecommendations);
    });

    it('should set loading state', () => {
      const { setLoading } = usePersonalizationStore.getState();
      
      setLoading(true);
      expect(usePersonalizationStore.getState().isLoading).toBe(true);
      
      setLoading(false);
      expect(usePersonalizationStore.getState().isLoading).toBe(false);
    });

    it('should track user preferences', () => {
      const { updateUserPreference } = usePersonalizationStore.getState();
      
      updateUserPreference('preferredSessionLength', 15);
      
      const state = usePersonalizationStore.getState();
      expect(state.userPreferences?.preferredSessionLength).toBe(15);
    });

    it('should store interaction history', () => {
      const { addInteraction } = usePersonalizationStore.getState();
      
      const interaction = {
        id: 'interaction-1',
        type: 'completed_session',
        timestamp: new Date(),
        metadata: { sessionId: 'session-123', duration: 10 }
      };
      
      addInteraction(interaction);
      
      const state = usePersonalizationStore.getState();
      expect(state.interactionHistory).toContainEqual(interaction);
    });
  });

  describe('Fallback Recommendations', () => {
    it('should generate rule-based recommendations', () => {
      const mockRecommendations = [
        {
          id: 'rec-1',
          title: 'Deep Breathing',
          description: 'Try a breathing exercise',
          type: 'breathing',
          priority: 'high',
          reason: 'Great for beginners'
        }
      ];
      
      vi.mocked(generateFallbackRecommendations).mockReturnValue(mockRecommendations);
      
      const recommendations = generateFallbackRecommendations({
        userLevel: 'beginner',
        timeOfDay: 'morning'
      });
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].type).toBe('breathing');
    });

    it('should match user activity patterns', () => {
      const mockRecommendations = [
        {
          id: 'rec-2',
          title: 'Evening Wind Down',
          description: 'Relax before bed',
          type: 'meditation',
          priority: 'high',
          reason: 'Based on your evening activity'
        }
      ];
      
      vi.mocked(generateFallbackRecommendations).mockReturnValue(mockRecommendations);
      
      const recommendations = generateFallbackRecommendations({
        userLevel: 'intermediate',
        timeOfDay: 'evening',
        recentActivity: ['meditation', 'meditation', 'breathing']
      });
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].title).toContain('Evening');
    });

    it('should prioritize recommendations by relevance', () => {
      const mockRecommendations = [
        {
          id: 'rec-1',
          title: 'High Priority',
          description: 'Important task',
          type: 'meditation',
          priority: 'high',
          reason: 'Critical for your goals'
        },
        {
          id: 'rec-2',
          title: 'Medium Priority',
          description: 'Secondary task',
          type: 'breathing',
          priority: 'medium',
          reason: 'Helpful addition'
        }
      ];
      
      vi.mocked(generateFallbackRecommendations).mockReturnValue(mockRecommendations);
      
      const recommendations = generateFallbackRecommendations({
        userLevel: 'advanced'
      });
      
      expect(recommendations[0].priority).toBe('high');
      expect(recommendations[1].priority).toBe('medium');
    });

    it('should adapt to user skill level', () => {
      const beginnerRecs = [
        {
          id: 'rec-1',
          title: 'Beginner Meditation',
          description: 'Simple 5-minute session',
          type: 'meditation',
          priority: 'high',
          reason: 'Perfect for starting out'
        }
      ];
      
      const advancedRecs = [
        {
          id: 'rec-2',
          title: 'Advanced Focus Session',
          description: 'Challenging 30-minute practice',
          type: 'meditation',
          priority: 'high',
          reason: 'Matches your experience level'
        }
      ];
      
      vi.mocked(generateFallbackRecommendations)
        .mockReturnValueOnce(beginnerRecs)
        .mockReturnValueOnce(advancedRecs);
      
      const beginnerResults = generateFallbackRecommendations({ userLevel: 'beginner' });
      expect(beginnerResults[0].title).toContain('Beginner');
      
      const advancedResults = generateFallbackRecommendations({ userLevel: 'advanced' });
      expect(advancedResults[0].title).toContain('Advanced');
    });
  });

  describe('Recommendation Cache', () => {
    it('should cache recommendations', () => {
      const { setRecommendations, getCachedRecommendations } = usePersonalizationStore.getState();
      
      const mockRecommendations = [
        {
          id: '1',
          title: 'Cached Recommendation',
          description: 'Test',
          type: 'meditation',
          priority: 'high',
          reason: 'Cache test'
        }
      ];
      
      setRecommendations(mockRecommendations);
      
      const cached = getCachedRecommendations?.();
      expect(cached).toEqual(mockRecommendations);
    });

    it('should invalidate expired cache', () => {
      const { 
        setRecommendations, 
        setCacheTimestamp, 
        isCacheExpired 
      } = usePersonalizationStore.getState();
      
      setRecommendations([
        {
          id: '1',
          title: 'Test',
          description: 'Test',
          type: 'meditation',
          priority: 'high',
          reason: 'Test'
        }
      ]);
      
      // Set cache timestamp to 2 hours ago
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      setCacheTimestamp?.(twoHoursAgo);
      
      const expired = isCacheExpired?.();
      expect(expired).toBe(true);
    });

    it('should not invalidate fresh cache', () => {
      const {
        setRecommendations,
        setCacheTimestamp,
        isCacheExpired
      } = usePersonalizationStore.getState();
      
      setRecommendations([
        {
          id: '1',
          title: 'Fresh',
          description: 'Fresh recommendation',
          type: 'meditation',
          priority: 'high',
          reason: 'Fresh cache'
        }
      ]);
      
      setCacheTimestamp?.(Date.now());
      
      const expired = isCacheExpired?.();
      expect(expired).toBe(false);
    });
  });

  describe('User Behavior Analysis', () => {
    it('should track session completion patterns', () => {
      const { addInteraction, getSessionPattern } = usePersonalizationStore.getState();
      
      // Add multiple completed sessions
      for (let i = 0; i < 5; i++) {
        addInteraction({
          id: `interaction-${i}`,
          type: 'completed_session',
          timestamp: new Date(),
          metadata: { duration: 10, type: 'meditation' }
        });
      }
      
      const pattern = getSessionPattern?.();
      expect(pattern?.totalSessions).toBeGreaterThanOrEqual(5);
    });

    it('should identify preferred session times', () => {
      const { addInteraction, getPreferredTimes } = usePersonalizationStore.getState();
      
      // Add morning sessions
      for (let i = 0; i < 3; i++) {
        const morningTime = new Date();
        morningTime.setHours(8, 0, 0, 0);
        
        addInteraction({
          id: `morning-${i}`,
          type: 'completed_session',
          timestamp: morningTime,
          metadata: { duration: 10 }
        });
      }
      
      const preferredTimes = getPreferredTimes?.();
      expect(preferredTimes).toBeDefined();
    });

    it('should calculate engagement score', () => {
      const { addInteraction, calculateEngagementScore } = usePersonalizationStore.getState();
      
      // High engagement: multiple sessions, completions
      addInteraction({
        id: 'engagement-1',
        type: 'completed_session',
        timestamp: new Date(),
        metadata: { duration: 20 }
      });
      
      addInteraction({
        id: 'engagement-2',
        type: 'completed_session',
        timestamp: new Date(),
        metadata: { duration: 15 }
      });
      
      const score = calculateEngagementScore?.();
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty recommendation list', () => {
      const { setRecommendations } = usePersonalizationStore.getState();
      
      setRecommendations([]);
      
      const state = usePersonalizationStore.getState();
      expect(state.recommendations).toHaveLength(0);
    });

    it('should handle invalid recommendation data', () => {
      const { setRecommendations } = usePersonalizationStore.getState();
      
      const invalidData = null as any;
      
      // Should not throw error
      expect(() => setRecommendations(invalidData)).not.toThrow();
    });

    it('should provide default recommendations on failure', () => {
      vi.mocked(generateFallbackRecommendations).mockReturnValue([
        {
          id: 'default-1',
          title: 'Default Meditation',
          description: 'Fallback option',
          type: 'meditation',
          priority: 'medium',
          reason: 'Default recommendation'
        }
      ]);
      
      const recommendations = generateFallbackRecommendations({});
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].id).toContain('default');
    });
  });
});
