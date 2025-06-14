
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './providers/AuthProvider';
import { UserPreferencesProvider } from './context/UserPreferencesProvider';
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
import Index from './pages/Index';

const queryClient = new QueryClient();

function App() {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <UserPreferencesProvider>
            <NotificationsProvider>
              <Router>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settingspage" element={<SettingsPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/meditation" element={<MeditationPage />} />
                  <Route path="/meditation/advanced" element={<MeditateAdvanced />} />
                  <Route path="/meditation/audio-management" element={<MeditationAudioManagement />} />
                  <Route path="/breathing" element={<BreathingExercisesPage />} />
                  <Route path="/focus" element={<FocusModePage />} />
                  <Route path="/social" element={<SocialPage />} />
                  <Route path="/morning-ritual" element={<MorningRitual />} />
                </Routes>
              </Router>
            </NotificationsProvider>
          </UserPreferencesProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
