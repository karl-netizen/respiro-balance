import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
  BreathingTechnique,
  WorkStressor,
  StressfulTime,
  WorkBreathingSession
} from '@/types/workLifeBalance';

export class BreathingRecommendationEngine {
  private preferences: EnhancedWorkLifePreferences;
  private sessionHistory: WorkBreathingSession[];

  constructor(preferences: EnhancedWorkLifePreferences, sessionHistory: WorkBreathingSession[] = []) {
    this.preferences = preferences;
    this.sessionHistory = sessionHistory;
  }

  /**
   * Gets personalized breathing recommendations based on current context
   */
  getRecommendations(context: {
    currentTime?: Date;
    detectedStressors?: WorkStressor[];
    currentStressLevel?: number; // 1-10 scale
    timeUntilNextMeeting?: number; // minutes
    workloadLevel?: 'light' | 'moderate' | 'heavy';
    userRequested?: boolean;
    reportedPhysicalSymptoms?: string[]; // NEW: Physical symptoms user is experiencing
    currentGoalFocus?: string; // NEW: What goal user wants to focus on right now
  } = {}): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const now = context.currentTime || new Date();

    // Core context-aware recommendations
    recommendations.push(...this.getTimeBasedRecommendations(now, context));
    recommendations.push(...this.getStressorBasedRecommendations(context.detectedStressors || []));
    recommendations.push(...this.getWorkloadBasedRecommendations(context.workloadLevel || 'moderate'));
    recommendations.push(...this.getMeetingBasedRecommendations(context.timeUntilNextMeeting));

    // NEW: Health and goal-based recommendations
    recommendations.push(...this.getHealthBasedRecommendations(context));
    recommendations.push(...this.getGoalBasedRecommendations(context));
    recommendations.push(...this.getStressLevelBasedRecommendations(context.currentStressLevel));

    // Apply user preferences and personalization
    const filtered = this.filterByPreferences(recommendations);
    const personalized = this.personalizeWithHistory(filtered);
    const goalAligned = this.alignWithWellnessGoals(personalized, context.currentGoalFocus);

    // Sort by priority and relevance
    return goalAligned.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Get recommendations based on time of day
   */
  private getTimeBasedRecommendations(
    currentTime: Date,
    context: any
  ): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const hour = currentTime.getHours();

    // Early morning energy boost
    if (hour >= 7 && hour <= 9 && this.preferences.energyPatterns?.morningEnergy === 'low') {
      recommendations.push({
        id: `morning-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'coherent-breathing',
        duration: this.getPreferredDuration(),
        reasoning: 'Start your day with energizing rhythmic breathing to boost morning alertness',
        priority: 'medium',
        context: {
          timeOfDay: 'morning',
          workloadLevel: context.workloadLevel,
        },
      });
    }

    // Pre-lunch focus maintenance
    if (hour >= 11 && hour <= 12) {
      recommendations.push({
        id: `prelunch-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'box-breathing',
        duration: Math.min(this.getPreferredDuration(), 3),
        reasoning: 'Maintain focus and clarity before your lunch break',
        priority: 'low',
        context: {
          timeOfDay: 'pre-lunch',
        },
      });
    }

