// ===================================================================
// AI-POWERED PERSONALIZATION ENGINE FOR RESPIRO BALANCE
// ===================================================================

import { Result, Ok, Err } from '../advanced-patterns';
import {
  PersonalizationProfileId,
  SessionRecommendationId,
  UserBehaviorData,
  SessionActivity,
  SessionRecommendation,
  ContextAnalysis,
  ModelWeights,
  MoodEntry,
  PersonalGoal,
  SessionFeedback,
  PersonalizedElement
} from './types';

export class AIPersonalizationEngine {
  private userProfile: UserBehaviorData | null = null;
  private modelWeights: ModelWeights;
  private learningRate: number = 0.01;

  constructor() {
    this.modelWeights = this.initializeModelWeights();
  }

  // Initialize the AI model with default weights
  private initializeModelWeights(): ModelWeights {
    return {
      moodInfluence: 0.3,
      timeOfDayInfluence: 0.25,
      sessionHistoryInfluence: 0.2,
      biometricInfluence: 0.15,
      contextualInfluence: 0.1,
      personalPreferences: {
        sessionType: 0.4,
        duration: 0.3,
        difficulty: 0.2,
        audioPreference: 0.1,
      },
      goalAlignment: 0.35,
      adaptationSpeed: 0.15, // How quickly to adapt to new patterns
    };
  }

