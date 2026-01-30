import {
  EnhancedWorkLifePreferences,
  BreakRecommendation,
  BreathingTechnique,
} from '@/types/workLifeBalance';

/**
 * Handles filtering and adjusting recommendations based on user preferences
 */
export class PreferenceFilter {
  constructor(private preferences: EnhancedWorkLifePreferences) {}

  /**
   * Filter recommendations based on user preferences
   */
  filterByPreferences(recommendations: BreakRecommendation[]): BreakRecommendation[] {
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
   * Get preferred duration based on user settings
   */
  getPreferredDuration(): number {
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
  getClosestPreferredTechnique(original: BreathingTechnique): BreathingTechnique {
    const preferred = this.preferences.breathingPreferences?.preferredTechniques || [];

    if (preferred.length === 0) return original;

    // Technique similarity mapping
    const similarityMap: Partial<Record<BreathingTechnique, BreathingTechnique[]>> = {
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
  getAlternativeTechnique(original: BreathingTechnique): BreathingTechnique {
    const alternatives: Partial<Record<BreathingTechnique, BreathingTechnique>> = {
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
}
