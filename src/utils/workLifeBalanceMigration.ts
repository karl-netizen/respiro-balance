import { UserPreferences } from '@/context/types';
import {
  EnhancedWorkLifePreferences,
  WorkStressor,
  StressfulTime,
  CopingMethod,
  BreakLength,
  BreathingTechnique,
  StressAssessment,
  BreathingAwareness,
  WellnessGoals,
  StressFrequency,
  PhysicalStressSymptom,
  BreathingAwarenessLevel,
  BreathingIssue,
  ExperienceLevel,
  WellnessGoal
} from '@/types/workLifeBalance';

/**
 * Migrates existing work-life balance data to the enhanced structure
 */
export function migrateToEnhancedWorkLife(
  preferences: UserPreferences
): EnhancedWorkLifePreferences {
  // Extract existing data
  const workingDays = preferences.workDays || preferences.work_days || [];
  const workStartTime = preferences.workStartTime || preferences.work_start_time || '09:00';
  const workEndTime = preferences.workEndTime || preferences.work_end_time || '17:00';
  const lunchTime = preferences.lunchTime || preferences.lunch_time || '12:00';
  const lunchBreak = preferences.lunchBreak !== undefined ? preferences.lunchBreak : preferences.lunch_break;

  // Determine default lunch break duration (if not specified)
  const lunchDuration = 60; // Default to 60 minutes

  // Infer initial values based on existing user data
  const defaultStressors = inferStressors(preferences);
  const defaultStressfulTimes = inferStressfulTimes(preferences);
  const defaultCopingMethods = inferCopingMethods(preferences);
  const defaultBreakLength = inferPreferredBreakLength(preferences);

  return {
    // Core existing structure
    workingDays,
    workingHours: {
      start: workStartTime,
      end: workEndTime,
    },
    lunchBreak: {
      duration: lunchDuration,
      time: lunchTime,
    },

    // Enhanced breathing integration
    workStressors: preferences.workStressors?.map(s => s as WorkStressor) || defaultStressors,
    stressfulTimes: preferences.stressfulTimes?.map(t => t as StressfulTime) || defaultStressfulTimes,
    currentCopingMethods: preferences.currentCopingMethods?.map(m => m as CopingMethod) || defaultCopingMethods,
    preferredBreakLength: (preferences.preferredBreakLength as BreakLength) || defaultBreakLength,

    // Additional context
    workEnvironment: preferences.workEnvironment || 'office',

    energyPatterns: preferences.energyPatterns || {
      morningEnergy: preferences.morningEnergyLevel || 'medium',
      afternoonDip: true, // Common pattern
      eveningEnergy: 'medium',
    },

    breathingPreferences: preferences.breathingPreferences ? {
      preferredTechniques: (preferences.breathingPreferences.preferredTechniques as BreathingTechnique[]) || getDefaultBreathingTechniques(preferences),
      guidedVsUnguided: preferences.breathingPreferences.guidedVsUnguided || 'guided' as const,
      backgroundSounds: preferences.breathingPreferences.backgroundSounds ?? preferences.meditation?.backgroundSounds ?? true,
      voicePreference: preferences.breathingPreferences.voicePreference || preferences.meditation?.guidedVoice || 'female',
    } : {
      preferredTechniques: getDefaultBreathingTechniques(preferences),
      guidedVsUnguided: 'guided' as const,
      backgroundSounds: preferences.meditation?.backgroundSounds ?? true,
      voicePreference: preferences.meditation?.guidedVoice || 'female',
    },

    // NEW: Health and wellness assessment (inferred from existing data)
    stressAssessment: inferStressAssessment(preferences),
    breathingAwareness: inferBreathingAwareness(preferences),
    wellnessGoals: inferWellnessGoals(preferences),
  };
}

/**
 * Infers likely stressors based on user's existing preferences and role
 */
function inferStressors(preferences: UserPreferences): WorkStressor[] {
  const stressors: WorkStressor[] = ['deadlines', 'meetings']; // Common baseline

  // Add based on role or experience
  if (preferences.workEnvironment === 'home') {
    stressors.push('interruptions');
  }

  if (preferences.workEnvironment === 'office') {
    stressors.push('multitasking', 'email-overload');
  }

  // Add based on stress level
  if (preferences.stressLevel === 'high') {
    stressors.push('workload', 'time-pressure');
  }

  // Add based on focus challenges
  if (preferences.focusChallenges?.includes('distractions')) {
    stressors.push('interruptions');
  }

  if (preferences.focusChallenges?.includes('multitasking')) {
    stressors.push('multitasking');
  }

  return [...new Set(stressors)]; // Remove duplicates
}

/**
 * Infers likely stressful times based on work patterns
 */
