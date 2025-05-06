import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ViewportToggle from '@/components/layout/ViewportToggle';
import { cn } from '@/lib/utils';
import RequireAuth from '@/components/auth/RequireAuth';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from "@/hooks/use-mobile";

// Import pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import LandingPage from '@/pages/LandingPage';
import OnboardingPage from '@/pages/OnboardingPage';
import Breathe from '@/pages/Breathe';
import Meditate from '@/pages/Meditate';
import Progress from '@/pages/Progress';
import MeditationSession from '@/pages/MeditationSession';
import Account from '@/pages/Account';
import MorningRitual from '@/pages/MorningRitual';
import Settings from '@/pages/Settings';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import NotFound from '@/pages/NotFound';
import WorkLifeBalance from '@/pages/WorkLifeBalance';

const App: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleViewportChange = (e: CustomEvent) => {
      setIsMobileView(e.detail.isMobile);
    };

    // @ts-ignore
    window.addEventListener('viewport-change', handleViewportChange);

    return () => {
      // @ts-ignore
      window.removeEventListener('viewport-change', handleViewportChange);
    };
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen w-full", 
        (isMobileView || isMobile) && "max-w-[390px] mx-auto border-x border-border"
      )}
    >
      <ViewportToggle />
      <Routes>
        {/* Public routes - Use Home component instead of LandingPage for root path */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* Terms and Privacy Pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* Meditation routes */}
        <Route path="/meditate" element={<Meditate />} />
        <Route path="/meditate/session/:sessionId" element={<MeditationSession />} />
        
        {/* Breathing routes */}
        <Route path="/breathe" element={<Breathe />} />
        
        {/* Work-Life Balance route */}
        <Route path="/work-life-balance" element={<WorkLifeBalance />} />
        
        {/* Progress routes */}
        <Route path="/progress" element={<Progress />} />
        
        {/* Account routes */}
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        
        {/* Morning Ritual routes */}
        <Route path="/morning-ritual" element={<MorningRitual />} />
        
        {/* Protected routes - auth is bypassed for testing */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        
        {/* 404 route - catch all unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
