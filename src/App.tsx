
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { UserPreferencesProvider } from '@/context/UserPreferencesProvider';
import { SubscriptionProvider } from '@/context/SubscriptionProvider';
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
import { MobilePWASetup } from '@/components/mobile/MobilePWASetup';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App component is rendering!');
  
  // Add a test to see if we can render anything at all
  const testRender = () => {
    console.log('✅ Test render function called');
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: 'red', 
        color: 'white', 
        padding: '10px', 
        zIndex: 9999 
      }}>
        APP IS WORKING!
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserPreferencesProvider>
            <SubscriptionProvider>
              <ThemeProvider defaultTheme="system" storageKey="respiro-ui-theme">
                <Router>
                  <NavigationHistoryProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      {testRender()}
                      
                      <Header />
                      
                      {/* Mobile PWA Setup */}
                      <MobilePWASetup />
                      
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/landing" element={<LandingPage />} />
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
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
