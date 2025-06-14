
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class SocialContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Check if user hasn't engaged socially recently
    const hasRecentSocialActivity = context.sessionHistory.some(session => 
      session.shared || session.social_engagement
    );
    
    if (!hasRecentSocialActivity && context.sessionHistory.length > 10) {
      recommendations.push({
        id: 'social-engagement',
        type: 'social',
        priority: 'low',
        title: 'Join the Community',
        description: 'Share your progress and connect with others on their wellness journey.',
        action: 'Explore Community',
        module: 'Social',
        route: '/social',
        confidence: 0.6,
        reasons: ['Low community engagement', 'Social support improves outcomes']
      });
    }
    
    return recommendations;
  }
}
