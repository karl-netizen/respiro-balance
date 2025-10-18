import {
  EnhancedSleepRecovery,
  SleepBreathingRecommendation,
} from '@/types/sleepRecovery';

/**
 * Handles timing-based sleep breathing recommendations
 */
export class TimingBasedRecommendations {
  constructor(private sleepPreferences: EnhancedSleepRecovery) {}

  /**
   * Get recommendations based on timing relative to bedtime
   */
  getRecommendations(
    currentTime: Date,
    context: {
      timeUntilBedtime?: number;
    }
  ): SleepBreathingRecommendation[] {
    const recommendations: SleepBreathingRecommendation[] = [];
    const timeUntilBedtime = context.timeUntilBedtime || this.calculateTimeUntilBedtime(currentTime);

    // Wind-down time (30-90 minutes before bed)
    if (timeUntilBedtime >= 30 && timeUntilBedtime <= 90) {
      recommendations.push({
        id: `wind-down-${Date.now()}`,
        technique: 'coherent-breathing',
        purpose: 'bedtime-routine',
        timing: 'wind-down-routine',
        duration: 10,
        title: 'Wind-Down Breathing',
        description: 'Gentle rhythmic breathing to begin transitioning to sleep',
        instructions: [
          'Find a comfortable seated position',
          'Breathe in for 5 counts through your nose',
          'Breathe out for 5 counts through your mouth',
          'Let your breath be smooth and effortless',
          'Continue for 10 minutes or until you feel calm'
        ],
        tips: [
          'Dim the lights while practicing',
          'This can be done while reading or listening to calming music',
          'Focus on the rhythm rather than forcing deep breaths'
        ],
        effectivenessForFallingAsleep: 4,
        effectivenessForStayingAsleep: 3,
        effectivenessForMorningEnergy: 3,
        canBeDonenInBed: false,
        requiresQuietEnvironment: false,
        priority: 'medium',
        reasoning: 'Optimal time to begin sleep preparation with gentle breathing'
      });
    }

    // Bedtime approach (15-30 minutes before bed)
    if (timeUntilBedtime >= 15 && timeUntilBedtime <= 30) {
      recommendations.push({
        id: `bedtime-approach-${Date.now()}`,
        technique: 'four-seven-eight',
        purpose: 'preparation',
        timing: 'in-bed-before-sleep',
        duration: 5,
        title: 'Bedtime 4-7-8 Breathing',
        description: 'Powerful technique to activate your body\'s natural sleep response',
        instructions: [
          'Lie comfortably in bed',
          'Exhale completely through your mouth',
          'Inhale through your nose for 4 counts',
          'Hold your breath for 7 counts',
          'Exhale through your mouth for 8 counts',
          'Repeat 3-4 cycles'
        ],
        tips: [
          'Don\'t worry if you feel lightheaded at first',
          'The exhale should be slow and controlled',
          'This technique gets more effective with practice'
        ],
        effectivenessForFallingAsleep: 5,
        effectivenessForStayingAsleep: 3,
        effectivenessForMorningEnergy: 3,
        canBeDonenInBed: true,
        requiresQuietEnvironment: true,
        priority: 'high',
        reasoning: 'Prime time for sleep induction breathing before getting into bed'
      });
    }

    // Late evening (already past bedtime)
    if (timeUntilBedtime < 0) {
      recommendations.push({
        id: `late-evening-${Date.now()}`,
        technique: 'physiological-sigh',
        purpose: 'falling-asleep',
        timing: 'if-cant-fall-asleep',
        duration: 2,
        title: 'Quick Sleep Reset',
        description: 'Rapid nervous system calming for when you\'re past bedtime',
        instructions: [
          'Take a normal inhale through your nose',
          'Add a second, smaller inhale on top',
          'Exhale slowly and completely through your mouth',
          'Repeat 5-10 times',
          'Let your breathing return to natural rhythm'
        ],
        tips: [
          'This works quickly - usually within 1-2 minutes',
          'Don\'t overthink the technique',
          'Focus on the long, slow exhale'
        ],
        effectivenessForFallingAsleep: 4,
        effectivenessForStayingAsleep: 2,
        effectivenessForMorningEnergy: 2,
        canBeDonenInBed: true,
        requiresQuietEnvironment: false,
        priority: 'high',
        reasoning: 'Quick intervention needed since past optimal bedtime'
      });
    }

    return recommendations;
  }

  /**
   * Calculate time until bedtime in minutes
   */
  calculateTimeUntilBedtime(currentTime: Date): number {
    const [bedHour, bedMinute] = this.sleepPreferences.bedtime.split(':').map(Number);
    const bedtimeToday = new Date(currentTime);
    bedtimeToday.setHours(bedHour, bedMinute, 0, 0);

    // If bedtime has passed today, calculate for tomorrow
    if (bedtimeToday <= currentTime) {
      bedtimeToday.setDate(bedtimeToday.getDate() + 1);
    }

    return Math.floor((bedtimeToday.getTime() - currentTime.getTime()) / (1000 * 60));
  }
}
