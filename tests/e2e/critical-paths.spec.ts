import { test, expect } from '@playwright/test'

test.describe('Critical User Paths E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('http://localhost:3000')
  })

  test('Complete new user registration and first meditation session', async ({ page }) => {
    // Step 1: Navigate to signup
    await page.click('text=Get Started')
    await expect(page).toHaveURL(/.*register/)

    // Step 2: Fill registration form
    await page.fill('[data-testid="email-input"]', 'e2e-test@example.com')
    await page.fill('[data-testid="password-input"]', 'TestPassword123!')
    await page.fill('[data-testid="confirm-password-input"]', 'TestPassword123!')
    
    // Step 3: Submit registration
    await page.click('[data-testid="register-button"]')
    
    // Step 4: Handle email confirmation (in test mode, auto-confirm)
    await expect(page.locator('text=Welcome to Respiro')).toBeVisible({ timeout: 10000 })
    
    // Step 5: Complete onboarding
    await page.click('text=Continue')
    await page.selectOption('[data-testid="experience-level"]', 'beginner')
    await page.click('[data-testid="goal-stress"]')
    await page.click('text=Complete Setup')
    
    // Step 6: Start first meditation
    await page.click('text=Start Your Journey')
    await expect(page.locator('[data-testid="meditation-player"]')).toBeVisible()
    
    // Step 7: Play meditation
    await page.click('[data-testid="play-button"]')
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
    
    // Step 8: Wait for session to start
    await page.waitForTimeout(2000)
    
    // Step 9: Complete session
    await page.click('[data-testid="complete-session"]')
    await expect(page.locator('text=Session Completed')).toBeVisible()
    
    // Verify user progress was tracked
    await expect(page.locator('[data-testid="session-count"]')).toContainText('1')
  })

  test('Premium upgrade flow with Stripe checkout', async ({ page }) => {
    // Step 1: Login as existing user
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'premium-test@example.com')
    await page.fill('[data-testid="password-input"]', 'TestPassword123!')
    await page.click('[data-testid="login-button"]')
    
    // Step 2: Navigate to premium content
    await page.click('text=Explore')
    await page.click('[data-testid="premium-filter"]')
    
    // Step 3: Try to access premium content
    await page.click('[data-testid="premium-content-card"]')
    await expect(page.locator('[data-testid="paywall"]')).toBeVisible()
    
    // Step 4: Click upgrade to premium
    await page.click('[data-testid="upgrade-premium"]')
    
    // Step 5: Should open Stripe checkout (in test mode, mock success)
    await page.waitForURL(/.*checkout.stripe.com.*/)
    
    // Step 6: Complete mock payment
    await page.fill('[data-testid="card-number"]', '4242424242424242')
    await page.fill('[data-testid="card-expiry"]', '12/34')
    await page.fill('[data-testid="card-cvc"]', '123')
    await page.click('[data-testid="submit-payment"]')
    
    // Step 7: Return to app with premium access
    await page.waitForURL(/.*success.*/)
    await expect(page.locator('text=Welcome to Premium')).toBeVisible()
    
    // Step 8: Verify premium features are unlocked
    await page.goto('/meditate')
    await page.click('[data-testid="premium-content-card"]')
    await expect(page.locator('[data-testid="premium-player"]')).toBeVisible()
  })

  test('Meditation session completion and progress tracking', async ({ page }) => {
    // Step 1: Login as existing user
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'session-test@example.com')
    await page.fill('[data-testid="password-input"]', 'TestPassword123!')
    await page.click('[data-testid="login-button"]')
    
    // Step 2: Start a meditation session
    await page.goto('/meditate')
    await page.click('[data-testid="free-content-card"]')
    await page.click('[data-testid="start-session"]')
    
    // Step 3: Verify session tracking
    await expect(page.locator('[data-testid="session-timer"]')).toBeVisible()
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
    
    // Step 4: Simulate session completion (fast-forward)
    await page.click('[data-testid="fast-forward"]') // Test helper
    await page.waitForTimeout(1000)
    
    // Step 5: Complete session
    await page.click('[data-testid="complete-session"]')
    await expect(page.locator('text=Congratulations')).toBeVisible()
    
    // Step 6: Check progress dashboard
    await page.goto('/progress')
    await expect(page.locator('[data-testid="total-sessions"]')).toContainText(/[1-9]/)
    await expect(page.locator('[data-testid="total-minutes"]')).toContainText(/[1-9]/)
    await expect(page.locator('[data-testid="current-streak"]')).toContainText(/[1-9]/)
  })

  test('Enterprise admin dashboard access and management', async ({ page }) => {
    // Step 1: Login as enterprise admin
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@enterprise.com')
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!')
    await page.click('[data-testid="login-button"]')
    
    // Step 2: Navigate to admin dashboard
    await page.goto('/admin')
    await expect(page.locator('text=Enterprise Admin Dashboard')).toBeVisible()
    
    // Step 3: Test user management
    await page.click('[data-testid="users-tab"]')
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible()
    
    // Step 4: Invite new user
    await page.click('[data-testid="invite-user"]')
    await page.fill('[data-testid="invite-email"]', 'newemployee@company.com')
    await page.selectOption('[data-testid="invite-role"]', 'user')
    await page.fill('[data-testid="invite-department"]', 'Marketing')
    await page.click('[data-testid="send-invitation"]')
    
    await expect(page.locator('text=User invitation sent')).toBeVisible()
    
    // Step 5: Check analytics
    await page.click('[data-testid="analytics-tab"]')
    await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="roi-metrics"]')).toBeVisible()
    
    // Step 6: Test API management
    await page.click('[data-testid="api-tab"]')
    await page.click('[data-testid="generate-api-key"]')
    await page.fill('[data-testid="api-key-name"]', 'Test Integration')
    await page.click('[data-testid="create-key"]')
    
    await expect(page.locator('[data-testid="api-key-created"]')).toBeVisible()
  })

  test('Mobile responsiveness and touch interactions', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Step 2: Test mobile navigation
    await page.goto('/')
    await page.click('[data-testid="mobile-menu-trigger"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Step 3: Test mobile meditation player
    await page.goto('/meditate')
    await page.click('[data-testid="meditation-card"]')
    await expect(page.locator('[data-testid="mobile-player"]')).toBeVisible()
    
    // Step 4: Test touch controls
    await page.tap('[data-testid="mobile-play-button"]')
    await expect(page.locator('[data-testid="mobile-progress"]')).toBeVisible()
    
    // Step 5: Test swipe gestures
    await page.locator('[data-testid="mobile-player"]').swipe({ direction: 'left' })
    await expect(page.locator('[data-testid="next-track"]')).toBeVisible()
  })

  test('Offline functionality and PWA features', async ({ page, context }) => {
    // Step 1: Login and cache content
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'offline-test@example.com')
    await page.fill('[data-testid="password-input"]', 'TestPassword123!')
    await page.click('[data-testid="login-button"]')
    
    // Step 2: Download content for offline use
    await page.goto('/meditate')
    await page.click('[data-testid="download-for-offline"]')
    await expect(page.locator('text=Content downloaded')).toBeVisible()
    
    // Step 3: Go offline
    await context.setOffline(true)
    
    // Step 4: Test offline indicator
    await page.reload()
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
    
    // Step 5: Test offline meditation playback
    await page.click('[data-testid="offline-content"]')
    await page.click('[data-testid="play-offline"]')
    await expect(page.locator('[data-testid="offline-player"]')).toBeVisible()
    
    // Step 6: Complete offline session
    await page.click('[data-testid="complete-offline-session"]')
    await expect(page.locator('text=Session saved locally')).toBeVisible()
    
    // Step 7: Go back online and sync
    await context.setOffline(false)
    await page.reload()
    await expect(page.locator('text=Syncing offline sessions')).toBeVisible()
    await expect(page.locator('text=Sync complete')).toBeVisible()
  })

  test('Error recovery and resilience', async ({ page }) => {
    // Step 1: Test network error recovery
    await page.route('**/api/**', route => route.abort())
    await page.goto('/')
    
    await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible()
    await expect(page.locator('text=Something went wrong')).toBeVisible()
    
    // Step 2: Test retry functionality
    await page.unroute('**/api/**')
    await page.click('[data-testid="retry-button"]')
    
    await expect(page.locator('text=Welcome to Respiro')).toBeVisible()
    
    // Step 3: Test session recovery after interruption
    await page.goto('/meditate')
    await page.click('[data-testid="meditation-card"]')
    await page.click('[data-testid="play-button"]')
    
    // Simulate browser refresh during session
    await page.reload()
    
    // Should recover session state
    await expect(page.locator('[data-testid="resume-session"]')).toBeVisible()
    await page.click('[data-testid="resume-session"]')
    await expect(page.locator('[data-testid="session-resumed"]')).toBeVisible()
  })
})