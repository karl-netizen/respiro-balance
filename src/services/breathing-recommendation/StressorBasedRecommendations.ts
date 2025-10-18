import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
  WorkStressor,
  BreathingTechnique,
} from '@/types/workLifeBalance';

/**
 * Handles stressor-based breathing recommendations
 */
export class StressorBasedRecommendations {
  constructor(private preferences: EnhancedWorkLifePreferences) {}

  /**
   * Get recommendations based on detected stressors
   */
  getRecommendations(detectedStressors: WorkStressor[]): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];

    for (const stressor of detectedStressors) {
      if (!this.preferences.workStressors.includes(stressor)) continue;

      let technique: BreathingTechnique;
      let duration: number;
      let reasoning: string;
      let priority: 'low' | 'medium' | 'high' | 'urgent';

      switch (stressor) {
        case 'deadlines':
          technique = 'box-breathing';
          duration = 2;
          reasoning = 'Regain focus and clarity under deadline pressure';
          priority = 'high';
          break;

        case 'meetings':
          technique = 'coherent-breathing';
          duration = 3;
          reasoning = 'Center yourself before or after meetings';
          priority = 'medium';
          break;

        case 'interruptions':
          technique = 'physiological-sigh';
          duration = 1;
          reasoning = 'Quick reset after unexpected interruptions';
          priority = 'high';
          break;

        case 'email-overload':
          technique = 'triangular-breathing';
          duration = 2;
          reasoning = 'Reduce overwhelm from information overload';
          priority = 'medium';
          break;

        case 'difficult-conversations':
          technique = 'four-seven-eight';
          duration = 3;
          reasoning = 'Calm nerves before or after challenging interactions';
          priority = 'high';
          break;

        case 'technical-issues':
          technique = 'tactical-breathing';
          duration = 2;
          reasoning = 'Maintain problem-solving clarity during technical challenges';
          priority = 'medium';
          break;

        default:
          technique = 'box-breathing';
          duration = this.getPreferredDuration();
          reasoning = `Address ${stressor.replace('-', ' ')} with focused breathing`;
          priority = 'medium';
      }

      recommendations.push({
        id: `stressor-${stressor}-${Date.now()}`,
        triggerType: 'stress-detected',
        suggestedTechnique: technique,
        duration,
        reasoning,
        priority,
        context: {
          currentStressor: stressor,
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    }

    return recommendations;
  }

  /**
   * Get recommendations based on workload level
   */
  getWorkloadBasedRecommendations(workloadLevel: 'light' | 'moderate' | 'heavy'): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];

    if (workloadLevel === 'heavy') {
      recommendations.push({
        id: `heavy-workload-${Date.now()}`,
        triggerType: 'stress-detected',
        suggestedTechnique: 'quick-coherence',
        duration: 2,
        reasoning: 'Maintain performance and prevent burnout during heavy workload',
        priority: 'high',
        context: {
          workloadLevel,
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    }

    return recommendations;
  }

  /**
   * Get recommendations based on upcoming meetings
   */
  getMeetingBasedRecommendations(timeUntilNextMeeting?: number): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];

    if (timeUntilNextMeeting !== undefined) {
      if (timeUntilNextMeeting <= 5 && timeUntilNextMeeting > 0) {
        // Meeting starting soon
        recommendations.push({
          id: `pre-meeting-${Date.now()}`,
          triggerType: 'scheduled',
          suggestedTechnique: 'coherent-breathing',
          duration: Math.min(timeUntilNextMeeting - 1, 2),
          reasoning: 'Center yourself before your upcoming meeting',
          priority: 'medium',
          context: {
            nextMeetingIn: timeUntilNextMeeting,
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      } else if (timeUntilNextMeeting <= 0) {
        // Meeting just ended
        recommendations.push({
          id: `post-meeting-${Date.now()}`,
          triggerType: 'scheduled',
          suggestedTechnique: 'physiological-sigh',
          duration: 1,
          reasoning: 'Reset and transition after your meeting',
          priority: 'medium',
          context: {
            timeOfDay: this.getCurrentTimeOfDay(),
          },
        });
      }
    }

    return recommendations;
  }

  /**
   * Get recommendations based on specific stress level
   */
  getStressLevelBasedRecommendations(currentStressLevel?: number): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];

    if (currentStressLevel === undefined) return recommendations;

    if (currentStressLevel >= 9) {
      recommendations.push({
        id: `crisis-stress-${Date.now()}`,
        triggerType: 'stress-detected',
        suggestedTechnique: 'physiological-sigh',
        duration: 1,
        reasoning: 'Crisis-level stress - immediate nervous system reset needed',
        priority: 'urgent',
        context: {
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    } else if (currentStressLevel >= 7) {
      recommendations.push({
        id: `high-stress-intervention-${Date.now()}`,
        triggerType: 'stress-detected',
        suggestedTechnique: 'four-seven-eight',
        duration: 3,
        reasoning: 'High stress intervention - extended calming exhale',
        priority: 'high',
        context: {
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    } else if (currentStressLevel >= 5) {
      recommendations.push({
        id: `moderate-stress-${Date.now()}`,
        triggerType: 'stress-detected',
        suggestedTechnique: 'box-breathing',
        duration: this.getPreferredDuration(),
        reasoning: 'Moderate stress - structured breathing for balance',
        priority: 'medium',
        context: {
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    } else if (currentStressLevel <= 3) {
      recommendations.push({
        id: `maintenance-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'coherent-breathing',
        duration: this.getPreferredDuration(),
        reasoning: 'Low stress - maintenance practice for continued wellness',
        priority: 'low',
        context: {
          timeOfDay: this.getCurrentTimeOfDay(),
        },
      });
    }

    return recommendations;
  }

  /**
   * Get preferred duration based on user settings
   */
  private getPreferredDuration(): number {
    switch (this.preferences.preferredBreakLength) {
      case '1-minute': return 1;
      case '2-minutes': return 2;
      case '5-minutes': return 5;
      case '10-minutes': return 10;
      case 'flexible': return 3; // Default middle ground
      default: return 2;
    }
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
