import {
  EnhancedSleepRecovery,
  SleepBreathingRecommendation,
} from '@/types/sleepRecovery';
import { BreathingTechnique } from '@/types/workLifeBalance';

/**
 * Handles filtering and adjusting sleep recommendations based on user preferences
 */
export class SleepPreferenceFilter {
  constructor(private sleepPreferences: EnhancedSleepRecovery) {}

  /**
   * Filter recommendations based on user preferences and context
   */
  filterByPreferences(recommendations: SleepBreathingRecommendation[]): SleepBreathingRecommendation[] {
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
   * Find closest preferred technique for sleep
   */
  getClosestPreferredSleepTechnique(original: BreathingTechnique): BreathingTechnique {
    const preferredTechniques = this.sleepPreferences.preferredSleepBreathingTechniques || [];

    if (preferredTechniques.length === 0) return original;

    // Sleep-specific technique similarity mapping
    const sleepSimilarityMap: Partial<Record<BreathingTechnique, BreathingTechnique[]>> = {
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
}
