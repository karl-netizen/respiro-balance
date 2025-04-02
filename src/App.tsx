
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserPreferencesProvider } from '@/context';
import { NotificationsProvider } from '@/context/NotificationsProvider';
import { AuthProvider } from "@/providers/AuthProvider";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import MeditationLibrary from "@/pages/MeditationLibrary";
import BreathingExercise from "@/pages/BreathingExercise";
import MeditationSessionView from "@/pages/MeditationSessionView";
import ProgressDashboard from "@/pages/ProgressDashboard";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AccountPage from "@/pages/AccountPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResendVerificationPage from "@/pages/ResendVerificationPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import OnboardingPage from "@/pages/OnboardingPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import SettingsPage from "@/pages/SettingsPage";
import AppSettings from "@/pages/AppSettings";
import HelpPage from "@/pages/HelpPage";
import MorningRitual from "@/pages/MorningRitual";
import RequireAuth from "@/components/auth/RequireAuth";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import FAQPage from "@/pages/FAQ";
import "./App.css";

// Create a wrapper component to use hooks and pass them to the AuthProvider
function AuthProviderWithNavigate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
}

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
      <Router>
        <AuthProviderWithNavigate>
          <UserPreferencesProvider>
            <NotificationsProvider>
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
                <Route path="/faq" element={<FAQPage />} />
                
                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/dashboard" element={<Dashboard />} />
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
                
                {/* Use NotFound instead of ErrorPage for 404 errors */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </NotificationsProvider>
          </UserPreferencesProvider>
        </AuthProviderWithNavigate>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
