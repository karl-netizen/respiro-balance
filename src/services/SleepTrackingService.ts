import {
  EnhancedSleepRecovery,
  SleepBreathingSession,
  SleepTrend,
  SleepAnalytics,
  SleepChallenge,
  WindDownActivity,
  SleepGoal,
  BreathingTechnique
} from '@/types/sleepRecovery';

/**
 * Service for tracking and analyzing sleep data
 */
export class SleepTrackingService {
  private static instance: SleepTrackingService;
  private sleepData: Map<string, EnhancedSleepRecovery> = new Map();
  private breathingSessions: Map<string, SleepBreathingSession[]> = new Map();
  private sleepTrends: Map<string, SleepTrend[]> = new Map();

  public static getInstance(): SleepTrackingService {
    if (!SleepTrackingService.instance) {
      SleepTrackingService.instance = new SleepTrackingService();
    }
    return SleepTrackingService.instance;
  }

  /**
   * Save user's sleep assessment data
   */
  public async saveSleepAssessment(userId: string, sleepData: EnhancedSleepRecovery): Promise<void> {
    this.sleepData.set(userId, sleepData);

    // Create initial trend entry
    const trend: SleepTrend = {
      date: new Date().toISOString(),
      sleepQuality: sleepData.sleepQuality,
      morningEnergy: sleepData.morningEnergy,
      timeToFallAsleep: sleepData.timeToFallAsleep || 20,
      nightWakeups: sleepData.nightTimeWakeups || 0,
      totalSleepTime: this.calculateSleepDuration(sleepData.bedtime, sleepData.wakeTime),
      breathingSessionUsed: false
    };

    this.addSleepTrend(userId, trend);

    // In a real app, this would persist to a database
    console.log('Sleep assessment saved for user:', userId);
  }

  /**
   * Record a daily sleep entry
   */
  public async recordDailySleep(
    userId: string,
    sleepQuality: number,
    morningEnergy: number,
    timeToFallAsleep: number,
    nightWakeups: number,
    stressLevelBeforeBed?: number,
    windDownActivities?: WindDownActivity[],
    notes?: string
  ): Promise<void> {
    const userSleepData = this.sleepData.get(userId);
    if (!userSleepData) {
      throw new Error('User sleep assessment not found. Complete assessment first.');
    }

    const trend: SleepTrend = {
      date: new Date().toISOString(),
      sleepQuality,
      morningEnergy,
      timeToFallAsleep,
      nightWakeups,
      totalSleepTime: this.calculateSleepDuration(userSleepData.bedtime, userSleepData.wakeTime),
      breathingSessionUsed: false, // Will be updated if session is recorded
      stressLevelBeforeBed,
      windDownActivities,
      notesOrFactors: notes
    };

    this.addSleepTrend(userId, trend);
  }

