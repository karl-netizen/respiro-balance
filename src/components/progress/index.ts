// Main components - export only non-lazy loaded ones
export { default as ProgressHero } from './ProgressHero';

// Note: Tab components are now lazy-loaded in Progress.tsx
// Do not export them here to avoid breaking code splitting
// export { default as OverviewTab } from './OverviewTab';
// export { default as InsightsTab } from './InsightsTab';
// export { default as CorrelationsTab } from './CorrelationsTab';
// export { default as AchievementsTab } from './AchievementsTab';

// Hooks
export { useMeditationStats } from './useMeditationStats';

// Types
export type { MeditationStats, SessionDay } from './types/meditationStats';
