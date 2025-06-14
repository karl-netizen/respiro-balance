
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class PatternContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Check meditation consistency
    const recentMeditationDays = this.getRecentMeditationDays(context.sessionHistory);
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
    const focusPerformance = this.getRecentFocusPerformance(context.sessionHistory);
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

  private getRecentMeditationDays(sessionHistory: any[]): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const uniqueDays = new Set();
    sessionHistory.forEach(session => {
      if (session.session_type === 'meditation' && new Date(session.started_at) > sevenDaysAgo) {
        uniqueDays.add(new Date(session.started_at).toDateString());
      }
    });
    
    return uniqueDays.size;
  }

  private getRecentFocusPerformance(sessionHistory: any[]): number {
    const focusSessions = sessionHistory
      .filter(session => session.session_type === 'focus')
      .slice(-5);
    
    if (focusSessions.length === 0) return 0.8; // Default good performance
    
    const avgScore = focusSessions.reduce((sum, session) => sum + (session.focus_score || 70), 0) / focusSessions.length;
    return avgScore / 100;
  }
}
