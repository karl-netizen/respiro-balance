import {
  BreakRecommendation,
  WorkBreathingSession,
} from '@/types/workLifeBalance';
import { PreferenceFilter } from './PreferenceFilter';

/**
 * Handles personalization of recommendations based on session history
 */
export class HistoryPersonalizer {
  constructor(
    private sessionHistory: WorkBreathingSession[],
    private preferenceFilter: PreferenceFilter
  ) {}

  /**
   * Personalize recommendations based on session history
   */
  personalizeWithHistory(recommendations: BreakRecommendation[]): BreakRecommendation[] {
    return recommendations.map(rec => {
      // Find similar past sessions
      const similarSessions = this.sessionHistory.filter(session =>
        session.technique === rec.suggestedTechnique &&
        session.trigger.type === rec.triggerType
      );

      if (similarSessions.length > 0) {
        // Calculate average effectiveness
        const avgEffectiveness = similarSessions.reduce((sum, session) =>
          sum + (session.effectiveness || 3), 0) / similarSessions.length;

        // Adjust priority based on past effectiveness
        if (avgEffectiveness >= 4) {
          rec.priority = rec.priority === 'low' ? 'medium' : 'high';
          rec.reasoning += ' (This technique has worked well for you before)';
        } else if (avgEffectiveness <= 2) {
          rec.priority = 'low';
          // Suggest alternative technique
          rec.suggestedTechnique = this.preferenceFilter.getAlternativeTechnique(rec.suggestedTechnique);
          rec.reasoning += ' (Trying a different approach based on your feedback)';
        }
      }

      return rec;
    });
  }

  /**
   * Update session history
   */
  updateHistory(sessionHistory: WorkBreathingSession[]): void {
    this.sessionHistory = sessionHistory;
  }
}
