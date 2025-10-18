
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { NotificationsProvider } from '@/context/NotificationsProvider';
import { FocusProvider } from '@/context/FocusProvider';
import { UserPreferencesProvider } from '@/context/UserPreferencesProvider';
import { SubscriptionProvider } from '@/features/subscription';
import { NavigationHistoryProvider } from '@/context/NavigationHistoryProvider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingMonitor } from '@/components/LoadingMonitor';
import { DashboardSkeleton } from '@/components/ui/skeleton-variants';
import { SuspenseRoute } from '@/components/SuspenseRoute';
import { CookieConsent } from '@/components/analytics/CookieConsent';
import { analytics } from '@/lib/analytics/analytics';
// Keep only critical landing/auth pages as eager imports
import HomePage from '@/pages/HomePage';
// import Dashboard from '@/pages/Dashboard';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
// import ProfilePage from '@/pages/ProfilePage';
// import SettingsPage from '@/pages/SettingsPage';
// import SystemDashboardPage from '@/pages/SystemDashboardPage';
// import Meditate from '@/pages/Meditate';
// import BiofeedbackPage from '@/pages/BiofeedbackPage';
// import SubscriptionPage from '@/pages/SubscriptionPage';
// import PremiumPlusPage from '@/pages/PremiumPlusPage';
// import MeditateAdvanced from '@/pages/MeditateAdvanced';
// import PremiumProPage from '@/pages/PremiumProPage';
// import UserJourneyTestingPage from '@/pages/UserJourneyTestingPage';
// import MeditationAudioManagement from '@/pages/MeditationAudioManagement';
// import MeditationSessionPage from '@/pages/MeditationSessionPage';
import FitbitCallback from '@/pages/FitbitCallback';
// import MeditationMonitorPage from '@/pages/MeditationMonitorPage';
// import SetupGuidePage from '@/pages/SetupGuidePage';
// import HelpPage from '@/pages/HelpPage';
// import ContactPage from '@/pages/ContactPage';
// import PrivacyPage from '@/pages/PrivacyPage';
// import TermsPage from '@/pages/TermsPage';

// Lazy-loaded components for better performance
import {
  LazyPricingPage,
  LazyAccountSettings,
  LazyModuleLibraryPage,
  LazyBiofeedbackSettings,
  LazyMeditationLibrary,
  LazyProgressPage,
  LazyDashboard,
  LazyProfilePage,
  LazySettingsPage,
  LazySystemDashboardPage,
  LazyMeditate,
  LazyBiofeedbackPage,
  LazySubscriptionPage,
  LazyPremiumPlusPage,
  LazyMeditateAdvanced,
  LazyPremiumProPage,
  LazyUserJourneyTestingPage,
  LazyMeditationAudioManagement,
  LazyMeditationSessionPage,
  LazyMeditationMonitorPage,
  LazySetupGuidePage,
  LazyHelpPage,
  LazyContactPage,
  LazyPrivacyPage,
  LazyTermsPage,
  LazyOnboardingPage,
  LazyFocusPage,
  LazyWorkLifeBalance,
  LazyMorningRitual,
  LazyBreathePage,
  LazySocialPage,
  LazyEnhancedWorkLifeExample,
  setupPreloadHooks
} from '@/lib/performance/lazyLoad';

// Lazy-loaded demo components
const PerformanceDemo = lazy(() => import('@/components/performance/PerformanceDemo'));
const AIPersonalizationDemo = lazy(() => import('@/components/ai-personalization/AIPersonalizationDemo'));
const SecuritySystemDemo = lazy(() => import('@/components/security/SecuritySystemDemo'));
const SecureFormsDemo = lazy(() => import('@/components/security/SecureFormsDemo'));
const AdvancedSecurityDemo = lazy(() => import('@/components/security/advanced/AdvancedSecurityDemo'));

