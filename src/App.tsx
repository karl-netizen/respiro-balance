
import React, { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { NotificationsProvider } from '@/context/NotificationsProvider';
import { FocusProvider } from '@/context/FocusProvider';
import { UserPreferencesProvider } from '@/context/UserPreferencesProvider';
import { SubscriptionProvider } from '@/components/subscription/SubscriptionProvider';
import { NavigationHistoryProvider } from '@/context/NavigationHistoryProvider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingMonitor } from '@/components/LoadingMonitor';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import SystemDashboardPage from '@/pages/SystemDashboardPage';
import Meditate from '@/pages/Meditate';
import BiofeedbackPage from '@/pages/BiofeedbackPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import PremiumPlusPage from '@/pages/PremiumPlusPage';
import SocialPage from '@/pages/SocialPage';
import MeditateAdvanced from '@/pages/MeditateAdvanced';
import PremiumProPage from '@/pages/PremiumProPage';
import UserJourneyTestingPage from '@/pages/UserJourneyTestingPage';
import MeditationLibrary from '@/pages/MeditationLibrary';
import MeditationAudioManagement from '@/pages/MeditationAudioManagement';
import MeditationSessionPage from '@/pages/MeditationSessionPage';
import Breathe from '@/pages/Breathe';
import MorningRitual from '@/pages/MorningRitual';
import FitbitCallback from '@/pages/FitbitCallback';
import MeditationMonitorPage from '@/pages/MeditationMonitorPage';
import SetupGuidePage from '@/pages/SetupGuidePage';
import WorkLifeBalance from '@/pages/WorkLifeBalance';
import Progress from '@/pages/Progress';
import FocusPage from '@/pages/FocusPage';
import HelpPage from '@/pages/HelpPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

// Lazy-loaded demo components
const PerformanceDemo = lazy(() => import('@/components/performance/PerformanceDemo'));
const AIPersonalizationDemo = lazy(() => import('@/components/ai-personalization/AIPersonalizationDemo'));
const SecuritySystemDemo = lazy(() => import('@/components/security/SecuritySystemDemo'));
const SecureFormsDemo = lazy(() => import('@/components/security/SecureFormsDemo'));
const AdvancedSecurityDemo = lazy(() => import('@/components/security/advanced/AdvancedSecurityDemo'));
import { ComprehensiveTestingDemo } from '@/test/demo/comprehensive-testing-demo';
import { TestingFrameworkSummary } from '@/test/demo/testing-framework-summary';
import OnboardingPage from '@/pages/Onboarding';
import SimpleAuthPage from '@/pages/SimpleAuthPage';
import { MobilePWASetup } from '@/components/mobile/MobilePWASetup';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, isLoading: authLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();

  // Show loading while checking auth and onboarding status
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to onboarding if not completed
  if (user && !hasCompletedOnboarding) {
    return (
      <NotificationsProvider>
        <FocusProvider>
          <UserPreferencesProvider>
            <SubscriptionProvider>
              <ThemeProvider defaultTheme="system" storageKey="respiro-ui-theme">
                <Router>
                  <NavigationHistoryProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <OnboardingPage />
                      <MobilePWASetup />
                      <LoadingMonitor />
                      <Toaster />
                    </div>
                  </NavigationHistoryProvider>
                </Router>
              </ThemeProvider>
            </SubscriptionProvider>
          </UserPreferencesProvider>
        </FocusProvider>
      </NotificationsProvider>
    );
  }

  return (
    <NotificationsProvider>
      <FocusProvider>
        <UserPreferencesProvider>
          <SubscriptionProvider>
            <ThemeProvider defaultTheme="system" storageKey="respiro-ui-theme">
              <Router>
                <NavigationHistoryProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Header />
                    
                    {/* Mobile PWA Setup */}
                    <MobilePWASetup />
                    
                    {/* Loading Performance Monitor */}
                    <LoadingMonitor />
                    
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route path="/dashboard" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/auth" element={user ? <HomePage /> : <SimpleAuthPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/account" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/meditate" element={<Meditate />} />
                        <Route path="/system" element={<SystemDashboardPage />} />
                        <Route path="/meditation" element={<MeditationLibrary />} />
                        <Route path="/biofeedback" element={<BiofeedbackPage />} />
                        <Route path="/subscription" element={<SubscriptionPage />} />
                        <Route path="/premium-plus" element={<PremiumPlusPage />} />
                        <Route path="/social" element={<SocialPage />} />
                        <Route path="/meditate-advanced" element={<MeditateAdvanced />} />
                        <Route path="/premium-pro" element={<PremiumProPage />} />
                        <Route path="/testing" element={<UserJourneyTestingPage />} />
                        <Route path="/meditation/audio-management" element={<MeditationAudioManagement />} />
                        <Route path="/meditate/session/:sessionId" element={<MeditationSessionPage />} />
                        <Route path="/meditation-monitor" element={<MeditationMonitorPage />} />
                        <Route path="/setup-guide" element={<SetupGuidePage />} />
                        <Route path="/fitbit-callback" element={<FitbitCallback />} />
                        <Route path="/breathe" element={<Breathe />} />
                        <Route path="/morning-ritual" element={<MorningRitual />} />
                        <Route path="/work-life-balance" element={<WorkLifeBalance />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/focus" element={<FocusPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />

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
                        <Route path="/enhanced-work-life" element={React.createElement(React.lazy(() => import('@/examples/EnhancedWorkLifeExample').then(m => ({ default: m.EnhancedWorkLifeExample }))))} />

                      </Routes>
                    </main>
                    
                    <Footer />
                    <Toaster />
                  </div>
                </NavigationHistoryProvider>
              </Router>
            </ThemeProvider>
          </SubscriptionProvider>
        </UserPreferencesProvider>
      </FocusProvider>
    </NotificationsProvider>
  );
}

export default App;
