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
// Import other pages as needed

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
                  {/* Add other routes as needed */}
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
