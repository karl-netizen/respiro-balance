import {
  SleepBreathingSession,
  SleepBreathingTiming,
} from '@/types/sleepRecovery';
import { BreathingTechnique } from '@/types/workLifeBalance';

/**
 * Handles sleep breathing analytics and insights
 */
export class SleepAnalytics {
  constructor(private sessionHistory: SleepBreathingSession[]) {}

  /**
   * Get sleep-specific analytics and insights
   */
  getAnalytics(): {
    totalSleepSessions: number;
    averageTimeToFallAsleep: number;
    averageRelaxationRating: number;
    mostEffectiveForFallingAsleep: BreathingTechnique | null;
    mostEffectiveForStayingAsleep: BreathingTechnique | null;
    sleepQualityImprovement: number;
    bestTimeForPractice: SleepBreathingTiming | null;
    recommendationsForImprovement: string[];
  } {
    if (this.sessionHistory.length === 0) {
      return {
        totalSleepSessions: 0,
        averageTimeToFallAsleep: 0,
        averageRelaxationRating: 0,
        mostEffectiveForFallingAsleep: null,
        mostEffectiveForStayingAsleep: null,
        sleepQualityImprovement: 0,
        bestTimeForPractice: null,
        recommendationsForImprovement: [
          'Start with 4-7-8 breathing 30 minutes before bedtime',
          'Track your sleep quality to see the impact of breathing practice',
          'Try different techniques to find what works best for you'
        ]
      };
    }

    const sessions = this.sessionHistory;
    const completedSessions = sessions.filter(s => s.completed);

    // Calculate averages
    const avgTimeToSleep = completedSessions
      .filter(s => s.timeToFallAsleepAfter !== undefined)
      .reduce((sum, s) => sum + (s.timeToFallAsleepAfter || 0), 0) / completedSessions.length;

    const avgRelaxation = completedSessions
      .filter(s => s.relaxationAfter !== undefined)
      .reduce((sum, s) => sum + (s.relaxationAfter || 0), 0) / completedSessions.length;

    // Find most effective techniques
    const techniqueEffectiveness: Record<string, {
      totalSessions: number;
      avgTimeToSleep: number;
      avgSleepQuality: number;
    }> = {};

    completedSessions.forEach(session => {
      const technique = session.technique;
      if (!techniqueEffectiveness[technique]) {
        techniqueEffectiveness[technique] = {
          totalSessions: 0,
          avgTimeToSleep: 0,
          avgSleepQuality: 0
        };
      }

      techniqueEffectiveness[technique].totalSessions++;
      if (session.timeToFallAsleepAfter) {
        techniqueEffectiveness[technique].avgTimeToSleep += session.timeToFallAsleepAfter;
      }
      if (session.sleepQualityNextMorning) {
        techniqueEffectiveness[technique].avgSleepQuality += session.sleepQualityNextMorning;
      }
    });

    // Calculate averages
    Object.keys(techniqueEffectiveness).forEach(technique => {
      const data = techniqueEffectiveness[technique];
      data.avgTimeToSleep = data.avgTimeToSleep / data.totalSessions;
      data.avgSleepQuality = data.avgSleepQuality / data.totalSessions;
    });

    // Find best techniques (lowest time to sleep, highest sleep quality)
    const techniquesByFallAsleep = Object.entries(techniqueEffectiveness)
      .sort(([,a], [,b]) => a.avgTimeToSleep - b.avgTimeToSleep);

    const techniquesBySleepQuality = Object.entries(techniqueEffectiveness)
      .sort(([,a], [,b]) => b.avgSleepQuality - a.avgSleepQuality);

    // Calculate sleep quality improvement trend
    const recentSessions = sessions.slice(-10).filter(s => s.sleepQualityNextMorning);
    const oldSessions = sessions.slice(0, 10).filter(s => s.sleepQualityNextMorning);

    let sleepQualityImprovement = 0;
    if (recentSessions.length > 0 && oldSessions.length > 0) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.sleepQualityNextMorning || 0), 0) / recentSessions.length;
      const oldAvg = oldSessions.reduce((sum, s) => sum + (s.sleepQualityNextMorning || 0), 0) / oldSessions.length;
      sleepQualityImprovement = recentAvg - oldAvg;
    }

    // Determine best timing
    const timingEffectiveness: Record<string, number[]> = {};
    sessions.forEach(session => {
      const timing = this.categorizeTiming(session.timeRelativeToBedtime);
      if (!timingEffectiveness[timing]) {
        timingEffectiveness[timing] = [];
      }
      if (session.relaxationAfter) {
        timingEffectiveness[timing].push(session.relaxationAfter);
      }
    });

    const bestTiming = Object.entries(timingEffectiveness)
      .map(([timing, scores]) => ({
        timing,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0]?.timing as SleepBreathingTiming;

    // Generate recommendations
    const recommendations: string[] = [];

    if (avgTimeToSleep > 20) {
      recommendations.push('Try 4-7-8 breathing - it\'s specifically designed to help you fall asleep faster');
    }

    if (avgRelaxation < 7) {
      recommendations.push('Consider extending your breathing practice time for deeper relaxation');
    }

    if (techniquesByFallAsleep.length > 0 && techniquesByFallAsleep[0][1].avgTimeToSleep <= 15) {
      recommendations.push(`Your most effective technique is ${techniquesByFallAsleep[0][0]} - consider using it more regularly`);
    }

    if (sleepQualityImprovement < 0) {
      recommendations.push('Try practicing breathing earlier in your wind-down routine');
    }

    return {
      totalSleepSessions: sessions.length,
      averageTimeToFallAsleep: Math.round(avgTimeToSleep),
      averageRelaxationRating: Math.round(avgRelaxation * 10) / 10,
      mostEffectiveForFallingAsleep: (techniquesByFallAsleep[0]?.[0] as BreathingTechnique) || null,
      mostEffectiveForStayingAsleep: (techniquesBySleepQuality[0]?.[0] as BreathingTechnique) || null,
      sleepQualityImprovement: Math.round(sleepQualityImprovement * 10) / 10,
      bestTimeForPractice: bestTiming || null,
      recommendationsForImprovement: recommendations
    };
  }

  /**
   * Categorize timing relative to bedtime
   */
  private categorizeTiming(minutesRelativeToBedtime: number): string {
    if (minutesRelativeToBedtime >= 60) return 'wind-down-routine';
    if (minutesRelativeToBedtime >= 15) return 'bedtime-approach';
    if (minutesRelativeToBedtime >= -15) return 'in-bed-before-sleep';
    if (minutesRelativeToBedtime >= -180) return 'middle-of-night-wake';
    return 'early-morning-wake';
  }

  /**
   * Update session history
   */
  updateHistory(sessionHistory: SleepBreathingSession[]): void {
    this.sessionHistory = sessionHistory;
  }
}
