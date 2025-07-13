
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsInsight {
  id: string;
  user_id: string;
  insight_type: string;
  insight_data: any;
  confidence_score: number;
  generated_at: string;
  expires_at: string;
}

export interface ProgressData {
  dates: string[];
  meditationMinutes: number[];
  stressLevels: number[];
  focusScores: number[];
  streakData: number[];
}

export class AnalyticsService {
  async generateInsights(userId: string): Promise<AnalyticsInsight[]> {
    if (!supabase) return [];
    
    try {
      // Get recent meditation and biometric data
      const { data: sessions } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(30);

      const { data: biometrics } = await supabase
        .from('biometric_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(100);

      const insights = this.analyzePatterns(sessions || [], biometrics || []);
      
      // Store insights in database
      for (const insight of insights) {
        await supabase
          .from('analytics_insights')
          .upsert({
            user_id: userId,
            insight_type: insight.type,
            insight_data: insight.data,
            confidence_score: insight.confidence,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  private analyzePatterns(sessions: any[], biometrics: any[]) {
    const insights = [];

    // Analyze meditation consistency
    if (sessions.length >= 7) {
      const recentWeekSessions = sessions.slice(0, 7);
      const completionRate = recentWeekSessions.filter(s => s.completed).length / 7;
      
      if (completionRate > 0.8) {
        insights.push({
          type: 'consistency_high',
          data: {
            message: 'Excellent consistency! You\'ve maintained a strong meditation practice.',
            completionRate: Math.round(completionRate * 100),
            recommendation: 'Consider increasing session duration or trying advanced techniques.'
          },
          confidence: 0.9
        });
      } else if (completionRate < 0.4) {
        insights.push({
          type: 'consistency_low',
          data: {
            message: 'Your meditation consistency could be improved.',
            completionRate: Math.round(completionRate * 100),
            recommendation: 'Try shorter sessions or set daily reminders to build the habit.'
          },
          confidence: 0.8
        });
      }
    }

    // Analyze stress patterns
    if (biometrics.length >= 10) {
      const avgStress = biometrics
        .filter(b => b.stress_score !== null)
        .reduce((sum, b) => sum + b.stress_score, 0) / biometrics.length;
      
      if (avgStress > 70) {
        insights.push({
          type: 'stress_high',
          data: {
            message: 'Your stress levels have been consistently elevated.',
            avgStress: Math.round(avgStress),
            recommendation: 'Consider incorporating more breathing exercises and shorter, frequent meditation sessions.'
          },
          confidence: 0.85
        });
      }
    }

    // Optimal meditation time analysis
    const timeAnalysis = this.analyzeOptimalTimes(sessions);
    if (timeAnalysis) {
      insights.push(timeAnalysis);
    }

    return insights;
  }

  private analyzeOptimalTimes(sessions: any[]) {
    const timeSlots = sessions.reduce((acc, session) => {
      const hour = new Date(session.started_at).getHours();
      const timeSlot = Math.floor(hour / 4); // 0-5: Night, 6-11: Morning, 12-17: Afternoon, 18-23: Evening
      
      if (!acc[timeSlot]) acc[timeSlot] = { count: 0, totalRating: 0 };
      acc[timeSlot].count++;
      if (session.rating) acc[timeSlot].totalRating += session.rating;
      
      return acc;
    }, {});

    const bestTimeSlot = Object.entries(timeSlots)
      .map(([slot, data]: [string, any]) => ({
        slot: parseInt(slot),
        avgRating: data.totalRating / data.count,
        count: data.count
      }))
      .filter(item => item.count >= 3 && item.avgRating > 0)
      .sort((a, b) => b.avgRating - a.avgRating)[0];

    if (bestTimeSlot) {
      const timeLabels = ['Night', 'Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];
      return {
        type: 'optimal_time',
        data: {
          message: `Your best meditation results occur during ${timeLabels[bestTimeSlot.slot]}.`,
          timeSlot: timeLabels[bestTimeSlot.slot],
          avgRating: bestTimeSlot.avgRating.toFixed(1),
          recommendation: `Schedule more sessions during ${timeLabels[bestTimeSlot.slot]} for optimal results.`
        },
        confidence: 0.75
      };
    }

    return null;
  }

  async getProgressData(userId: string, days: number = 30): Promise<ProgressData> {
    if (!supabase) {
      return { dates: [], meditationMinutes: [], stressLevels: [], focusScores: [], streakData: [] };
    }

    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      const { data: sessions } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('started_at', startDate.toISOString())
        .order('started_at', { ascending: true });

      const { data: biometrics } = await supabase
        .from('biometric_data')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      return this.processProgressData(sessions || [], biometrics || [], days);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      return { dates: [], meditationMinutes: [], stressLevels: [], focusScores: [], streakData: [] };
    }
  }

  private processProgressData(sessions: any[], biometrics: any[], days: number): ProgressData {
    const dates = [];
    const meditationMinutes = [];
    const stressLevels = [];
    const focusScores = [];
    const streakData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);

      // Calculate daily meditation minutes
      const dailySessions = sessions.filter(s => 
        s.started_at.split('T')[0] === dateStr && s.completed
      );
      const dailyMinutes = dailySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
      meditationMinutes.push(Math.round(dailyMinutes));

      // Calculate average daily stress
      const dailyBiometrics = biometrics.filter(b => 
        b.timestamp.split('T')[0] === dateStr && b.stress_score !== null
      );
      const avgStress = dailyBiometrics.length > 0 
        ? dailyBiometrics.reduce((sum, b) => sum + b.stress_score, 0) / dailyBiometrics.length
        : 0;
      stressLevels.push(Math.round(avgStress));

      // Calculate average daily focus score
      const avgFocus = dailyBiometrics.length > 0 
        ? dailyBiometrics.reduce((sum, b) => sum + (b.focus_score || 70), 0) / dailyBiometrics.length
        : 0;
      focusScores.push(Math.round(avgFocus));

      // Calculate streak (simplified)
      const hasSession = dailySessions.length > 0;
      const previousStreak = i > 0 ? streakData[i - 1] : 0;
      streakData.push(hasSession ? previousStreak + 1 : 0);
    }

    return { dates, meditationMinutes, stressLevels, focusScores, streakData };
  }

  async exportProgressReport(userId: string): Promise<string> {
    const progressData = await this.getProgressData(userId, 90);
    const insights = await this.generateInsights(userId);

    const report = {
      generatedAt: new Date().toISOString(),
      userId,
      summary: {
        totalMeditationMinutes: progressData.meditationMinutes.reduce((a, b) => a + b, 0),
        averageStress: Math.round(progressData.stressLevels.reduce((a, b) => a + b, 0) / progressData.stressLevels.length),
        averageFocus: Math.round(progressData.focusScores.reduce((a, b) => a + b, 0) / progressData.focusScores.length),
        longestStreak: Math.max(...progressData.streakData)
      },
      progressData,
      insights
    };

    return JSON.stringify(report, null, 2);
  }
}

export const analyticsService = new AnalyticsService();
