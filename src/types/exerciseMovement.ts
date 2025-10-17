import { BreathingTechnique } from './workLifeBalance';

// Enhanced exercise and movement data structure with breathing integration
export interface EnhancedExerciseMovement {
  // Basic exercise configuration (existing)
  exerciseFrequency: ExerciseFrequency;
  exerciseTypes: ExerciseType[];

  // Enhanced with breathing and stress relief
  exerciseStressRelief: boolean; // Does exercise help with stress?
  breathingDuringExercise: BreathingAwarenessLevel; // Awareness of breathing during exercise
  recoveryMethods: RecoveryMethod[];

  // Physical tension areas (for targeted breathing)
  tensionAreas: TensionArea[];

  // Advanced exercise patterns
  exerciseGoals?: ExerciseGoal[];
  preferredExerciseTime?: PreferredExerciseTime;
  exerciseIntensity?: IntensityLevel;
  warmUpRoutine?: WarmUpActivity[];
  coolDownRoutine?: CoolDownActivity[];

  // Exercise challenges
  exerciseChallenges?: ExerciseChallenge[];
  motivationLevel?: ExerciseMotivation;

  // Recovery and breathing preferences
  interestedInBreathingExercises: boolean;
  currentBreathingPractices?: BreathingPractice[];
  recoveryBreathingTechniques?: BreathingTechnique[];

  // Performance tracking
  perceivedExertion?: number; // 1-10 scale
  recoveryQuality?: number; // 1-10 scale
  energyPostExercise?: number; // 1-10 scale

  // Assessment tracking
  lastExerciseAssessment?: string; // ISO date
  exerciseTrends?: ExerciseTrend[];
}

// Exercise frequency options
export type ExerciseFrequency =
  | 'daily'           // Exercise every day
  | 'almost-daily'    // 5-6 times per week
  | 'weekly'          // 3-4 times per week
  | 'occasional'      // 1-2 times per week
  | 'rarely'          // Less than once per week
  | 'never';          // No regular exercise

// Exercise types
export type ExerciseType =
  | 'cardio'          // Running, cycling, swimming
  | 'strength'        // Weight training, resistance
  | 'yoga'            // Yoga practice
  | 'pilates'         // Pilates
  | 'walking'         // Walking, hiking
  | 'hiit'            // High-intensity interval training
  | 'sports'          // Team or individual sports
  | 'dance'           // Dancing, aerobics
  | 'martial-arts'    // Martial arts, boxing
  | 'swimming'        // Swimming, water aerobics
  | 'cycling'         // Cycling, spinning
  | 'running'         // Running, jogging
  | 'flexibility'     // Stretching, mobility work
  | 'balance'         // Balance exercises, tai chi
  | 'functional'      // Functional fitness
  | 'crossfit'        // CrossFit style workouts
  | 'calisthenics'    // Bodyweight exercises
  | 'climbing'        // Rock climbing, bouldering
  | 'other';          // Other forms of exercise

// Breathing awareness during exercise
export type BreathingAwarenessLevel =
  | 'never-think'     // Never think about breathing
  | 'sometimes-aware' // Occasionally aware of breathing
  | 'often-aware'     // Frequently notice breathing
  | 'very-focused';   // Highly focused on breath control

// Recovery methods
export type RecoveryMethod =
  | 'stretching'      // Post-exercise stretching
  | 'breathing'       // Breathing exercises
  | 'meditation'      // Meditation or mindfulness
  | 'rest'            // Passive rest
  | 'foam-rolling'    // Foam rolling, self-massage
  | 'ice-bath'        // Cold therapy
  | 'sauna'           // Heat therapy
  | 'massage'         // Professional massage
  | 'hydration'       // Focus on hydration
  | 'nutrition'       // Recovery nutrition
  | 'sleep'           // Prioritize sleep
  | 'active-recovery' // Light activity
  | 'compression'     // Compression gear
  | 'elevation'       // Leg elevation
  | 'visualization'   // Mental recovery
  | 'music'           // Relaxing music
  | 'nature'          // Time in nature
  | 'social'          // Social recovery
  | 'none';           // No specific recovery

// Physical tension areas
export type TensionArea =
  | 'neck'            // Neck tension
  | 'shoulders'       // Shoulder tension
  | 'upper-back'      // Upper back tension
  | 'lower-back'      // Lower back tension
  | 'chest'           // Chest tightness
  | 'stomach'         // Abdominal tension
  | 'hips'            // Hip tightness
  | 'legs'            // Leg tension
  | 'arms'            // Arm tension
  | 'jaw'             // Jaw tension
  | 'feet'            // Foot tension
  | 'hands'           // Hand tension
  | 'whole-body'      // General body tension
  | 'none';           // No specific tension

