
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
import { ThemeProvider } from './context'

// Create a client
const queryClient = new QueryClient();

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