function inferStressfulTimes(preferences: UserPreferences): StressfulTime[] {
  const times: StressfulTime[] = [];

  // Early start time suggests morning rush
  const startHour = parseInt(preferences.workStartTime?.split(':')[0] || '9');
  if (startHour <= 8) {
    times.push('morning-rush');
  }

  // Long work days suggest end-of-day stress
  const endHour = parseInt(preferences.workEndTime?.split(':')[0] || '17');
  if (endHour >= 18) {
    times.push('end-of-day');
  }

  // Common patterns
  times.push('pre-meetings', 'mid-afternoon');

  // Add based on stress level
  if (preferences.stressLevel === 'high') {
    times.push('monday-mornings', 'overtime');
  }

  return times;
}

/**
 * Infers current coping methods based on user preferences
 */
function inferCopingMethods(preferences: UserPreferences): CopingMethod[] {
  const methods: CopingMethod[] = [];

  // Check existing meditation habits
  if (preferences.meditation?.sessionReminders) {
    methods.push('meditation');
  }

  // Check morning rituals for exercise
  if (preferences.morningExercise || preferences.morning_exercise) {
    methods.push('exercise');
  }

  // Check if they have break reminders enabled
  if (preferences.breakReminders?.enabled) {
    methods.push('short-walks');
  }

  // Default common methods if none detected
  if (methods.length === 0) {
    methods.push('coffee', 'deep-breaths');
  }

  return methods;
}

/**
 * Infers preferred break length based on existing preferences
 */
function inferPreferredBreakLength(preferences: UserPreferences): BreakLength {
  // Check break timer duration if available
  const breakDuration = preferences.breakTimerDuration;

  if (breakDuration) {
    if (breakDuration <= 2) return '2-minutes';
    if (breakDuration <= 5) return '5-minutes';
    if (breakDuration <= 10) return '10-minutes';
  }

  // Check meditation duration preference
  const meditationDuration = preferences.preferredSessionDuration || preferences.preferred_session_duration;

  if (meditationDuration) {
    if (meditationDuration <= 2) return '2-minutes';
    if (meditationDuration <= 5) return '5-minutes';
    if (meditationDuration <= 10) return '10-minutes';
  }

  // Default for beginners vs experienced
  if (preferences.meditationExperience === 'beginner') {
    return '2-minutes';
  }

  return '5-minutes'; // Sensible default
}

/**
 * Gets default breathing techniques based on user experience and preferences
 */
function getDefaultBreathingTechniques(preferences: UserPreferences): BreathingTechnique[] {
  const techniques: BreathingTechnique[] = [];

  // Start with beginner-friendly techniques
  if (preferences.meditationExperience === 'beginner') {
    techniques.push('box-breathing', 'belly-breathing');
  } else if (preferences.meditationExperience === 'intermediate') {
    techniques.push('box-breathing', 'coherent-breathing', 'four-seven-eight');
  } else {
    techniques.push('box-breathing', 'coherent-breathing', 'alternate-nostril', 'tactical-breathing');
  }

  // Add work-specific techniques
  techniques.push('quick-coherence'); // Good for workplace

  // Add based on stress level
  if (preferences.stressLevel === 'high') {
    techniques.push('physiological-sigh');
  }

  return [...new Set(techniques)];
}

/**
 * Creates smart break recommendations based on enhanced preferences
 */
export function generateBreakRecommendations(
  preferences: EnhancedWorkLifePreferences,
  currentTime: Date = new Date()
): Array<{
  technique: BreathingTechnique;
  duration: number;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
}> {
  const recommendations = [];
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  // Morning energy boost
  if (hour >= 8 && hour <= 10 && preferences.energyPatterns?.morningEnergy === 'low') {
    recommendations.push({
      technique: 'coherent-breathing' as BreathingTechnique,
      duration: 3,
      reasoning: 'Boost morning energy with rhythmic breathing',
      priority: 'medium' as const,
    });
  }

  // Pre-lunch energy maintenance
  if (hour >= 11 && hour <= 12) {
    recommendations.push({
      technique: 'box-breathing' as BreathingTechnique,
      duration: 2,
      reasoning: 'Maintain focus before lunch break',
      priority: 'low' as const,
    });
  }

  // Post-lunch dip
  if (hour >= 13 && hour <= 15 && preferences.energyPatterns?.afternoonDip) {
    recommendations.push({
      technique: 'physiological-sigh' as BreathingTechnique,
      duration: 1,
      reasoning: 'Combat afternoon energy dip',
      priority: 'high' as const,
    });
  }

  // End of day wind-down
  if (hour >= 16) {
    recommendations.push({
      technique: 'four-seven-eight' as BreathingTechnique,
      duration: 5,
      reasoning: 'Prepare for end of workday transition',
      priority: 'medium' as const,
    });
  }

  return recommendations;
}

/**
 * Infers stress assessment from existing user data
 */
