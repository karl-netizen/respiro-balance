
import { UserPreferences } from '@/context/types';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { TimeAwarenessService } from '@/services/TimeAwarenessService';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'work' | 'personal' | 'meeting' | 'break';
}

export interface SocialActivity {
  challengeParticipations: number;
  communityEngagement: number;
  recentShares: number;
  friendActivity: number;
}

export interface ContextualInsight {
  id: string;
  type: 'biometric' | 'pattern' | 'social' | 'timing' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  moduleTarget: string;
  route: string;
}

export interface EnhancedRecommendation {
  id: string;
  type: 'meditation' | 'breathing' | 'focus' | 'ritual' | 'social' | 'biofeedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  action: string;
  module: string;
  route: string;
  confidence: number;
  reasons: string[];
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  biometricTrigger?: string;
  timeRelevant?: boolean;
  socialRelevant?: boolean;
  calendarAware?: boolean;
  weatherConsidered?: boolean;
  insights: ContextualInsight[];
}

export class EnhancedContextAnalysisEngine {
  private userPreferences: UserPreferences | null = null;
  private recentBiometrics: BiometricData[] = [];
  private sessionHistory: any[] = [];
  private weatherData: WeatherData | null = null;
  private calendarEvents: CalendarEvent[] = [];
  private socialActivity: SocialActivity | null = null;
  private currentTime: Date = new Date();
  
  // Input Sources Integration
  updateContext(
    preferences: UserPreferences, 
    biometrics: BiometricData[], 
    sessions: any[],
    weather?: WeatherData,
    calendar?: CalendarEvent[],
    social?: SocialActivity
  ) {
    this.userPreferences = preferences;
    this.recentBiometrics = biometrics.slice(-20);
    this.sessionHistory = sessions.slice(-30);
    this.weatherData = weather || null;
    this.calendarEvents = calendar || [];
    this.socialActivity = social || null;
    this.currentTime = new Date();
  }
  
  // AI Processing: Cross-module pattern recognition
  private analyzePatterns(): ContextualInsight[] {
    const insights: ContextualInsight[] = [];
    
    // Biometric correlation analysis
    const stressPatterns = this.analyzeBiometricStressPatterns();
    if (stressPatterns.length > 0) {
      insights.push(...stressPatterns);
    }
    
    // Session performance trends
    const performancePatterns = this.analyzeSessionPerformancePatterns();
    if (performancePatterns.length > 0) {
      insights.push(...performancePatterns);
    }
    
    // Social influence optimization
    const socialPatterns = this.analyzeSocialInfluencePatterns();
    if (socialPatterns.length > 0) {
      insights.push(...socialPatterns);
    }
    
    // Timing optimization
    const timingPatterns = this.analyzeTimingPatterns();
    if (timingPatterns.length > 0) {
      insights.push(...timingPatterns);
    }
    
    return insights;
  }
  
  private analyzeBiometricStressPatterns(): ContextualInsight[] {
    const insights: ContextualInsight[] = [];
    
    if (this.recentBiometrics.length < 5) return insights;
    
    const recentStress = this.recentBiometrics.slice(-5).map(b => b.stress_score || 0);
    const avgStress = recentStress.reduce((sum, score) => sum + score, 0) / recentStress.length;
    
    if (avgStress > 70) {
      insights.push({
        id: 'high-stress-pattern',
        type: 'biometric',
        title: 'Elevated Stress Pattern Detected',
        description: 'Your stress levels have been consistently high. Breathing exercises could help.',
        confidence: 0.9,
        actionable: true,
        moduleTarget: 'breathing',
        route: '/breathing?type=stress-relief'
      });
    }
    
    // HRV analysis
    const recentHRV = this.recentBiometrics.slice(-3).map(b => b.hrv).filter(Boolean);
    if (recentHRV.length > 0) {
      const avgHRV = recentHRV.reduce((sum, hrv) => sum + hrv!, 0) / recentHRV.length;
      if (avgHRV < 30) {
        insights.push({
          id: 'low-hrv-pattern',
          type: 'biometric',
          title: 'Low Heart Rate Variability',
          description: 'Your HRV suggests autonomic stress. Try coherence breathing.',
          confidence: 0.85,
          actionable: true,
          moduleTarget: 'breathing',
          route: '/breathing?type=hrv-training'
        });
      }
    }
    
    return insights;
  }
  
