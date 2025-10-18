import {
  SleepBreathingRecommendation,
} from '@/types/sleepRecovery';

/**
 * Handles contextual sleep breathing recommendations based on current state
 */
export class ContextualRecommendations {
  /**
   * Get recommendations for high stress levels affecting sleep
   */
  getStressRelatedRecommendations(context: {
    stressLevel?: number;
  }): SleepBreathingRecommendation[] {
    if (!context.stressLevel || context.stressLevel < 6) {
      return [];
    }

    return [{
      id: `stress-sleep-${Date.now()}`,
      technique: 'triangular-breathing',
      purpose: 'stress-relief',
      timing: 'wind-down-routine',
      duration: 10,
      title: 'Stress-to-Sleep Transition',
      description: 'Breathing pattern to process stress before sleep',
      instructions: [
        'Sit comfortably away from bed initially',
        'Inhale for 4 counts',
        'Hold for 4 counts',
        'Exhale for 8 counts (key: longer exhale)',
        'Focus on releasing the day\'s stress with each exhale',
        'After 10 minutes, move to bedtime routine'
      ],
      tips: [
        'Imagine breathing out the stress of the day',
        'The longer exhale helps shift from sympathetic to parasympathetic mode',
        'You may want to journal briefly before this practice'
      ],
      effectivenessForFallingAsleep: 4,
      effectivenessForStayingAsleep: 4,
      effectivenessForMorningEnergy: 4,
      bestForStressLevel: 7,
      canBeDonenInBed: false,
      requiresQuietEnvironment: false,
      priority: 'high',
      reasoning: 'High stress detected - need to process before attempting sleep'
    }];
  }

  /**
   * Get recommendations for physical tension affecting sleep
   */
  getPhysicalTensionRecommendations(context: {
    physicalTension?: number;
  }): SleepBreathingRecommendation[] {
    if (!context.physicalTension || context.physicalTension < 6) {
      return [];
    }

    return [{
      id: `tension-sleep-${Date.now()}`,
      technique: 'belly-breathing',
      purpose: 'physical-tension',
      timing: 'wind-down-routine',
      duration: 15,
      title: 'Tension Release Breathing',
      description: 'Deep breathing with progressive muscle relaxation',
      instructions: [
        'Lie down in bed or on comfortable surface',
        'Place one hand on chest, one on belly',
        'Breathe so only the belly hand moves',
        'Inhale for 4-6 counts, inflating belly',
        'Exhale for 6-8 counts, releasing all tension',
        'With each exhale, consciously relax one muscle group'
      ],
      tips: [
        'Start with face muscles, work down to toes',
        'Don\'t force the relaxation - just invite it',
        'If tension returns to an area, breathe into it specifically'
      ],
      effectivenessForFallingAsleep: 4,
      effectivenessForStayingAsleep: 4,
      effectivenessForMorningEnergy: 4,
      canBeDonenInBed: true,
      requiresQuietEnvironment: false,
      priority: 'high',
      reasoning: 'Physical tension detected - need body-based relaxation approach'
    }];
  }

  /**
   * Get recommendations for racing thoughts
   */
  getRacingThoughtsRecommendations(context: {
    mentalActivity?: number;
  }): SleepBreathingRecommendation[] {
    if (!context.mentalActivity || context.mentalActivity < 7) {
      return [];
    }

    return [{
      id: `racing-thoughts-sleep-${Date.now()}`,
      technique: 'alternate-nostril',
      purpose: 'racing-thoughts',
      timing: 'wind-down-routine',
      duration: 8,
      title: 'Mind-Balancing Breathing',
      description: 'Traditional technique to calm mental chatter',
      instructions: [
        'Sit comfortably with spine straight',
        'Use right thumb to close right nostril',
        'Inhale through left nostril for 4 counts',
        'Close left nostril with ring finger, release thumb',
        'Exhale through right nostril for 4 counts',
        'Inhale right, switch, exhale left - continue pattern'
      ],
      tips: [
        'If hand position is awkward, just visualize the pattern',
        'The alternating pattern naturally calms mental activity',
        'End by breathing freely through both nostrils'
      ],
      effectivenessForFallingAsleep: 3,
      effectivenessForStayingAsleep: 3,
      effectivenessForMorningEnergy: 3,
      bestForExperienceLevel: 'intermediate',
      canBeDonenInBed: false,
      requiresQuietEnvironment: true,
      priority: 'medium',
      reasoning: 'Mental hyperactivity detected - technique to balance and calm mind'
    }];
  }
}
