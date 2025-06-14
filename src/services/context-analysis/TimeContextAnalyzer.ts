
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class TimeContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    const hour = context.currentTime.getHours();
    
    // Morning recommendations (6-10 AM)
    if (hour >= 6 && hour <= 10) {
      if (!this.hasCompletedMorningRitual(context.sessionHistory)) {
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
      
      if (this.shouldRecommendMorningMeditation(context.userPreferences)) {
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
    if (hour >= 9 && hour <= 17 && this.isWorkDay(context.userPreferences, context.currentTime)) {
      const recentStress = this.getRecentStressLevel(context.recentBiometrics);
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

  private hasCompletedMorningRitual(sessionHistory: any[]): boolean {
    const today = new Date().toDateString();
    return sessionHistory.some(session => 
      session.type === 'morning_ritual' && 
      new Date(session.completed_at).toDateString() === today
    );
  }

  private shouldRecommendMorningMeditation(userPreferences: any): boolean {
    if (!userPreferences) return false;
    return userPreferences.meditation_goals?.includes('focus') || 
           userPreferences.meditation_experience !== 'beginner';
  }

  private isWorkDay(userPreferences: any, currentTime: Date): boolean {
    if (!userPreferences) return true;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[currentTime.getDay()];
    return userPreferences.work_days?.includes(today as any) || false;
  }

  private getRecentStressLevel(recentBiometrics: any[]): number {
    if (recentBiometrics.length === 0) return 30;
    const latest = recentBiometrics[recentBiometrics.length - 1];
    return latest.stress_score || 30;
  }
}
