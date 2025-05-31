
import { FocusSession } from '../types';

export interface FocusScoreFactors {
  sessionCompletion: number;
  distractionImpact: number;
  durationEfficiency: number;
  consistencyBonus: number;
}

export class FocusScoreCalculator {
  private static readonly WEIGHTS = {
    sessionCompletion: 0.4,
    distractionImpact: 0.3,
    durationEfficiency: 0.2,
    consistencyBonus: 0.1
  };

  static calculateSessionScore(session: Partial<FocusSession>): number {
    const factors = this.getScoreFactors(session);
    
    const score = (
      factors.sessionCompletion * this.WEIGHTS.sessionCompletion +
      factors.distractionImpact * this.WEIGHTS.distractionImpact +
      factors.durationEfficiency * this.WEIGHTS.durationEfficiency +
      factors.consistencyBonus * this.WEIGHTS.consistencyBonus
    ) * 100;

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  static calculateWeeklyScore(sessions: Partial<FocusSession>[]): number {
    if (sessions.length === 0) return 0;

    const sessionScores = sessions.map(session => this.calculateSessionScore(session));
    const averageScore = sessionScores.reduce((sum, score) => sum + score, 0) / sessionScores.length;
    
    // Add consistency bonus for regular sessions
    const consistencyMultiplier = Math.min(1.1, 1 + (sessions.length / 14)); // Bonus for frequent sessions
    
    return Math.round(Math.min(100, averageScore * consistencyMultiplier));
  }

  private static getScoreFactors(session: Partial<FocusSession>): FocusScoreFactors {
    const targetDuration = 25; // minutes
    const actualDuration = session.duration || 0;
    const distractions = session.distractionCount || 0;
    const completed = session.taskCompleted || false;

    return {
      sessionCompletion: completed ? 1 : 0.3, // Heavy penalty for incomplete sessions
      distractionImpact: this.calculateDistractionImpact(distractions),
      durationEfficiency: this.calculateDurationEfficiency(actualDuration, targetDuration),
      consistencyBonus: 0.1 // Base consistency bonus
    };
  }

  private static calculateDistractionImpact(distractions: number): number {
    // Exponential decay for distractions
    return Math.max(0, 1 - (distractions * 0.2));
  }

  private static calculateDurationEfficiency(actual: number, target: number): number {
    if (actual === 0) return 0;
    
    const ratio = actual / target;
    // Optimal efficiency between 0.8 and 1.2 of target duration
    if (ratio >= 0.8 && ratio <= 1.2) return 1;
    if (ratio < 0.8) return ratio / 0.8;
    return Math.max(0.5, 1.2 / ratio);
  }

  static generateInsights(
    currentScore: number, 
    previousScore: number, 
    sessions: Partial<FocusSession>[]
  ): Array<{type: 'positive' | 'warning' | 'suggestion', title: string, description: string}> {
    const insights = [];
    const scoreDiff = currentScore - previousScore;

    // Score trend insights
    if (scoreDiff > 10) {
      insights.push({
        type: 'positive' as const,
        title: 'Great improvement!',
        description: `Your focus score increased by ${scoreDiff} points this week.`
      });
    } else if (scoreDiff < -10) {
      insights.push({
        type: 'warning' as const,
        title: 'Focus declining',
        description: `Your focus score dropped by ${Math.abs(scoreDiff)} points. Consider reviewing your routine.`
      });
    }

    // Session analysis
    const avgDistractions = sessions.reduce((sum, s) => sum + (s.distractionCount || 0), 0) / sessions.length;
    if (avgDistractions > 3) {
      insights.push({
        type: 'suggestion' as const,
        title: 'Reduce distractions',
        description: 'Try using Do Not Disturb mode or finding a quieter workspace.'
      });
    }

    const completionRate = sessions.filter(s => s.taskCompleted).length / sessions.length;
    if (completionRate < 0.7) {
      insights.push({
        type: 'suggestion' as const,
        title: 'Break tasks into smaller chunks',
        description: 'Consider splitting large tasks into smaller, more manageable focus sessions.'
      });
    }

    return insights;
  }
}
