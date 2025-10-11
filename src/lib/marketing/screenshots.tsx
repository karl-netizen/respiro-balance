/**
 * App Store Assets & Marketing Screenshots
 * 
 * This file contains utilities and metadata for generating
 * app store screenshots and marketing assets.
 */

export interface Screenshot {
  id: string;
  title: string;
  description: string;
  route: string;
  captureArea?: 'fullscreen' | 'mobile' | 'tablet';
  highlights?: string[];
}

/**
 * Screenshot configurations for app stores (iOS, Android, Web)
 */
export const APP_STORE_SCREENSHOTS: Screenshot[] = [
  {
    id: 'dashboard',
    title: 'Personalized Dashboard',
    description: 'Your meditation journey at a glance with AI-powered recommendations',
    route: '/dashboard',
    captureArea: 'mobile',
    highlights: [
      'Session counter',
      'AI recommendations',
      'Quick access tabs',
      'Module widgets'
    ]
  },
  {
    id: 'meditation-session',
    title: 'Guided Meditation',
    description: 'Immersive meditation experience with real-time guidance',
    route: '/meditate',
    captureArea: 'mobile',
    highlights: [
      'Beautiful session cards',
      'Progress tracking',
      'Timer and controls',
      'Session insights'
    ]
  },
  {
    id: 'focus-mode',
    title: 'Focus Timer',
    description: 'Pomodoro-style focus sessions to boost productivity',
    route: '/focus',
    captureArea: 'mobile',
    highlights: [
      'Work/break cycles',
      'Session stats',
      'Distraction blocking',
      'Completion tracking'
    ]
  },
  {
    id: 'biofeedback',
    title: 'Health Tracking',
    description: 'Track your wellness with biofeedback integration',
    route: '/biofeedback',
    captureArea: 'mobile',
    highlights: [
      'Heart rate monitoring',
      'HRV analysis',
      'Stress score',
      'Weekly reports'
    ]
  },
  {
    id: 'morning-ritual',
    title: 'Morning Rituals',
    description: 'Start your day with mindful habits and routines',
    route: '/morning-ritual',
    captureArea: 'mobile',
    highlights: [
      'Habit tracking',
      'Streak counters',
      'Daily checklist',
      'Motivation badges'
    ]
  },
  {
    id: 'progress',
    title: 'Progress & Insights',
    description: 'Visualize your meditation journey and growth',
    route: '/progress',
    captureArea: 'mobile',
    highlights: [
      'Session history',
      'Streak tracking',
      'Mood analytics',
      'Achievement badges'
    ]
  }
];

/**
 * App Store Metadata
 */
export const APP_STORE_METADATA = {
  ios: {
    name: 'Respiro Balance',
    subtitle: 'Mindful Workplace Wellness',
    description: `Transform your workday with Respiro Balance - the ultimate meditation and wellness app designed for busy professionals.

🧘 PERSONALIZED MEDITATION
• AI-powered session recommendations
• Guided meditations for work breaks
• Stress relief & focus enhancement
• Beginner to advanced levels

⏰ FOCUS TOOLS
• Pomodoro-style focus timer
• Work/break cycle management
• Distraction-free sessions
• Productivity tracking

📊 BIOFEEDBACK TRACKING
• Heart rate & HRV monitoring
• Stress level insights
• Post-session analytics
• Weekly wellness reports

🌅 MORNING RITUALS
• Customizable habit tracking
• Daily streak counters
• Mindful morning routines
• Motivation & accountability

💎 FLEXIBLE PLANS
• Free: 5 sessions/month
• Standard: 40 sessions/month + Focus Mode
• Premium: Unlimited + all features

Perfect for:
✓ Busy professionals managing stress
✓ Remote workers seeking balance
✓ Anyone building mindfulness habits
✓ Teams promoting workplace wellness

Download now and start your mindful journey!`,
    keywords: [
      'meditation',
      'mindfulness',
      'workplace wellness',
      'stress relief',
      'focus timer',
      'productivity',
      'biofeedback',
      'work-life balance',
      'guided meditation',
      'breathing exercises'
    ],
    categories: ['Health & Fitness', 'Productivity'],
    supportURL: 'https://respirobalance.com/help',
    privacyURL: 'https://respirobalance.com/privacy'
  },
  
  android: {
    name: 'Respiro Balance',
    shortDescription: 'Mindful workplace wellness with meditation, focus tools & biofeedback',
    fullDescription: `Respiro Balance: Your Personal Wellness Companion

Transform your workday with personalized meditation, powerful focus tools, and intelligent biofeedback tracking.

🧘 MEDITATION LIBRARY
Hundreds of guided meditations designed for busy professionals:
• Quick 5-min work breaks
• Stress & anxiety relief
• Focus & concentration
• Better sleep
• Morning energizers

⏰ FOCUS MODE
Boost productivity with our Pomodoro-style timer:
• 25-min work sessions
• Strategic breaks
• Daily focus stats
• Completion tracking

📊 BIOFEEDBACK INTEGRATION
Track your wellness journey:
• Connect Apple Health / Google Fit
• Monitor heart rate & HRV
• Stress level insights
• Post-session metrics

🌅 MORNING RITUALS
Build lasting habits:
• Custom routine builder
• Streak tracking
• Daily reminders
• Achievement system

💎 SUBSCRIPTION PLANS
Free: 5 sessions/month, perfect to get started
Standard ($6.99/mo): 40 sessions + Focus Mode + Biofeedback
Premium ($12.99/mo): Unlimited everything + all modules

Try it free - no credit card required!`,
    categories: ['Health & Fitness', 'Productivity'],
    contentRating: 'Everyone',
    website: 'https://respirobalance.com'
  }
};

