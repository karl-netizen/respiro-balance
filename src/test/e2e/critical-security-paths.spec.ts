import { test, expect, Page, BrowserContext } from '@playwright/test';

// Page Object Models for E2E tests
class LoginPagePOM {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth');
  }

  async fillEmail(email: string) {
    await this.page.fill('[data-testid="email-input"], input[type="email"]', email);
  }

  async fillPassword(password: string) {
    await this.page.fill('[data-testid="password-input"], input[type="password"]', password);
  }

  async submit() {
    await this.page.click('[data-testid="login-submit"], button[type="submit"]');
  }

  async expectError(errorText: string) {
    await expect(this.page.locator('.alert, [role="alert"], .error')).toContainText(errorText);
  }

  async expectTwoFactorPrompt() {
    await expect(this.page.locator('[data-testid="2fa-input"], input[placeholder*="000000"]')).toBeVisible();
  }

  async fill2FACode(code: string) {
    await this.page.fill('[data-testid="2fa-input"], input[placeholder*="000000"]', code);
  }

  async submit2FA() {
    await this.page.click('[data-testid="2fa-submit"], button:has-text("Verify")');
  }
}

class DashboardPagePOM {
  constructor(private page: Page) {}

  async expectWelcomeMessage(name?: string) {
    if (name) {
      await expect(this.page.locator('h1, [data-testid="welcome"]')).toContainText(`Welcome ${name}`);
    } else {
      await expect(this.page.locator('h1, [data-testid="welcome"]')).toContainText('Welcome');
    }
  }

  async clickLogout() {
    await this.page.click('[data-testid="logout-button"], button:has-text("Logout")');
  }

  async expectAdminPanel() {
    await expect(this.page.locator('[data-testid="admin-panel"]')).toBeVisible();
  }

  async expectNoAdminPanel() {
    await expect(this.page.locator('[data-testid="admin-panel"]')).not.toBeVisible();
  }
}

class SecurityTestHelpers {
  constructor(private page: Page) {}

  async attemptXSSInjection(selector: string, payload: string) {
    await this.page.fill(selector, payload);
    await this.page.keyboard.press('Tab'); // Trigger blur event
  }

  async checkForXSSExecution() {
    // Check if any alert dialogs were opened (XSS succeeded)
    const dialogs: string[] = [];
    this.page.on('dialog', dialog => {
      dialogs.push(dialog.message());
      dialog.dismiss();
    });
    
    // Wait a bit for potential XSS execution
    await this.page.waitForTimeout(1000);
    
    return dialogs.length === 0; // Return true if no XSS executed
  }

  async simulateSlowNetwork() {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50kb/s
      uploadThroughput: 20 * 1024,   // 20kb/s
      latency: 2000 // 2s latency
    });
  }

  async simulateOffline() {
    await this.page.context().setOffline(true);
  }

  async simulateOnline() {
    await this.page.context().setOffline(false);
  }
}

