import { SessionRecommendation, RecommendationContext } from './AIPersonalizationEngine';

export class FallbackRecommendations {
  static generate(context?: RecommendationContext): SessionRecommendation[] {
    const timeOfDay = context?.timeOfDay || this.getCurrentTimeOfDay();
    const mood = context?.currentMood || 5;
    const stress = context?.currentStress || 5;
    const energy = context?.energyLevel || 5;
    const availableTime = context?.availableTime || 15;

    const recommendations: SessionRecommendation[] = [];

    // Rule 1: High stress → Stress relief or breathing
    if (stress > 6) {
      recommendations.push({
        id: `fallback_stress_${Date.now()}`,
        sessionType: 'stress_relief',
        title: 'Quick Stress Relief',
        description: 'Release tension with guided relaxation techniques',
        duration: Math.min(10, availableTime),
        difficulty: 'beginner',
        confidence: 0.85,
        reasoning: [
          'Your stress level is elevated',
          'Quick relief sessions work best under stress',
          'Beginner-friendly to ensure completion'
        ],
        expectedBenefits: {
          moodImprovement: 6,
          stressReduction: 9,
          focusImprovement: 4
        },
        tags: ['stress-relief', 'quick', 'gentle']
      });
    }

    // Rule 2: Low mood → Mood boost meditation
    if (mood < 5) {
      recommendations.push({
        id: `fallback_mood_${Date.now()}`,
        sessionType: 'meditation',
        title: 'Uplifting Meditation',
        description: 'Cultivate positivity and emotional balance',
        duration: Math.min(15, availableTime),
        difficulty: 'beginner',
        confidence: 0.80,
        reasoning: [
          'Designed to improve your current mood',
          'Focuses on positive emotions and gratitude',
          'Suitable length for mood improvement'
        ],
        expectedBenefits: {
          moodImprovement: 8,
          stressReduction: 6,
          focusImprovement: 5
        },
        tags: ['mood-boost', 'positivity', 'emotional-balance']
      });
    }

    // Rule 3: Morning → Energizing session
    if (timeOfDay === 'morning') {
      recommendations.push({
        id: `fallback_morning_${Date.now()}`,
        sessionType: 'breathing',
        title: 'Morning Energy Breath',
        description: 'Start your day with energizing breathwork',
        duration: 5,
        difficulty: 'beginner',
        confidence: 0.90,
        reasoning: [
          'Perfect for morning routines',
          'Energizes body and mind',
          'Quick and effective'
        ],
        expectedBenefits: {
          moodImprovement: 7,
          stressReduction: 4,
          focusImprovement: 8
        },
        tags: ['morning', 'energizing', 'breathwork']
      });
    }

    // Rule 4: Evening/Night → Sleep preparation
    if (timeOfDay === 'evening' || timeOfDay === 'night') {
      recommendations.push({
        id: `fallback_sleep_${Date.now()}`,
        sessionType: 'sleep',
        title: 'Evening Wind Down',
        description: 'Prepare your mind and body for restful sleep',
        duration: Math.min(20, availableTime),
        difficulty: 'beginner',
        confidence: 0.88,
        reasoning: [
          'Ideal for evening relaxation',
          'Promotes better sleep quality',
          'Gentle and calming'
        ],
        expectedBenefits: {
          moodImprovement: 7,
          stressReduction: 8,
          focusImprovement: 3
        },
        tags: ['sleep', 'evening', 'relaxation']
      });
    }

    // Rule 5: Low energy → Gentle meditation
    if (energy < 4) {
      recommendations.push({
        id: `fallback_gentle_${Date.now()}`,
        sessionType: 'meditation',
        title: 'Gentle Awareness',
        description: 'Low-effort mindfulness for when energy is low',
        duration: Math.min(10, availableTime),
        difficulty: 'beginner',
        confidence: 0.82,
        reasoning: [
          'Designed for low energy states',
          'Minimal effort required',
          'Restorative and calming'
        ],
        expectedBenefits: {
          moodImprovement: 5,
          stressReduction: 7,
          focusImprovement: 4
        },
        tags: ['gentle', 'low-energy', 'restorative']
      });
    }

    // Rule 6: Default - Balanced meditation
    if (recommendations.length === 0) {
      recommendations.push({
        id: `fallback_balanced_${Date.now()}`,
        sessionType: 'meditation',
        title: 'Balanced Mindfulness',
        description: 'A well-rounded meditation for everyday wellness',
        duration: Math.min(15, availableTime),
        difficulty: 'beginner',
        confidence: 0.75,
        reasoning: [
          'Balanced approach suitable for any time',
          'Covers multiple wellness aspects',
          'Beginner-friendly and accessible'
        ],
        expectedBenefits: {
          moodImprovement: 6,
          stressReduction: 6,
          focusImprovement: 6
        },
        tags: ['balanced', 'mindfulness', 'everyday']
      });
    }

    return recommendations.slice(0, 5);
  }

  private static getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }
}
