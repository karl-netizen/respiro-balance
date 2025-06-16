import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { UserPreferencesProvider } from './context/UserPreferencesProvider';
import { AuthProvider } from './context/AuthProvider';
import { SubscriptionProvider } from './context/SubscriptionProvider';
import { NotificationsProvider } from './context/NotificationsProvider';
import { FocusProvider } from './context/FocusProvider';
import { NavigationHistoryProvider } from './context/NavigationHistoryProvider';
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
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { useNotifications } from '@/hooks/useNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error Boundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error Boundary - Component Stack:', errorInfo.componentStack);
    console.error('Error Boundary - Error:', error);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please check the console for more details.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
              <pre className="text-xs text-red-500 mt-2 overflow-auto">
                {(this.state as any).error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

function App() {
  const { requestPermission } = useNotifications();

  console.log('App component rendering...');
  console.log('React version check:', !!React);
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  useEffect(() => {
    // Initialize notifications on app load
    requestPermission();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserPreferencesProvider>
          <Router>
            <NavigationHistoryProvider>
              <AuthProvider>
                <SubscriptionProvider>
                  <NotificationsProvider>
                    <FocusProvider>
                      <div className="app-wrapper" style={{ minHeight: '100vh' }}>
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
                        <OfflineIndicator />
                      </div>
                    </FocusProvider>
                  </NotificationsProvider>
                </SubscriptionProvider>
              </AuthProvider>
            </NavigationHistoryProvider>
          </Router>
        </UserPreferencesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
