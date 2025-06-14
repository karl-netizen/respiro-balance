
import { Analyzer, AnalysisContext, ContextualRecommendation } from './types';

export class BiometricContextAnalyzer implements Analyzer {
  analyze(context: AnalysisContext): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    if (context.recentBiometrics.length === 0) return recommendations;
    
    const latest = context.recentBiometrics[context.recentBiometrics.length - 1];
    
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
    if (latest.heart_rate && latest.heart_rate > 90 && this.isRestingPeriod(context.currentTime)) {
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

  private isRestingPeriod(currentTime: Date): boolean {
    const hour = currentTime.getHours();
    return hour < 8 || hour > 18; // Before 8 AM or after 6 PM
  }
}
