
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
        id: 'welcome-step-1',
        target: '[data-testid="app-header"]',
        title: 'Welcome to Your Wellness Journey',
        content: 'Respiro Balance helps busy professionals find calm and focus through guided meditation.',
        placement: 'bottom',
        highlight: true,
        skippable: true
      },
      {
        id: 'welcome-step-2',
        target: '[data-testid="meditation-dashboard"]',
        title: 'Your Meditation Hub',
        content: 'This is your personal dashboard. Track progress, discover new sessions, and build healthy habits.',
        placement: 'top',
        highlight: true,
        skippable: true
      },
      {
        id: 'welcome-step-3',
        target: '[data-testid="session-categories"]',
        title: 'Choose Your Focus',
        content: 'Select from stress relief, focus enhancement, sleep improvement, or quick energy boosts.',
        placement: 'right',
        highlight: true,
        skippable: true
      }
    ],
    completionReward: {
      type: 'badge',
      value: 'welcome-completed'
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
        id: 'meditation-step-1',
        target: '[data-testid="session-player"]',
        title: 'Meet Your Meditation Player',
        content: 'Simple controls designed for distraction-free meditation. Just press play and follow along.',
        placement: 'top',
        action: 'click',
        highlight: true,
        skippable: true
      },
      {
        id: 'meditation-step-2',
        target: '[data-testid="progress-slider"]',
        title: 'Track Your Journey',
        content: 'See your progress and easily skip to different parts if needed.',
        placement: 'top',
        highlight: true,
        skippable: true
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
        id: 'offline-step-1',
        target: '[data-testid="download-button"]',
        title: 'Download for Offline',
        content: 'Download your favorite sessions to meditate anywhere - even without internet!',
        placement: 'top',
        highlight: true,
        skippable: true
      },
      {
        id: 'offline-step-2',
        target: '[data-testid="offline-indicator"]',
        title: 'Offline Ready',
        content: 'This badge shows which sessions are available offline.',
        placement: 'bottom',
        highlight: true,
        skippable: true
      }
    ]
  }
];
