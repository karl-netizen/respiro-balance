import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
} from '@/types/workLifeBalance';

/**
 * Handles wellness goal-based breathing recommendations
 */
export class GoalBasedRecommendations {
  constructor(private preferences: EnhancedWorkLifePreferences) {}

  /**
   * Get recommendations based on wellness goals
   */
  getRecommendations(context: {
    currentGoalFocus?: string;
  }): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const wellnessGoals = this.preferences.wellnessGoals;

    if (!wellnessGoals) return recommendations;

    // Prioritize current goal focus if specified
    const focusGoal = context.currentGoalFocus;
    const goalsToConsider = focusGoal ? [focusGoal] : wellnessGoals.primaryGoals;

    goalsToConsider.forEach(goal => {
      switch (goal) {
        case 'reduce-stress':
          recommendations.push({
            id: `goal-stress-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'four-seven-eight',
            duration: this.getPreferredDuration(),
            reasoning: 'Working toward your stress reduction goal',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'improve-focus':
          recommendations.push({
            id: `goal-focus-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'box-breathing',
            duration: this.getPreferredDuration(),
            reasoning: 'Building focus and concentration abilities',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'better-sleep':
          if (this.getCurrentTimeOfDay() === 'evening') {
            recommendations.push({
              id: `goal-sleep-${Date.now()}`,
              triggerType: 'scheduled',
              suggestedTechnique: 'four-seven-eight',
              duration: 5,
              reasoning: 'Evening practice for better sleep preparation',
              priority: 'medium',
              context: {
                timeOfDay: this.getCurrentTimeOfDay(),
              },
            });
          }
          break;

        case 'increase-energy':
          if (this.getCurrentTimeOfDay() === 'morning' || this.getCurrentTimeOfDay() === 'afternoon') {
            recommendations.push({
              id: `goal-energy-${Date.now()}`,
              triggerType: 'scheduled',
              suggestedTechnique: 'coherent-breathing',
              duration: 3,
              reasoning: 'Energizing breath work to boost vitality',
              priority: 'medium',
              context: {
                timeOfDay: this.getCurrentTimeOfDay(),
              },
            });
          }
          break;

        case 'anxiety-management':
          recommendations.push({
            id: `goal-anxiety-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'physiological-sigh',
            duration: 2,
            reasoning: 'Quick anxiety relief with calming breath technique',
            priority: 'high',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'athletic-performance':
          recommendations.push({
            id: `goal-performance-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'tactical-breathing',
            duration: 3,
            reasoning: 'Performance breathing for optimal mind-body state',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;
      }
    });

    return recommendations;
  }

  /**
   * Align recommendations with user's wellness goals
   */
  alignWithWellnessGoals(
    recommendations: BreakRecommendation[],
    currentGoalFocus?: string
  ): BreakRecommendation[] {
    const wellnessGoals = this.preferences.wellnessGoals;
    if (!wellnessGoals) return recommendations;

    return recommendations.map(rec => {
      // Boost priority if recommendation aligns with primary goals
      const primaryGoals = wellnessGoals.primaryGoals;
      const isAlignedWithPrimaryGoal = this.isRecommendationAlignedWithGoal(rec, primaryGoals);

      if (isAlignedWithPrimaryGoal) {
        // Boost priority
        if (rec.priority === 'low') rec.priority = 'medium';
        else if (rec.priority === 'medium') rec.priority = 'high';

        rec.reasoning += ' (Aligned with your primary wellness goals)';
      }

      // Extra boost if it matches current focus goal
      if (currentGoalFocus && this.isRecommendationAlignedWithGoal(rec, [currentGoalFocus as any])) {
        rec.priority = 'high';
        rec.reasoning = rec.reasoning.replace(' (Aligned with your primary wellness goals)', '');
        rec.reasoning += ` (Supporting your focus on ${currentGoalFocus.replace('-', ' ')})`;
      }

      return rec;
    });
  }

  /**
   * Check if recommendation aligns with wellness goals
   */
  private isRecommendationAlignedWithGoal(
    recommendation: BreakRecommendation,
    goals: any[]
  ): boolean {
    const technique = recommendation.suggestedTechnique;
    const reasoning = recommendation.reasoning.toLowerCase();

    return goals.some(goal => {
      switch (goal) {
        case 'reduce-stress':
          return ['four-seven-eight', 'physiological-sigh'].includes(technique) ||
                 reasoning.includes('stress') || reasoning.includes('calm');

        case 'improve-focus':
          return ['box-breathing', 'tactical-breathing'].includes(technique) ||
                 reasoning.includes('focus') || reasoning.includes('concentration');

        case 'better-sleep':
          return ['four-seven-eight', 'belly-breathing'].includes(technique) ||
                 reasoning.includes('sleep') || reasoning.includes('evening');

        case 'increase-energy':
          return ['coherent-breathing', 'quick-coherence'].includes(technique) ||
                 reasoning.includes('energy') || reasoning.includes('alertness');

        case 'anxiety-management':
          return ['physiological-sigh', 'four-seven-eight'].includes(technique) ||
                 reasoning.includes('anxiety') || reasoning.includes('calm');

        default:
          return false;
      }
    });
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

  /**
   * Get current time of day category
   */
  private getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
}
