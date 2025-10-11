export interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  shortDescription: string;
  tier: 'standard' | 'premium';
  alwaysActive?: boolean;
  colorClass: string;
  features: string[];
}

export const MODULE_REGISTRY: Record<string, Module> = {
  biofeedback: {
    id: 'biofeedback',
    name: 'Biofeedback',
    icon: '📱',
    description: 'Track heart rate, HRV, and stress levels with Apple Health and Google Fit integration.',
    shortDescription: 'See your stress reduction in real-time',
    tier: 'standard',
    alwaysActive: true,
    colorClass: 'bg-destructive',
    features: [
      'Heart rate tracking',
      'HRV monitoring',
      'Post-session insights',
      'Weekly wellness reports'
    ]
  },
  focus: {
    id: 'focus',
    name: 'Focus Mode',
    icon: '🎯',
    description: 'Pomodoro timer with productivity analytics. Track your focus sessions and improve your deep work capacity.',
    shortDescription: 'Boost productivity with focus sessions',
    tier: 'premium',
    colorClass: 'bg-[hsl(271,76%,53%)]',
    features: [
      'Pomodoro timer',
      'Productivity analytics',
      'Session history',
      'Focus score tracking'
    ]
  },
  morning_rituals: {
    id: 'morning_rituals',
    name: 'Morning Rituals',
    icon: '🌄',
    description: 'Build consistent morning habits. Create custom routines, track streaks, and start your day with intention.',
    shortDescription: 'Start your day with intention',
    tier: 'premium',
    colorClass: 'bg-warning',
    features: [
      'Custom routines',
      'Habit tracking',
      'Streak counters',
      'Morning reminders'
    ]
  },
  social: {
    id: 'social',
    name: 'Social Hub',
    icon: '👥',
    description: 'Connect with the wellness community. Join challenges, share achievements, and meditate together.',
    shortDescription: 'Share your journey with others',
    tier: 'premium',
    colorClass: 'bg-success',
    features: [
      'Friend connections',
      'Community challenges',
      'Achievement sharing',
      'Group meditation'
    ]
  },
  work_life_balance: {
    id: 'work_life_balance',
    name: 'Work-Life Balance',
    icon: '⚖️',
    description: 'Prevent burnout with smart breaks. Track your balance meter and maintain healthy boundaries.',
    shortDescription: 'Maintain healthy boundaries',
    tier: 'premium',
    colorClass: 'bg-[hsl(210,29%,29%)]',
    features: [
      'Balance meter',
      'Break reminders',
      'Burnout prevention',
      'Weekly balance reports'
    ]
  },
  ai_personalization: {
    id: 'ai_personalization',
    name: 'AI Personalization',
    icon: '✨',
    description: 'Get personalized meditation and wellness recommendations powered by AI. Smart insights tailored to your journey.',
    shortDescription: 'AI-powered recommendations',
    tier: 'premium',
    alwaysActive: false,
    colorClass: 'bg-[hsl(271,76%,53%)]',
    features: [
      'Personalized session recommendations',
      'AI wellness insights',
      'Adaptive meditation programs',
      'Smart progress tracking'
    ]
  }
};

export const getModulesByTier = (tier: 'free' | 'standard' | 'premium'): Module[] => {
  const modules = Object.values(MODULE_REGISTRY);
  
  if (tier === 'free') return [];
  if (tier === 'premium') return modules;
  return modules.filter(m => m.tier === 'standard');
};

export const getModuleById = (id: string): Module | undefined => {
  return MODULE_REGISTRY[id];
};
