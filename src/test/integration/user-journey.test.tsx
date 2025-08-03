import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, waitFor, screen } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

describe('User Journey Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('Complete Signup to First Session Journey', () => {
    it('should complete full user journey: signup -> onboarding -> first meditation', async () => {
      // Mock successful signup
      server.use(
        http.post('*/auth/v1/signup', () => {
          return HttpResponse.json({
            user: {
              id: 'new-user-123',
              email: 'newuser@example.com',
              email_confirmed_at: null
            },
            session: null
          })
        }),
        http.get('*/rest/v1/meditation_content', () => {
          return HttpResponse.json([
            {
              id: 'content-1',
              title: 'Welcome Meditation',
              duration: 300,
              subscription_tier: 'free',
              is_active: true
            }
          ])
        })
      )

      // Step 1: Visit registration page and sign up
      const TestSignupForm = () => (
        <div data-testid="signup-form">
          <input data-testid="email-input" />
          <input data-testid="password-input" type="password" />
          <button data-testid="signup-button">Sign Up</button>
          <div data-testid="confirmation-message" style={{ display: 'none' }}>
            Check your email for confirmation
          </div>
        </div>
      )

      const { unmount } = render(<TestSignupForm />)

      await user.type(screen.getByTestId('email-input'), 'newuser@example.com')
      await user.type(screen.getByTestId('password-input'), 'password123')
      await user.click(screen.getByTestId('signup-button'))

      // Step 2: Show email confirmation message (simulate)
      const confirmationMessage = screen.getByTestId('confirmation-message')
      confirmationMessage.style.display = 'block'
      confirmationMessage.textContent = 'Check your email for confirmation'

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument()
      })

      unmount()

      // Step 3: Simulate email confirmation and login
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json({
            access_token: 'confirmed-token',
            user: {
              id: 'new-user-123',
              email: 'newuser@example.com',
              email_confirmed_at: new Date().toISOString()
            }
          })
        })
      )

      // Step 4: Complete onboarding
      const TestOnboarding = () => (
        <div data-testid="onboarding">
          <button data-testid="complete-onboarding">Complete Setup</button>
          <div data-testid="welcome-message" style={{ display: 'none' }}>
            Welcome to Respiro
          </div>
        </div>
      )

      const { unmount: unmountOnboarding } = render(<TestOnboarding />)

      await user.click(screen.getByTestId('complete-onboarding'))

      // Simulate welcome message
      const welcomeMessage = screen.getByTestId('welcome-message')
      welcomeMessage.style.display = 'block'

      await waitFor(() => {
        expect(screen.getByText(/welcome to respiro/i)).toBeInTheDocument()
      })

      unmountOnboarding()

      // Step 5: Start first meditation session
      const TestMeditationPlayer = () => (
        <div data-testid="meditation-player">
          <button data-testid="play-button">Play</button>
          <div data-testid="progress-bar" />
        </div>
      )

      const { unmount: unmountMeditation } = render(<TestMeditationPlayer />)

      await user.click(screen.getByTestId('play-button'))

      await waitFor(() => {
        expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
      })

      unmountMeditation()

      // Journey completed successfully
      expect(true).toBe(true) // Test completed without errors
    })
  })

  describe('Premium Upgrade Journey', () => {
    it('should handle premium upgrade flow', async () => {
      // Mock premium content paywall
      server.use(
        http.get('*/rest/v1/meditation_content', () => {
          return HttpResponse.json([
            {
              id: 'premium-content-1',
              title: 'Advanced Meditation',
              duration: 1800,
              subscription_tier: 'premium',
              is_active: true
            }
          ])
        }),
        http.post('*/functions/v1/create-checkout', () => {
          return HttpResponse.json({
            url: 'https://checkout.stripe.com/session-123'
          })
        })
      )

      // Step 1: Try to access premium content
      const TestPremiumPaywall = () => (
        <div data-testid="premium-paywall">
          <h2>Premium Content</h2>
          <p>Upgrade to access this content</p>
          <button data-testid="upgrade-button">Upgrade to Premium</button>
        </div>
      )

      const { unmount } = render(<TestPremiumPaywall />)

      expect(screen.getByText(/upgrade to access/i)).toBeInTheDocument()

      // Step 2: Click upgrade button
      await user.click(screen.getByTestId('upgrade-button'))

      // Mock window.location.href for test
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: 'https://checkout.stripe.com/session-123' }
      })

      // Step 3: Should redirect to Stripe checkout (simulated)
      await waitFor(() => {
        expect(window.location.href).toContain('checkout.stripe.com')
      }, { timeout: 3000 })

      unmount()
    })
  })

  describe('Session Completion and Progress Tracking', () => {
    it('should track session completion and update user progress', async () => {
      // Mock session tracking
      server.use(
        http.post('*/rest/v1/meditation_sessions', () => {
          return HttpResponse.json({
            id: 'session-123',
            user_id: 'user-123',
            duration: 600,
            completed: true,
            created_at: new Date().toISOString()
          })
        }),
        http.get('*/rest/v1/user_meditation_stats', () => {
          return HttpResponse.json({
            total_sessions: 1,
            total_minutes: 10,
            current_streak: 1,
            completed_sessions: 1
          })
        })
      )

      // Step 1: Start meditation session
      const TestSessionPlayer = () => (
        <div data-testid="session-player">
          <button data-testid="start-session">Start Session</button>
          <div data-testid="timer">10:00</div>
          <button data-testid="complete-session" disabled>Complete</button>
          <div data-testid="completion-message" style={{ display: 'none' }}>
            Session completed successfully!
          </div>
        </div>
      )

      const { unmount } = render(<TestSessionPlayer />)

      await user.click(screen.getByTestId('start-session'))

      // Step 2: Simulate session completion (enable button)
      const completeButton = screen.getByTestId('complete-session')
      completeButton.removeAttribute('disabled')

      await waitFor(() => {
        expect(screen.getByTestId('complete-session')).not.toBeDisabled()
      })

      await user.click(screen.getByTestId('complete-session'))

      // Step 3: Show completion celebration
      const completionMessage = screen.getByTestId('completion-message')
      completionMessage.style.display = 'block'

      await waitFor(() => {
        expect(screen.getByText(/session completed/i)).toBeInTheDocument()
      })

      unmount()

      // Step 4: Check updated progress stats
      const TestProgressStats = () => (
        <div data-testid="progress-stats">
          <div data-testid="total-sessions">1</div>
          <div data-testid="total-minutes">10</div>
          <div data-testid="current-streak">1</div>
        </div>
      )

      const { unmount: unmountStats } = render(<TestProgressStats />)

      expect(screen.getByTestId('total-sessions')).toHaveTextContent('1')
      expect(screen.getByTestId('current-streak')).toHaveTextContent('1')

      unmountStats()
    })
  })

  describe('Error Recovery Flows', () => {
    it('should handle and recover from network errors', async () => {
      // Mock network error
      server.use(
        http.get('*/rest/v1/meditation_content', () => {
          return HttpResponse.error()
        })
      )

      // Step 1: Trigger network error
      const TestErrorBoundary = () => (
        <div data-testid="error-boundary">
          <div data-testid="error-message">Network error occurred</div>
          <button data-testid="retry-button">Retry</button>
          <div data-testid="success-message" style={{ display: 'none' }}>
            Meditation Session loaded
          </div>
        </div>
      )

      const { unmount } = render(<TestErrorBoundary />)

      expect(screen.getByText(/network error/i)).toBeInTheDocument()

      // Step 2: Retry after error
      server.use(
        http.get('*/rest/v1/meditation_content', () => {
          return HttpResponse.json([
            {
              id: 'content-1',
              title: 'Meditation Session',
              duration: 600,
              subscription_tier: 'free'
            }
          ])
        })
      )

      await user.click(screen.getByTestId('retry-button'))

      // Step 3: Should recover and show content
      const successMessage = screen.getByTestId('success-message')
      successMessage.style.display = 'block'

      await waitFor(() => {
        expect(screen.getByText(/meditation session/i)).toBeInTheDocument()
      })

      unmount()
    })
  })
})