import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
  WorkStressor,
  WorkBreathingSession,
  BreathingTechnique,
} from '@/types/workLifeBalance';
import { TimeBasedRecommendations } from './TimeBasedRecommendations';
import { StressorBasedRecommendations } from './StressorBasedRecommendations';
import { HealthBasedRecommendations } from './HealthBasedRecommendations';
import { GoalBasedRecommendations } from './GoalBasedRecommendations';
import { PreferenceFilter } from './PreferenceFilter';
import { HistoryPersonalizer } from './HistoryPersonalizer';
import { EffectivenessAnalytics } from './EffectivenessAnalytics';

/**
 * Main orchestrator for breathing recommendations
 * Coordinates all recommendation modules to provide personalized breathing suggestions
 */
export class BreathingRecommendationEngine {
  private preferences: EnhancedWorkLifePreferences;
  private sessionHistory: WorkBreathingSession[];

  // Recommendation modules
  private timeBasedRecommendations: TimeBasedRecommendations;
  private stressorBasedRecommendations: StressorBasedRecommendations;
  private healthBasedRecommendations: HealthBasedRecommendations;
  private goalBasedRecommendations: GoalBasedRecommendations;
  private preferenceFilter: PreferenceFilter;
  private historyPersonalizer: HistoryPersonalizer;
  private effectivenessAnalytics: EffectivenessAnalytics;

  constructor(preferences: EnhancedWorkLifePreferences, sessionHistory: WorkBreathingSession[] = []) {
    this.preferences = preferences;
    this.sessionHistory = sessionHistory;

    // Initialize all modules
    this.timeBasedRecommendations = new TimeBasedRecommendations(preferences);
    this.stressorBasedRecommendations = new StressorBasedRecommendations(preferences);
    this.healthBasedRecommendations = new HealthBasedRecommendations(preferences);
    this.goalBasedRecommendations = new GoalBasedRecommendations(preferences);
    this.preferenceFilter = new PreferenceFilter(preferences);
    this.historyPersonalizer = new HistoryPersonalizer(sessionHistory, this.preferenceFilter);
    this.effectivenessAnalytics = new EffectivenessAnalytics(sessionHistory);
  }

  /**
   * Gets personalized breathing recommendations based on current context
   */
  getRecommendations(context: {
    currentTime?: Date;
    detectedStressors?: WorkStressor[];
    currentStressLevel?: number; // 1-10 scale
    timeUntilNextMeeting?: number; // minutes
    workloadLevel?: 'light' | 'moderate' | 'heavy';
    userRequested?: boolean;
    reportedPhysicalSymptoms?: string[]; // Physical symptoms user is experiencing
    currentGoalFocus?: string; // What goal user wants to focus on right now
  } = {}): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const now = context.currentTime || new Date();

    // Core context-aware recommendations
    recommendations.push(...this.timeBasedRecommendations.getRecommendations(now, context));
    recommendations.push(...this.stressorBasedRecommendations.getRecommendations(context.detectedStressors || []));
    recommendations.push(...this.stressorBasedRecommendations.getWorkloadBasedRecommendations(context.workloadLevel || 'moderate'));
    recommendations.push(...this.stressorBasedRecommendations.getMeetingBasedRecommendations(context.timeUntilNextMeeting));

    // Health and goal-based recommendations
    recommendations.push(...this.healthBasedRecommendations.getRecommendations(context));
    recommendations.push(...this.goalBasedRecommendations.getRecommendations(context));
    recommendations.push(...this.stressorBasedRecommendations.getStressLevelBasedRecommendations(context.currentStressLevel));

    // Apply user preferences and personalization
    const filtered = this.preferenceFilter.filterByPreferences(recommendations);
    const personalized = this.historyPersonalizer.personalizeWithHistory(filtered);
    const goalAligned = this.goalBasedRecommendations.alignWithWellnessGoals(personalized, context.currentGoalFocus);

    // Sort by priority and relevance
    return goalAligned.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Log a completed session for learning
   */
  public recordSession(session: WorkBreathingSession): void {
    this.sessionHistory.push(session);

    // Keep only recent sessions for performance (last 100)
    if (this.sessionHistory.length > 100) {
      this.sessionHistory = this.sessionHistory.slice(-100);
    }

    // Update history in modules
    this.historyPersonalizer.updateHistory(this.sessionHistory);
    this.effectivenessAnalytics.updateHistory(this.sessionHistory);
  }

  /**
   * Get effectiveness analytics for user feedback
   */
  public getEffectivenessAnalytics(): {
    totalSessions: number;
    averageEffectiveness: number;
    mostEffectiveTechnique: BreathingTechnique | null;
    leastEffectiveTechnique: BreathingTechnique | null;
    improvementTrend: 'improving' | 'stable' | 'declining';
  } {
    return this.effectivenessAnalytics.getAnalytics();
  }
}
