
import { TooltipConfig } from '../types';

export const tooltipConfigs: TooltipConfig[] = [
  // First-time user tooltips
  {
    id: 'first-play-session',
    target: '[data-guide="play-button"]',
    content: 'Start your meditation journey! This session is perfect for beginners.',
    trigger: 'hover',
    placement: 'top',
    showOnce: true,
    delay: 500,
    condition: () => {
      const sessionCount = parseInt(localStorage.getItem('user-session-count') || '0');
      return sessionCount === 0;
    }
  },
  
  {
    id: 'session-favoriting',
    target: '[data-guide="favorite-button"]',
    content: 'Love this session? Add it to favorites for quick access later.',
    trigger: 'hover',
    placement: 'top',
    showOnce: true,
    delay: 1000
  },
  
  // Progress tracking tooltips
  {
    id: 'streak-explanation',
    target: '[data-guide="streak-counter"]',
    content: 'Keep your meditation streak alive! Consistency is key to building lasting habits.',
    trigger: 'hover',
    placement: 'bottom',
    delay: 1000
  },
  
  {
    id: 'mood-tracking-help',
    target: '[data-guide="mood-selector"]',
    content: 'Track how you feel before and after meditation to see your progress over time.',
    trigger: 'focus',
    placement: 'top'
  },
  
  // Offline features tooltips
  {
    id: 'download-explanation',
    target: '[data-guide="download-button"]',
    content: 'Download this session to access it offline. Perfect for commutes or travel!',
    trigger: 'hover',
    placement: 'top',
    interactive: true,
    delay: 800
  },
  
  {
    id: 'storage-warning',
    target: '[data-guide="storage-indicator"]',
    content: 'You\'re running low on storage space. Consider removing old downloads to make room for new ones.',
    trigger: 'manual',
    placement: 'left',
    condition: () => {
      const storageUsed = parseFloat(localStorage.getItem('storage-usage') || '0');
      return storageUsed > 80;
    }
  },
  
  // Work-life balance tooltips
  {
    id: 'focus-mode-intro',
    target: '[data-guide="focus-mode-toggle"]',
    content: 'Activate focus mode to minimize distractions during your meditation sessions.',
    trigger: 'hover',
    placement: 'bottom',
    showOnce: true,
    delay: 1200
  },
  
  {
    id: 'break-reminder-setup',
    target: '[data-guide="break-reminder-card"]',
    content: 'Set up intelligent reminders to take mindful breaks throughout your workday.',
    trigger: 'manual',
    placement: 'top'
  },
  
  // Premium features tooltips
  {
    id: 'premium-feature-unlock',
    target: '[data-guide="premium-badge"]',
    content: 'This is a premium feature. Upgrade to access advanced meditation programs and insights.',
    trigger: 'click',
    placement: 'top',
    interactive: true
  },
  
  // Mobile-specific tooltips
  {
    id: 'mobile-gesture-help',
    target: '[data-guide="session-player"]',
    content: 'Tip: Swipe left or right to skip forward or backward during meditation.',
    trigger: 'manual',
    placement: 'bottom',
    condition: () => window.innerWidth < 768
  },
  
  // Advanced user tooltips
  {
    id: 'biometric-integration',
    target: '[data-guide="biometric-display"]',
    content: 'Connect your fitness tracker to see real-time heart rate and stress levels during meditation.',
    trigger: 'hover',
    placement: 'left',
    delay: 1500,
    condition: () => {
      const sessionCount = parseInt(localStorage.getItem('user-session-count') || '0');
      return sessionCount >= 10;
    }
  },
  
  {
    id: 'custom-program-hint',
    target: '[data-guide="create-program"]',
    content: 'Create custom meditation programs tailored to your specific goals and schedule.',
    trigger: 'hover',
    placement: 'top',
    showOnce: true,
    condition: () => {
      const sessionCount = parseInt(localStorage.getItem('user-session-count') || '0');
      return sessionCount >= 20;
    }
  },
  
  // Contextual help tooltips
  {
    id: 'session-completion-encouragement',
    target: '[data-guide="session-rating"]',
    content: 'Great job completing your session! Your feedback helps us recommend better content.',
    trigger: 'manual',
    placement: 'top'
  },
  
  {
    id: 'achievement-unlocked',
    target: '[data-guide="achievement-badge"]',
    content: 'Congratulations! You\'ve unlocked a new achievement. Keep up the great work!',
    trigger: 'manual',
    placement: 'bottom',
    interactive: true
  }
];