// Exercise goals
export type ExerciseGoal =
  | 'weight-loss'     // Lose weight
  | 'muscle-gain'     // Build muscle
  | 'endurance'       // Improve endurance
  | 'strength'        // Increase strength
  | 'flexibility'     // Improve flexibility
  | 'stress-relief'   // Reduce stress
  | 'energy-boost'    // Increase energy
  | 'better-sleep'    // Improve sleep
  | 'pain-management' // Manage chronic pain
  | 'posture'         // Improve posture
  | 'balance'         // Better balance
  | 'coordination'    // Improve coordination
  | 'sports-performance' // Sport-specific performance
  | 'rehabilitation'  // Injury recovery
  | 'general-health'  // Overall health
  | 'social-connection' // Social aspects
  | 'mental-health'   // Mental wellbeing
  | 'bone-health'     // Bone density
  | 'heart-health'    // Cardiovascular health
  | 'longevity';      // Healthy aging

// Preferred exercise time
export type PreferredExerciseTime =
  | 'early-morning'   // 5-7 AM
  | 'morning'         // 7-10 AM
  | 'lunch'           // 11 AM-1 PM
  | 'afternoon'       // 2-5 PM
  | 'evening'         // 5-8 PM
  | 'night'           // 8-10 PM
  | 'varies';         // No fixed preference

// Exercise intensity level
export type IntensityLevel =
  | 'very-light'      // Can easily hold conversation
  | 'light'           // Can speak comfortably
  | 'moderate'        // Can speak with effort
  | 'vigorous'        // Difficult to speak
  | 'maximum'         // Cannot speak
  | 'mixed';          // Varies by workout

// Warm-up activities
export type WarmUpActivity =
  | 'dynamic-stretching' // Movement-based stretching
  | 'light-cardio'    // Easy cardio
  | 'breathing'       // Breathing exercises
  | 'foam-rolling'    // Pre-workout rolling
  | 'mobility'        // Joint mobility work
  | 'activation'      // Muscle activation
  | 'visualization'   // Mental preparation
  | 'gradual-intensity' // Progressive warm-up
  | 'sport-specific'  // Sport-specific drills
  | 'none';           // No warm-up

// Cool-down activities
export type CoolDownActivity =
  | 'static-stretching' // Hold stretches
  | 'walking'         // Easy walking
  | 'breathing'       // Breathing exercises
  | 'meditation'      // Brief meditation
  | 'foam-rolling'    // Post-workout rolling
  | 'hydration'       // Focus on fluids
  | 'progressive-relaxation' // Muscle relaxation
  | 'gentle-yoga'     // Yoga poses
  | 'journaling'      // Workout reflection
  | 'none';           // No cool-down

// Exercise challenges
export type ExerciseChallenge =
  | 'lack-of-time'    // Time constraints
  | 'low-motivation'  // Motivation issues
  | 'physical-pain'   // Pain or discomfort
  | 'fatigue'         // Too tired
  | 'weather'         // Weather conditions
  | 'no-equipment'    // Lack of equipment
  | 'no-space'        // Space limitations
  | 'cost'            // Financial constraints
  | 'injury'          // Injury or recovery
  | 'boredom'         // Workout boredom
  | 'plateau'         // Progress plateau
  | 'overtraining'    // Doing too much
  | 'recovery-issues' // Poor recovery
  | 'breathing-difficulty' // Breathing challenges
  | 'coordination'    // Coordination issues
  | 'self-consciousness' // Gym anxiety
  | 'scheduling'      // Schedule conflicts
  | 'knowledge'       // Lack of knowledge
  | 'consistency'     // Maintaining routine
  | 'none';           // No challenges

// Exercise motivation level
export type ExerciseMotivation =
  | 'very-high'       // Extremely motivated
  | 'high'            // Highly motivated
  | 'moderate'        // Moderately motivated
  | 'low'             // Low motivation
  | 'very-low'        // Very low motivation
  | 'variable';       // Fluctuates

// Current breathing practices
export type BreathingPractice =
  | 'pre-workout'     // Before exercise
  | 'during-cardio'   // During cardio
  | 'during-strength' // During strength training
  | 'between-sets'    // Rest periods
  | 'post-workout'    // After exercise
  | 'recovery-days'   // On rest days
  | 'injury-management' // For pain/injury
  | 'performance'     // For performance
  | 'stress-relief'   // Stress management
  | 'none';           // No breathing practice

