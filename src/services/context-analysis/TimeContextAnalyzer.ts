
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class TimeContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    const hour = context.currentTime.getHours();
    
    // Morning recommendations
    if (hour >= 6 && hour <= 10) {
      recommendations.push({
        id: 'morning-ritual-time',
        type: 'ritual',
        priority: 'high',
        title: 'Perfect Morning Time',
        description: 'Great time to start your morning ritual for the day ahead.',
        action: 'Start Morning Ritual',
        module: 'Morning Rituals',
        route: '/morning-ritual',
        confidence: 0.9,
        reasons: ['Optimal morning timing', 'High energy levels'],
        timeRelevant: true
      });
    }
    
    // Afternoon energy dip
    if (hour >= 14 && hour <= 16) {
      recommendations.push({
        id: 'afternoon-recharge',
        type: 'breathing',
        priority: 'medium',
        title: 'Afternoon Energy Boost',
        description: 'Combat the afternoon slump with energizing breathing exercises.',
        action: 'Quick Energy Boost',
        module: 'Breathing',
        route: '/breathing?type=energizing',
        confidence: 0.8,
        reasons: ['Natural energy dip period', 'Breathing improves alertness'],
        timeRelevant: true
      });
    }
    
    // Evening wind-down
    if (hour >= 19 && hour <= 22) {
      recommendations.push({
        id: 'evening-meditation',
        type: 'meditation',
        priority: 'medium',
        title: 'Evening Wind Down',
        description: 'Perfect time for relaxing meditation to prepare for sleep.',
        action: 'Start Evening Meditation',
        module: 'Meditation',
        route: '/meditation?tab=guided&type=sleep',
        confidence: 0.85,
        reasons: ['Wind-down period', 'Improves sleep quality'],
        timeRelevant: true
      });
    }
    
    return recommendations;
  }
}
