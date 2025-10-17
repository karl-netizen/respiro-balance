import {
  ExerciseBreathingRecommendation,
  ExerciseBreathingPurpose,
  ExerciseBreathingContext,
  ExerciseType,
  IntensityLevel,
  TensionArea,
  ExerciseGoal,
  EnhancedExerciseMovement
} from '@/types/exerciseMovement';
import { BreathingTechnique } from '@/types/workLifeBalance';

interface ExerciseRecommendationContext {
  currentTime?: Date;
  exerciseType?: ExerciseType;
  exerciseIntensity?: IntensityLevel;
  exerciseDuration?: number; // minutes
  timeRelativeToExercise?: number; // minutes (-30 = 30 min before, 0 = during, 30 = 30 min after)
  currentTensionLevel?: number; // 1-10
  currentEnergyLevel?: number; // 1-10
  currentFocusLevel?: number; // 1-10
  targetedTensionAreas?: TensionArea[];
  exerciseGoals?: ExerciseGoal[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  availableTime?: number; // minutes available for breathing
  gymEnvironment?: boolean;
  hasEquipment?: boolean;
}

/**
 * Advanced recommendation engine for exercise-related breathing techniques
 * Provides context-aware suggestions based on exercise type, timing, and personal goals
 */
export class ExerciseBreathingRecommendationEngine {
  private breathingTechniques: Record<BreathingTechnique, {
    name: string;
    description: string;
    benefits: string[];
    duration: number; // typical duration in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: boolean;
    contexts: ExerciseBreathingContext[];
    purposes: ExerciseBreathingPurpose[];
    bestForExerciseTypes: ExerciseType[];
    bestForIntensity: IntensityLevel[];
    tensionAreas: TensionArea[];
  }> = {
    'box-breathing': {
      name: 'Box Breathing',
      description: 'Four-count breathing pattern for focus and calm',
      benefits: ['Improves focus', 'Reduces anxiety', 'Enhances mental clarity'],
      duration: 5,
      difficulty: 'beginner',
      equipment: false,
      contexts: ['pre-exercise', 'between-sets', 'cool-down'],
      purposes: ['focus', 'stress-relief', 'performance'],
      bestForExerciseTypes: ['strength', 'yoga', 'martial-arts'],
      bestForIntensity: ['light', 'moderate'],
      tensionAreas: ['neck', 'shoulders', 'chest']
    },
    'coherent-breathing': {
      name: 'Coherent Breathing',
      description: 'Rhythmic breathing to balance the nervous system',
      benefits: ['Balances nervous system', 'Improves heart rate variability', 'Enhances recovery'],
      duration: 10,
      difficulty: 'beginner',
      equipment: false,
      contexts: ['pre-exercise', 'cool-down', 'recovery-day'],
      purposes: ['recovery', 'stress-relief', 'warm-up'],
      bestForExerciseTypes: ['cardio', 'yoga', 'walking'],
      bestForIntensity: ['light', 'moderate'],
      tensionAreas: ['chest', 'stomach', 'whole-body']
    },
    'wim-hof': {
      name: 'Wim Hof Breathing',
      description: 'Powerful breathing technique for energy and endurance',
      benefits: ['Increases energy', 'Improves endurance', 'Enhances cold tolerance'],
      duration: 15,
      difficulty: 'advanced',
      equipment: false,
      contexts: ['pre-exercise', 'recovery-day'],
      purposes: ['energy-boost', 'endurance', 'performance'],
      bestForExerciseTypes: ['hiit', 'crossfit', 'endurance'],
      bestForIntensity: ['vigorous', 'maximum'],
      tensionAreas: ['chest', 'whole-body']
    },
    'four-seven-eight': {
      name: '4-7-8 Breathing',
      description: 'Calming breath pattern for relaxation',
      benefits: ['Promotes relaxation', 'Reduces stress', 'Improves recovery'],
      duration: 8,
      difficulty: 'beginner',
      equipment: false,
      contexts: ['cool-down', 'post-exercise', 'recovery-day'],
      purposes: ['recovery', 'stress-relief', 'cool-down'],
      bestForExerciseTypes: ['yoga', 'pilates', 'stretching'],
      bestForIntensity: ['very-light', 'light'],
      tensionAreas: ['neck', 'shoulders', 'stomach']
    },
    'breath-of-fire': {
      name: 'Breath of Fire',
      description: 'Rapid abdominal breathing for energy and focus',
      benefits: ['Increases energy', 'Improves focus', 'Strengthens core'],
      duration: 5,
      difficulty: 'intermediate',
      equipment: false,
      contexts: ['warm-up', 'pre-exercise'],
      purposes: ['energy-boost', 'warm-up', 'focus'],
      bestForExerciseTypes: ['yoga', 'pilates', 'calisthenics'],
      bestForIntensity: ['moderate', 'vigorous'],
      tensionAreas: ['stomach', 'chest']
    },
    'extended-exhale': {
      name: 'Extended Exhale',
      description: 'Longer exhale for nervous system reset',
      benefits: ['Activates parasympathetic nervous system', 'Promotes recovery', 'Reduces tension'],
      duration: 8,
      difficulty: 'beginner',
      equipment: false,
      contexts: ['cool-down', 'post-exercise', 'between-sets'],
      purposes: ['recovery', 'tension-relief', 'cool-down'],
      bestForExerciseTypes: ['strength', 'hiit', 'crossfit'],
      bestForIntensity: ['moderate', 'vigorous', 'maximum'],
      tensionAreas: ['shoulders', 'back', 'chest']
    },
    'alternate-nostril': {
      name: 'Alternate Nostril Breathing',
      description: 'Balancing technique using nostril breathing',
      benefits: ['Balances nervous system', 'Improves focus', 'Enhances recovery'],
      duration: 10,
      difficulty: 'intermediate',
      equipment: false,
      contexts: ['pre-exercise', 'cool-down', 'recovery-day'],
      purposes: ['focus', 'recovery', 'stress-relief'],
      bestForExerciseTypes: ['yoga', 'meditation', 'tai-chi'],
      bestForIntensity: ['very-light', 'light'],
      tensionAreas: ['neck', 'head', 'shoulders']
    }
  };