// Exercise trend tracking
export interface ExerciseTrend {
  date: string;
  exerciseType: ExerciseType;
  duration: number; // minutes
  intensity: IntensityLevel;
  perceivedExertion: number; // 1-10
  recoveryQuality: number; // 1-10
  energyPostExercise: number; // 1-10
  breathingSessionUsed?: boolean;
  tensionBeforeExercise?: number; // 1-10
  tensionAfterExercise?: number; // 1-10
  stressLevelBefore?: number; // 1-10
  stressLevelAfter?: number; // 1-10
  notes?: string;
}

// Exercise-specific breathing session
export interface ExerciseBreathingSession {
  id: string;
  userId: string;
  technique: BreathingTechnique;
  purpose: ExerciseBreathingPurpose;

  // Timing and context
  startTime: string; // ISO timestamp
  endTime?: string;
  duration: number;  // seconds
  exerciseContext: ExerciseBreathingContext;

  // Exercise relationship
  exerciseType?: ExerciseType;
  exerciseIntensity?: IntensityLevel;
  tensionAreas?: TensionArea[];

  // Pre-exercise state
  tensionBefore?: number; // 1-10
  energyBefore?: number; // 1-10
  focusBefore?: number; // 1-10

  // Post-session state
  tensionAfter?: number; // 1-10
  energyAfter?: number; // 1-10
  focusAfter?: number; // 1-10
  readinessToExercise?: number; // 1-10

  // Session quality
  breathControl?: number; // 1-10 how well controlled
  completed: boolean;
  wouldUseAgain?: boolean;

  createdAt: string;
  updatedAt: string;
}

// Purpose of exercise breathing session
export type ExerciseBreathingPurpose =
  | 'warm-up'         // Pre-exercise preparation
  | 'performance'     // During exercise performance
  | 'recovery'        // Post-exercise recovery
  | 'tension-relief'  // Release physical tension
  | 'energy-boost'    // Increase energy
  | 'focus'           // Improve concentration
  | 'pain-management' // Manage discomfort
  | 'stress-relief'   // Reduce exercise stress
  | 'cool-down'       // Post-exercise relaxation
  | 'endurance'       // Improve stamina
  | 'strength'        // Support strength training
  | 'flexibility'     // Support stretching
  | 'injury-prevention' // Prevent injury
  | 'rehabilitation'  // Injury recovery
  | 'mindfulness';    // Mind-body connection

// When the breathing occurs relative to exercise
export type ExerciseBreathingContext =
  | 'pre-exercise'    // Before starting
  | 'warm-up'         // During warm-up
  | 'during-exercise' // While exercising
  | 'between-sets'    // Rest periods
  | 'cool-down'       // During cool-down
  | 'post-exercise'   // After finishing
  | 'recovery-day'    // On rest days
  | 'injury-recovery' // During rehabilitation
  | 'any-time';       // Not exercise-specific

// Exercise breathing recommendation
export interface ExerciseBreathingRecommendation {
  id: string;
  technique: BreathingTechnique;
  purpose: ExerciseBreathingPurpose;
  context: ExerciseBreathingContext;
  duration: number; // minutes

  // Recommendation context
  forExerciseType?: ExerciseType;
  forTensionAreas?: TensionArea[];
  forIntensityLevel?: IntensityLevel;

  // Instructions and guidance
  title: string;
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];

  // Effectiveness predictors
  effectivenessForRecovery: number; // 1-5 rating
  effectivenessForPerformance: number; // 1-5
  effectivenessForTension: number; // 1-5
  effectivenessForEnergy: number; // 1-5

  // Personalization factors
  bestForExperienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  requiresEquipment?: boolean;
  canBeDoneInGym?: boolean;

  priority: 'low' | 'medium' | 'high' | 'urgent';
  reasoning: string;
}

// Exercise analytics
export interface ExerciseAnalytics {
  userId: string;
  period: 'week' | 'month' | 'quarter';

  // Exercise patterns
  totalWorkouts: number;
  averageWorkoutsPerWeek: number;
  averageDuration: number; // minutes
  mostCommonExerciseTypes: ExerciseType[];
  preferredIntensity: IntensityLevel;

  // Performance metrics
  averagePerceivedExertion: number;
  averageRecoveryQuality: number;
  averageEnergyPostExercise: number;

  // Tension and stress
  averageTensionReduction: number; // percentage
  averageStressReduction: number; // percentage
  mostCommonTensionAreas: TensionArea[];

  // Breathing integration
  breathingSessionsUsed: number;
  breathingEffectiveness: number; // 1-10
  mostEffectiveBreathingTechniques: Array<{
    technique: BreathingTechnique;
    averageImprovement: number;
    usageCount: number;
  }>;

  // Recovery insights
  mostEffectiveRecoveryMethods: RecoveryMethod[];
  recoveryTimeNeeded: number; // hours
  optimalExerciseFrequency: ExerciseFrequency;

