import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import SystemDashboardPage from '@/pages/SystemDashboardPage';
import Meditate from '@/pages/Meditate';
import BiofeedbackPage from '@/pages/BiofeedbackPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import PremiumPlusPage from '@/pages/PremiumPlusPage';
import SocialPage from '@/pages/SocialPage';
import MeditateAdvanced from '@/pages/MeditateAdvanced';
import PremiumProPage from '@/pages/PremiumProPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/system" element={<SystemDashboardPage />} />
          <Route path="/meditation" element={<Meditate />} />
          <Route path="/biofeedback" element={<BiofeedbackPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/premium-plus" element={<PremiumPlusPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/meditate-advanced" element={<MeditateAdvanced />} />
          <Route path="/premium-pro" element={<PremiumProPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