    // Post-lunch energy dip
    if (hour >= 13 && hour <= 15 && this.preferences.energyPatterns?.afternoonDip) {
      recommendations.push({
        id: `postlunch-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'physiological-sigh',
        duration: 2,
        reasoning: 'Combat the afternoon energy dip with alerting breath work',
        priority: 'high',
        context: {
          timeOfDay: 'afternoon',
        },
      });
    }

    // End of day transition
    if (hour >= 16 && hour <= 18) {
      recommendations.push({
        id: `endday-${Date.now()}`,
        triggerType: 'scheduled',
        suggestedTechnique: 'four-seven-eight',
        duration: this.getPreferredDuration(),
        reasoning: 'Prepare for the transition from work to personal time',
        priority: 'medium',
        context: {
          timeOfDay: 'end-of-day',
        },
      });
    }

    return recommendations;
  }

  /**
   * Get recommendations based on detected stressors
   */
  private getStressorBasedRecommendations(detectedStressors: WorkStressor[]): BreakRecommendation[] {
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
  private getWorkloadBasedRecommendations(workloadLevel: 'light' | 'moderate' | 'heavy'): BreakRecommendation[] {
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
  private getMeetingBasedRecommendations(timeUntilNextMeeting?: number): BreakRecommendation[] {
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
   * Get recommendations based on reported physical symptoms
   */
  private getHealthBasedRecommendations(context: any): BreakRecommendation[] {
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
   * Get recommendations based on wellness goals
   */
  private getGoalBasedRecommendations(context: any): BreakRecommendation[] {
    const recommendations: BreakRecommendation[] = [];
    const wellnessGoals = this.preferences.wellnessGoals;

    if (!wellnessGoals) return recommendations;

    // Prioritize current goal focus if specified
    const focusGoal = context.currentGoalFocus;
    const goalsToConsider = focusGoal ? [focusGoal] : wellnessGoals.primaryGoals;

    goalsToConsider.forEach(goal => {
      switch (goal) {
        case 'reduce-stress':
          recommendations.push({
            id: `goal-stress-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'four-seven-eight',
            duration: this.getPreferredDuration(),
            reasoning: 'Working toward your stress reduction goal',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'improve-focus':
          recommendations.push({
            id: `goal-focus-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'box-breathing',
            duration: this.getPreferredDuration(),
            reasoning: 'Building focus and concentration abilities',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'better-sleep':
          if (this.getCurrentTimeOfDay() === 'evening') {
            recommendations.push({
              id: `goal-sleep-${Date.now()}`,
              triggerType: 'scheduled',
              suggestedTechnique: 'four-seven-eight',
              duration: 5,
              reasoning: 'Evening practice for better sleep preparation',
              priority: 'medium',
              context: {
                timeOfDay: this.getCurrentTimeOfDay(),
              },
            });
          }
          break;

        case 'increase-energy':
          if (this.getCurrentTimeOfDay() === 'morning' || this.getCurrentTimeOfDay() === 'afternoon') {
            recommendations.push({
              id: `goal-energy-${Date.now()}`,
              triggerType: 'scheduled',
              suggestedTechnique: 'coherent-breathing',
              duration: 3,
              reasoning: 'Energizing breath work to boost vitality',
              priority: 'medium',
              context: {
                timeOfDay: this.getCurrentTimeOfDay(),
              },
            });
          }
          break;

        case 'anxiety-management':
          recommendations.push({
            id: `goal-anxiety-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'physiological-sigh',
            duration: 2,
            reasoning: 'Quick anxiety relief with calming breath technique',
            priority: 'high',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;

        case 'athletic-performance':
          recommendations.push({
            id: `goal-performance-${Date.now()}`,
            triggerType: 'user-requested',
            suggestedTechnique: 'tactical-breathing',
            duration: 3,
            reasoning: 'Performance breathing for optimal mind-body state',
            priority: 'medium',
            context: {
              timeOfDay: this.getCurrentTimeOfDay(),
            },
          });
          break;
      }
    });

    return recommendations;
  }

  /**
   * Get recommendations based on specific stress level
   */
  private getStressLevelBasedRecommendations(currentStressLevel?: number): BreakRecommendation[] {
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
   * Align recommendations with user's wellness goals
   */
  private alignWithWellnessGoals(
    recommendations: BreakRecommendation[],
    currentGoalFocus?: string
  ): BreakRecommendation[] {
    const wellnessGoals = this.preferences.wellnessGoals;
    if (!wellnessGoals) return recommendations;

    return recommendations.map(rec => {
      // Boost priority if recommendation aligns with primary goals
      const primaryGoals = wellnessGoals.primaryGoals;
      const isAlignedWithPrimaryGoal = this.isRecommendationAlignedWithGoal(rec, primaryGoals);

      if (isAlignedWithPrimaryGoal) {
        // Boost priority
        if (rec.priority === 'low') rec.priority = 'medium';
        else if (rec.priority === 'medium') rec.priority = 'high';

        rec.reasoning += ' (Aligned with your primary wellness goals)';
      }

      // Extra boost if it matches current focus goal
      if (currentGoalFocus && this.isRecommendationAlignedWithGoal(rec, [currentGoalFocus as any])) {
        rec.priority = 'high';
        rec.reasoning = rec.reasoning.replace(' (Aligned with your primary wellness goals)', '');
        rec.reasoning += ` (Supporting your focus on ${currentGoalFocus.replace('-', ' ')})`;
      }

      return rec;
    });
  }

  /**
   * Check if recommendation aligns with wellness goals
   */
  private isRecommendationAlignedWithGoal(
    recommendation: BreakRecommendation,
    goals: any[]
  ): boolean {
    const technique = recommendation.suggestedTechnique;
    const reasoning = recommendation.reasoning.toLowerCase();

    return goals.some(goal => {
      switch (goal) {
        case 'reduce-stress':
          return ['four-seven-eight', 'physiological-sigh'].includes(technique) ||
                 reasoning.includes('stress') || reasoning.includes('calm');

        case 'improve-focus':
          return ['box-breathing', 'tactical-breathing'].includes(technique) ||
                 reasoning.includes('focus') || reasoning.includes('concentration');

        case 'better-sleep':
          return ['four-seven-eight', 'belly-breathing'].includes(technique) ||
                 reasoning.includes('sleep') || reasoning.includes('evening');

        case 'increase-energy':
          return ['coherent-breathing', 'quick-coherence'].includes(technique) ||
                 reasoning.includes('energy') || reasoning.includes('alertness');

        case 'anxiety-management':
          return ['physiological-sigh', 'four-seven-eight'].includes(technique) ||
                 reasoning.includes('anxiety') || reasoning.includes('calm');

        default:
          return false;
      }
    });
  }

  /**
   * Filter recommendations based on user preferences
   */
  private filterByPreferences(recommendations: BreakRecommendation[]): BreakRecommendation[] {
    return recommendations.filter(rec => {
      // Check if technique is in user's preferred list
      const preferredTechniques = this.preferences.breathingPreferences?.preferredTechniques || [];
      if (preferredTechniques.length > 0 && !preferredTechniques.includes(rec.suggestedTechnique)) {
        // Replace with preferred technique
        rec.suggestedTechnique = this.getClosestPreferredTechnique(rec.suggestedTechnique);
      }

      // Adjust duration based on preferred break length
      rec.duration = this.adjustDurationToPreference(rec.duration);

      return true;
    });
  }

  /**
   * Personalize recommendations based on session history
   */
  private personalizeWithHistory(recommendations: BreakRecommendation[]): BreakRecommendation[] {
    return recommendations.map(rec => {
      // Find similar past sessions
      const similarSessions = this.sessionHistory.filter(session =>
        session.technique === rec.suggestedTechnique &&
        session.trigger.type === rec.triggerType
      );

      if (similarSessions.length > 0) {
        // Calculate average effectiveness
        const avgEffectiveness = similarSessions.reduce((sum, session) =>
          sum + (session.effectiveness || 3), 0) / similarSessions.length;

        // Adjust priority based on past effectiveness
        if (avgEffectiveness >= 4) {
          rec.priority = rec.priority === 'low' ? 'medium' : 'high';
          rec.reasoning += ' (This technique has worked well for you before)';
        } else if (avgEffectiveness <= 2) {
          rec.priority = 'low';
          // Suggest alternative technique
          rec.suggestedTechnique = this.getAlternativeTechnique(rec.suggestedTechnique);
          rec.reasoning += ' (Trying a different approach based on your feedback)';
        }
      }

      return rec;
    });
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
   * Adjust recommendation duration to user preference
   */
  private adjustDurationToPreference(suggestedDuration: number): number {
    const preferred = this.getPreferredDuration();

    if (this.preferences.preferredBreakLength === 'flexible') {
      return suggestedDuration; // Keep original suggestion
    }

    // Don't exceed preferred duration by more than 50%
    return Math.min(suggestedDuration, Math.ceil(preferred * 1.5));
  }

  /**
   * Find closest technique from user's preferred list
   */
  private getClosestPreferredTechnique(original: BreathingTechnique): BreathingTechnique {
    const preferred = this.preferences.breathingPreferences?.preferredTechniques || [];

    if (preferred.length === 0) return original;

    // Technique similarity mapping
    const similarityMap: Record<BreathingTechnique, BreathingTechnique[]> = {
      'box-breathing': ['coherent-breathing', 'tactical-breathing'],
      'coherent-breathing': ['box-breathing', 'belly-breathing'],
      'four-seven-eight': ['triangular-breathing', 'physiological-sigh'],
      'physiological-sigh': ['four-seven-eight', 'quick-coherence'],
      'tactical-breathing': ['box-breathing', 'coherent-breathing'],
      'quick-coherence': ['coherent-breathing', 'physiological-sigh'],
      'belly-breathing': ['coherent-breathing', 'box-breathing'],
      'triangular-breathing': ['four-seven-eight', 'box-breathing'],
      'alternate-nostril': ['belly-breathing', 'coherent-breathing'],
    };

    // First, check if original is preferred
    if (preferred.includes(original)) return original;

    // Then check similar techniques
    const similar = similarityMap[original] || [];
    for (const technique of similar) {
      if (preferred.includes(technique)) return technique;
    }

    // Fallback to first preferred technique
    return preferred[0];
  }

  /**
   * Get alternative technique for low-performing ones
   */
  private getAlternativeTechnique(original: BreathingTechnique): BreathingTechnique {
    const alternatives: Record<BreathingTechnique, BreathingTechnique> = {
      'box-breathing': 'coherent-breathing',
      'coherent-breathing': 'box-breathing',
      'four-seven-eight': 'physiological-sigh',
      'physiological-sigh': 'quick-coherence',
      'tactical-breathing': 'box-breathing',
      'quick-coherence': 'coherent-breathing',
      'belly-breathing': 'coherent-breathing',
      'triangular-breathing': 'box-breathing',
      'alternate-nostril': 'belly-breathing',
    };

    return alternatives[original] || 'box-breathing';
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

  /**
   * Log a completed session for learning
   */
  public recordSession(session: WorkBreathingSession): void {
    this.sessionHistory.push(session);

    // Keep only recent sessions for performance (last 100)
    if (this.sessionHistory.length > 100) {
      this.sessionHistory = this.sessionHistory.slice(-100);
    }
  }

  /**
   * Get effectiveness analytics for user feedback
   */
  public getEffectivenessAnalytics(): {
    totalSessions: number;
    averageEffectiveness: number;
    mostEffectiveTechnique: BreathingTechnique | null;
    leastEffectiveTechnique: BreathingTechnique | null;
    improvementTrend: 'improving' | 'stable' | 'declining';
  } {
    if (this.sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        averageEffectiveness: 0,
        mostEffectiveTechnique: null,
        leastEffectiveTechnique: null,
        improvementTrend: 'stable',
      };
    }

    const sessions = this.sessionHistory.filter(s => s.effectiveness !== undefined);
    const totalSessions = sessions.length;
    const averageEffectiveness = sessions.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / totalSessions;

    // Find most/least effective techniques
    const techniqueEffectiveness: Record<string, { total: number; count: number }> = {};

    sessions.forEach(session => {
      const technique = session.technique;
      if (!techniqueEffectiveness[technique]) {
        techniqueEffectiveness[technique] = { total: 0, count: 0 };
      }
      techniqueEffectiveness[technique].total += session.effectiveness || 0;
      techniqueEffectiveness[technique].count++;
    });

    const averages = Object.entries(techniqueEffectiveness).map(([technique, data]) => ({
      technique: technique as BreathingTechnique,
      average: data.total / data.count,
    }));

    averages.sort((a, b) => b.average - a.average);

    // Determine improvement trend (last 10 vs previous 10)
    let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (sessions.length >= 20) {
      const recent = sessions.slice(-10);
      const previous = sessions.slice(-20, -10);

      const recentAvg = recent.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / recent.length;
      const previousAvg = previous.reduce((sum, s) => sum + (s.effectiveness || 0), 0) / previous.length;

      if (recentAvg > previousAvg + 0.3) improvementTrend = 'improving';
      else if (recentAvg < previousAvg - 0.3) improvementTrend = 'declining';
    }

    return {
      totalSessions,
      averageEffectiveness,
      mostEffectiveTechnique: averages[0]?.technique || null,
      leastEffectiveTechnique: averages[averages.length - 1]?.technique || null,
      improvementTrend,
    };
  }
}