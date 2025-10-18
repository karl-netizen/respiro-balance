import {
  WorkBreathingSession,
  BreathingTechnique,
} from '@/types/workLifeBalance';

/**
 * Handles effectiveness analytics for breathing sessions
 */
export class EffectivenessAnalytics {
  constructor(private sessionHistory: WorkBreathingSession[]) {}

  /**
   * Get effectiveness analytics for user feedback
   */
  getAnalytics(): {
    totalSessions: number;
    averageEffectiveness: number;
    mostEffectiveTechnique: BreathingTechnique | null;
    leastEffectiveTechnique: BreathingTechnique | null;
    improvementTrend: 'improving' | 'stable' | 'declining';
  } {
    if (this.sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        averageEffectiveness: 0,
        mostEffectiveTechnique: null,
        leastEffectiveTechnique: null,
        improvementTrend: 'stable',
      };
    }

    const sessions = this.sessionHistory.filter(s => s.effectiveness !== undefined);
    const totalSessions = sessions.length;
    const averageEffectiveness = sessions.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / totalSessions;

    // Find most/least effective techniques
    const techniqueEffectiveness: Record<string, { total: number; count: number }> = {};

    sessions.forEach(session => {
      const technique = session.technique;
      if (!techniqueEffectiveness[technique]) {
        techniqueEffectiveness[technique] = { total: 0, count: 0 };
      }
      techniqueEffectiveness[technique].total += session.effectiveness || 0;
      techniqueEffectiveness[technique].count++;
    });

    const averages = Object.entries(techniqueEffectiveness).map(([technique, data]) => ({
      technique: technique as BreathingTechnique,
      average: data.total / data.count,
    }));

    averages.sort((a, b) => b.average - a.average);

    // Determine improvement trend (last 10 vs previous 10)
    let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (sessions.length >= 20) {
      const recent = sessions.slice(-10);
      const previous = sessions.slice(-20, -10);

      const recentAvg = recent.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / recent.length;
      const previousAvg = previous.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / previous.length;

      if (recentAvg > previousAvg + 0.3) improvementTrend = 'improving';
      else if (recentAvg < previousAvg - 0.3) improvementTrend = 'declining';
    }

    return {
      totalSessions,
      averageEffectiveness,
      mostEffectiveTechnique: averages[0]?.technique || null,
      leastEffectiveTechnique: averages[averages.length - 1]?.technique || null,
      improvementTrend,
    };
  }

  /**
   * Update session history
   */
  updateHistory(sessionHistory: WorkBreathingSession[]): void {
    this.sessionHistory = sessionHistory;
  }
}