/**
 * Social Media Assets
 */
export const SOCIAL_MEDIA_POSTS = {
  launch: {
    twitter: `🚀 Introducing Respiro Balance!

Your new companion for mindful workplace wellness.

✨ AI-powered meditation
⏰ Focus tools
📊 Biofeedback tracking
🌅 Morning rituals

Transform your workday. Start free ↓`,
    
    facebook: `We're excited to introduce Respiro Balance - a meditation and wellness app designed specifically for busy professionals!

🧘 Personalized meditation sessions
⏰ Pomodoro-style focus timer
📊 Biofeedback & health tracking
🌅 Morning ritual builder

Whether you're working from home or in the office, Respiro Balance helps you find calm, focus, and balance throughout your day.

Start with 5 free sessions per month - no credit card needed!`,
    
    instagram: `Find your calm in the chaos 🌊

Respiro Balance brings mindfulness to your workday with:
✨ Personalized meditations
⏰ Focus sessions
📊 Health insights
🌅 Morning rituals

Link in bio to start free! 💫

#MindfulnessAtWork #WorkplaceWellness #MeditationApp #StressRelief #ProductivityTools #WorkLifeBalance`
  }
};

/**
 * Press Kit Information
 */
export const PRESS_KIT = {
  headlines: [
    'Respiro Balance: Bringing Mindfulness to the Modern Workplace',
    'AI-Powered Meditation App Launches with Biofeedback Integration',
    'New App Helps Professionals Find Balance in Busy Workdays'
  ],
  
  boilerplate: `Respiro Balance is a comprehensive wellness platform designed for busy professionals seeking balance in their work lives. Combining AI-powered meditation recommendations, focus enhancement tools, and biofeedback tracking, the app provides a personalized approach to workplace wellness. Founded in 2024, Respiro Balance aims to make mindfulness accessible and practical for everyone, regardless of experience level.`,
  
  features: [
    'AI-Powered Recommendations: Personalized session suggestions based on user history and context',
    'Biofeedback Integration: Real-time health tracking with Apple Health and Google Fit',
    'Focus Mode: Pomodoro-style timer for enhanced productivity',
    'Morning Rituals: Customizable habit tracking for mindful starts',
    'Flexible Pricing: Free tier plus affordable Standard and Premium plans',
    'Offline Access: Download sessions for meditation anywhere'
  ],
  
  founders: [
    {
      name: 'Development Team',
      role: 'Product Development',
      bio: 'Built by a passionate team focused on workplace wellness and mental health technology.'
    }
  ]
};

/**
 * Feature Comparison Table (for landing page / pricing)
 */
export const FEATURE_COMPARISON = {
  headers: ['Feature', 'Free', 'Standard', 'Premium'],
  rows: [
    ['Sessions per month', '5', '40', 'Unlimited'],
    ['Meditation library', '✓', '✓', '✓'],
    ['Progress tracking', '✓', '✓', '✓'],
    ['Focus Mode', '✗', '✓', '✓'],
    ['Biofeedback tracking', '✗', '✓', '✓'],
    ['Morning Rituals', '✗', '✗', '✓'],
    ['Work-Life Balance', '✗', '✗', '✓'],
    ['Social Hub', '✗', '✗', '✓'],
    ['Offline downloads', '✗', '✗', '✓'],
    ['AI recommendations', '✗', '✗', '✓'],
    ['Priority support', '✗', '✗', '✓']
  ]
};
