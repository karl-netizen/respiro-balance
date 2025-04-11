
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ViewportToggle from '@/components/layout/ViewportToggle';
import { cn } from '@/lib/utils';
import RequireAuth from '@/components/auth/RequireAuth';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import LandingPage from '@/pages/LandingPage';
import OnboardingPage from '@/pages/OnboardingPage';

const App: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);

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
        isMobileView && "max-w-[390px] mx-auto border-x border-border"
      )}
    >
      <ViewportToggle />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* Protected routes - auth is bypassed for testing */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        
        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
