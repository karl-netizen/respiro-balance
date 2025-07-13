
import React, { useEffect } from 'react';
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
import MeditationAudioManagement from '@/pages/MeditationAudioManagement';
import MeditationSessionPage from '@/pages/MeditationSessionPage';
import Breathe from '@/pages/Breathe';
import MorningRitual from '@/pages/MorningRitual';
import WorkLifeBalance from '@/pages/WorkLifeBalance';
import Progress from '@/pages/Progress';
import FocusPage from '@/pages/FocusPage';
import HelpPage from '@/pages/HelpPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import OnboardingPage from '@/pages/Onboarding';
import { MobilePWASetup } from '@/components/mobile/MobilePWASetup';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

const queryClient = new QueryClient();

function App() {
  usePerformanceMonitoring();
  
  return (
    <ErrorBoundary level="global" onError={(error, errorInfo) => {
      console.error('Global error boundary:', error, errorInfo);
    }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
                      
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/landing" element={<LandingPage />} />
                          <Route path="/onboarding" element={<OnboardingPage />} />
                          <Route path="/dashboard" element={<HomePage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/reset-password" element={<ResetPasswordPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/system" element={<SystemDashboardPage />} />
                          <Route path="/meditation" element={<Meditate />} />
                          <Route path="/biofeedback" element={<BiofeedbackPage />} />
                          <Route path="/subscription" element={<SubscriptionPage />} />
                          <Route path="/premium-plus" element={<PremiumPlusPage />} />
                          <Route path="/social" element={<SocialPage />} />
                          <Route path="/meditate-advanced" element={<MeditateAdvanced />} />
                          <Route path="/premium-pro" element={<PremiumProPage />} />
                          <Route path="/testing" element={<UserJourneyTestingPage />} />
                          <Route path="/meditation/audio-management" element={<MeditationAudioManagement />} />
                          <Route path="/meditate/session/:sessionId" element={<MeditationSessionPage />} />
                          <Route path="/breathe" element={<Breathe />} />
                          <Route path="/morning-ritual" element={<MorningRitual />} />
                          <Route path="/work-life-balance" element={<WorkLifeBalance />} />
                          <Route path="/progress" element={<Progress />} />
                          <Route path="/focus" element={<FocusPage />} />
                          <Route path="/help" element={<HelpPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/privacy" element={<PrivacyPage />} />
                          <Route path="/terms" element={<TermsPage />} />
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
    </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