  // Correlations
  exerciseStressCorrelation: number;
  exerciseSleepCorrelation: number;
  exerciseEnergyCorrelation: number;
  breathingRecoveryCorrelation: number;

  // Recommendations
  suggestedExerciseSchedule: Array<{
    day: string;
    exerciseType: ExerciseType;
    duration: number;
    intensity: IntensityLevel;
  }>;
  recommendedBreathingTechniques: BreathingTechnique[];
  suggestedRecoveryAdjustments: string[];

  // Trends
  consistencyTrend: 'improving' | 'stable' | 'declining';
  performanceTrend: 'improving' | 'stable' | 'declining';
  recoveryTrend: 'improving' | 'stable' | 'declining';

  generatedAt: string;
}

// Integration with wellness system
export interface ExerciseWellnessIntegration {
  // Links to main wellness goals
  relatedWellnessGoals: string[];

  // Exercise impact on other areas
  exerciseImpactOnStress: number; // 0-1 correlation
  exerciseImpactOnSleep: number;
  exerciseImpactOnEnergy: number;
  exerciseImpactOnFocus: number;
  exerciseImpactOnMood: number;

  // Cross-system recommendations
  recommendExerciseForStressGoal: boolean;
  recommendExerciseForSleepGoal: boolean;
  recommendExerciseForEnergyGoal: boolean;
  recommendBreathingForExerciseRecovery: boolean;

  // Integrated tracking
  trackExerciseInWellnessAssessment: boolean;
  includeExerciseInDailyCheck: boolean;
  prioritizeRecoveryBasedOnGoals: boolean;
}

// Movement quality assessment
export interface MovementQuality {
  // Mobility assessment
  flexibilityLevel: 'very-limited' | 'limited' | 'moderate' | 'good' | 'excellent';
  balanceLevel: 'poor' | 'fair' | 'good' | 'very-good' | 'excellent';
  coordinationLevel: 'poor' | 'fair' | 'good' | 'very-good' | 'excellent';

  // Movement patterns
  movementRestrictions?: string[]; // Specific limitations
  painDuringMovement?: boolean;
  painLocations?: TensionArea[];

  // Breathing during movement
  breathHolding: boolean; // Tendency to hold breath
  breathingRhythm: 'erratic' | 'shallow' | 'normal' | 'deep' | 'controlled';
  breathMovementCoordination: 'poor' | 'fair' | 'good' | 'excellent';

  // Improvement areas
  priorityAreas: Array<'flexibility' | 'strength' | 'balance' | 'coordination' | 'breathing'>;
  recommendedExercises: ExerciseType[];
}

// Recovery optimization
export interface RecoveryOptimization {
  // Recovery needs
  currentRecoveryTime: number; // hours needed
  optimalRecoveryTime: number; // recommended hours
  recoveryQualityScore: number; // 1-10

  // Recovery methods effectiveness
  mostEffectiveRecoveryMethods: Array<{
    method: RecoveryMethod;
    effectiveness: number; // 1-10
    frequency: 'daily' | 'after-workout' | 'weekly' | 'as-needed';
  }>;

  // Breathing for recovery
  recoveryBreathingProtocol: {
    technique: BreathingTechnique;
    duration: number; // minutes
    timing: 'immediately-after' | '30-min-after' | '1-hour-after' | 'before-sleep';
    expectedBenefit: string;
  };

  // Nutrition and hydration
  hydrationRecommendation: string;
  nutritionTiming: string;

  // Sleep optimization for recovery
  recommendedSleepDuration: number; // hours
  optimalSleepTime: string; // time to go to bed

  // Active recovery suggestions
  activeRecoveryDays: number; // per week
  activeRecoveryActivities: ExerciseType[];
}

// Performance optimization
export interface PerformanceOptimization {
  // Current performance level
  currentFitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  performanceGoals: ExerciseGoal[];

  // Breathing for performance
  performanceBreathingTechniques: Array<{
    technique: BreathingTechnique;
    useCase: string; // When to use
    expectedImprovement: string;
  }>;

  // Training recommendations
  optimalTrainingFrequency: ExerciseFrequency;
  recommendedIntensityMix: {
    low: number; // percentage
    moderate: number;
    high: number;
  };

  // Progressive overload plan
  progressionStrategy: string;
  nextMilestones: string[];

  // Mental preparation
  prePerformanceRoutine: Array<{
    activity: string;
    duration: number; // minutes
    timing: string; // when before exercise
  }>;

  // Recovery between sessions
  minimumRecoveryBetweenSessions: number; // hours
  activeRecoveryRecommended: boolean;
}