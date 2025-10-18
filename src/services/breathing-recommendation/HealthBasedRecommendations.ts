import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
} from '@/types/workLifeBalance';

/**
 * Handles health and symptom-based breathing recommendations
 */
export class HealthBasedRecommendations {
  constructor(private preferences: EnhancedWorkLifePreferences) {}

  /**
   * Get recommendations based on reported physical symptoms
   */
  getRecommendations(context: {
    reportedPhysicalSymptoms?: string[];
    currentStressLevel?: number;
  }): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const symptoms = context.reportedPhysicalSymptoms || [];
    const stressAssessment = this.preferences.stressAssessment;

    // Recommendations based on current stress level
    if (stressAssessment && context.currentStressLevel !== undefined) {
      const stressLevel = context.currentStressLevel;

      if (stressLevel >= 8) {
        recommendations.push({
          id: `high-stress-${Date.now()}`,
          triggerType: 'stress-detected',
          suggestedTechnique: 'physiological-sigh',
          duration: 1,
          reasoning: 'Emergency stress relief - double inhale for immediate calm',
          priority: 'urgent',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      } else if (stressLevel >= 6) {
        recommendations.push({
          id: `elevated-stress-${Date.now()}`,
          triggerType: 'stress-detected',
          suggestedTechnique: 'four-seven-eight',
          duration: 3,
          reasoning: 'Elevated stress detected - calming exhale focus',
          priority: 'high',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }
    }

    // Recommendations based on physical symptoms
    symptoms.forEach(symptom => {
      const symptomLower = symptom.toLowerCase();

      if (symptomLower.includes('tension') || symptomLower.includes('muscle')) {
        recommendations.push({
          id: `tension-${Date.now()}`,
          triggerType: 'stress-detected',
          suggestedTechnique: 'belly-breathing',
          duration: 5,
          reasoning: 'Deep diaphragmatic breathing to release physical tension',
          priority: 'high',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }

      if (symptomLower.includes('headache') || symptomLower.includes('head')) {
        recommendations.push({
          id: `headache-${Date.now()}`,
          triggerType: 'stress-detected',
          suggestedTechnique: 'coherent-breathing',
          duration: 5,
          reasoning: 'Rhythmic breathing to ease tension headaches',
          priority: 'high',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }

      if (symptomLower.includes('shallow') || symptomLower.includes('breath')) {
        recommendations.push({
          id: `breathing-${Date.now()}`,
          triggerType: 'user-requested',
          suggestedTechnique: 'belly-breathing',
          duration: 3,
          reasoning: 'Retrain breathing pattern with deep diaphragmatic breaths',
          priority: 'medium',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }

      if (symptomLower.includes('heart') || symptomLower.includes('racing')) {
        recommendations.push({
          id: `heart-rate-${Date.now()}`,
          triggerType: 'stress-detected',
          suggestedTechnique: 'box-breathing',
          duration: 4,
          reasoning: 'Structured breathing to regulate heart rate',
          priority: 'high',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }
    });

    return recommendations;
  }

  /**
   * Get current time of day category
   */
  private getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
}
