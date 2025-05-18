
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider'
import { Toaster } from './components/ui/toaster'
import { UserPreferencesProvider } from './context/UserPreferencesProvider'
import { NotificationsProvider } from './context/NotificationsProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscriptionProvider } from './context/SubscriptionProvider'
import { ThemeProvider } from './context' // Fixed import from our context

// Create a client
const queryClient = new QueryClient();

// Apply high contrast mode based on HTML attribute
const applyHighContrastMode = (highContrast: boolean) => {
  if (highContrast) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
};

// Get high contrast preference from local storage
const storedPreferences = localStorage.getItem('user-preferences');
if (storedPreferences) {
  try {
    const preferences = JSON.parse(storedPreferences);
    applyHighContrastMode(preferences.highContrast);
  } catch (e) {
    console.error('Error parsing preferences:', e);
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserPreferencesProvider>
              <NotificationsProvider>
                <SubscriptionProvider>
                  <App />
                  <Toaster />
                </SubscriptionProvider>
              </NotificationsProvider>
            </UserPreferencesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
