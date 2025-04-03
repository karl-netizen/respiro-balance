
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { UserPreferencesProvider } from '@/context/UserPreferencesProvider';
import { SubscriptionProvider } from '@/context/SubscriptionProvider';

// Pages
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import MeditationLibrary from '@/pages/MeditationLibrary';
import MeditationSessionView from '@/pages/MeditationSessionView';
import Breathe from '@/pages/Breathe';
import BreathingExercise from '@/pages/BreathingExercise';
import MorningRituals from '@/pages/MorningRituals';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import SubscriptionPage from '@/pages/SubscriptionPage';

// Create React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            <SubscriptionProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/meditate" element={<MeditationLibrary />} />
                  <Route path="/meditate/:sessionId" element={<MeditationSessionView />} />
                  <Route path="/breathing" element={<Breathe />} />
                  <Route path="/breathing/:exerciseId" element={<BreathingExercise />} />
                  <Route path="/morning-rituals" element={<MorningRituals />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster position="top-right" />
            </SubscriptionProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
