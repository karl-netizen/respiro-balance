
import { TooltipConfig } from '../types';

export const tooltipConfigs: TooltipConfig[] = [
  {
    id: 'first-play-session',
    target: '[data-testid="play-button"]',
    content: 'Start your meditation journey! This session is perfect for beginners.',
    placement: 'top',
    trigger: 'hover',
    showOnce: true,
    condition: () => {
      // Check if user hasn't played a session yet
      const hasPlayedSession = localStorage.getItem('hasPlayedSession');
      return !hasPlayedSession;
    }
  },
  {
    id: 'session-favoriting',
    target: '[data-testid="favorite-button"]',
    content: 'Love this session? Add it to favorites for quick access later.',
    placement: 'top',
    trigger: 'manual',
    showOnce: true
  },
  {
    id: 'streak-counter',
    target: '[data-testid="streak-counter"]',
    content: 'Keep your meditation streak alive! Consistency is key to building lasting habits.',
    placement: 'bottom',
    trigger: 'hover',
    delay: 1000
  },
  {
    id: 'mood-tracking',
    target: '[data-testid="mood-selector"]',
    content: 'Track how you feel before and after meditation to see your progress over time.',
    placement: 'right',
    trigger: 'focus'
  },
  {
    id: 'download-explanation',
    target: '[data-testid="download-button"]',
    content: 'Download this session to access it offline. Perfect for commutes or travel!',
    placement: 'top',
    trigger: 'hover',
    interactive: true
  },
  {
    id: 'first-session-encouragement',
    target: '[data-testid="meditation-card"]',
    content: '🎉 Congratulations on completing your first session! Ready for another?',
    placement: 'top',
    trigger: 'manual',
    showOnce: true
  },
  {
    id: 'focus-mode-intro',
    target: '[data-testid="focus-mode-toggle"]',
    content: 'Activate focus mode to minimize distractions during your meditation.',
    placement: 'left',
    trigger: 'hover',
    showOnce: true
  },
  {
    id: 'break-reminder',
    target: '[data-testid="break-reminder-card"]',
    content: 'Set reminders to take mindful breaks throughout your workday.',
    placement: 'top',
    trigger: 'manual'
  }
];
