import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

// Mock imports - these would be your actual components
interface TestOptions {
  initialEntries?: string[];
  authState?: any;
  queryClient?: QueryClient;
  mockCSRF?: boolean;
}

// Test wrapper with all providers
export const createTestWrapper = (options: TestOptions = {}) => {
  const {
    initialEntries = ['/'],
    authState,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    mockCSRF = true
  } = options;

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Mock factories for test data
export class TestDataFactory {
  static createMockUser(overrides?: Partial<any>) {
    return {
      id: 'test_user_123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      permissions: ['read:profile', 'write:profile'] as const,
      securityLevel: 'basic' as const,
      mfaEnabled: false,
      lastPasswordChange: new Date(),
      accountStatus: 'active' as const,
      loginHistory: [],
      ...overrides
    };
  }

  static createMockSession(overrides?: Partial<any>) {
    return {
      id: 'session_123',
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      csrfToken: 'mock_csrf_token',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Test)',
      createdAt: new Date(),
      lastActivity: new Date(),
      isDeviceTrusted: false,
      ...overrides
    };
  }

  static createMockAuthState(type: 'authenticated' | 'unauthenticated' = 'authenticated') {
    if (type === 'unauthenticated') {
      return { type: 'unauthenticated' };
    }

    const user = this.createMockUser();
    const session = this.createMockSession();
    
    return {
      type: 'authenticated',
      user,
      session,
      permissions: ['read:profile', 'write:profile'],
      lastActivity: new Date(),
      requiresPasswordChange: false,
      mfaEnabled: false
    };
  }

  static createMockSecurityError(type: string = 'invalid_credentials') {
    switch (type) {
      case 'invalid_credentials':
        return { type, attempts: 2, maxAttempts: 5 };
      case 'rate_limited':
        return { type, retryAfter: new Date(Date.now() + 300000), limitType: 'login' };
      case 'account_locked':
        return { type, unlockAt: new Date(Date.now() + 1800000), reason: 'Too many failed attempts' };
      default:
        return { type, attempts: 1, maxAttempts: 5 };
    }
  }
}

// Mock API responses
export const mockApiResponses = {
  login: {
    success: { user: TestDataFactory.createMockUser(), session: TestDataFactory.createMockSession() },
    invalidCredentials: { error: { type: 'invalid_credentials', attempts: 3, maxAttempts: 5 } },
    rateLimited: { error: { type: 'rate_limited', retryAfter: new Date(Date.now() + 300000), limitType: 'login' } },
    accountLocked: { error: { type: 'account_locked', unlockAt: new Date(Date.now() + 1800000), reason: 'Suspicious activity' } }
  },
  csrf: {
    token: 'mock_csrf_token_12345'
  }
};

// Security test helpers
export const securityTestHelpers = {
  xssAttempts: [
    '<script>alert("xss")</script>',
    'javascript:alert(1)',
    '<img src=x onerror=alert(1)>',
    'eval("malicious code")',
    '<svg onload=alert(1)>',
    'data:text/html,<script>alert(1)</script>'
  ],
  
  safeInputs: [
    'Hello World',
    'user@example.com',
    '123-456-7890',
    'Safe content with numbers 123!',
    'Normal text with symbols: !@#$%'
  ],
  
  sqlInjectionAttempts: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "UNION SELECT * FROM passwords",
    "'; DELETE FROM users WHERE '1'='1"
  ]
};

// Performance test helpers
export const performanceHelpers = {
  measureRenderTime: (renderFn: () => void) => {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    return endTime - startTime;
  },
  
  measureAsyncOperation: async (asyncFn: () => Promise<void>) => {
    const startTime = performance.now();
    await asyncFn();
    const endTime = performance.now();
    return endTime - startTime;
  }
};

// Accessibility test helpers
export const a11yTestHelpers = {
  expectKeyboardNavigation: async (user: any, elements: HTMLElement[]) => {
    for (let i = 0; i < elements.length; i++) {
      await user.tab();
      expect(elements[i]).toHaveFocus();
    }
  },
  
  expectScreenReaderAnnouncement: (element: HTMLElement, expectedText: string) => {
    expect(element).toHaveAttribute('aria-live');
    expect(element).toHaveTextContent(expectedText);
  }
};

export * from '@testing-library/react';
export { createTestWrapper as render };
export { default as userEvent } from '@testing-library/user-event';