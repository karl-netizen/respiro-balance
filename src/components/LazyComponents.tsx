import { lazy } from 'react';

// Route-level lazy loading
export const LazyMeditate = lazy(() => import('@/pages/Meditate'));
export const LazyEnhancedMeditationPage = lazy(() => import('@/pages/EnhancedMeditationPage'));
export const LazyProgressDashboard = lazy(() => import('@/pages/ProgressDashboard'));
export const LazyFocusModePage = lazy(() => import('@/pages/FocusModePage'));

// Heavy component lazy loading
export const LazyBreathingVisualizer = lazy(() => import('@/components/breathing/BreathingVisualizer'));

// Chart components lazy loading  
export const LazyMeditationProgressChart = lazy(() => import('@/components/progress/overview/MeditationProgressChart'));