function inferStressAssessment(preferences: UserPreferences): StressAssessment {
  // Map existing stress level to numeric scale
  let currentStressLevel = 5; // default moderate
  switch (preferences.stressLevel) {
    case 'low': currentStressLevel = 3; break;
    case 'moderate': currentStressLevel = 5; break;
    case 'high': currentStressLevel = 7; break;
    default: currentStressLevel = 5;
  }

  // Infer stress frequency from existing patterns
  let stressFrequency: StressFrequency = 'weekly';
  if (preferences.stressLevel === 'high') {
    stressFrequency = 'daily';
  } else if (preferences.stressLevel === 'low') {
    stressFrequency = 'rarely';
  }

  // Infer physical symptoms from existing challenges
  const physicalStressSymptoms: PhysicalStressSymptom[] = [];

  if (preferences.focusChallenges?.includes('fatigue')) {
    physicalStressSymptoms.push('fatigue');
  }

  if (preferences.timeChallenges?.includes('sleep')) {
    physicalStressSymptoms.push('sleep-problems');
  }

  // Common symptoms based on stress level
  if (preferences.stressLevel === 'high') {
    physicalStressSymptoms.push('tension', 'headaches');
  }

  if (physicalStressSymptoms.length === 0) {
    physicalStressSymptoms.push('none');
  }

  return {
    currentStressLevel,
    stressFrequency,
    physicalStressSymptoms: [...new Set(physicalStressSymptoms)], // Remove duplicates
    assessmentDate: new Date().toISOString(),
  };
}

/**
 * Infers breathing awareness from existing meditation experience
 */
function inferBreathingAwareness(preferences: UserPreferences): BreathingAwareness {
  // Map meditation experience to breathing awareness
  let breathingAwareness: BreathingAwarenessLevel = 'sometimes-notice';
  let previousBreathingExperience: ExperienceLevel = 'beginner';

  switch (preferences.meditationExperience || preferences.meditation_experience) {
    case 'beginner':
      breathingAwareness = 'sometimes-notice';
      previousBreathingExperience = 'beginner';
      break;
    case 'intermediate':
      breathingAwareness = 'often-aware';
      previousBreathingExperience = 'some-experience';
      break;
    case 'advanced':
      breathingAwareness = 'very-aware';
      previousBreathingExperience = 'experienced';
      break;
    default:
      breathingAwareness = 'sometimes-notice';
      previousBreathingExperience = 'beginner';
  }

  // Infer breathing issues from stress level and existing challenges
  const breathingIssues: BreathingIssue[] = [];

  if (preferences.stressLevel === 'high') {
    breathingIssues.push('shallow', 'irregular');
  }

  if (preferences.focusChallenges?.includes('concentration')) {
    breathingIssues.push('breath-holding');
  }

  if (breathingIssues.length === 0) {
    breathingIssues.push('none');
  }

  return {
    breathingAwareness,
    breathingIssues: [...new Set(breathingIssues)], // Remove duplicates
    previousBreathingExperience,
    assessmentDate: new Date().toISOString(),
  };
}

/**
 * Infers wellness goals from existing meditation goals and preferences
 */
function inferWellnessGoals(preferences: UserPreferences): WellnessGoals {
  const primaryGoals: WellnessGoal[] = [];
  const secondaryGoals: WellnessGoal[] = [];

  // Map existing meditation goals to wellness goals
  const existingGoals = preferences.meditationGoals || preferences.meditation_goals || [];

  existingGoals.forEach(goal => {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes('stress')) {
      primaryGoals.push('reduce-stress');
    } else if (goalLower.includes('focus') || goalLower.includes('concentration')) {
      primaryGoals.push('improve-focus');
    } else if (goalLower.includes('sleep')) {
      primaryGoals.push('better-sleep');
    } else if (goalLower.includes('energy')) {
      primaryGoals.push('increase-energy');
    } else if (goalLower.includes('anxiety')) {
      primaryGoals.push('anxiety-management');
    }
  });

  // Add defaults based on stress level if no specific goals found
  if (primaryGoals.length === 0) {
    switch (preferences.stressLevel) {
      case 'high':
        primaryGoals.push('reduce-stress', 'anxiety-management');
        break;
      case 'moderate':
        primaryGoals.push('improve-focus', 'better-sleep');
        break;
      case 'low':
        primaryGoals.push('general-wellness', 'increase-energy');
        break;
      default:
        primaryGoals.push('reduce-stress', 'improve-focus');
    }
  }

  // Add secondary goals based on preferences
  if (preferences.timeChallenges?.includes('sleep')) {
    if (!primaryGoals.includes('better-sleep')) {
      secondaryGoals.push('better-sleep');
    }
  }

  if (preferences.meditation?.sessionReminders) {
    secondaryGoals.push('habit-formation');
  }

  // Remove duplicates
  const uniquePrimaryGoals = [...new Set(primaryGoals)];
  const uniqueSecondaryGoals = [...new Set(secondaryGoals.filter(goal => !uniquePrimaryGoals.includes(goal)))];

  return {
    primaryGoals: uniquePrimaryGoals,
    secondaryGoals: uniqueSecondaryGoals,
    timeframe: 'medium-term', // 1-3 months default
    goalSetDate: new Date().toISOString(),
  };
}