  private analyzeSessionPerformancePatterns(): ContextualInsight[] {
    const insights: ContextualInsight[] = [];
    
    // Meditation consistency analysis
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentMeditations = this.sessionHistory.filter(s => 
      s.session_type === 'meditation' && new Date(s.started_at) > last7Days
    );
    
    if (recentMeditations.length < 3) {
      insights.push({
        id: 'meditation-consistency',
        type: 'pattern',
        title: 'Meditation Consistency Opportunity',
        description: 'You\'ve missed some meditation sessions. Quick breaks can help rebuild the habit.',
        confidence: 0.75,
        actionable: true,
        moduleTarget: 'meditation',
        route: '/meditation?tab=quick-breaks'
      });
    }
    
    // Focus session performance
    const focusSessions = this.sessionHistory.filter(s => s.session_type === 'focus').slice(-5);
    if (focusSessions.length > 0) {
      const avgFocusScore = focusSessions.reduce((sum, s) => sum + (s.focus_score || 70), 0) / focusSessions.length;
      if (avgFocusScore < 60) {
        insights.push({
          id: 'focus-performance',
          type: 'pattern',
          title: 'Focus Performance Below Optimal',
          description: 'Your recent focus scores suggest room for improvement. Try meditation before focus sessions.',
          confidence: 0.8,
          actionable: true,
          moduleTarget: 'meditation',
          route: '/meditation?tab=guided&type=focus'
        });
      }
    }
    
    return insights;
  }
  
  private analyzeSocialInfluencePatterns(): ContextualInsight[] {
    const insights: ContextualInsight[] = [];
    
    if (!this.socialActivity) return insights;
    
    if (this.socialActivity.challengeParticipations === 0 && this.socialActivity.communityEngagement < 3) {
      insights.push({
        id: 'social-engagement',
        type: 'social',
        title: 'Community Engagement Opportunity',
        description: 'Joining challenges and connecting with others can boost motivation.',
        confidence: 0.7,
        actionable: true,
        moduleTarget: 'social',
        route: '/social?tab=challenges'
      });
    }
    
    if (this.socialActivity.friendActivity > 5 && this.socialActivity.recentShares === 0) {
      insights.push({
        id: 'sharing-opportunity',
        type: 'social',
        title: 'Share Your Progress',
        description: 'Your friends are active! Consider sharing your recent achievements.',
        confidence: 0.8,
        actionable: true,
        moduleTarget: 'social',
        route: '/social?tab=sharing'
      });
    }
    
    return insights;
  }
  
  private analyzeTimingPatterns(): ContextualInsight[] {
    const insights: ContextualInsight[] = [];
    
    // Calendar integration analysis
    const upcomingMeetings = this.calendarEvents.filter(event => 
      event.type === 'meeting' && 
      event.start > this.currentTime &&
      event.start.getTime() - this.currentTime.getTime() < 3600000 // Within 1 hour
    );
    
    if (upcomingMeetings.length > 0) {
      insights.push({
        id: 'pre-meeting-prep',
        type: 'timing',
        title: 'Pre-Meeting Preparation',
        description: 'You have a meeting soon. A quick breathing exercise can help you feel centered.',
        confidence: 0.9,
        actionable: true,
        moduleTarget: 'breathing',
        route: '/breathing?type=quick-calm'
      });
    }
    
    // Weather consideration
    if (this.weatherData) {
      if (this.weatherData.condition === 'rainy' || this.weatherData.condition === 'cloudy') {
        insights.push({
          id: 'weather-mood',
          type: 'timing',
          title: 'Weather-Adjusted Wellness',
          description: 'Gloomy weather can affect mood. Indoor meditation might be perfect right now.',
          confidence: 0.7,
          actionable: true,
          moduleTarget: 'meditation',
          route: '/meditation?tab=guided&type=mood-boost'
        });
      }
    }
    
    return insights;
  }
  
  // Enhanced recommendation generation
  generateEnhancedRecommendations(): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    const insights = this.analyzePatterns();
    
    // Time-based recommendations with weather consideration
    const timeBasedRecs = this.generateTimeBasedRecommendations(insights);
    recommendations.push(...timeBasedRecs);
    
    // Biometric-driven recommendations
    const biometricRecs = this.generateBiometricRecommendations(insights);
    recommendations.push(...biometricRecs);
    
    // Calendar-aware recommendations
    const calendarRecs = this.generateCalendarAwareRecommendations(insights);
    recommendations.push(...calendarRecs);
    
    // Social optimization recommendations
    const socialRecs = this.generateSocialOptimizedRecommendations(insights);
    recommendations.push(...socialRecs);
    
    // Achievement opportunity recommendations
    const achievementRecs = this.generateAchievementRecommendations(insights);
    recommendations.push(...achievementRecs);
    
