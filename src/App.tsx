import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
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
import { MobilePWASetup } from '@/components/mobile/MobilePWASetup';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { QueryClient } from 'react-query';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { ThemeProvider } from 'next-themes';
import { Header, Footer, Toaster } from '@/components';
import { ErrorBoundary } from '@/components';

function App() {
  const { trackError } = usePerformanceMonitoring();

  // Global error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(event.error, { 
        source: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [trackError]);

  return (
    <ErrorBoundary>
      <QueryClient>
        <UserPreferencesProvider>
          <ThemeProvider defaultTheme="system" storageKey="respiro-ui-theme">
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Header />
                
                {/* Mobile PWA Setup */}
                <MobilePWASetup />
                
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
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
                  </Routes>
                </main>
                
                <Footer />
                <Toaster />
              </div>
            </Router>
          </ThemeProvider>
        </UserPreferencesProvider>
      </QueryClient>
    </ErrorBoundary>
  );
}

export default App;
