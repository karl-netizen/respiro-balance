
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  UserPreferencesProvider,
  AuthProvider,
  NotificationsProvider,
  SubscriptionProvider,
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <SubscriptionProvider>
              <FocusProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/focus" element={<FocusModePage />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/biofeedback" element={<BiofeedbackPage />} />
                  <Route path="/work-life-balance" element={<WorkLifeBalance />} />
                  <Route path="/work-life-balance/break-settings" element={<BreakSettingsPage />} />
                  <Route path="/breathe" element={<Breathe />} />
                </Routes>
              </FocusProvider>
            </SubscriptionProvider>
          </NotificationsProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
