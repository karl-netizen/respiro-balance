
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class PatternContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    if (context.sessionHistory.length === 0) return recommendations;
    
    // Analyze session frequency
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentSessions = context.sessionHistory.filter(session => 
      new Date(session.started_at || session.created_at) > last7Days
    );
    
    if (recentSessions.length < 3) {
      recommendations.push({
        id: 'consistency-building',
        type: 'meditation',
        priority: 'medium',
        title: 'Build Consistency',
        description: 'You\'ve been less active lately. A short session can help rebuild momentum.',
        action: 'Quick Session',
        module: 'Meditation',
        route: '/meditation?tab=quick-breaks',
        confidence: 0.7,
        reasons: ['Low recent activity', 'Consistency improves outcomes']
      });
    }
    
    // Analyze preferred session types
    const sessionTypes = recentSessions.map(s => s.session_type || s.type);
    const mostCommon = this.getMostCommonElement(sessionTypes);
    
    if (mostCommon && recentSessions.length > 5) {
      recommendations.push({
        id: 'preferred-pattern',
        type: mostCommon as any,
        priority: 'low',
        title: `Continue Your ${mostCommon} Practice`,
        description: `You\'ve been enjoying ${mostCommon} sessions. Ready for another?`,
        action: `Start ${mostCommon}`,
        module: mostCommon,
        route: `/${mostCommon}`,
        confidence: 0.75,
        reasons: ['Based on your preferences', 'Consistent practice pattern']
      });
    }
    
    return recommendations;
  }
  
  private getMostCommonElement(arr: string[]): string | null {
    if (arr.length === 0) return null;
    
    const counts = arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}
