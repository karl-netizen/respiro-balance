
import { supabase } from '@/lib/supabase';

export interface SessionData {
  id: string;
  userId: string;
  type: 'meditation' | 'breathing' | 'focus' | 'morning_ritual';
  duration: number;
  completedAt: Date;
  outcomes: {
    stressReduction?: number;
    heartRateChange?: number;
    focusScore?: number;
    satisfaction?: number;
    techniques?: string[];
  };
  biometricData?: {
    averageHeartRate?: number;
    heartRateVariability?: number;
    stressLevel?: number;
  };
}

export interface WellnessScore {
  overall: number;
  meditation: number;
  breathing: number;
  focus: number;
  consistency: number;
  biometricImprovement: number;
  socialEngagement: number;
}

export interface CrossModuleProgress {
  streaks: {
    meditation: number;
    breathing: number;
    focus: number;
    morningRitual: number;
    overall: number;
  };
  achievements: string[];
  totalSessions: number;
  weeklyGoals: {
    meditation: { current: number; target: number };
    breathing: { current: number; target: number };
    focus: { current: number; target: number };
  };
}

class UnifiedDataCoordinator {
  private static instance: UnifiedDataCoordinator;

  private constructor() {}

  public static getInstance(): UnifiedDataCoordinator {
    if (!UnifiedDataCoordinator.instance) {
      UnifiedDataCoordinator.instance = new UnifiedDataCoordinator();
    }
    return UnifiedDataCoordinator.instance;
  }

  async onSessionComplete(sessionData: SessionData): Promise<void> {
    try {
      console.log('Processing session completion:', sessionData);

      // 1. Save session data to appropriate table
      await this.saveSessionData(sessionData);

      // 2. Update cross-module progress
      await this.updateCrossModuleProgress(sessionData.userId, sessionData);

      // 3. Check for achievements
      await this.checkAchievements(sessionData.userId, sessionData);

      // 4. Update wellness score
      await this.updateWellnessScore(sessionData.userId);

      // 5. Generate recommendations
      await this.generateRecommendations(sessionData.userId, sessionData);

      // 6. Update social progress if enabled
      await this.updateSocialProgress(sessionData.userId, sessionData);

      console.log('Session completion processing finished');
    } catch (error) {
      console.error('Error processing session completion:', error);
    }
  }