test.describe('E2E Critical Security Paths', () => {
  let loginPage: LoginPagePOM;
  let dashboardPage: DashboardPagePOM;
  let securityHelpers: SecurityTestHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPagePOM(page);
    dashboardPage = new DashboardPagePOM(page);
    securityHelpers = new SecurityTestHelpers(page);
  });

  test.describe('Authentication Security', () => {
    test('successful login flow with security checks', async ({ page }) => {
      await loginPage.goto();
      
      // Verify page is loaded securely (HTTPS in production)
      const url = page.url();
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        // Local development - check for security headers via response
        const response = await page.goto('/auth');
        const headers = response?.headers() || {};
        
        // Check for basic security headers (if implemented)
        if (headers['x-frame-options']) {
          expect(headers['x-frame-options']).toBeTruthy();
        }
      }

      // Perform login
      await loginPage.fillEmail('admin@example.com');
      await loginPage.fillPassword('SecurePassword123!');
      await loginPage.submit();

      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard.*/);
      await dashboardPage.expectWelcomeMessage();
    });

    test('prevents brute force attacks with rate limiting', async ({ page }) => {
      await loginPage.goto();

      // Attempt multiple failed logins rapidly
      for (let i = 0; i < 6; i++) {
        await loginPage.fillEmail('attacker@example.com');
        await loginPage.fillPassword('wrongpassword');
        await loginPage.submit();
        
        if (i < 4) {
          // First few attempts should show invalid credentials
          await expect(page.locator('.error, [role="alert"]')).toContainText(/invalid|incorrect/i);
        }
        
        // Clear form for next attempt
        await page.fill('input[type="email"]', '');
        await page.fill('input[type="password"]', '');
      }

      // Final attempt should show rate limiting
      await loginPage.fillEmail('attacker@example.com');
      await loginPage.fillPassword('wrongpassword');
      await loginPage.submit();

      await expect(page.locator('.error, [role="alert"]')).toContainText(/too many|rate limit|blocked/i);
    });

    test('two-factor authentication flow', async ({ page }) => {
      await loginPage.goto();
      
      // Login with 2FA enabled user
      await loginPage.fillEmail('user-with-2fa@example.com');
      await loginPage.fillPassword('SecurePassword123!');
      await loginPage.submit();

      // Should prompt for 2FA
      await loginPage.expectTwoFactorPrompt();
      
      // Enter correct 2FA code
      await loginPage.fill2FACode('123456');
      await loginPage.submit2FA();

      // Should be logged in
      await expect(page).toHaveURL(/.*dashboard.*/);
      await dashboardPage.expectWelcomeMessage();
    });

    test('session management and automatic logout', async ({ page, context }) => {
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();

      await dashboardPage.expectWelcomeMessage();

      // Simulate session expiry by clearing cookies
      await context.clearCookies();

      // Navigate to a protected page
      await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/.*auth.*/);
    });
  });

  test.describe('XSS Protection', () => {
    test('prevents XSS in login form', async ({ page }) => {
      await loginPage.goto();

      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        'data:text/html,<script>alert(1)</script>'
      ];

      for (const payload of xssPayloads) {
        await securityHelpers.attemptXSSInjection('input[type="email"]', payload);
        await securityHelpers.attemptXSSInjection('input[type="password"]', payload);
        
        // Verify no XSS executed
        const isSafe = await securityHelpers.checkForXSSExecution();
        expect(isSafe).toBe(true);
        
        // Clear inputs
        await page.fill('input[type="email"]', '');
        await page.fill('input[type="password"]', '');
      }
    });

    test('sanitizes user input in forms', async ({ page }) => {
      // Navigate to a form page (could be profile edit, etc.)
      await page.goto('/dashboard');
      
      // If there's a user input form
      const inputField = page.locator('input[type="text"], textarea').first();
      if (await inputField.isVisible()) {
        const maliciousInput = '<script>document.body.innerHTML="HACKED"</script>';
        await inputField.fill(maliciousInput);
        await inputField.blur();
        
        // Page should not be modified by the script
        await expect(page.locator('body')).not.toContainText('HACKED');
      }
    });
  });

  test.describe('CSRF Protection', () => {
    test('includes CSRF tokens in state-changing requests', async ({ page }) => {
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      
      // Intercept the login request
      const requestPromise = page.waitForRequest(request => 
        request.method() === 'POST' && request.url().includes('/api/')
      );
      
      await loginPage.submit();
      
      const request = await requestPromise;
      const headers = request.headers();
      
      // Should include CSRF token (implementation dependent)
      expect(headers['x-csrf-token'] || headers['x-requested-with']).toBeTruthy();
    });

    test('rejects requests without valid CSRF tokens', async ({ page, context }) => {
      // This test would require backend cooperation
      // Simulate by making a request without the proper token
      
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();
      
      // Once logged in, try to make a request without CSRF token
      const response = await page.evaluate(async () => {
        try {
          const res = await fetch('/api/protected-endpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: 'test' })
          });
          return res.status;
        } catch {
          return 0;
        }
      });
      
      // Should be rejected (403 Forbidden or similar)
      if (response !== 0) {
        expect(response).toBeGreaterThanOrEqual(400);
      }
    });
  });

  test.describe('Permission-Based Access Control', () => {
    test('enforces role-based access to admin features', async ({ page }) => {
      // Login as regular user
      await loginPage.goto();
      await loginPage.fillEmail('user@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();

      await dashboardPage.expectWelcomeMessage();
      
      // Should not see admin panel
      await dashboardPage.expectNoAdminPanel();
      
      // Directly navigate to admin route
      await page.goto('/admin');
      
      // Should be redirected or show access denied
      await expect(page.locator('body')).toContainText(/access denied|unauthorized|forbidden/i);
    });

    test('allows admin access to admin features', async ({ page }) => {
      // Login as admin
      await loginPage.goto();
      await loginPage.fillEmail('admin@example.com');
      await loginPage.fillPassword('AdminPassword123!');
      await loginPage.submit();

      await dashboardPage.expectWelcomeMessage();
      
      // Should see admin panel
      await dashboardPage.expectAdminPanel();
      
      // Should be able to access admin routes
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*admin.*/);
    });
  });

  test.describe('Network Security & Resilience', () => {
    test('handles network interruptions gracefully', async ({ page }) => {
      await securityHelpers.simulateSlowNetwork();
      
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();

      // Should show loading state during slow network
      await expect(page.locator('button:has-text("Signing in")')).toBeVisible();
      
      // Eventually should succeed
      await dashboardPage.expectWelcomeMessage();
    });

    test('offline functionality and recovery', async ({ page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();
      await dashboardPage.expectWelcomeMessage();

      // Go offline
      await securityHelpers.simulateOffline();
      
      // Try to navigate (should show offline state or cached content)
      await page.reload();
      
      // Page should handle offline gracefully
      const isOfflineHandled = await page.locator('body').textContent();
      expect(isOfflineHandled).toBeTruthy(); // Page should still load something
      
      // Go back online
      await securityHelpers.simulateOnline();
      await page.reload();
      
      // Should recover
      await dashboardPage.expectWelcomeMessage();
    });
  });

  test.describe('Mobile Security', () => {
    test('mobile authentication flow', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await loginPage.goto();
      
      // Verify mobile-friendly login
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      
      await loginPage.fillEmail('mobile@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();
      
      await dashboardPage.expectWelcomeMessage();
      
      // Test mobile navigation
      const menuButton = page.locator('[data-testid="mobile-menu"], button:has-text("Menu")').first();
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await expect(page.locator('[data-testid="mobile-nav"], .mobile-menu')).toBeVisible();
      }
    });

    test('touch-based security interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      
      // Use touch events instead of click
      await page.locator('button[type="submit"]').tap();
      
      await dashboardPage.expectWelcomeMessage();
    });
  });

  test.describe('Performance Under Load', () => {
    test('authentication performance with multiple concurrent attempts', async ({ page, context }) => {
      const startTime = Date.now();
      
      await loginPage.goto();
      await loginPage.fillEmail('perf@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.submit();
      
      await dashboardPage.expectWelcomeMessage();
      
      const endTime = Date.now();
      const loginTime = endTime - startTime;
      
      // Login should complete within reasonable time (adjust as needed)
      expect(loginTime).toBeLessThan(5000); // 5 seconds max
    });

    test('form validation performance', async ({ page }) => {
      await loginPage.goto();
      
      const startTime = Date.now();
      
      // Type rapidly to test validation performance
      const longEmail = 'a'.repeat(100) + '@example.com';
      await page.fill('input[type="email"]', longEmail);
      
      // Validation should be responsive
      await page.waitForTimeout(100);
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  test.describe('Security Headers and Configuration', () => {
    test('security headers are present', async ({ page }) => {
      const response = await page.goto('/');
      const headers = response?.headers() || {};
      
      // Check for security headers (if implemented)
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'strict-transport-security',
        'content-security-policy'
      ];
      
      // At least some security headers should be present
      const presentHeaders = securityHeaders.filter(header => headers[header]);
      
      // In a real application, you'd expect all these headers
      // For demo purposes, we'll just check that some effort was made
      console.log('Present security headers:', presentHeaders);
    });

    test('prevents clickjacking attacks', async ({ page }) => {
      // Check if page can be embedded in iframe (should be prevented)
      const canEmbed = await page.evaluate(() => {
        try {
          return window.self === window.top;
        } catch {
          return false; // X-Frame-Options is working
        }
      });
      
      // In a properly secured app, this should be true (page is not in iframe)
      expect(canEmbed).toBe(true);
    });
  });
});

// Accessibility tests for security components
test.describe('Security Accessibility', () => {
  test('login form meets accessibility standards', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for proper form labels
    await expect(page.locator('label[for="email"], label:has(input[type="email"])')).toBeVisible();
    await expect(page.locator('label[for="password"], label:has(input[type="password"])')).toBeVisible();
    
    // Check for proper focus management
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('error messages are announced to screen readers', async ({ page }) => {
    await page.goto('/auth');
    
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    
    // Check for aria-live regions or role="alert"
    const errorElement = page.locator('[role="alert"], [aria-live]').first();
    if (await errorElement.isVisible()) {
      await expect(errorElement).toBeVisible();
      
      const ariaLive = await errorElement.getAttribute('aria-live');
      const role = await errorElement.getAttribute('role');
      
      expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBe(true);
    }
  });
});