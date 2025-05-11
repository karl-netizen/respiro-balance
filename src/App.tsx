
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  FocusProvider
} from './context';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FocusModePage from './pages/FocusModePage';
import Progress from './pages/Progress';
import BiofeedbackPage from './pages/BiofeedbackPage';
import WorkLifeBalance from './pages/WorkLifeBalance';
import BreakSettingsPage from './pages/BreakSettingsPage';
import Breathe from './pages/Breathe';
import LandingPage from './pages/LandingPage';
import Meditate from './pages/Meditate';
import MeditationSessionView from './pages/MeditationSessionView';
import MorningRitual from './pages/MorningRitual';
import Account from './pages/Account';
import FAQ from './pages/FAQ';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FocusProvider>
      <Routes>
        {/* Redirect root to landing page */}
        <Route path="/" element={<Navigate replace to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<FocusModePage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/biofeedback" element={<BiofeedbackPage />} />
        <Route path="/work-life-balance" element={<WorkLifeBalance />} />
        <Route path="/work-life-balance/break-settings" element={<BreakSettingsPage />} />
        <Route path="/breathe" element={<Breathe />} />
        <Route path="/meditate" element={<Meditate />} />
        <Route path="/meditate/session/:sessionId" element={<MeditationSessionView />} />
        <Route path="/morning-ritual" element={<MorningRitual />} />
        <Route path="/account" element={<Account />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </FocusProvider>
  );
}

export default App;