  /**
   * Record a breathing session for sleep
   */
  public async recordBreathingSession(
    userId: string,
    session: Omit<SleepBreathingSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SleepBreathingSession> {
    const fullSession: SleepBreathingSession = {
      ...session,
      id: this.generateId(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userSessions = this.breathingSessions.get(userId) || [];
    userSessions.push(fullSession);
    this.breathingSessions.set(userId, userSessions);

    // Update today's trend to indicate breathing session was used
    this.updateTodaysTrendWithBreathingSession(userId);

    return fullSession;
  }

  /**
   * Get comprehensive sleep analytics for a user
   */
  public async getSleepAnalytics(
    userId: string,
    period: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<SleepAnalytics> {
    const trends = this.getSleepTrends(userId, period);
    const sessions = this.getBreathingSessions(userId, period);
    const sleepData = this.sleepData.get(userId);

    if (!sleepData || trends.length === 0) {
      throw new Error('Insufficient data for analytics');
    }

    // Calculate averages
    const averageSleepQuality = trends.reduce((sum, t) => sum + t.sleepQuality, 0) / trends.length;
    const averageMorningEnergy = trends.reduce((sum, t) => sum + t.morningEnergy, 0) / trends.length;
    const averageTimeToFallAsleep = trends.reduce((sum, t) => sum + t.timeToFallAsleep, 0) / trends.length;
    const averageNightWakeups = trends.reduce((sum, t) => sum + t.nightWakeups, 0) / trends.length;

    // Analyze breathing effectiveness
    const breathingTrends = trends.filter(t => t.breathingSessionUsed);
    const nonBreathingTrends = trends.filter(t => !t.breathingSessionUsed);

    const breathingAvgQuality = breathingTrends.length > 0
      ? breathingTrends.reduce((sum, t) => sum + t.sleepQuality, 0) / breathingTrends.length
      : 0;
    const nonBreathingAvgQuality = nonBreathingTrends.length > 0
      ? nonBreathingTrends.reduce((sum, t) => sum + t.sleepQuality, 0) / nonBreathingTrends.length
      : 0;

    const breathingImpact = breathingTrends.length > 0
      ? (breathingAvgQuality - nonBreathingAvgQuality) / 10
      : 0;

    // Sleep quality by day of week
    const sleepQualityByDay = this.calculateSleepQualityByDayOfWeek(trends);

    // Most effective techniques
    const mostEffectiveTechniques = this.analyzeMostEffectiveTechniques(sessions);

    // Correlation analysis
    const stressCorrelation = this.calculateStressCorrelation(trends);
    const exerciseCorrelation = Math.random() * 0.6 + 0.2; // Mock data

    // Trend analysis
    const recentTrends = trends.slice(-14); // Last 14 days
    const olderTrends = trends.slice(-28, -14); // Previous 14 days

    const sleepQualityTrend = this.calculateTrend(
      recentTrends.map(t => t.sleepQuality),
      olderTrends.map(t => t.sleepQuality)
    );

    const morningEnergyTrend = this.calculateTrend(
      recentTrends.map(t => t.morningEnergy),
      olderTrends.map(t => t.morningEnergy)
    );

    const consistencyTrend = this.calculateConsistencyTrend(trends);

    return {
      userId,
      period,
      averageSleepQuality,
      averageMorningEnergy,
      averageTimeToFallAsleep,
      averageNightWakeups,
      mostCommonChallenges: sleepData.sleepChallenges,
      mostEffectiveWindDownActivities: sleepData.windDownRoutine,
      sleepQualityByDayOfWeek: sleepQualityByDay,
      breathingSessionsUsed: sessions.length,
      averageBreathingEffectiveness: this.calculateAverageBreathingEffectiveness(sessions),
      mostEffectiveTechniques,
      stressImpactOnSleep: stressCorrelation,
      exerciseImpactOnSleep: exerciseCorrelation,
      breathingImpactOnSleep: breathingImpact,
      suggestedOptimalBedtime: this.suggestOptimalBedtime(trends, sleepData.bedtime),
      suggestedOptimalWakeTime: this.suggestOptimalWakeTime(trends, sleepData.wakeTime),
      recommendedBreathingTechniques: this.getRecommendedTechniques(sleepData, sessions),
      suggestedWindDownAdjustments: this.getSuggestedAdjustments(sleepData, trends),
      sleepQualityTrend,
      morningEnergyTrend,
      consistencyTrend,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Get sleep trends for a specific period
   */
  public getSleepTrends(userId: string, period: 'week' | 'month' | 'quarter'): SleepTrend[] {
    const trends = this.sleepTrends.get(userId) || [];
    const now = new Date();
    const periodStart = new Date();

    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        periodStart.setMonth(now.getMonth() - 3);
        break;
    }

    return trends.filter(trend => new Date(trend.date) >= periodStart);
  }

  /**
   * Get breathing sessions for a specific period
   */
  public getBreathingSessions(userId: string, period: 'week' | 'month' | 'quarter'): SleepBreathingSession[] {
    const sessions = this.breathingSessions.get(userId) || [];
    const now = new Date();
    const periodStart = new Date();

    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        periodStart.setMonth(now.getMonth() - 3);
        break;
    }

    return sessions.filter(session => new Date(session.createdAt) >= periodStart);
  }

  /**
   * Generate sleep recommendations based on patterns
   */
  public generateSleepRecommendations(userId: string): string[] {
    const analytics = this.getSleepAnalytics(userId);
    const recommendations: string[] = [];

    if (analytics.then) {
      analytics.then((data: SleepAnalytics) => {
        if (data.averageTimeToFallAsleep > 20) {
          recommendations.push('Try breathing exercises 30 minutes before bedtime to fall asleep faster');
        }

        if (data.averageNightWakeups > 1) {
          recommendations.push('Practice middle-of-night breathing techniques when you wake up');
        }

        if (data.averageMorningEnergy < 6) {
          recommendations.push('Focus on sleep quality improvement through consistent wind-down routine');
        }

        if (data.stressImpactOnSleep > 0.6) {
          recommendations.push('Address stress levels with evening breathing sessions for better sleep');
        }
      });
    }

    return recommendations;
  }

  // Private helper methods

  private addSleepTrend(userId: string, trend: SleepTrend): void {
    const trends = this.sleepTrends.get(userId) || [];
    trends.push(trend);
    this.sleepTrends.set(userId, trends);
  }

  private updateTodaysTrendWithBreathingSession(userId: string): void {
    const trends = this.sleepTrends.get(userId) || [];
    const today = new Date().toDateString();

    const todaysTrend = trends.find(t => new Date(t.date).toDateString() === today);
    if (todaysTrend) {
      todaysTrend.breathingSessionUsed = true;
    }
  }

  private calculateSleepDuration(bedtime: string, wakeTime: string): number {
    const [bedHour, bedMinute] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);

    let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

    return totalMinutes / 60; // Return hours
  }

  private calculateSleepQualityByDayOfWeek(trends: SleepTrend[]): Record<string, number> {
    const dayAverages: Record<string, { total: number; count: number }> = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    trends.forEach(trend => {
      const dayOfWeek = days[new Date(trend.date).getDay()];
      if (!dayAverages[dayOfWeek]) {
        dayAverages[dayOfWeek] = { total: 0, count: 0 };
      }
      dayAverages[dayOfWeek].total += trend.sleepQuality;
      dayAverages[dayOfWeek].count += 1;
    });

    const result: Record<string, number> = {};
    Object.entries(dayAverages).forEach(([day, data]) => {
      result[day] = data.count > 0 ? data.total / data.count : 0;
    });

    return result;
  }

  private analyzeMostEffectiveTechniques(sessions: SleepBreathingSession[]): Array<{
    technique: BreathingTechnique;
    averageImprovement: number;
    usageCount: number;
  }> {
    const techniqueStats: Record<string, { improvements: number[]; count: number }> = {};

    sessions.forEach(session => {
      const technique = session.technique;
      if (!techniqueStats[technique]) {
        techniqueStats[technique] = { improvements: [], count: 0 };
      }

      if (session.sleepQualityNextMorning && session.relaxationAfter) {
        const improvement = (session.sleepQualityNextMorning + session.relaxationAfter) / 2;
        techniqueStats[technique].improvements.push(improvement);
      }
      techniqueStats[technique].count += 1;
    });

    return Object.entries(techniqueStats)
      .map(([technique, stats]) => ({
        technique: technique as BreathingTechnique,
        averageImprovement: stats.improvements.length > 0
          ? stats.improvements.reduce((sum, imp) => sum + imp, 0) / stats.improvements.length
          : 0,
        usageCount: stats.count
      }))
      .sort((a, b) => b.averageImprovement - a.averageImprovement)
      .slice(0, 5);
  }

  private calculateStressCorrelation(trends: SleepTrend[]): number {
    const validTrends = trends.filter(t => t.stressLevelBeforeBed !== undefined);
    if (validTrends.length < 2) return 0;

    // Simple correlation calculation
    const stressLevels = validTrends.map(t => t.stressLevelBeforeBed!);
    const sleepQualities = validTrends.map(t => t.sleepQuality);

    const correlation = this.calculateCorrelation(stressLevels, sleepQualities);
    return Math.abs(correlation); // Return absolute value for impact magnitude
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateTrend(recent: number[], older: number[]): 'improving' | 'stable' | 'declining' {
    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateConsistencyTrend(trends: SleepTrend[]): 'improving' | 'stable' | 'declining' {
    if (trends.length < 7) return 'stable';

    const recent = trends.slice(-7);
    const older = trends.slice(-14, -7);

    const recentVariance = this.calculateVariance(recent.map(t => t.sleepQuality));
    const olderVariance = this.calculateVariance(older.map(t => t.sleepQuality));

    const difference = olderVariance - recentVariance; // Lower variance is better

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateAverageBreathingEffectiveness(sessions: SleepBreathingSession[]): number {
    const effectivenessScores = sessions
      .filter(s => s.relaxationAfter !== undefined)
      .map(s => s.relaxationAfter!);

    return effectivenessScores.length > 0
      ? effectivenessScores.reduce((sum, score) => sum + score, 0) / effectivenessScores.length
      : 0;
  }

  private suggestOptimalBedtime(trends: SleepTrend[], currentBedtime: string): string {
    // Analyze which bedtimes correlate with best sleep quality
    // For now, return current bedtime (would implement sophisticated analysis)
    return currentBedtime;
  }

  private suggestOptimalWakeTime(trends: SleepTrend[], currentWakeTime: string): string {
    // Analyze which wake times correlate with best morning energy
    // For now, return current wake time (would implement sophisticated analysis)
    return currentWakeTime;
  }

  private getRecommendedTechniques(
    sleepData: EnhancedSleepRecovery,
    sessions: SleepBreathingSession[]
  ): BreathingTechnique[] {
    const recommendations: BreathingTechnique[] = [];

    // Base recommendations on sleep challenges
    if (sleepData.sleepChallenges.includes('falling-asleep')) {
      recommendations.push('four-seven-eight');
    }

    if (sleepData.sleepChallenges.includes('racing-thoughts')) {
      recommendations.push('box-breathing');
    }

    if (sleepData.sleepChallenges.includes('physical-tension')) {
      recommendations.push('coherent-breathing');
    }

    if (sleepData.sleepChallenges.includes('anxiety-bedtime')) {
      recommendations.push('extended-exhale');
    }

    // Add effective techniques from past sessions
    const effectiveTechniques = this.analyzeMostEffectiveTechniques(sessions)
      .slice(0, 2)
      .map(t => t.technique);

    recommendations.push(...effectiveTechniques);

    // Remove duplicates and return top 3
    return [...new Set(recommendations)].slice(0, 3);
  }

  private getSuggestedAdjustments(
    sleepData: EnhancedSleepRecovery,
    trends: SleepTrend[]
  ): string[] {
    const suggestions: string[] = [];

    if (sleepData.timeToFallAsleep && sleepData.timeToFallAsleep > 20) {
      suggestions.push('Try establishing a 30-minute wind-down routine before bedtime');
    }

    if (sleepData.sleepQuality < 6) {
      suggestions.push('Consider reducing screen time 1 hour before bed');
    }

    if (sleepData.morningEnergy < 5) {
      suggestions.push('Ensure consistent sleep schedule, including weekends');
    }

    const hasStressImpact = trends.some(t => t.stressLevelBeforeBed && t.stressLevelBeforeBed > 6);
    if (hasStressImpact) {
      suggestions.push('Practice stress-reduction breathing techniques in the evening');
    }

    return suggestions;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}