    // Sort by priority and confidence, include insights
    return recommendations
      .map(rec => ({ ...rec, insights: insights.filter(i => i.moduleTarget === rec.type) }))
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] * b.confidence) - (priorityWeight[a.priority] * a.confidence);
      })
      .slice(0, 8);
  }
  
  private generateTimeBasedRecommendations(insights: ContextualInsight[]): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    const hour = this.currentTime.getHours();
    const timeBasedRecs = TimeAwarenessService.getTimeBasedRecommendations(this.userPreferences);
    
    // Morning recommendations (enhanced with weather)
    if (hour >= 6 && hour <= 10) {
      recommendations.push({
        id: 'enhanced-morning-ritual',
        type: 'ritual',
        priority: 'high',
        title: timeBasedRecs.meditation.title,
        description: this.weatherData 
          ? `Perfect morning for indoor wellness. Temperature: ${this.weatherData.temperature}°F`
          : 'Start your day with intentional practices',
        action: 'Begin Morning Routine',
        module: 'Morning Rituals',
        route: '/morning-ritual',
        confidence: 0.9,
        duration: timeBasedRecs.meditation.duration,
        reasons: ['Optimal morning timing', 'Weather-adjusted recommendation'],
        timeRelevant: true,
        weatherConsidered: !!this.weatherData,
        insights: insights.filter(i => i.type === 'timing')
      });
    }
    
    return recommendations;
  }
  
  private generateBiometricRecommendations(insights: ContextualInsight[]): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    
    if (this.recentBiometrics.length === 0) return recommendations;
    
    const latest = this.recentBiometrics[this.recentBiometrics.length - 1];
    const biometricInsights = insights.filter(i => i.type === 'biometric');
    
    if (latest.stress_score && latest.stress_score > 75) {
      recommendations.push({
        id: 'urgent-stress-relief',
        type: 'breathing',
        priority: 'urgent',
        title: 'Immediate Stress Relief',
        description: `Stress level at ${latest.stress_score}/100. Quick intervention recommended.`,
        action: 'Start Breathing Now',
        module: 'Breathing',
        route: '/breathing?type=emergency-calm',
        confidence: 0.95,
        duration: 3,
        difficulty: 'beginner',
        reasons: ['Critical stress level detected', 'Immediate intervention needed'],
        biometricTrigger: 'high stress',
        insights: biometricInsights
      });
    }
    
    return recommendations;
  }
  
  private generateCalendarAwareRecommendations(insights: ContextualInsight[]): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    
    const nextHour = new Date(this.currentTime.getTime() + 3600000);
    const upcomingEvents = this.calendarEvents.filter(event => 
      event.start > this.currentTime && event.start < nextHour
    );
    
    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      recommendations.push({
        id: 'calendar-prep',
        type: 'meditation',
        priority: 'medium',
        title: 'Prepare for Upcoming Event',
        description: `${nextEvent.title} starts in ${Math.round((nextEvent.start.getTime() - this.currentTime.getTime()) / 60000)} minutes`,
        action: 'Quick Preparation',
        module: 'Meditation',
        route: '/meditation?tab=quick-breaks&type=focus',
        confidence: 0.85,
        duration: 5,
        reasons: ['Calendar integration', 'Event preparation'],
        calendarAware: true,
        insights: insights.filter(i => i.type === 'timing')
      });
    }
    
    return recommendations;
  }
  
  private generateSocialOptimizedRecommendations(insights: ContextualInsight[]): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    
    if (!this.socialActivity) return recommendations;
    
    const socialInsights = insights.filter(i => i.type === 'social');
    
    if (this.socialActivity.challengeParticipations === 0) {
      recommendations.push({
        id: 'join-challenge',
        type: 'social',
        priority: 'low',
        title: 'Join a Community Challenge',
        description: 'Active challenges can boost motivation and consistency',
        action: 'Browse Challenges',
        module: 'Social',
        route: '/social?tab=challenges',
        confidence: 0.7,
        reasons: ['No current challenge participation', 'Community motivation'],
        socialRelevant: true,
        insights: socialInsights
      });
    }
    
    return recommendations;
  }
  
  private generateAchievementRecommendations(insights: ContextualInsight[]): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = [];
    
    // Analyze achievement opportunities based on recent activity
    const meditationSessions = this.sessionHistory.filter(s => s.session_type === 'meditation').length;
    const focusSessions = this.sessionHistory.filter(s => s.session_type === 'focus').length;
    
    if (meditationSessions >= 4 && meditationSessions < 7) {
      recommendations.push({
        id: 'weekly-meditation-achievement',
        type: 'meditation',
        priority: 'medium',
        title: 'Complete Weekly Meditation Goal',
        description: `${meditationSessions}/7 sessions completed. You're close to unlocking a weekly achievement!`,
        action: 'Continue Streak',
        module: 'Meditation',
        route: '/meditation?achievement=weekly-goal',
        confidence: 0.8,
        reasons: ['Achievement opportunity', 'Streak momentum'],
        insights: insights.filter(i => i.type === 'achievement')
      });
    }
    
    return recommendations;
  }
}

export const enhancedContextAnalysisEngine = new EnhancedContextAnalysisEngine();
