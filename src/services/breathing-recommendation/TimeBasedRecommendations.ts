import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
} from '@/types/workLifeBalance';

/**
 * Handles time-of-day based breathing recommendations
 */
export class TimeBasedRecommendations {
  constructor(private preferences: EnhancedWorkLifePreferences) {}

  /**
   * Get recommendations based on time of day
   */
  getRecommendations(
    currentTime: Date,
    context: {
      workloadLevel?: 'light' | 'moderate' | 'heavy';
    }
  ): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const hour = currentTime.getHours();

    // Early morning energy boost
    if (hour >= 7 && hour <= 9 && this.preferences.energyPatterns?.morningEnergy === 'low') {
      recommendations.push({
        id: `morning-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'coherent-breathing',
        duration: this.getPreferredDuration(),
        reasoning: 'Start your day with energizing rhythmic breathing to boost morning alertness',
        priority: 'medium',
        context: {
          timeOfDay: 'morning',
          workloadLevel: context.workloadLevel,
        },
      });
    }

    // Pre-lunch focus maintenance
    if (hour >= 11 && hour <= 12) {
      recommendations.push({
        id: `prelunch-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'box-breathing',
        duration: Math.min(this.getPreferredDuration(), 3),
        reasoning: 'Maintain focus and clarity before your lunch break',
        priority: 'low',
        context: {
          timeOfDay: 'pre-lunch',
        },
      });
    }

    // Post-lunch energy dip
    if (hour >= 13 && hour <= 15 && this.preferences.energyPatterns?.afternoonDip) {
      recommendations.push({
        id: `postlunch-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'physiological-sigh',
        duration: 2,
        reasoning: 'Combat the afternoon energy dip with alerting breath work',
        priority: 'high',
        context: {
          timeOfDay: 'afternoon',
        },
      });
    }

    // End of day transition
    if (hour >= 16 && hour <= 18) {
      recommendations.push({
        id: `endday-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'four-seven-eight',
        duration: this.getPreferredDuration(),
        reasoning: 'Prepare for the transition from work to personal time',
        priority: 'medium',
        context: {
          timeOfDay: 'end-of-day',
        },
      });
    }

    return recommendations;
  }

  /**
   * Get preferred duration based on user settings
   */
  private getPreferredDuration(): number {
    switch (this.preferences.preferredBreakLength) {
      case '1-minute': return 1;
      case '2-minutes': return 2;
      case '5-minutes': return 5;
      case '10-minutes': return 10;
      case 'flexible': return 3; // Default middle ground
      default: return 2;
    }
  }
}
