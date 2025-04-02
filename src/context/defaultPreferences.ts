
import { UserPreferences } from './types';

const defaultPreferences: UserPreferences = {
  theme: 'light' as 'light' | 'dark' | 'system',
  focusMode: false,
  defaultMeditationDuration: 10,
  preferredBreathingTechnique: 'box',
  showBreathingGuide: true,
  breathingSpeed: 'medium' as 'slow' | 'medium' | 'fast',
  notificationsEnabled: true,
  soundEnabled: true,
  backgroundMusic: 'ambient' as 'nature' | 'ambient' | 'none',
  focusTimerDuration: 25,
  breakTimerDuration: 5,
  weeklyMeditationGoal: 3,
  autoPlayNextSession: false,
  hasWearableDevice: false,
  wearableDeviceType: '',
  wearableDeviceId: '',
  lastSyncDate: '',
  connectedDevices: [],
  metricsOfInterest: [
    'heartRate',
    'breathingRate',
    'focusScore',
    'stress'
  ],
  focusChallenges: [
    'deepWork',
    'pomodoro',
    'socialMedia'
  ],
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // Changed to string array
  userRole: 'user' as 'user' | 'coach' | 'admin',
  meditationGoals: [
    'reduce stress',
    'improve focus',
    'better sleep'
  ],
  
  // Morning ritual related
  morningRituals: [],
  morningActivities: [],
  morningEnergyLevel: 5,
  morningDevices: 'phone_first',
  weekdayWakeTime: '07:00',
  weekendWakeTime: '08:00',
  
  // Onboarding related
  hasCompletedOnboarding: false,
  stressLevel: 'moderate',
  energyPattern: 'morning',
  workStartTime: '09:00',
  workEndTime: '17:00',
  workEnvironment: 'hybrid',
  lunchBreak: true,
  lunchTime: '12:00',
  morningExercise: false,
  exerciseTime: '06:30',
  bedTime: '22:30',
  meditationExperience: 'beginner',
  preferredSessionDuration: 10,
  timeChallenges: [],
  usesTimeBlocking: 'sometimes',
  workBoundaries: 'flexible',
  timeManagementStyle: 'flexible',
  
  // Notifications
  enableSessionReminders: true,
  enableProgressUpdates: true,
  enableRecommendations: true,
  
  // Business
  businessAttribution: '',
  subscriptionTier: 'free',
  
  // UI preferences
  darkMode: false,
  reducedMotion: false,
  highContrast: false,
  reminders: true,
  emailNotifications: true,
  achievementNotifications: true,
  showBiometrics: false,
  enableBackgroundAudio: true,
  highQualityAudio: false,
  offlineAccess: false,
};

export default defaultPreferences;
