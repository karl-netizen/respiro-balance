
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  UserPreferencesProvider,
  AuthProvider,
  NotificationsProvider,
  SubscriptionProvider,
} from './context';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import MorningRitual from './pages/MorningRitual';
import Breathe from './pages/Breathe';
import Meditate from './pages/Meditate';
import WorkLifeBalance from './pages/WorkLifeBalance';
import BreakSettingsPage from './pages/BreakSettingsPage';
import MeditationSession from './pages/MeditationSession';
import Progress from './pages/Progress';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

// Auth and Route Protection
import RequireAuth from './components/auth/RequireAuth';
import { useEffect } from 'react';

function App() {
  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registered: ', registration);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <SubscriptionProvider>
            <NotificationsProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Protected Routes */}
                  <Route element={<RequireAuth>{null}</RequireAuth>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/morning-ritual" element={<MorningRitual />} />
                    <Route path="/breathe" element={<Breathe />} />
                    <Route path="/meditate" element={<Meditate />} />
                    <Route path="/meditate/:sessionId" element={<MeditationSession />} />
                    <Route path="/work-life-balance" element={<WorkLifeBalance />} />
                    <Route path="/work-life-balance/break-settings" element={<BreakSettingsPage />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster position="top-right" />
            </NotificationsProvider>
          </SubscriptionProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
