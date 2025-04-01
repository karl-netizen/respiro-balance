const defaultPreferences = {
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
  workDays: [1, 2, 3, 4, 5], // Mon, Tue, Wed, Thu, Fri
  userRole: 'user' as 'user' | 'coach' | 'admin',
  meditationGoals: [
    'reduce stress',
    'improve focus',
    'better sleep'
  ]
};

export default defaultPreferences;
