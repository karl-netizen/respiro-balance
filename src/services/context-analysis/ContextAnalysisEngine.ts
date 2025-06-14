
import { UserPreferences } from '@/context/types';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { ContextualRecommendation, AnalysisContext } from './types';
import { TimeContextAnalyzer } from './TimeContextAnalyzer';
import { BiometricContextAnalyzer } from './BiometricContextAnalyzer';
import { PatternContextAnalyzer } from './PatternContextAnalyzer';
import { SocialContextAnalyzer } from './SocialContextAnalyzer';

export class ContextAnalysisEngine {
  private timeAnalyzer = new TimeContextAnalyzer();
  private biometricAnalyzer = new BiometricContextAnalyzer();
  private patternAnalyzer = new PatternContextAnalyzer();
  private socialAnalyzer = new SocialContextAnalyzer();
  
  private context: AnalysisContext = {
    userPreferences: null,
    recentBiometrics: [],
    sessionHistory: [],
    currentTime: new Date()
  };
  
  updateContext(preferences: UserPreferences, biometrics: BiometricData[], sessions: any[]) {
    this.context = {
      userPreferences: preferences,
      recentBiometrics: biometrics.slice(-10), // Last 10 readings
      sessionHistory: sessions.slice(-20), // Last 20 sessions
      currentTime: new Date()
    };
  }
  
  generateRecommendations(): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Gather recommendations from all analyzers
    recommendations.push(...this.timeAnalyzer.analyze(this.context));
    recommendations.push(...this.biometricAnalyzer.analyze(this.context));
    recommendations.push(...this.patternAnalyzer.analyze(this.context));
    recommendations.push(...this.socialAnalyzer.analyze(this.context));
    
    // Sort by priority and confidence
    return recommendations
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] * b.confidence) - (priorityWeight[a.priority] * a.confidence);
      })
      .slice(0, 6); // Top 6 recommendations
  }
}

export const contextAnalysisEngine = new ContextAnalysisEngine();
export type { ContextualRecommendation };