  async loadUserProfile(userId: string): Promise<Result<UserBehaviorData, string>> {
    try {
      const response = await fetch(`/api/personalization/profile/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return new Err('Failed to load user profile');
      }

      const profileData = await response.json();
      this.userProfile = profileData;
      
      return new Ok(profileData);
    } catch (error) {
      return new Err('Network error loading profile');
    }
  }

  async generateRecommendations(
    count: number = 5,
    context?: {
      currentMood?: number;
      availableTime?: number;
      currentStress?: number;
      immediateGoal?: string;
    }
  ): Promise<Result<SessionRecommendation[], string>> {
    if (!this.userProfile) {
      return new Err('User profile not loaded');
    }

    try {
      const currentContext = await this.analyzeCurrentContext(context);
      const recommendations = await this.generatePersonalizedRecommendations(
        currentContext,
        count
      );

      // Sort by confidence score
      recommendations.sort((a, b) => b.confidence - a.confidence);

      return new Ok(recommendations);
    } catch (error) {
      return new Err('Failed to generate recommendations');
    }
  }

  private async analyzeCurrentContext(context?: any): Promise<ContextAnalysis> {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay();

    // Analyze recent patterns
    const recentSessions = this.userProfile!.sessionHistory
      .filter(s => new Date(s.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
      .slice(-10);

    const recentMoods = this.userProfile!.moodHistory
      .filter(m => new Date(m.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000);

    const averageRecentMood = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + m.overallMood, 0) / recentMoods.length
      : 5;

    const preferredTimeMatch = this.calculateTimePreferenceMatch(currentHour);
    const stressLevel = this.estimateCurrentStressLevel(recentMoods, context);
    const energyLevel = this.estimateEnergyLevel(currentHour, recentMoods);

    return {
      currentMood: context?.currentMood || averageRecentMood,
      timeOfDay: this.categorizeTimeOfDay(currentHour),
      dayOfWeek,
      stressLevel,
      energyLevel,
      availableTime: context?.availableTime || this.estimateAvailableTime(currentHour),
      recentSessionPatterns: this.analyzeRecentPatterns(recentSessions),
      preferredTimeMatch,
      immediateGoal: context?.immediateGoal,
    };
  }

  private async generatePersonalizedRecommendations(
    context: ContextAnalysis,
    count: number
  ): Promise<SessionRecommendation[]> {
    const recommendations: SessionRecommendation[] = [];
    const sessionTypes: SessionActivity['sessionType'][] = [
      'meditation', 'breathing', 'focus', 'sleep', 'stress_relief'
    ];

    for (const sessionType of sessionTypes) {
      if (recommendations.length >= count) break;

      const recommendation = await this.generateSessionRecommendation(
        sessionType,
        context
      );

      if (recommendation.confidence > 0.3) { // Only include confident recommendations
        recommendations.push(recommendation);
      }
    }

    // Generate additional recommendations if needed
    while (recommendations.length < count) {
      const fallbackType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const fallback = await this.generateSessionRecommendation(fallbackType, context);
      recommendations.push(fallback);
    }

    return recommendations;
  }

  private async generateSessionRecommendation(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): Promise<SessionRecommendation> {
    const baseRecommendation = await this.getBaseSessionTemplate(sessionType);
    
    // Personalize based on user data
    const personalizedDuration = this.calculateOptimalDuration(sessionType, context);
    const personalizedDifficulty = this.calculateOptimalDifficulty(sessionType, context);
    const personalizedGuide = await this.selectOptimalGuide(sessionType, context);
    const personalizedBackground = this.selectOptimalBackground(sessionType, context);

    // Calculate confidence based on multiple factors
    const confidence = this.calculateRecommendationConfidence(sessionType, context);

    // Generate reasoning
    const reasoning = this.generateRecommendationReasoning(
      sessionType,
      context,
      personalizedDuration,
      personalizedDifficulty
    );

    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as SessionRecommendationId,
      sessionType,
      title: this.generatePersonalizedTitle(sessionType, context),
      description: this.generatePersonalizedDescription(sessionType, context),
      duration: personalizedDuration,
      difficulty: personalizedDifficulty,
      audioGuide: personalizedGuide,
      backgroundSound: personalizedBackground,
      confidence,
      reasoning,
      personalizedElements: [
        {
          type: 'duration',
          value: personalizedDuration,
          reason: `Optimized for your ${context.availableTime} minute availability and current energy level`
        },
        {
          type: 'difficulty',
          value: personalizedDifficulty,
          reason: `Matched to your experience level and current stress state`
        },
        {
          type: 'timing',
          value: context.timeOfDay,
          reason: `Perfect for ${context.timeOfDay} sessions based on your history`
        }
      ],
      expectedBenefit: this.calculateExpectedBenefits(sessionType, context),
      tags: this.generatePersonalizedTags(sessionType, context)
    };
  }

  private calculateOptimalDuration(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): number {
    const userPreferred = this.userProfile!.preferenceData.preferredSessionLength;
    const averagePreferred = userPreferred.reduce((sum, len) => sum + len, 0) / userPreferred.length;
    
    // Adjust based on available time and energy
    let optimalDuration = Math.min(averagePreferred, context.availableTime);
    
    // Adjust based on stress level (higher stress = shorter sessions initially)
    if (context.stressLevel > 7) {
      optimalDuration = Math.min(optimalDuration, 10);
    }
    
    // Adjust based on energy level
    if (context.energyLevel < 4) {
      optimalDuration = Math.min(optimalDuration, 15);
    }
    
    // Session type adjustments
    const typeAdjustments = {
      breathing: 0.7, // Breathing exercises tend to be shorter
      focus: 1.2, // Focus sessions can be longer
      sleep: 1.5, // Sleep sessions are typically longer
      meditation: 1.0,
      stress_relief: 0.8,
    };
    
    return Math.round(optimalDuration * typeAdjustments[sessionType]);
  }

  private calculateOptimalDifficulty(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): SessionActivity['difficulty'] {
    const userHistory = this.userProfile!.sessionHistory
      .filter(s => s.sessionType === sessionType)
      .slice(-10);

    if (userHistory.length === 0) return 'beginner';

    const averageCompletion = userHistory.reduce((sum, s) => sum + s.completionRate, 0) / userHistory.length;
    const averageRating = userHistory.reduce((sum, s) => sum + s.userRating, 0) / userHistory.length;

    // High completion rate and rating = can handle more difficulty
    if (averageCompletion > 0.85 && averageRating >= 4) {
      return context.stressLevel > 8 ? 'intermediate' : 'advanced';
    } else if (averageCompletion > 0.7 && averageRating >= 3) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  private async selectOptimalGuide(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): Promise<string> {
    const favoriteGuides = this.userProfile!.preferenceData.favoriteGuides;
    
    if (favoriteGuides.length > 0) {
      // Select from favorites based on session type and context
      const suitableGuides = await this.filterGuidesByContext(favoriteGuides, sessionType, context);
      if (suitableGuides.length > 0) {
        return suitableGuides[0]; // Return most suitable
      }
    }

    // Fallback to optimal guide selection algorithm
    return this.getOptimalGuideForContext(sessionType, context);
  }

  private selectOptimalBackground(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): string {
    const preference = this.userProfile!.preferenceData.backgroundSoundPreference;
    
    if (preference === 'adaptive') {
      // AI selects based on context
      if (context.stressLevel > 7) return 'nature_calm';
      if (context.energyLevel < 4) return 'gentle_ambient';
      if (sessionType === 'focus') return 'minimal_focus';
      return 'nature_default';
    }
    
    return preference;
  }

  private calculateRecommendationConfidence(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on historical data
    const relevantHistory = this.userProfile!.sessionHistory
      .filter(s => s.sessionType === sessionType);

    if (relevantHistory.length > 5) {
      confidence += 0.2;
    }
    if (relevantHistory.length > 15) {
      confidence += 0.1;
    }

    // Adjust based on time preference match
    confidence += context.preferredTimeMatch * 0.2;

    // Adjust based on recent success with similar sessions
    const recentSimilar = relevantHistory
      .slice(-5)
      .filter(s => s.completionRate > 0.8 && s.userRating >= 4);
    
    confidence += (recentSimilar.length / 5) * 0.15;

    // Cap at 0.95 to maintain some uncertainty
    return Math.min(confidence, 0.95);
  }

  private generateRecommendationReasoning(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis,
    duration: number,
    difficulty: SessionActivity['difficulty']
  ): string[] {
    const reasoning: string[] = [];

    // Time-based reasoning
    if (context.preferredTimeMatch > 0.7) {
      reasoning.push(`Perfect timing - you usually meditate during ${context.timeOfDay}`);
    }

    // Mood-based reasoning
    if (context.currentMood < 5) {
      reasoning.push(`Designed to help improve your current mood and energy levels`);
    }

    // Stress-based reasoning
    if (context.stressLevel > 6) {
      reasoning.push(`Specially selected for stress relief and relaxation`);
    }

    // Experience-based reasoning
    const sessionCount = this.userProfile!.sessionHistory
      .filter(s => s.sessionType === sessionType).length;
    
    if (sessionCount > 10) {
      reasoning.push(`Matched to your ${difficulty} experience level with ${sessionType} sessions`);
    }

    // Goal alignment reasoning
    const relevantGoals = this.userProfile!.preferenceData.goals
      .filter(g => this.isGoalRelevantToSession(g.type, sessionType));
    
    if (relevantGoals.length > 0) {
      reasoning.push(`Aligned with your ${relevantGoals[0].type.replace('_', ' ')} goals`);
    }

    return reasoning;
  }

  private calculateExpectedBenefits(
    sessionType: SessionActivity['sessionType'],
    context: ContextAnalysis
  ): SessionRecommendation['expectedBenefit'] {
    // Base benefits by session type
    const baseBenefits = {
      meditation: { mood: 6, stress: 7, focus: 5 },
      breathing: { mood: 5, stress: 8, focus: 4 },
      focus: { mood: 4, stress: 5, focus: 9 },
      sleep: { mood: 7, stress: 8, focus: 3 },
      stress_relief: { mood: 8, stress: 9, focus: 4 },
    };

    const base = baseBenefits[sessionType];

    // Adjust based on user's current state
    let moodImprovement = base.mood;
    let stressReduction = base.stress;
    let focusImprovement = base.focus;

    // Lower mood = higher potential improvement
    if (context.currentMood < 5) {
      moodImprovement = Math.min(moodImprovement + 2, 10);
    }

    // Higher stress = better stress reduction potential
    if (context.stressLevel > 6) {
      stressReduction = Math.min(stressReduction + 1, 10);
    }

    // Lower energy during work hours = better focus potential
    if (context.energyLevel < 5 && (context.timeOfDay === 'morning' || context.timeOfDay === 'afternoon')) {
      focusImprovement = Math.min(focusImprovement + 1, 10);
    }

    return {
      moodImprovement,
      stressReduction,
      focusImprovement,
    };
  }

  // Learning and adaptation methods
  async recordSessionFeedback(
    recommendationId: SessionRecommendationId,
    actualSession: SessionActivity,
    userFeedback: SessionFeedback
  ): Promise<void> {
    // Update model weights based on feedback
    await this.updateModelWeights(recommendationId, actualSession, userFeedback);
    
    // Store feedback for future learning
    await this.storeFeedback(recommendationId, userFeedback);
  }

  private async updateModelWeights(
    recommendationId: SessionRecommendationId,
    session: SessionActivity,
    feedback: SessionFeedback
  ): Promise<void> {
    // Simple gradient descent-like update
    const learningSignal = this.calculateLearningSignal(feedback);
    
    // Update weights based on what worked/didn't work
    if (learningSignal > 0) {
      // Positive feedback - reinforce these patterns
      this.modelWeights.moodInfluence += this.learningRate * 0.1;
      this.modelWeights.timeOfDayInfluence += this.learningRate * 0.1;
    } else {
      // Negative feedback - reduce confidence in these patterns
      this.modelWeights.moodInfluence -= this.learningRate * 0.05;
      this.modelWeights.timeOfDayInfluence -= this.learningRate * 0.05;
    }

    // Ensure weights stay in valid ranges
    this.normalizeWeights();
  }

  private calculateLearningSignal(feedback: SessionFeedback): number {
    // Combine multiple feedback signals
    let signal = 0;
    
    signal += (feedback.rating - 3) * 0.4; // Rating contribution
    signal += feedback.completed ? 0.3 : -0.3; // Completion contribution
    signal += feedback.helpful ? 0.3 : -0.3; // Helpfulness contribution
    
    return signal;
  }

  private normalizeWeights(): void {
    // Ensure all weights sum to 1 and stay positive
    const totalWeight = Object.values(this.modelWeights).reduce((sum: number, weight: any) => {
      return sum + (typeof weight === 'number' ? weight : 0);
    }, 0);

    if (totalWeight > 0) {
      for (const key in this.modelWeights) {
        const weight = this.modelWeights[key as keyof ModelWeights];
        if (typeof weight === 'number') {
          this.modelWeights[key as keyof ModelWeights] = Math.max(0.01, weight / totalWeight) as any;
        }
      }
    }
  }

  // Helper methods
  private categorizeTimeOfDay(hour: number): ContextAnalysis['timeOfDay'] {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private calculateTimePreferenceMatch(currentHour: number): number {
    const preferredTimes = this.userProfile!.preferenceData.preferredTimes;
    const currentTimeCategory = this.categorizeTimeOfDay(currentHour);
    
    return preferredTimes.includes(currentTimeCategory) ? 1.0 : 0.3;
  }

  private estimateCurrentStressLevel(recentMoods: MoodEntry[], context?: any): number {
    if (context?.currentStress) return context.currentStress;
    
    if (recentMoods.length === 0) return 5; // Default neutral
    
    const avgStress = recentMoods.reduce((sum, m) => sum + m.stress, 0) / recentMoods.length;
    return avgStress;
  }

  private estimateEnergyLevel(hour: number, recentMoods: MoodEntry[]): number {
    // Typical energy patterns throughout the day
    const energyCurve: Record<number, number> = {
      6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 7, 12: 6,
      13: 5, 14: 4, 15: 5, 16: 6, 17: 7, 18: 6, 19: 5,
      20: 4, 21: 3, 22: 2, 23: 2, 0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 3
    };

    let baseEnergy = energyCurve[hour] || 5;

    // Adjust based on recent mood data
    if (recentMoods.length > 0) {
      const avgEnergy = recentMoods.reduce((sum, m) => sum + m.energy, 0) / recentMoods.length;
      baseEnergy = (baseEnergy + avgEnergy) / 2;
    }

    return Math.round(baseEnergy);
  }

  private estimateAvailableTime(hour: number): number {
    // Estimate available time based on typical schedules
    if (hour >= 7 && hour <= 9) return 10; // Morning routine
    if (hour >= 12 && hour <= 13) return 15; // Lunch break
    if (hour >= 17 && hour <= 19) return 20; // Evening
    if (hour >= 20 && hour <= 22) return 30; // Night relaxation
    return 15; // Default
  }

  private analyzeRecentPatterns(recentSessions: SessionActivity[]): any {
    if (recentSessions.length === 0) return {};

    return {
      averageCompletion: recentSessions.reduce((sum, s) => sum + s.completionRate, 0) / recentSessions.length,
      averageRating: recentSessions.reduce((sum, s) => sum + s.userRating, 0) / recentSessions.length,
      mostCommonType: this.getMostFrequent(recentSessions.map(s => s.sessionType)),
      averageDuration: recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length,
    };
  }

  private getMostFrequent<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    
    const frequency: Record<string, number> = {};
    let maxCount = 0;
    let mostFrequent: T = array[0];

    array.forEach(item => {
      const key = String(item);
      frequency[key] = (frequency[key] || 0) + 1;
      if (frequency[key] > maxCount) {
        maxCount = frequency[key];
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }

  private isGoalRelevantToSession(goalType: PersonalGoal['type'], sessionType: SessionActivity['sessionType']): boolean {
    const relevanceMap = {
      stress_reduction: ['meditation', 'breathing', 'stress_relief'],
      better_sleep: ['sleep', 'meditation'],
      focus_improvement: ['focus', 'meditation'],
      emotional_balance: ['meditation', 'breathing'],
      habit_building: ['meditation', 'breathing', 'focus']
    };

    return relevanceMap[goalType]?.includes(sessionType) || false;
  }

  // Placeholder methods (would be implemented based on content database)
  private async getBaseSessionTemplate(sessionType: SessionActivity['sessionType']): Promise<any> {
    const templates = {
      meditation: { title: 'Mindful Meditation', description: 'Center yourself with mindful awareness' },
      breathing: { title: 'Breathing Exercise', description: 'Regulate your breath and calm your mind' },
      focus: { title: 'Focus Session', description: 'Enhance your concentration and mental clarity' },
      sleep: { title: 'Sleep Preparation', description: 'Prepare your mind and body for restful sleep' },
      stress_relief: { title: 'Stress Relief', description: 'Release tension and find peace' },
    };
    return templates[sessionType];
  }

  private generatePersonalizedTitle(sessionType: SessionActivity['sessionType'], context: ContextAnalysis): string {
    const timeGreeting = {
      morning: 'Morning',
      afternoon: 'Midday',
      evening: 'Evening',
      night: 'Nighttime'
    }[context.timeOfDay];

    const moodAdjective = context.currentMood < 4 ? 'Uplifting' : 
                         context.currentMood > 7 ? 'Enhancing' : 'Balancing';

    const stressAdjective = context.stressLevel > 7 ? 'Calming' : 
                           context.stressLevel < 4 ? 'Energizing' : 'Centering';

    const titles = {
      meditation: `${timeGreeting} ${moodAdjective} Meditation`,
      breathing: `${stressAdjective} Breath Work`,
      focus: `${timeGreeting} Focus Boost`,
      sleep: `Peaceful Sleep Preparation`,
      stress_relief: `${stressAdjective} Stress Release`
    };

    return titles[sessionType];
  }

  private generatePersonalizedDescription(sessionType: SessionActivity['sessionType'], context: ContextAnalysis): string {
    const descriptions = {
      meditation: `A ${context.availableTime}-minute meditation crafted for your current mood and energy level`,
      breathing: `Specialized breathing techniques to help ${context.stressLevel > 6 ? 'reduce stress' : 'maintain balance'}`,
      focus: `Concentration exercises designed to enhance your ${context.timeOfDay} productivity`,
      sleep: `Gentle relaxation to prepare your mind for ${context.energyLevel < 4 ? 'much-needed' : 'restful'} sleep`,
      stress_relief: `Targeted stress relief for your current ${context.stressLevel > 7 ? 'high stress' : 'tension'} levels`
    };

    return descriptions[sessionType];
  }

  private generatePersonalizedTags(sessionType: SessionActivity['sessionType'], context: ContextAnalysis): string[] {
    const baseTags: string[] = [sessionType];
    
    if (context.stressLevel > 6) baseTags.push('stress-relief');
    if (context.currentMood < 5) baseTags.push('mood-boost');
    if (context.energyLevel < 4) baseTags.push('gentle');
    if (context.energyLevel > 7) baseTags.push('energizing');
    if (context.timeOfDay === 'morning') baseTags.push('morning-routine');
    if (context.timeOfDay === 'evening') baseTags.push('evening-wind-down');
    
    return baseTags;
  }

  private async filterGuidesByContext(
    guides: string[], 
    sessionType: SessionActivity['sessionType'], 
    context: ContextAnalysis
  ): Promise<string[]> {
    // Filter guides based on context - placeholder implementation
    return guides.filter(guide => {
      // Logic to filter guides based on session type and context
      return true; // Simplified for now
    });
  }

  private getOptimalGuideForContext(
    sessionType: SessionActivity['sessionType'], 
    context: ContextAnalysis
  ): string {
    // Select optimal guide based on context - placeholder implementation
    const guides = {
      meditation: ['calm_voice', 'nature_guide', 'mindful_teacher'],
      breathing: ['breath_coach', 'wellness_guide', 'zen_master'],
      focus: ['productivity_coach', 'focus_trainer', 'clarity_guide'],
      sleep: ['sleep_specialist', 'dream_guide', 'rest_companion'],
      stress_relief: ['relaxation_expert', 'stress_coach', 'peace_guide']
    };

    const sessionGuides = guides[sessionType] || ['default_guide'];
    return sessionGuides[0]; // Return first as default
  }

  private async storeFeedback(recommendationId: SessionRecommendationId, feedback: SessionFeedback): Promise<void> {
    // Store feedback in database for future learning
    try {
      await fetch('/api/personalization/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          feedback,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to store feedback:', error);
    }
  }
}

// Singleton instance
export const aiPersonalizationEngine = new AIPersonalizationEngine();