  async syncCrossModuleProgress(userId: string): Promise<void> {
    try {
      console.log('Syncing cross-module progress for user:', userId);

      const progress = await this.calculateCrossModuleProgress(userId);
      
      // Update user preferences with latest progress
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          cross_module_progress: progress,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error syncing cross-module progress:', error);
      }
    } catch (error) {
      console.error('Error in syncCrossModuleProgress:', error);
    }
  }

  async calculateOverallWellnessScore(userId: string): Promise<WellnessScore> {
    try {
      console.log('Calculating wellness score for user:', userId);

      // Fetch data from all modules
      const [meditationData, focusData, biometricData, morningRitualData] = await Promise.all([
        this.getMeditationMetrics(userId),
        this.getFocusMetrics(userId),
        this.getBiometricMetrics(userId),
        this.getMorningRitualMetrics(userId)
      ]);

      // Calculate individual scores
      const meditationScore = this.calculateMeditationScore(meditationData);
      const breathingScore = this.calculateBreathingScore(meditationData); // Breathing tracked in meditation
      const focusScore = this.calculateFocusScore(focusData);
      const consistencyScore = this.calculateConsistencyScore(userId);
      const biometricScore = this.calculateBiometricScore(biometricData);
      const socialScore = await this.calculateSocialScore(userId);

      // Weighted overall score
      const overall = Math.round(
        (meditationScore * 0.25) +
        (breathingScore * 0.15) +
        (focusScore * 0.20) +
        (consistencyScore * 0.20) +
        (biometricScore * 0.10) +
        (socialScore * 0.10)
      );

      const wellnessScore: WellnessScore = {
        overall,
        meditation: meditationScore,
        breathing: breathingScore,
        focus: focusScore,
        consistency: consistencyScore,
        biometricImprovement: biometricScore,
        socialEngagement: socialScore
      };

      console.log('Calculated wellness score:', wellnessScore);
      return wellnessScore;
    } catch (error) {
      console.error('Error calculating wellness score:', error);
      // Return default scores on error
      return {
        overall: 50,
        meditation: 50,
        breathing: 50,
        focus: 50,
        consistency: 50,
        biometricImprovement: 50,
        socialEngagement: 50
      };
    }
  }

  private async saveSessionData(sessionData: SessionData): Promise<void> {
    try {
      switch (sessionData.type) {
        case 'meditation':
          await supabase.from('meditation_sessions').insert({
            user_id: sessionData.userId,
            duration: sessionData.duration,
            completed: true,
            completed_at: sessionData.completedAt.toISOString(),
            session_type: 'guided',
            rating: sessionData.outcomes.satisfaction || 3
          });
          break;

        case 'focus':
          await supabase.from('focus_sessions').insert({
            user_id: sessionData.userId,
            duration: sessionData.duration,
            completed: true,
            end_time: sessionData.completedAt.toISOString(),
            focus_score: sessionData.outcomes.focusScore || 70
          });
          break;

        case 'morning_ritual':
          await supabase.from('morning_rituals').upsert({
            user_id: sessionData.userId,
            last_completed: sessionData.completedAt.toISOString(),
            status: 'completed'
          }, { onConflict: 'user_id' });
          break;
      }
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  private async updateCrossModuleProgress(userId: string, sessionData: SessionData): Promise<void> {
    // Update streaks, session counts, etc.
    console.log('Updating cross-module progress for:', userId, sessionData.type);
  }

  private async checkAchievements(userId: string, sessionData: SessionData): Promise<void> {
    // Check for new achievements across modules
    console.log('Checking achievements for:', userId, sessionData.type);
  }

  private async updateWellnessScore(userId: string): Promise<void> {
    const score = await this.calculateOverallWellnessScore(userId);
    console.log('Updated wellness score:', score);
  }

  private async generateRecommendations(userId: string, sessionData: SessionData): Promise<void> {
    // Generate AI-powered recommendations based on session data
    console.log('Generating recommendations for:', userId, sessionData.type);
  }

  private async updateSocialProgress(userId: string, sessionData: SessionData): Promise<void> {
    // Update social hub with progress if user has sharing enabled
    console.log('Updating social progress for:', userId, sessionData.type);
  }

  private async calculateCrossModuleProgress(userId: string): Promise<CrossModuleProgress> {
    // Calculate progress across all modules
    return {
      streaks: {
        meditation: 0,
        breathing: 0,
        focus: 0,
        morningRitual: 0,
        overall: 0
      },
      achievements: [],
      totalSessions: 0,
      weeklyGoals: {
        meditation: { current: 0, target: 3 },
        breathing: { current: 0, target: 5 },
        focus: { current: 0, target: 5 }
      }
    };
  }

  private async getMeditationMetrics(userId: string) {
    const { data } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    return data || [];
  }

  private async getFocusMetrics(userId: string) {
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    return data || [];
  }

  private async getBiometricMetrics(userId: string) {
    const { data } = await supabase
      .from('biometric_data')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    return data || [];
  }

  private async getMorningRitualMetrics(userId: string) {
    const { data } = await supabase
      .from('morning_rituals')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }

  private calculateMeditationScore(data: any[]): number {
    if (data.length === 0) return 50;
    const avgRating = data.reduce((acc, session) => acc + (session.rating || 3), 0) / data.length;
    return Math.min(100, Math.round((avgRating / 5) * 100));
  }

  private calculateBreathingScore(data: any[]): number {
    // For now, derive from meditation data
    return Math.min(100, data.length * 10);
  }

  private calculateFocusScore(data: any[]): number {
    if (data.length === 0) return 50;
    const avgFocusScore = data.reduce((acc, session) => acc + (session.focus_score || 70), 0) / data.length;
    return Math.round(avgFocusScore);
  }

  private calculateConsistencyScore(userId: string): number {
    // Calculate based on daily usage patterns
    return 75; // Placeholder
  }

  private calculateBiometricScore(data: any[]): number {
    if (data.length === 0) return 50;
    // Calculate improvement in stress levels, HRV, etc.
    return 80; // Placeholder
  }

  private async calculateSocialScore(userId: string): Promise<number> {
    // Calculate based on community engagement
    return 60; // Placeholder
  }
}

export const unifiedDataCoordinator = UnifiedDataCoordinator.getInstance();