  private exerciseContextRules = {
    'pre-exercise': {
      primaryPurposes: ['warm-up', 'focus', 'energy-boost'],
      timeRange: [-60, -5], // 5-60 minutes before
      preferredDuration: [3, 10],
      intensity: ['light', 'moderate']
    },
    'warm-up': {
      primaryPurposes: ['warm-up', 'focus', 'performance'],
      timeRange: [-15, 0],
      preferredDuration: [2, 5],
      intensity: ['light']
    },
    'during-exercise': {
      primaryPurposes: ['performance', 'endurance', 'focus'],
      timeRange: [0, 120], // during exercise
      preferredDuration: [1, 3],
      intensity: ['light', 'moderate']
    },
    'between-sets': {
      primaryPurposes: ['recovery', 'focus', 'performance'],
      timeRange: [0, 120],
      preferredDuration: [1, 2],
      intensity: ['light']
    },
    'cool-down': {
      primaryPurposes: ['cool-down', 'recovery', 'tension-relief'],
      timeRange: [0, 30], // immediately after to 30 min after
      preferredDuration: [5, 15],
      intensity: ['very-light', 'light']
    },
    'post-exercise': {
      primaryPurposes: ['recovery', 'tension-relief', 'stress-relief'],
      timeRange: [5, 120], // 5 min to 2 hours after
      preferredDuration: [8, 20],
      intensity: ['very-light', 'light']
    }
  };

