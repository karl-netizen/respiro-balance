import {
  SleepBreathingRecommendation,
  SleepChallenge,
} from '@/types/sleepRecovery';

/**
 * Handles sleep challenge-specific breathing recommendations
 */
export class ChallengeSpecificRecommendations {
  /**
   * Get recommendations for specific sleep challenges
   */
  getRecommendations(
    challenge: SleepChallenge,
    context: any
  ): SleepBreathingRecommendation[] {
    const recommendations: SleepBreathingRecommendation[] = [];

    switch (challenge) {
      case 'falling-asleep':
        recommendations.push({
          id: `falling-asleep-${Date.now()}`,
          technique: 'four-seven-eight',
          purpose: 'falling-asleep',
          timing: 'in-bed-before-sleep',
          duration: 8,
          forSleepChallenge: challenge,
          title: 'Sleep Induction Breathing',
          description: 'Extended 4-7-8 practice specifically for falling asleep',
          instructions: [
            'Lie comfortably with eyes closed',
            'Place tongue tip behind upper teeth',
            'Exhale completely making a whoosh sound',
            'Inhale through nose for 4 counts',
            'Hold breath for 7 counts',
            'Exhale through mouth for 8 counts with whoosh sound',
            'Repeat up to 8 cycles or until sleepy'
          ],
          tips: [
            'Start with 4 cycles and gradually increase',
            'If you feel too alert, reduce the number of cycles',
            'The key is the long exhale - it triggers relaxation'
          ],
          effectivenessForFallingAsleep: 5,
          effectivenessForStayingAsleep: 3,
          effectivenessForMorningEnergy: 3,
          canBeDonenInBed: true,
          requiresQuietEnvironment: true,
          priority: 'high',
          reasoning: 'Specifically designed to activate parasympathetic nervous system for sleep'
        });
        break;

      case 'staying-asleep':
        recommendations.push({
          id: `staying-asleep-${Date.now()}`,
          technique: 'belly-breathing',
          purpose: 'middle-of-night',
          timing: 'middle-of-night-wake',
          duration: 5,
          forSleepChallenge: challenge,
          title: 'Middle-of-Night Reset',
          description: 'Gentle breathing to return to sleep without full awakening',
          instructions: [
            'Don\'t open your eyes or check the time',
            'Place one hand on chest, one on belly',
            'Breathe slowly so only the belly hand moves',
            'Inhale for 4 counts, pause briefly',
            'Exhale for 6 counts, letting belly fall',
            'Continue until you drift back to sleep'
          ],
          tips: [
            'Keep movements minimal',
            'Don\'t count cycles - just focus on the rhythm',
            'If mind wanders, gently return to breath'
          ],
          effectivenessForFallingAsleep: 3,
          effectivenessForStayingAsleep: 5,
          effectivenessForMorningEnergy: 4,
          canBeDonenInBed: true,
          requiresQuietEnvironment: false,
          priority: 'high',
          reasoning: 'Maintains sleepy state while addressing night waking'
        });
        break;

      case 'racing-thoughts':
        recommendations.push({
          id: `racing-thoughts-${Date.now()}`,
          technique: 'box-breathing',
          purpose: 'racing-thoughts',
          timing: 'wind-down-routine',
          duration: 12,
          forSleepChallenge: challenge,
          title: 'Mind-Quieting Breathing',
          description: 'Structured breathing to calm mental hyperactivity',
          instructions: [
            'Sit comfortably or lie in bed',
            'Inhale through nose for 4 counts',
            'Hold breath for 4 counts',
            'Exhale through mouth for 4 counts',
            'Hold empty for 4 counts',
            'Repeat for 12 minutes, focusing only on counting'
          ],
          tips: [
            'When thoughts arise, label them "thinking" and return to counting',
            'The equal timing gives your mind something specific to focus on',
            'Start with shorter holds if 4 counts feels difficult'
          ],
          effectivenessForFallingAsleep: 4,
          effectivenessForStayingAsleep: 4,
          effectivenessForMorningEnergy: 3,
          canBeDonenInBed: true,
          requiresQuietEnvironment: true,
          priority: 'high',
          reasoning: 'Structured pattern helps redirect hyperactive mind'
        });
        break;

      case 'physical-tension':
        recommendations.push({
          id: `physical-tension-${Date.now()}`,
          technique: 'belly-breathing',
          purpose: 'physical-tension',
          timing: 'wind-down-routine',
          duration: 15,
          forSleepChallenge: challenge,
          title: 'Progressive Relaxation Breathing',
          description: 'Deep breathing combined with body relaxation',
          instructions: [
            'Lie down and get comfortable',
            'Place hands on belly',
            'Breathe deeply so belly rises and falls',
            'On each exhale, consciously relax a body part',
            'Start with toes, work up to head',
            'Continue breathing and releasing tension'
          ],
          tips: [
            'Take your time - tension took time to build up',
            'Pay special attention to jaw, shoulders, and forehead',
            'If you notice tension returning, breathe into that area'
          ],
          effectivenessForFallingAsleep: 4,
          effectivenessForStayingAsleep: 4,
          effectivenessForMorningEnergy: 4,
          canBeDonenInBed: true,
          requiresQuietEnvironment: false,
          priority: 'high',
          reasoning: 'Combines breath work with physical tension release'
        });
        break;

      case 'early-waking':
        recommendations.push({
          id: `early-waking-${Date.now()}`,
          technique: 'coherent-breathing',
          purpose: 'early-morning',
          timing: 'early-morning-wake',
          duration: 10,
          forSleepChallenge: challenge,
          title: 'Early Morning Return to Sleep',
          description: 'Gentle breathing to extend sleep when waking too early',
          instructions: [
            'Don\'t check the time or get up',
            'Keep eyes closed and body still',
            'Breathe in for 5 counts',
            'Breathe out for 5 counts',
            'Make breathing effortless and smooth',
            'Let go of any agenda to fall back asleep'
          ],
          tips: [
            'Acceptance is key - fighting wakefulness makes it worse',
            'Focus on rest even if you don\'t fall back asleep',
            'This technique often leads to surprise return to sleep'
          ],
          effectivenessForFallingAsleep: 3,
          effectivenessForStayingAsleep: 4,
          effectivenessForMorningEnergy: 3,
          canBeDonenInBed: true,
          requiresQuietEnvironment: false,
          priority: 'medium',
          reasoning: 'Maintains relaxed state for potential sleep return'
        });
        break;

      case 'anxiety-bedtime':
        recommendations.push({
          id: `anxiety-bedtime-${Date.now()}`,
          technique: 'physiological-sigh',
          purpose: 'anxiety-about-sleep',
          timing: 'any-time-stressed',
          duration: 3,
          forSleepChallenge: challenge,
          title: 'Sleep Anxiety Relief',
          description: 'Quick anxiety intervention before bed',
          instructions: [
            'Sit on edge of bed or in comfortable chair',
            'Take a normal inhale through your nose',
            'Add a second, smaller inhale on top',
            'Exhale slowly through your mouth',
            'Repeat 8-10 times',
            'Notice anxiety decreasing with each exhale'
          ],
          tips: [
            'This works by directly calming your nervous system',
            'Don\'t rush - let each exhale be complete',
            'Follow with gentle self-talk about sleep being natural'
          ],
          effectivenessForFallingAsleep: 4,
          effectivenessForStayingAsleep: 3,
          effectivenessForMorningEnergy: 3,
          canBeDonenInBed: false,
          requiresQuietEnvironment: false,
          priority: 'urgent',
          reasoning: 'Addresses anxiety that can create sleep performance pressure'
        });
        break;
    }

    return recommendations;
  }
}
