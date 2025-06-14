
import { UserPreferences } from '@/context/types';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export interface ContextualRecommendation {
  id: string;
  type: 'meditation' | 'breathing' | 'focus' | 'ritual' | 'social';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  action: string;
  module: string;
  route: string;
  confidence: number;
  reasons: string[];
  biometricTrigger?: string;
  timeRelevant?: boolean;
}

export class ContextAnalysisEngine {
  private userPreferences: UserPreferences | null = null;
  private recentBiometrics: BiometricData[] = [];
  private sessionHistory: any[] = [];
  private currentTime: Date = new Date();
  
  updateContext(preferences: UserPreferences, biometrics: BiometricData[], sessions: any[]) {
    this.userPreferences = preferences;
    this.recentBiometrics = biometrics.slice(-10); // Last 10 readings
    this.sessionHistory = sessions.slice(-20); // Last 20 sessions
    this.currentTime = new Date();
  }
  
  generateRecommendations(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Time-based recommendations
    const timeBasedRecs = this.analyzeTimeContext();
    recommendations.push(...timeBasedRecs);
    
    // Biometric-based recommendations
    const biometricRecs = this.analyzeBiometricContext();
    recommendations.push(...biometricRecs);
    
    // Pattern-based recommendations
    const patternRecs = this.analyzePatternContext();
    recommendations.push(...patternRecs);
    
    // Social context recommendations
    const socialRecs = this.analyzeSocialContext();
    recommendations.push(...socialRecs);
    
    // Sort by priority and confidence
    return recommendations
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] * b.confidence) - (priorityWeight[a.priority] * a.confidence);
      })
      .slice(0, 6); // Top 6 recommendations
  }
  
  private analyzeTimeContext(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    const hour = this.currentTime.getHours();
    
    // Morning recommendations (6-10 AM)
    if (hour >= 6 && hour <= 10) {
      if (!this.hasCompletedMorningRitual()) {
        recommendations.push({
          id: 'morning-ritual',
          type: 'ritual',
          priority: 'high',
          title: 'Start Your Morning Ritual',
          description: 'Begin your day with intention and focus',
          action: 'Start Morning Ritual',
          module: 'Morning Rituals',
          route: '/morning-ritual',
          confidence: 0.9,
          reasons: ['Morning time optimal for ritual establishment', 'No ritual completed today'],
          timeRelevant: true
        });
      }
      
      if (this.shouldRecommendMorningMeditation()) {
        recommendations.push({
          id: 'morning-meditation',
          type: 'meditation',
          priority: 'medium',
          title: 'Energizing Morning Meditation',
          description: 'Set a positive tone for your day',
          action: 'Start Meditation',
          module: 'Meditation',
          route: '/meditation?tab=guided&type=morning',
          confidence: 0.85,
          reasons: ['Morning meditation improves focus', 'Consistent with your preferences'],
          timeRelevant: true
        });
      }
    }
    
    // Work hours stress check (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17 && this.isWorkDay()) {
      const recentStress = this.getRecentStressLevel();
      if (recentStress > 60) {
        recommendations.push({
          id: 'work-stress-relief',
          type: 'breathing',
          priority: 'urgent',
          title: 'Quick Stress Relief',
          description: 'Your stress levels are elevated during work hours',
          action: 'Start Breathing Exercise',
          module: 'Breathing',
          route: '/breathing?type=stress-relief',
          confidence: 0.95,
          reasons: ['High stress detected', 'Quick intervention needed', 'Work hours'],
          biometricTrigger: 'elevated stress'
        });
      }
    }
    
    // Evening wind-down (7-10 PM)
    if (hour >= 19 && hour <= 22) {
      recommendations.push({
        id: 'evening-meditation',
        type: 'meditation',
        priority: 'medium',
        title: 'Evening Wind Down',
        description: 'Prepare for restful sleep',
        action: 'Start Sleep Meditation',
        module: 'Meditation',
        route: '/meditation?tab=sleep',
        confidence: 0.8,
        reasons: ['Evening time optimal for relaxation', 'Sleep preparation'],
        timeRelevant: true
      });
    }
    
    return recommendations;
  }
  
  private analyzeBiometricContext(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    if (this.recentBiometrics.length === 0) return recommendations;
    
    const latest = this.recentBiometrics[this.recentBiometrics.length - 1];
    
    // Heart Rate Variability analysis
    if (latest.hrv && latest.hrv < 30) {
      recommendations.push({
        id: 'low-hrv-intervention',
        type: 'breathing',
        priority: 'high',
        title: 'Improve Heart Rate Variability',
        description: 'Your HRV is below optimal range. Breathing exercises can help.',
        action: 'Start HRV Training',
        module: 'Breathing',
        route: '/breathing?type=hrv-training',
        confidence: 0.9,
        reasons: ['Low HRV detected', 'Breathing proven to improve HRV'],
        biometricTrigger: 'low HRV'
      });
    }
    
    // High heart rate during rest
    if (latest.heart_rate && latest.heart_rate > 90 && this.isRestingPeriod()) {
      recommendations.push({
        id: 'high-resting-hr',
        type: 'meditation',
        priority: 'medium',
        title: 'Calm Your Heart Rate',
        description: 'Your resting heart rate is elevated. Try a calming meditation.',
        action: 'Start Calming Meditation',
        module: 'Meditation',
        route: '/meditation?tab=guided&type=calming',
        confidence: 0.85,
        reasons: ['Elevated resting heart rate', 'Meditation reduces heart rate'],
        biometricTrigger: 'elevated heart rate'
      });
    }
    
    return recommendations;
  }
  
  private analyzePatternContext(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Check meditation consistency
    const recentMeditationDays = this.getRecentMeditationDays();
    if (recentMeditationDays < 3) {
      recommendations.push({
        id: 'consistency-boost',
        type: 'meditation',
        priority: 'medium',
        title: 'Rebuild Your Meditation Streak',
        description: 'You\'ve missed a few days. Start with a short session.',
        action: 'Quick Meditation',
        module: 'Meditation',
        route: '/meditation?tab=quick-breaks',
        confidence: 0.7,
        reasons: ['Decreased meditation consistency', 'Short sessions rebuild habits'],
      });
    }
    
    // Focus session performance analysis
    const focusPerformance = this.getRecentFocusPerformance();
    if (focusPerformance < 0.6) {
      recommendations.push({
        id: 'focus-improvement',
        type: 'focus',
        priority: 'medium',
        title: 'Enhance Your Focus Sessions',
        description: 'Recent focus sessions show room for improvement.',
        action: 'Focus Training',
        module: 'Focus Mode',
        route: '/focus?mode=training',
        confidence: 0.75,
        reasons: ['Low focus session performance', 'Training mode available'],
      });
    }
    
    return recommendations;
  }
  
  private analyzeSocialContext(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Check if user hasn't engaged socially recently
    const lastSocialActivity = this.getLastSocialActivityDays();
    if (lastSocialActivity > 7) {
      recommendations.push({
        id: 'social-engagement',
        type: 'social',
        priority: 'low',
        title: 'Connect with the Community',
        description: 'Join challenges or share your progress with others.',
        action: 'Visit Social Hub',
        module: 'Social',
        route: '/social',
        confidence: 0.6,
        reasons: ['No recent social activity', 'Community support improves consistency'],
      });
    }
    
    return recommendations;
  }
  
  // Helper methods
  private hasCompletedMorningRitual(): boolean {
    const today = new Date().toDateString();
    return this.sessionHistory.some(session => 
      session.type === 'morning_ritual' && 
      new Date(session.completed_at).toDateString() === today
    );
  }
  
  private shouldRecommendMorningMeditation(): boolean {
    if (!this.userPreferences) return false;
    return this.userPreferences.meditation_goals?.includes('focus') || 
           this.userPreferences.meditation_experience !== 'beginner';
  }
  
  private isWorkDay(): boolean {
    if (!this.userPreferences) return true;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[this.currentTime.getDay()];
    return this.userPreferences.work_days?.includes(today as any) || false;
  }
  
  private getRecentStressLevel(): number {
    if (this.recentBiometrics.length === 0) return 30;
    const latest = this.recentBiometrics[this.recentBiometrics.length - 1];
    return latest.stress_score || 30;
  }
  
  private isRestingPeriod(): boolean {
    const hour = this.currentTime.getHours();
    return hour < 8 || hour > 18; // Before 8 AM or after 6 PM
  }
  
  private getRecentMeditationDays(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const uniqueDays = new Set();
    this.sessionHistory.forEach(session => {
      if (session.session_type === 'meditation' && new Date(session.started_at) > sevenDaysAgo) {
        uniqueDays.add(new Date(session.started_at).toDateString());
      }
    });
    
    return uniqueDays.size;
  }
  
  private getRecentFocusPerformance(): number {
    const focusSessions = this.sessionHistory
      .filter(session => session.session_type === 'focus')
      .slice(-5);
    
    if (focusSessions.length === 0) return 0.8; // Default good performance
    
    const avgScore = focusSessions.reduce((sum, session) => sum + (session.focus_score || 70), 0) / focusSessions.length;
    return avgScore / 100;
  }
  
  private getLastSocialActivityDays(): number {
    // This would check social interactions, for now return a mock value
    return Math.floor(Math.random() * 14);
  }
}

export const contextAnalysisEngine = new ContextAnalysisEngine();
