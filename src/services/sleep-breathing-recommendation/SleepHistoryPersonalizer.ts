import {
  SleepBreathingRecommendation,
  SleepBreathingSession,
} from '@/types/sleepRecovery';

/**
 * Handles personalization of sleep recommendations based on session history
 */
export class SleepHistoryPersonalizer {
  constructor(private sessionHistory: SleepBreathingSession[]) {}

  /**
   * Personalize recommendations based on session history
   */
  personalizeWithHistory(recommendations: SleepBreathingRecommendation[]): SleepBreathingRecommendation[] {
    return recommendations.map(rec => {
      // Find similar past sessions
      const similarSessions = this.sessionHistory.filter(session =>
        session.technique === rec.technique &&
        session.purpose === rec.purpose
      );

      if (similarSessions.length > 0) {
        // Calculate average effectiveness
        const avgRelaxation = similarSessions.reduce((sum, session) =>
          sum + (session.relaxationAfter || 3), 0) / similarSessions.length;

        const avgTimeToSleep = similarSessions.reduce((sum, session) =>
          sum + (session.timeToFallAsleepAfter || 20), 0) / similarSessions.length;

        // Adjust priority based on past effectiveness
        if (avgRelaxation >= 8 && avgTimeToSleep <= 15) {
          rec.priority = rec.priority === 'low' ? 'medium' : 'high';
          rec.reasoning += ' (This has worked well for you before)';
        } else if (avgRelaxation <= 5 || avgTimeToSleep >= 30) {
          rec.priority = 'low';
          rec.reasoning += ' (Trying a different approach based on your feedback)';
        }

        // Update effectiveness ratings based on personal history
        if (avgTimeToSleep <= 10) {
          rec.effectivenessForFallingAsleep = Math.min(5, rec.effectivenessForFallingAsleep + 1);
        }
      }

      return rec;
    });
  }

  /**
   * Update session history
   */
  updateHistory(sessionHistory: SleepBreathingSession[]): void {
    this.sessionHistory = sessionHistory;
  }
}
