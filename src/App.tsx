
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { UserPreferencesProvider } from './context/UserPreferencesProvider';
import { AuthProvider } from './context/AuthProvider';
import { SubscriptionProvider } from './context/SubscriptionProvider';
import { NotificationsProvider } from './context/NotificationsProvider';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MeditationPage from './pages/Meditate';
import BreathingExercisesPage from './pages/BreathingExercise';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import FocusModePage from './pages/FocusModePage';
import MeditateAdvanced from './pages/MeditateAdvanced';
import SocialPage from './pages/SocialPage';
import MeditationAudioManagement from './pages/MeditationAudioManagement';
import MorningRitual from './pages/MorningRitual';
import AccountPage from './pages/AccountPage';
import AppSettings from './pages/AppSettings';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import EnhancedMeditationPage from './pages/EnhancedMeditationPage';
import Progress from './pages/Progress';
import WorkLifeBalance from './pages/WorkLifeBalance';
import BiofeedbackDashboard from './pages/BiofeedbackDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpPage from './pages/HelpPage';
import FAQ from './pages/FAQ';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendering...');
  console.log('React version check:', !!React);
  
  return (
    <QueryClientProvider client={queryClient}>
      <UserPreferencesProvider>
        <Router>
          <AuthProvider>
            <SubscriptionProvider>
              <NotificationsProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settingspage" element={<SettingsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/app-settings" element={<AppSettings />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/meditate" element={<MeditationPage />} />
                  <Route path="/meditation" element={<MeditationPage />} />
                  <Route path="/meditation/enhanced" element={<EnhancedMeditationPage />} />
                  <Route path="/meditation/advanced" element={<MeditateAdvanced />} />
                  <Route path="/meditation/audio-management" element={<MeditationAudioManagement />} />
                  <Route path="/breathe" element={<BreathingExercisesPage />} />
                  <Route path="/breathing" element={<BreathingExercisesPage />} />
                  <Route path="/work-life-balance" element={<WorkLifeBalance />} />
                  <Route path="/focus" element={<FocusModePage />} />
                  <Route path="/social" element={<SocialPage />} />
                  <Route path="/morning-ritual" element={<MorningRitual />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/biofeedback" element={<BiofeedbackDashboard />} />
                  <Route path="/devices" element={<BiofeedbackDashboard />} />
                  <Route path="/biometric-data" element={<BiofeedbackDashboard />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
              </NotificationsProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </Router>
      </UserPreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