  /**
   * Get personalized exercise breathing recommendations
   */
  public getExerciseRecommendations(
    userPreferences: EnhancedExerciseMovement,
    context: ExerciseRecommendationContext
  ): ExerciseBreathingRecommendation[] {
    const recommendations: ExerciseBreathingRecommendation[] = [];

    // Determine exercise context based on timing
    const exerciseContext = this.determineExerciseContext(context.timeRelativeToExercise || 0);

    // Get base recommendations for the context
    const contextualRecommendations = this.getContextualRecommendations(
      exerciseContext,
      context,
      userPreferences
    );

    // Add tension-specific recommendations
    const tensionRecommendations = this.getTensionSpecificRecommendations(
      context.targetedTensionAreas || userPreferences.tensionAreas || [],
      exerciseContext,
      context
    );

    // Add goal-specific recommendations
    const goalRecommendations = this.getGoalSpecificRecommendations(
      context.exerciseGoals || userPreferences.exerciseGoals || [],
      exerciseContext,
      context
    );

    // Combine and prioritize recommendations
    const allRecommendations = [
      ...contextualRecommendations,
      ...tensionRecommendations,
      ...goalRecommendations
    ];

    // Remove duplicates and sort by priority
    const uniqueRecommendations = this.removeDuplicatesAndPrioritize(allRecommendations);

    // Personalize based on user experience and preferences
    const personalizedRecommendations = this.personalizeRecommendations(
      uniqueRecommendations,
      userPreferences,
      context
    );

    return personalizedRecommendations.slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Get recommendations for specific exercise recovery needs
   */
  public getRecoveryRecommendations(
    tensionLevel: number,
    exerciseType: ExerciseType,
    exerciseIntensity: IntensityLevel,
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): ExerciseBreathingRecommendation[] {
    const context: ExerciseRecommendationContext = {
      exerciseType,
      exerciseIntensity,
      currentTensionLevel: tensionLevel,
      timeRelativeToExercise: 15, // 15 minutes post-exercise
      experienceLevel
    };

    const recoveryTechniques = Object.entries(this.breathingTechniques)
      .filter(([_, technique]) =>
        technique.purposes.includes('recovery') ||
        technique.purposes.includes('tension-relief') ||
        technique.purposes.includes('cool-down')
      )
      .map(([key, technique]) => this.createRecommendation(
        key as BreathingTechnique,
        technique,
        'recovery',
        'post-exercise',
        context
      ));

    return this.prioritizeByEffectiveness(recoveryTechniques, 'recovery').slice(0, 3);
  }

  /**
   * Get recommendations for pre-exercise preparation
   */
  public getPreExerciseRecommendations(
    exerciseType: ExerciseType,
    exerciseIntensity: IntensityLevel,
    energyLevel: number,
    focusLevel: number,
    availableTime: number = 10
  ): ExerciseBreathingRecommendation[] {
    const context: ExerciseRecommendationContext = {
      exerciseType,
      exerciseIntensity,
      currentEnergyLevel: energyLevel,
      currentFocusLevel: focusLevel,
      timeRelativeToExercise: -15, // 15 minutes before
      availableTime
    };

    const prepTechniques = Object.entries(this.breathingTechniques)
      .filter(([_, technique]) =>
        technique.contexts.includes('pre-exercise') ||
        technique.contexts.includes('warm-up')
      )
      .filter(([_, technique]) => technique.duration <= availableTime)
      .map(([key, technique]) => this.createRecommendation(
        key as BreathingTechnique,
        technique,
        energyLevel < 5 ? 'energy-boost' : 'focus',
        'pre-exercise',
        context
      ));

    return this.prioritizeByContext(prepTechniques, context).slice(0, 3);
  }

  // Private helper methods

  private determineExerciseContext(timeRelativeToExercise: number): ExerciseBreathingContext {
    if (timeRelativeToExercise < -15) return 'pre-exercise';
    if (timeRelativeToExercise >= -15 && timeRelativeToExercise < 0) return 'warm-up';
    if (timeRelativeToExercise >= 0 && timeRelativeToExercise <= 5) return 'during-exercise';
    if (timeRelativeToExercise > 5 && timeRelativeToExercise <= 30) return 'cool-down';
    if (timeRelativeToExercise > 30) return 'post-exercise';
    return 'any-time';
  }

  private getContextualRecommendations(
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext,
    userPreferences: EnhancedExerciseMovement
  ): ExerciseBreathingRecommendation[] {
    const recommendations: ExerciseBreathingRecommendation[] = [];

    Object.entries(this.breathingTechniques).forEach(([key, technique]) => {
      if (technique.contexts.includes(context)) {
        const purpose = this.determineBestPurpose(technique.purposes, requestContext);
        if (purpose) {
          recommendations.push(this.createRecommendation(
            key as BreathingTechnique,
            technique,
            purpose,
            context,
            requestContext
          ));
        }
      }
    });

    return recommendations;
  }

  private getTensionSpecificRecommendations(
    tensionAreas: TensionArea[],
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext
  ): ExerciseBreathingRecommendation[] {
    const recommendations: ExerciseBreathingRecommendation[] = [];

    tensionAreas.forEach(area => {
      Object.entries(this.breathingTechniques).forEach(([key, technique]) => {
        if (technique.tensionAreas.includes(area) && technique.contexts.includes(context)) {
          recommendations.push(this.createRecommendation(
            key as BreathingTechnique,
            technique,
            'tension-relief',
            context,
            requestContext,
            `Specifically targets ${area} tension`
          ));
        }
      });
    });

    return recommendations;
  }

  private getGoalSpecificRecommendations(
    goals: ExerciseGoal[],
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext
  ): ExerciseBreathingRecommendation[] {
    const recommendations: ExerciseBreathingRecommendation[] = [];
    const goalToPurposeMap: Record<string, ExerciseBreathingPurpose[]> = {
      'stress-relief': ['stress-relief', 'recovery'],
      'energy-boost': ['energy-boost', 'performance'],
      'endurance': ['endurance', 'performance'],
      'strength': ['strength', 'focus'],
      'flexibility': ['flexibility', 'tension-relief'],
      'pain-management': ['pain-management', 'tension-relief'],
      'mental-health': ['stress-relief', 'mindfulness']
    };

    goals.forEach(goal => {
      const purposes = goalToPurposeMap[goal] || ['performance'];
      purposes.forEach(purpose => {
        Object.entries(this.breathingTechniques).forEach(([key, technique]) => {
          if (technique.purposes.includes(purpose) && technique.contexts.includes(context)) {
            recommendations.push(this.createRecommendation(
              key as BreathingTechnique,
              technique,
              purpose,
              context,
              requestContext,
              `Supports your ${goal} goal`
            ));
          }
        });
      });
    });

    return recommendations;
  }

  private createRecommendation(
    technique: BreathingTechnique,
    techniqueData: typeof this.breathingTechniques[BreathingTechnique],
    purpose: ExerciseBreathingPurpose,
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext,
    customReasoning?: string
  ): ExerciseBreathingRecommendation {
    const duration = requestContext.availableTime
      ? Math.min(techniqueData.duration, requestContext.availableTime)
      : techniqueData.duration;

    return {
      id: `${technique}-${purpose}-${context}-${Date.now()}`,
      technique,
      purpose,
      context,
      duration,
      forExerciseType: requestContext.exerciseType,
      forTensionAreas: requestContext.targetedTensionAreas,
      forIntensityLevel: requestContext.exerciseIntensity,
      title: `${techniqueData.name} for ${purpose.replace('-', ' ')}`,
      description: techniqueData.description,
      instructions: this.generateInstructions(technique, purpose, context),
      benefits: techniqueData.benefits,
      tips: this.generateTips(technique, context, requestContext),
      effectivenessForRecovery: this.calculateEffectiveness(technique, 'recovery', requestContext),
      effectivenessForPerformance: this.calculateEffectiveness(technique, 'performance', requestContext),
      effectivenessForTension: this.calculateEffectiveness(technique, 'tension-relief', requestContext),
      effectivenessForEnergy: this.calculateEffectiveness(technique, 'energy-boost', requestContext),
      bestForExperienceLevel: techniqueData.difficulty,
      requiresEquipment: techniqueData.equipment,
      canBeDoneInGym: !techniqueData.equipment && context !== 'during-exercise',
      priority: this.calculatePriority(technique, purpose, context, requestContext),
      reasoning: customReasoning || this.generateReasoning(technique, purpose, context, requestContext)
    };
  }

  private determineBestPurpose(
    availablePurposes: ExerciseBreathingPurpose[],
    context: ExerciseRecommendationContext
  ): ExerciseBreathingPurpose | null {
    // Prioritize based on context
    if (context.currentEnergyLevel && context.currentEnergyLevel < 5 &&
        availablePurposes.includes('energy-boost')) {
      return 'energy-boost';
    }

    if (context.currentTensionLevel && context.currentTensionLevel > 6 &&
        availablePurposes.includes('tension-relief')) {
      return 'tension-relief';
    }

    if (context.currentFocusLevel && context.currentFocusLevel < 5 &&
        availablePurposes.includes('focus')) {
      return 'focus';
    }

    // Default to first available purpose
    return availablePurposes[0] || null;
  }

  private generateInstructions(
    technique: BreathingTechnique,
    purpose: ExerciseBreathingPurpose,
    context: ExerciseBreathingContext
  ): string[] {
    const baseInstructions: Record<BreathingTechnique, string[]> = {
      'box-breathing': [
        'Sit or stand comfortably with spine straight',
        'Inhale for 4 counts through your nose',
        'Hold your breath for 4 counts',
        'Exhale for 4 counts through your mouth',
        'Hold empty for 4 counts',
        'Repeat for the recommended duration'
      ],
      'coherent-breathing': [
        'Find a comfortable position',
        'Breathe in slowly for 5 counts',
        'Breathe out slowly for 5 counts',
        'Keep the rhythm steady and relaxed',
        'Focus on smooth, even breaths'
      ],
      'wim-hof': [
        'Sit comfortably and take 30 deep breaths',
        'Breathe in fully, breathe out naturally (not forced)',
        'After the 30th breath, exhale and hold',
        'Hold until you feel the urge to breathe',
        'Take a deep breath and hold for 15 seconds',
        'Repeat for 3-4 rounds'
      ],
      'four-seven-eight': [
        'Exhale completely through your mouth',
        'Close your mouth and inhale through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 3-4 times'
      ],
      'breath-of-fire': [
        'Sit with spine straight',
        'Place hands on belly',
        'Breathe rapidly through nose using belly muscles',
        'Focus on sharp exhales, natural inhales',
        'Start with 30 seconds, build up gradually'
      ],
      'extended-exhale': [
        'Breathe in naturally for 4 counts',
        'Exhale slowly for 8 counts',
        'Focus on making exhale longer than inhale',
        'Keep breathing smooth and controlled'
      ],
      'alternate-nostril': [
        'Sit comfortably with spine straight',
        'Use right thumb to close right nostril',
        'Inhale through left nostril',
        'Close left nostril with ring finger, release right',
        'Exhale through right nostril',
        'Continue alternating for recommended time'
      ]
    };

    const instructions = baseInstructions[technique] || [];

    // Add context-specific modifications
    if (context === 'during-exercise' || context === 'between-sets') {
      instructions.unshift('Keep movements minimal to maintain exercise flow');
    }

    if (context === 'pre-exercise') {
      instructions.push('End feeling energized and focused for your workout');
    }

    if (context === 'post-exercise') {
      instructions.push('Allow your body to relax and recover');
    }

    return instructions;
  }

  private generateTips(
    technique: BreathingTechnique,
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext
  ): string[] {
    const baseTips: string[] = [];

    // Context-specific tips
    if (context === 'pre-exercise') {
      baseTips.push('Start 5-10 minutes before your workout');
      baseTips.push('Focus on energizing your body and mind');
    }

    if (context === 'during-exercise' || context === 'between-sets') {
      baseTips.push('Keep breathing sessions short (1-2 minutes)');
      baseTips.push('Don\'t interrupt your workout flow');
    }

    if (context === 'post-exercise') {
      baseTips.push('Allow your heart rate to normalize first');
      baseTips.push('Focus on relaxation and recovery');
    }

    // Technique-specific tips
    if (technique === 'wim-hof') {
      baseTips.push('Never practice this while driving or in water');
      baseTips.push('Some tingling or lightheadedness is normal');
    }

    if (technique === 'breath-of-fire') {
      baseTips.push('Stop if you feel dizzy');
      baseTips.push('Build up duration gradually');
    }

    // Experience level tips
    if (requestContext.experienceLevel === 'beginner') {
      baseTips.push('Start with shorter sessions and build up');
      baseTips.push('Focus on comfort over perfect technique');
    }

    return baseTips.slice(0, 4); // Limit to 4 tips
  }

  private calculateEffectiveness(
    technique: BreathingTechnique,
    purpose: string,
    context: ExerciseRecommendationContext
  ): number {
    const techniqueData = this.breathingTechniques[technique];
    let effectiveness = 3; // Base effectiveness

    // Check if technique is designed for this purpose
    if (techniqueData.purposes.includes(purpose as ExerciseBreathingPurpose)) {
      effectiveness += 1;
    }

    // Adjust based on exercise type compatibility
    if (context.exerciseType && techniqueData.bestForExerciseTypes.includes(context.exerciseType)) {
      effectiveness += 1;
    }

    // Adjust based on intensity compatibility
    if (context.exerciseIntensity && techniqueData.bestForIntensity.includes(context.exerciseIntensity)) {
      effectiveness += 0.5;
    }

    // Cap at 5
    return Math.min(5, Math.max(1, effectiveness));
  }

  private calculatePriority(
    technique: BreathingTechnique,
    purpose: ExerciseBreathingPurpose,
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext
  ): 'low' | 'medium' | 'high' | 'urgent' {
    let score = 0;

    // High tension = urgent
    if (requestContext.currentTensionLevel && requestContext.currentTensionLevel > 8) {
      return 'urgent';
    }

    // Context appropriateness
    const techniqueData = this.breathingTechniques[technique];
    if (techniqueData.contexts.includes(context)) score += 2;
    if (techniqueData.purposes.includes(purpose)) score += 2;

    // Exercise compatibility
    if (requestContext.exerciseType && techniqueData.bestForExerciseTypes.includes(requestContext.exerciseType)) {
      score += 1;
    }

    // User state
    if (requestContext.currentEnergyLevel && requestContext.currentEnergyLevel < 4 && purpose === 'energy-boost') {
      score += 2;
    }

    if (requestContext.currentTensionLevel && requestContext.currentTensionLevel > 6 && purpose === 'tension-relief') {
      score += 2;
    }

    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  private generateReasoning(
    technique: BreathingTechnique,
    purpose: ExerciseBreathingPurpose,
    context: ExerciseBreathingContext,
    requestContext: ExerciseRecommendationContext
  ): string {
    const reasons: string[] = [];

    const techniqueData = this.breathingTechniques[technique];

    // Context reasoning
    if (context === 'pre-exercise') {
      reasons.push('ideal for pre-workout preparation');
    } else if (context === 'post-exercise') {
      reasons.push('excellent for post-workout recovery');
    } else if (context === 'during-exercise') {
      reasons.push('can be used during exercise');
    }

    // Exercise type compatibility
    if (requestContext.exerciseType && techniqueData.bestForExerciseTypes.includes(requestContext.exerciseType)) {
      reasons.push(`particularly effective for ${requestContext.exerciseType}`);
    }

    // State-based reasoning
    if (requestContext.currentTensionLevel && requestContext.currentTensionLevel > 6) {
      reasons.push('helps release physical tension');
    }

    if (requestContext.currentEnergyLevel && requestContext.currentEnergyLevel < 5 && purpose === 'energy-boost') {
      reasons.push('boosts energy levels naturally');
    }

    // Technique benefits
    if (techniqueData.benefits.length > 0) {
      reasons.push(techniqueData.benefits[0].toLowerCase());
    }

    return reasons.length > 0
      ? `Recommended because it's ${reasons.join(', ')}`
      : `${techniqueData.name} is effective for ${purpose.replace('-', ' ')}`;
  }

  private removeDuplicatesAndPrioritize(
    recommendations: ExerciseBreathingRecommendation[]
  ): ExerciseBreathingRecommendation[] {
    // Remove duplicates based on technique
    const seen = new Set<string>();
    const unique = recommendations.filter(rec => {
      const key = `${rec.technique}-${rec.purpose}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return unique.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  private personalizeRecommendations(
    recommendations: ExerciseBreathingRecommendation[],
    userPreferences: EnhancedExerciseMovement,
    context: ExerciseRecommendationContext
  ): ExerciseBreathingRecommendation[] {
    return recommendations.map(rec => {
      // Adjust for experience level
      if (context.experienceLevel === 'beginner' && rec.bestForExperienceLevel === 'advanced') {
        rec.priority = 'low';
        rec.reasoning += ' (Advanced technique - consider building up to this)';
      }

      // Adjust for available time
      if (context.availableTime && rec.duration > context.availableTime) {
        rec.duration = context.availableTime;
        rec.reasoning += ` (Shortened to fit ${context.availableTime} minutes)`;
      }

      // Adjust for gym environment
      if (context.gymEnvironment && !rec.canBeDoneInGym) {
        rec.priority = 'low';
        rec.reasoning += ' (May be difficult in gym environment)';
      }

      return rec;
    });
  }

  private prioritizeByEffectiveness(
    recommendations: ExerciseBreathingRecommendation[],
    metric: 'recovery' | 'performance' | 'tension' | 'energy'
  ): ExerciseBreathingRecommendation[] {
    const metricMap = {
      recovery: 'effectivenessForRecovery',
      performance: 'effectivenessForPerformance',
      tension: 'effectivenessForTension',
      energy: 'effectivenessForEnergy'
    };

    const key = metricMap[metric] as keyof ExerciseBreathingRecommendation;
    return recommendations.sort((a, b) => (b[key] as number) - (a[key] as number));
  }

  private prioritizeByContext(
    recommendations: ExerciseBreathingRecommendation[],
    context: ExerciseRecommendationContext
  ): ExerciseBreathingRecommendation[] {
    return recommendations.sort((a, b) => {
      let scoreA = 0, scoreB = 0;

      // Prioritize based on current needs
      if (context.currentTensionLevel && context.currentTensionLevel > 6) {
        scoreA += a.effectivenessForTension;
        scoreB += b.effectivenessForTension;
      }

      if (context.currentEnergyLevel && context.currentEnergyLevel < 5) {
        scoreA += a.effectivenessForEnergy;
        scoreB += b.effectivenessForEnergy;
      }

      return scoreB - scoreA;
    });
  }
}