import { ComprehensiveTestingDemo } from '@/test/demo/comprehensive-testing-demo';
import { TestingFrameworkSummary } from '@/test/demo/testing-framework-summary';
// import OnboardingPage from '@/pages/Onboarding';
import SimpleAuthPage from '@/pages/SimpleAuthPage';
import { MobilePWASetup } from '@/components/mobile/MobilePWASetup';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useModuleSync } from '@/hooks/useModuleSync';
import { useSubscriptionSync } from '@/hooks/useSubscriptionSync';
import { SubscriptionMonitor } from '@/features/subscription';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import { Navigate } from 'react-router-dom';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  usePerformanceMonitoring();
  
  // Initialize analytics on app load
  useEffect(() => {
    analytics.initialize();
  }, []);
  
  return (
    <ErrorBoundary level="global" onError={(error, errorInfo) => {
      console.error('Global error boundary:', error, errorInfo);
    }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  return (
    <NotificationsProvider>
      <FocusProvider>
        <UserPreferencesProvider>
          <SubscriptionProvider>
            <ModuleSyncWrapper>
              <ThemeProvider defaultTheme="system" storageKey="respiro-ui-theme">
                <Router>
                  <NavigationHistoryProvider>
                    <OnboardingGuard>
                      <div className="min-h-screen bg-background font-sans antialiased">
                        <Header />
                      
                      {/* Mobile PWA Setup */}
                      <MobilePWASetup />
                      
                      {/* Cookie Consent Banner */}
                      <CookieConsent />
                      
                      {/* Loading Performance Monitor */}
                      <LoadingMonitor />
                      
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/landing" element={<LandingPage />} />
                          <Route path="/home" element={<HomePage />} />
                          <Route path="/onboarding" element={
                            <SuspenseRoute><LazyOnboardingPage /></SuspenseRoute>
                          } />
                          <Route path="/dashboard" element={
                            <SuspenseRoute><LazyDashboard /></SuspenseRoute>
                          } />
                         <Route path="/register" element={<RegisterPage />} />
                         <Route path="/login" element={<LoginPage />} />
                         <Route path="/auth" element={<SimpleAuthPage />} />
                         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/profile" element={
                          <SuspenseRoute><LazyProfilePage /></SuspenseRoute>
                        } />
                        <Route path="/account" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyAccountSettings />
                          </Suspense>
                        } />
                        <Route path="/settings" element={
                          <SuspenseRoute><LazySettingsPage /></SuspenseRoute>
                        } />
                        <Route path="/pricing" element={
                          <SuspenseRoute><LazyPricingPage /></SuspenseRoute>
                        } />
                        <Route path="/meditate" element={
                          <SuspenseRoute><LazyMeditate /></SuspenseRoute>
                        } />
                        <Route path="/system" element={
                          <SuspenseRoute><LazySystemDashboardPage /></SuspenseRoute>
                        } />
                        <Route path="/meditation" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyMeditationLibrary />
                          </Suspense>
                        } />
                        <Route path="/biofeedback" element={
                          <SuspenseRoute><LazyBiofeedbackPage /></SuspenseRoute>
                        } />
                        <Route path="/subscription" element={
                          <SuspenseRoute><LazySubscriptionPage /></SuspenseRoute>
                        } />
                        <Route path="/premium-plus" element={
                          <SuspenseRoute><LazyPremiumPlusPage /></SuspenseRoute>
                        } />
                        <Route path="/social" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazySocialPage />
                          </Suspense>
                        } />
                        <Route path="/meditate-advanced" element={
                          <SuspenseRoute><LazyMeditateAdvanced /></SuspenseRoute>
                        } />
                        <Route path="/premium-pro" element={
                          <SuspenseRoute><LazyPremiumProPage /></SuspenseRoute>
                        } />
                        <Route path="/testing" element={
                          <SuspenseRoute><LazyUserJourneyTestingPage /></SuspenseRoute>
                        } />
                        <Route path="/meditation/audio-management" element={
                          <SuspenseRoute><LazyMeditationAudioManagement /></SuspenseRoute>
                        } />
                        <Route path="/meditate/session/:sessionId" element={
                          <SuspenseRoute><LazyMeditationSessionPage /></SuspenseRoute>
                        } />
                        <Route path="/meditation-monitor" element={
                          <SuspenseRoute><LazyMeditationMonitorPage /></SuspenseRoute>
                        } />
                        <Route path="/setup-guide" element={
                          <SuspenseRoute><LazySetupGuidePage /></SuspenseRoute>
                        } />
                        <Route path="/modules" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyModuleLibraryPage />
                          </Suspense>
                        } />
                        <Route path="/biofeedback/settings" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyBiofeedbackSettings />
                          </Suspense>
                        } />
                        <Route path="/fitbit-callback" element={<FitbitCallback />} />
                        <Route path="/breathe" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyBreathePage />
                          </Suspense>
                        } />
                        <Route path="/morning-ritual" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyMorningRitual />
                          </Suspense>
                        } />
                        <Route path="/work-life-balance" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyWorkLifeBalance />
                          </Suspense>
                        } />
                        <Route path="/progress" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyProgressPage />
                          </Suspense>
                        } />
                        <Route path="/focus" element={
                          <Suspense fallback={<DashboardSkeleton />}>
                            <LazyFocusPage />
                          </Suspense>
                        } />
                        <Route path="/help" element={
                          <SuspenseRoute><LazyHelpPage /></SuspenseRoute>
                        } />
                        <Route path="/contact" element={
                          <SuspenseRoute><LazyContactPage /></SuspenseRoute>
                        } />
                        <Route path="/privacy" element={
                          <SuspenseRoute><LazyPrivacyPage /></SuspenseRoute>
                        } />
                        <Route path="/terms" element={
                          <SuspenseRoute><LazyTermsPage /></SuspenseRoute>
                        } />

                        <Route path="/performance-demo" element={
                          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                            <PerformanceDemo />
                          </React.Suspense>
                        } />
                        <Route path="/ai-personalization" element={
                          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                            <AIPersonalizationDemo />
                          </React.Suspense>
                        } />
                        <Route path="/security-demo" element={
                          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                            <SecuritySystemDemo />
                          </React.Suspense>
                        } />
                        <Route path="/secure-forms" element={
                          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                            <SecureFormsDemo />
                          </React.Suspense>
                        } />
                        <Route path="/advanced-security" element={
                          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                            <AdvancedSecurityDemo />
                          </React.Suspense>
                        } />
                        <Route path="/testing-demo" element={<ComprehensiveTestingDemo />} />
                        <Route path="/testing-summary" element={<TestingFrameworkSummary />} />
                        <Route path="/enhanced-work-life" element={
                          <SuspenseRoute><LazyEnhancedWorkLifeExample /></SuspenseRoute>
                        } />

                        </Routes>
                      </main>
                      
                      <Footer />
                      <Toaster />
                    </div>
                    </OnboardingGuard>
                  </NavigationHistoryProvider>
                </Router>
              </ThemeProvider>
              </ModuleSyncWrapper>
            </SubscriptionProvider>
          </UserPreferencesProvider>
        </FocusProvider>
      </NotificationsProvider>
    );
  }

// Wrapper component to sync modules - must be inside SubscriptionProvider
function ModuleSyncWrapper({ children }: { children: React.ReactNode }) {
  useModuleSync();
  useSubscriptionSync(); // Sync subscription tier with module store
  
  // Setup preload hooks on mount
  useEffect(() => {
    setupPreloadHooks();
  }, []);
  
  return (
    <>
      <SubscriptionMonitor />
      {children}
    </>
  );
}

export default App;
