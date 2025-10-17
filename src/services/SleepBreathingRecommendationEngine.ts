import {
  EnhancedSleepRecovery,
  SleepBreathingRecommendation,
  SleepChallenge,
  SleepBreathingPurpose,
  SleepBreathingTiming,
  SleepBreathingSession,
  SleepAnalytics
} from '@/types/sleepRecovery';
import { BreathingTechnique } from '@/types/workLifeBalance';

export class SleepBreathingRecommendationEngine {
  private sleepPreferences: EnhancedSleepRecovery;
  private sessionHistory: SleepBreathingSession[];

  constructor(sleepPreferences: EnhancedSleepRecovery, sessionHistory: SleepBreathingSession[] = []) {
    this.sleepPreferences = sleepPreferences;
    this.sessionHistory = sessionHistory;
  }

  /**
   * Get personalized sleep breathing recommendations based on current context
   */
  getSleepRecommendations(context: {
    currentTime?: Date;
    timeUntilBedtime?: number; // minutes
    currentSleepChallenge?: SleepChallenge;
    stressLevel?: number; // 1-10
    physicalTension?: number; // 1-10
    mentalActivity?: number; // 1-10 (racing thoughts)
    purpose?: SleepBreathingPurpose;
    environment?: 'bedroom' | 'living-room' | 'other';
    canMakeNoise?: boolean;
  } = {}): SleepBreathingRecommendation[] {
    const recommendations: SleepBreathingRecommendation[] = [];
    const now = context.currentTime || new Date();

    // Get timing-based recommendations
    recommendations.push(...this.getTimingBasedRecommendations(now, context));

    // Get challenge-specific recommendations
    if (context.currentSleepChallenge) {
      recommendations.push(...this.getChallengeSpecificRecommendations(context.currentSleepChallenge, context));
    }

    // Get stress-responsive recommendations
    if (context.stressLevel !== undefined && context.stressLevel >= 6) {
      recommendations.push(...this.getStressRelatedSleepRecommendations(context));
    }

    // Get physical tension recommendations
    if (context.physicalTension !== undefined && context.physicalTension >= 6) {
      recommendations.push(...this.getPhysicalTensionRecommendations(context));
    }

    // Get racing thoughts recommendations
    if (context.mentalActivity !== undefined && context.mentalActivity >= 7) {
      recommendations.push(...this.getRacingThoughtsRecommendations(context));
    }

    // Filter and personalize
    const filtered = this.filterByPreferences(recommendations);
    const personalized = this.personalizeWithHistory(filtered);

    // Sort by priority and effectiveness
    return personalized.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Secondary sort by effectiveness for falling asleep
      return b.effectivenessForFallingAsleep - a.effectivenessForFallingAsleep;
    }).slice(0, 3);
  }

  /**
   * Get recommendations based on timing relative to bedtime
   */
  private getTimingBasedRecommendations(
    currentTime: Date,
    context: any
  ): SleepBreathingRecommendation[] {
    const recommendations: SleepBreathingRecommendation[] = [];
    const bedtimeHour = parseInt(this.sleepPreferences.bedtime.split(':')[0]);
    const currentHour = currentTime.getHours();
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
   * Get recommendations for specific sleep challenges
   */
  private getChallengeSpecificRecommendations(
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

  /**
   * Get recommendations for high stress levels affecting sleep
   */
  private getStressRelatedSleepRecommendations(context: any): SleepBreathingRecommendation[] {
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
  private getPhysicalTensionRecommendations(context: any): SleepBreathingRecommendation[] {
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
  private getRacingThoughtsRecommendations(context: any): SleepBreathingRecommendation[] {
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

  /**
   * Filter recommendations based on user preferences and context
   */
  private filterByPreferences(recommendations: SleepBreathingRecommendation[]): SleepBreathingRecommendation[] {
    return recommendations.filter(rec => {
      // Check if user is interested in sleep breathing
      if (!this.sleepPreferences.interestedInSleepBreathing) {
        return false;
      }

      // Check preferred techniques if specified
      const preferredTechniques = this.sleepPreferences.preferredSleepBreathingTechniques;
      if (preferredTechniques && preferredTechniques.length > 0) {
        if (!preferredTechniques.includes(rec.technique)) {
          // Replace with preferred technique if possible
          rec.technique = this.getClosestPreferredSleepTechnique(rec.technique);
          rec.reasoning += ' (Adapted to your preferred techniques)';
        }
      }

      return true;
    });
  }

  /**
   * Personalize recommendations based on session history
   */
  private personalizeWithHistory(recommendations: SleepBreathingRecommendation[]): SleepBreathingRecommendation[] {
    return recommendations.map(rec => {
      // Find similar past sessions
      const similarSessions = this.sessionHistory.filter(session =>
        session.technique === rec.technique &&
        session.purpose === rec.purpose
      );

      if (similarSessions.length > 0) {
        // Calculate average effectiveness
        const avgRelaxation = similarSessions.reduce((sum, session) =>
          sum + (session.relaxationAfter || 3), 0) / similarSessions.length;

        const avgTimeToSleep = similarSessions.reduce((sum, session) =>
          sum + (session.timeToFallAsleepAfter || 20), 0) / similarSessions.length;

        // Adjust priority based on past effectiveness
        if (avgRelaxation >= 8 && avgTimeToSleep <= 15) {
          rec.priority = rec.priority === 'low' ? 'medium' : 'high';
          rec.reasoning += ' (This has worked well for you before)';
        } else if (avgRelaxation <= 5 || avgTimeToSleep >= 30) {
          rec.priority = 'low';
          rec.reasoning += ' (Trying a different approach based on your feedback)';
        }

        // Update effectiveness ratings based on personal history
        if (avgTimeToSleep <= 10) {
          rec.effectivenessForFallingAsleep = Math.min(5, rec.effectivenessForFallingAsleep + 1);
        }
      }

      return rec;
    });
  }

  /**
   * Calculate time until bedtime in minutes
   */
  private calculateTimeUntilBedtime(currentTime: Date): number {
    const [bedHour, bedMinute] = this.sleepPreferences.bedtime.split(':').map(Number);
    const bedtimeToday = new Date(currentTime);
    bedtimeToday.setHours(bedHour, bedMinute, 0, 0);

    // If bedtime has passed today, calculate for tomorrow
    if (bedtimeToday <= currentTime) {
      bedtimeToday.setDate(bedtimeToday.getDate() + 1);
    }

    return Math.floor((bedtimeToday.getTime() - currentTime.getTime()) / (1000 * 60));
  }

  /**
   * Find closest preferred technique for sleep
   */
  private getClosestPreferredSleepTechnique(original: BreathingTechnique): BreathingTechnique {
    const preferredTechniques = this.sleepPreferences.preferredSleepBreathingTechniques || [];

    if (preferredTechniques.length === 0) return original;

    // Sleep-specific technique similarity mapping
    const sleepSimilarityMap: Record<BreathingTechnique, BreathingTechnique[]> = {
      'four-seven-eight': ['belly-breathing', 'coherent-breathing'],
      'belly-breathing': ['four-seven-eight', 'coherent-breathing'],
      'coherent-breathing': ['belly-breathing', 'box-breathing'],
      'box-breathing': ['coherent-breathing', 'tactical-breathing'],
      'physiological-sigh': ['four-seven-eight', 'belly-breathing'],
      'triangular-breathing': ['four-seven-eight', 'box-breathing'],
      'alternate-nostril': ['coherent-breathing', 'belly-breathing'],
      'tactical-breathing': ['box-breathing', 'coherent-breathing'],
      'quick-coherence': ['coherent-breathing', 'belly-breathing'],
    };

    // First check if original is preferred
    if (preferredTechniques.includes(original)) return original;

    // Then check similar techniques
    const similar = sleepSimilarityMap[original] || [];
    for (const technique of similar) {
      if (preferredTechniques.includes(technique)) return technique;
    }

    // Fallback to first preferred technique
    return preferredTechniques[0];
  }

  /**
   * Record a completed sleep breathing session for learning
   */
  public recordSleepSession(session: SleepBreathingSession): void {
    this.sessionHistory.push(session);

    // Keep only recent sessions for performance (last 50 sleep sessions)
    if (this.sessionHistory.length > 50) {
      this.sessionHistory = this.sessionHistory.slice(-50);
    }
  }

  /**
   * Get sleep-specific analytics and insights
   */
  public getSleepBreathingAnalytics(): {
    totalSleepSessions: number;
    averageTimeToFallAsleep: number;
    averageRelaxationRating: number;
    mostEffectiveForFallingAsleep: BreathingTechnique | null;
    mostEffectiveForStayingAsleep: BreathingTechnique | null;
    sleepQualityImprovement: number;
    bestTimeForPractice: SleepBreathingTiming | null;
    recommendationsForImprovement: string[];
  } {
    if (this.sessionHistory.length === 0) {
      return {
        totalSleepSessions: 0,
        averageTimeToFallAsleep: 0,
        averageRelaxationRating: 0,
        mostEffectiveForFallingAsleep: null,
        mostEffectiveForStayingAsleep: null,
        sleepQualityImprovement: 0,
        bestTimeForPractice: null,
        recommendationsForImprovement: [
          'Start with 4-7-8 breathing 30 minutes before bedtime',
          'Track your sleep quality to see the impact of breathing practice',
          'Try different techniques to find what works best for you'
        ]
      };
    }

    const sessions = this.sessionHistory;
    const completedSessions = sessions.filter(s => s.completed);

    // Calculate averages
    const avgTimeToSleep = completedSessions
      .filter(s => s.timeToFallAsleepAfter !== undefined)
      .reduce((sum, s) => sum + (s.timeToFallAsleepAfter || 0), 0) / completedSessions.length;

    const avgRelaxation = completedSessions
      .filter(s => s.relaxationAfter !== undefined)
      .reduce((sum, s) => sum + (s.relaxationAfter || 0), 0) / completedSessions.length;

    // Find most effective techniques
    const techniqueEffectiveness: Record<string, {
      totalSessions: number;
      avgTimeToSleep: number;
      avgSleepQuality: number;
    }> = {};

    completedSessions.forEach(session => {
      const technique = session.technique;
      if (!techniqueEffectiveness[technique]) {
        techniqueEffectiveness[technique] = {
          totalSessions: 0,
          avgTimeToSleep: 0,
          avgSleepQuality: 0
        };
      }

      techniqueEffectiveness[technique].totalSessions++;
      if (session.timeToFallAsleepAfter) {
        techniqueEffectiveness[technique].avgTimeToSleep += session.timeToFallAsleepAfter;
      }
      if (session.sleepQualityNextMorning) {
        techniqueEffectiveness[technique].avgSleepQuality += session.sleepQualityNextMorning;
      }
    });

    // Calculate averages
    Object.keys(techniqueEffectiveness).forEach(technique => {
      const data = techniqueEffectiveness[technique];
      data.avgTimeToSleep = data.avgTimeToSleep / data.totalSessions;
      data.avgSleepQuality = data.avgSleepQuality / data.totalSessions;
    });

    // Find best techniques (lowest time to sleep, highest sleep quality)
    const techniquesByFallAsleep = Object.entries(techniqueEffectiveness)
      .sort(([,a], [,b]) => a.avgTimeToSleep - b.avgTimeToSleep);

    const techniquesBySleepQuality = Object.entries(techniqueEffectiveness)
      .sort(([,a], [,b]) => b.avgSleepQuality - a.avgSleepQuality);

    // Calculate sleep quality improvement trend
    const recentSessions = sessions.slice(-10).filter(s => s.sleepQualityNextMorning);
    const oldSessions = sessions.slice(0, 10).filter(s => s.sleepQualityNextMorning);

    let sleepQualityImprovement = 0;
    if (recentSessions.length > 0 && oldSessions.length > 0) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.sleepQualityNextMorning || 0), 0) / recentSessions.length;
      const oldAvg = oldSessions.reduce((sum, s) => sum + (s.sleepQualityNextMorning || 0), 0) / oldSessions.length;
      sleepQualityImprovement = recentAvg - oldAvg;
    }

    // Determine best timing
    const timingEffectiveness: Record<string, number[]> = {};
    sessions.forEach(session => {
      const timing = this.categorizeTiming(session.timeRelativeToBedtime);
      if (!timingEffectiveness[timing]) {
        timingEffectiveness[timing] = [];
      }
      if (session.relaxationAfter) {
        timingEffectiveness[timing].push(session.relaxationAfter);
      }
    });

    const bestTiming = Object.entries(timingEffectiveness)
      .map(([timing, scores]) => ({
        timing,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0]?.timing as SleepBreathingTiming;

    // Generate recommendations
    const recommendations: string[] = [];

    if (avgTimeToSleep > 20) {
      recommendations.push('Try 4-7-8 breathing - it\'s specifically designed to help you fall asleep faster');
    }

    if (avgRelaxation < 7) {
      recommendations.push('Consider extending your breathing practice time for deeper relaxation');
    }

    if (techniquesByFallAsleep.length > 0 && techniquesByFallAsleep[0][1].avgTimeToSleep <= 15) {
      recommendations.push(`Your most effective technique is ${techniquesByFallAsleep[0][0]} - consider using it more regularly`);
    }

    if (sleepQualityImprovement < 0) {
      recommendations.push('Try practicing breathing earlier in your wind-down routine');
    }

    return {
      totalSleepSessions: sessions.length,
      averageTimeToFallAsleep: Math.round(avgTimeToSleep),
      averageRelaxationRating: Math.round(avgRelaxation * 10) / 10,
      mostEffectiveForFallingAsleep: (techniquesByFallAsleep[0]?.[0] as BreathingTechnique) || null,
      mostEffectiveForStayingAsleep: (techniquesBySleepQuality[0]?.[0] as BreathingTechnique) || null,
      sleepQualityImprovement: Math.round(sleepQualityImprovement * 10) / 10,
      bestTimeForPractice: bestTiming || null,
      recommendationsForImprovement: recommendations
    };
  }

  /**
   * Categorize timing relative to bedtime
   */
  private categorizeTiming(minutesRelativeToBedtime: number): string {
    if (minutesRelativeToBedtime >= 60) return 'wind-down-routine';
    if (minutesRelativeToBedtime >= 15) return 'bedtime-approach';
    if (minutesRelativeToBedtime >= -15) return 'in-bed-before-sleep';
    if (minutesRelativeToBedtime >= -180) return 'middle-of-night-wake';
    return 'early-morning-wake';
  }
}