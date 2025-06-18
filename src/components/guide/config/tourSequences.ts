
import { TourSequence } from '../types';

export const tourSequences: TourSequence[] = [
  {
    id: 'welcome-tour',
    name: 'Welcome to Respiro Balance',
    description: 'Discover meditation made for professionals',
    trigger: 'first-visit',
    userType: 'new',
    steps: [
      {
        id: 'welcome-intro',
        target: '[data-guide="main-navigation"]',
        title: 'Welcome to Your Wellness Journey',
        content: 'Respiro Balance helps busy professionals find calm and focus through guided meditation. Let\'s explore the key features together!',
        placement: 'bottom',
        highlight: true
      },
      {
        id: 'meditation-hub',
        target: '[data-guide="meditation-dashboard"]',
        title: 'Your Meditation Hub',
        content: 'This is your personal dashboard where you can track progress, discover new sessions, and build healthy habits.',
        placement: 'top',
        highlight: true
      },
      {
        id: 'session-categories',
        target: '[data-guide="session-categories"]',
        title: 'Choose Your Focus',
        content: 'Select from stress relief, focus enhancement, sleep improvement, or quick energy boosts based on your current needs.',
        placement: 'left',
        highlight: true
      },
      {
        id: 'play-session',
        target: '[data-guide="play-button"]',
        title: 'Start Your First Session',
        content: 'Ready to begin? Click the play button on any session to start your meditation journey. We recommend starting with a 5-minute guided session.',
        placement: 'top',
        highlight: true,
        action: 'click'
      }
    ],
    completionReward: {
      type: 'badge',
      value: 'welcome-explorer'
    }
  },
  {
    id: 'meditation-basics',
    name: 'Your First Meditation',
    description: 'Learn how to use our meditation player',
    trigger: 'feature-unlock',
    userType: 'new',
    steps: [
      {
        id: 'player-intro',
        target: '[data-guide="session-player"]',
        title: 'Meet Your Meditation Player',
        content: 'Simple, distraction-free controls designed for focused meditation. Just press play and follow along with the guided instructions.',
        placement: 'top',
        highlight: true
      },
      {
        id: 'progress-tracking',
        target: '[data-guide="progress-slider"]',
        title: 'Track Your Journey',
        content: 'See your progress throughout the session. You can skip to different parts if needed, but we recommend listening to the full session.',
        placement: 'bottom',
        highlight: true
      },
      {
        id: 'session-controls',
        target: '[data-guide="session-controls"]',
        title: 'Player Controls',
        content: 'Pause, play, or adjust volume as needed. The goal is to be comfortable so you can focus on your practice.',
        placement: 'top',
        highlight: true
      }
    ]
  },
  {
    id: 'offline-features',
    name: 'Meditation Anywhere',
    description: 'Download sessions for offline access',
    trigger: 'manual',
    userType: 'all',
    steps: [
      {
        id: 'download-intro',
        target: '[data-guide="download-button"]',
        title: 'Download for Offline',
        content: 'Download your favorite sessions to meditate anywhere - even without internet! Perfect for commutes, travel, or areas with poor connectivity.',
        placement: 'top',
        highlight: true
      },
      {
        id: 'offline-indicator',
        target: '[data-guide="offline-badge"]',
        title: 'Offline Ready',
        content: 'This badge shows which sessions are available offline. Downloaded sessions can be accessed anytime from your library.',
        placement: 'bottom',
        highlight: true
      },
      {
        id: 'storage-management',
        target: '[data-guide="storage-indicator"]',
        title: 'Manage Storage',
        content: 'Keep track of your device storage. You can remove old downloads to make space for new ones.',
        placement: 'left',
        highlight: true
      }
    ]
  },
  {
    id: 'progress-tracking',
    name: 'Track Your Growth',
    description: 'Understanding your meditation progress',
    trigger: 'time-based',
    userType: 'all',
    steps: [
      {
        id: 'streak-counter',
        target: '[data-guide="streak-counter"]',
        title: 'Build Your Streak',
        content: 'Consistency is key! Track your daily meditation streak to build lasting habits.',
        placement: 'bottom',
        highlight: true
      },
      {
        id: 'mood-tracking',
        target: '[data-guide="mood-selector"]',
        title: 'Track Your Mood',
        content: 'Log how you feel before and after meditation to see the positive impact over time.',
        placement: 'top',
        highlight: true
      },
      {
        id: 'analytics-dashboard',
        target: '[data-guide="progress-chart"]',
        title: 'Your Progress Analytics',
        content: 'Visualize your meditation journey with detailed insights and trends.',
        placement: 'right',
        highlight: true
      }
    ]
  }
];
