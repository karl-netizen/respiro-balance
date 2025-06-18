
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/context/ThemeProvider'
import { UserPreferencesProvider } from '@/context/UserPreferencesProvider'
import { AuthProvider } from '@/context/AuthProvider'
import { SubscriptionProvider } from '@/context/SubscriptionProvider'
import { FocusProvider } from '@/context/FocusProvider'
import { NotificationsProvider } from '@/context/NotificationsProvider'
import { NavigationHistoryProvider } from '@/context/NavigationHistoryProvider'
import SkipNavigation from '@/components/accessibility/SkipNavigation'
import OfflineIndicator from '@/components/common/OfflineIndicator'
import AriaLiveRegion from '@/components/accessibility/AriaLiveRegion'

// Import animations CSS
import '@/styles/animations.css'

// Import pages
import LandingPage from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'
import MeditationPage from '@/pages/MeditationPage'
import Meditate from '@/pages/Meditate'
import MeditationSessionPage from '@/pages/MeditationSessionPage'
import BreathePageRoute from '@/pages/BreathePageRoute'
import ProgressPage from '@/pages/ProgressPage'
import BiofeedbackPage from '@/pages/BiofeedbackPage'
import FocusPage from '@/pages/FocusPage'
import MorningRitualPage from '@/pages/MorningRitualPage'
import SocialPage from '@/pages/SocialPage'
import SettingsPage from '@/pages/SettingsPage'
import ProfilePage from '@/pages/ProfilePage'
import OnboardingPage from '@/pages/OnboardingPage'
import WorkLifeBalancePage from '@/pages/WorkLifeBalancePage'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage'
import PaymentCancelPage from '@/pages/PaymentCancelPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import BreakSettingsPage from '@/pages/BreakSettingsPage'
import OfflineDownloadsPage from '@/pages/OfflineDownloadsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <UserPreferencesProvider>
              <SubscriptionProvider>
                <FocusProvider>
                  <NotificationsProvider>
                    <NavigationHistoryProvider>
                      <div className="min-h-screen bg-background text-foreground w-full">
                        <SkipNavigation />
                        <AriaLiveRegion />
                        
                        <main id="main-content" className="w-full">
                          <Routes>
                            <Route path="/" element={<Navigate to="/landing" replace />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/meditation" element={<MeditationPage />} />
                            <Route path="/meditate" element={<Meditate />} />
                            <Route path="/meditate/session/:id" element={<MeditationSessionPage />} />
                            <Route path="/meditation/session/:id" element={<MeditationSessionPage />} />
                            <Route path="/offline-downloads" element={<OfflineDownloadsPage />} />
                            <Route path="/breathe" element={<BreathePageRoute />} />
                            <Route path="/progress" element={<ProgressPage />} />
                            <Route path="/biofeedback" element={<BiofeedbackPage />} />
                            <Route path="/focus" element={<FocusPage />} />
                            <Route path="/morning-ritual" element={<MorningRitualPage />} />
                            <Route path="/social" element={<SocialPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/onboarding" element={<OnboardingPage />} />
                            <Route path="/work-life-balance" element={<WorkLifeBalancePage />} />
                            <Route path="/work-life-balance/break-settings" element={<BreakSettingsPage />} />
                            <Route path="/payment/success" element={<PaymentSuccessPage />} />
                            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                          </Routes>
                        </main>

                        <OfflineIndicator />
                        <Toaster />
                      </div>
                    </NavigationHistoryProvider>
                  </NotificationsProvider>
                </FocusProvider>
              </SubscriptionProvider>
            </UserPreferencesProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
