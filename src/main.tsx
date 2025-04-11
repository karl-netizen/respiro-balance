
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { Toaster } from './components/ui/toaster'
import { UserPreferencesProvider } from './context/UserPreferencesProvider'
import { NotificationsProvider } from './context/NotificationsProvider'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <App />
            <Toaster />
          </NotificationsProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
