import {
  EnhancedSleepRecovery,
  SleepBreathingRecommendation,
  SleepChallenge,
  SleepBreathingPurpose,
  SleepBreathingTiming,
  SleepBreathingSession,
} from '@/types/sleepRecovery';
import { BreathingTechnique } from '@/types/workLifeBalance';
import { TimingBasedRecommendations } from './TimingBasedRecommendations';
import { ChallengeSpecificRecommendations } from './ChallengeSpecificRecommendations';
import { ContextualRecommendations } from './ContextualRecommendations';
import { SleepPreferenceFilter } from './SleepPreferenceFilter';
import { SleepHistoryPersonalizer } from './SleepHistoryPersonalizer';
import { SleepAnalytics } from './SleepAnalytics';

/**
 * Main orchestrator for sleep breathing recommendations
 * Coordinates all sleep recommendation modules to provide personalized sleep breathing suggestions
 */
export class SleepBreathingRecommendationEngine {
  private sleepPreferences: EnhancedSleepRecovery;
  private sessionHistory: SleepBreathingSession[];

  // Recommendation modules
  private timingBasedRecommendations: TimingBasedRecommendations;
  private challengeSpecificRecommendations: ChallengeSpecificRecommendations;
  private contextualRecommendations: ContextualRecommendations;
  private sleepPreferenceFilter: SleepPreferenceFilter;
  private sleepHistoryPersonalizer: SleepHistoryPersonalizer;
  private sleepAnalytics: SleepAnalytics;

  constructor(sleepPreferences: EnhancedSleepRecovery, sessionHistory: SleepBreathingSession[] = []) {
    this.sleepPreferences = sleepPreferences;
    this.sessionHistory = sessionHistory;

    // Initialize all modules
    this.timingBasedRecommendations = new TimingBasedRecommendations(sleepPreferences);
    this.challengeSpecificRecommendations = new ChallengeSpecificRecommendations();
    this.contextualRecommendations = new ContextualRecommendations();
    this.sleepPreferenceFilter = new SleepPreferenceFilter(sleepPreferences);
    this.sleepHistoryPersonalizer = new SleepHistoryPersonalizer(sessionHistory);
    this.sleepAnalytics = new SleepAnalytics(sessionHistory);
  }

  /**
   * Get personalized sleep breathing recommendations based on current context
   */
  getSleepRecommendations(context: {
    currentTime?: Date;
    timeUntilBedtime?: number; // minutes
    currentSleepChallenge?: SleepChallenge;
    stressLevel?: number; // 1-10
    physicalTension?: number; // 1-10
    mentalActivity?: number; // 1-10 (racing thoughts)
    purpose?: SleepBreathingPurpose;
    environment?: 'bedroom' | 'living-room' | 'other';
    canMakeNoise?: boolean;
  } = {}): SleepBreathingRecommendation[] {
    const recommendations: SleepBreathingRecommendation[] = [];
    const now = context.currentTime || new Date();

    // Get timing-based recommendations
    recommendations.push(...this.timingBasedRecommendations.getRecommendations(now, context));

    // Get challenge-specific recommendations
    if (context.currentSleepChallenge) {
      recommendations.push(...this.challengeSpecificRecommendations.getRecommendations(context.currentSleepChallenge, context));
    }

    // Get stress-responsive recommendations
    recommendations.push(...this.contextualRecommendations.getStressRelatedRecommendations(context));

    // Get physical tension recommendations
    recommendations.push(...this.contextualRecommendations.getPhysicalTensionRecommendations(context));

    // Get racing thoughts recommendations
    recommendations.push(...this.contextualRecommendations.getRacingThoughtsRecommendations(context));

    // Filter and personalize
    const filtered = this.sleepPreferenceFilter.filterByPreferences(recommendations);
    const personalized = this.sleepHistoryPersonalizer.personalizeWithHistory(filtered);

    // Sort by priority and effectiveness
    return personalized.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Secondary sort by effectiveness for falling asleep
      return b.effectivenessForFallingAsleep - a.effectivenessForFallingAsleep;
    }).slice(0, 3);
  }

  /**
   * Record a completed sleep breathing session for learning
   */
  public recordSleepSession(session: SleepBreathingSession): void {
    this.sessionHistory.push(session);

    // Keep only recent sessions for performance (last 50 sleep sessions)
    if (this.sessionHistory.length > 50) {
      this.sessionHistory = this.sessionHistory.slice(-50);
    }

    // Update history in modules
    this.sleepHistoryPersonalizer.updateHistory(this.sessionHistory);
    this.sleepAnalytics.updateHistory(this.sessionHistory);
  }

  /**
   * Get sleep-specific analytics and insights
   */
  public getSleepBreathingAnalytics(): {
    totalSleepSessions: number;
    averageTimeToFallAsleep: number;
    averageRelaxationRating: number;
    mostEffectiveForFallingAsleep: BreathingTechnique | null;
    mostEffectiveForStayingAsleep: BreathingTechnique | null;
    sleepQualityImprovement: number;
    bestTimeForPractice: SleepBreathingTiming | null;
    recommendationsForImprovement: string[];
  } {
    return this.sleepAnalytics.getAnalytics();
  }
}
