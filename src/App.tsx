
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserPreferencesProvider } from '@/context';
import { NotificationsProvider } from '@/context/NotificationsProvider';
import { AuthProvider } from "@/hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import MeditationLibrary from "./pages/MeditationLibrary";
import BreathingExercise from "./pages/BreathingExercise";
import MeditationSessionView from "./pages/MeditationSessionView";
import ProgressDashboard from "./pages/ProgressDashboard";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SettingsPage from "./pages/SettingsPage";
import AppSettings from "./pages/AppSettings";
import HelpPage from "./pages/HelpPage";
import MorningRitual from "./pages/MorningRitual";
import RequireAuth from "./components/auth/RequireAuth";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import "./App.css";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/resend-verification" element={<ResendVerificationPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/help" element={<HelpPage />} />
                
                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/meditate" element={<MeditationLibrary />} />
                  <Route path="/breathe" element={<BreathingExercise />} />
                  <Route path="/session/:sessionId" element={<MeditationSessionView />} />
                  <Route path="/progress" element={<ProgressDashboard />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/app-settings" element={<AppSettings />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/morning-ritual" element={<MorningRitual />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<Navigate to="/error" />} />
              </Routes>
              <Toaster />
            </Router>
          </NotificationsProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
