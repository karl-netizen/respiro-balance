
// Core components
export { default as DashboardWelcome } from './DashboardWelcome';
export { default as DashboardStats } from './DashboardStats';
export { default as DashboardActionCards } from './DashboardActionCards';
export { default as DashboardQuickAccess } from './DashboardQuickAccess';
export { default as WeeklyProgressCard } from './WeeklyProgressCard';
export { default as MoodTracker } from './MoodTracker';
export { default as RecommendationCard } from './RecommendationCard';
export { default as QuickAccessSection } from './QuickAccessSection';
export { default as ActivityCalendar } from './ActivityCalendar';

// New refactored components
export { default as DashboardLayout } from './DashboardLayout';
export { default as DashboardMainContent } from './DashboardMainContent';
export { default as DashboardHeader } from './DashboardHeader';

// New mood-focused components
export { default as MoodCheckModal } from './MoodCheckModal';
export { default as MoodBasedRecommendations } from './MoodBasedRecommendations';
export { default as MoodDashboardHeader } from './MoodDashboardHeader';

// Hooks
export { useDashboardData } from './hooks/useDashboardData';

// Utils
export { generateQuickStats } from './utils/dashboardUtils';

// Types
export type { ActivityEntry } from './ActivityCalendar';
