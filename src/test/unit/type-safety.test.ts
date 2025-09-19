import { describe, it, expect, vi } from 'vitest';
import { TestDataFactory, securityTestHelpers } from '../utils/comprehensive-test-utils';

// Mock security utilities - these would import from your actual security system
const createUserId = (id: string) => {
  if (!id || id.length < 3) throw new Error('Invalid user ID');
  return id as any;
};

const createEmail = (email: string) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) throw new Error('Invalid email format');
  return email as any;
};

const hasPermission = (userPermissions: readonly string[], requiredPermission: string) => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('super:all');
};

const sanitizeUserInput = (input: string) => {
  // Check for XSS attempts
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /eval\s*\(/gi,
    /<svg\b[^>]*\bonload\s*=/gi
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(input)) {
      return { success: false, error: 'Input contains malicious content' };
    }
  }

  return { success: true, data: input.trim() };
};

describe('Unit Tests - Type Safety & Utilities', () => {
  describe('Branded Types', () => {
    it('createUserId validates input correctly', () => {
      expect(() => createUserId('')).toThrow('Invalid user ID');
      expect(() => createUserId('ab')).toThrow('Invalid user ID');
      expect(() => createUserId('valid_user_123')).not.toThrow();
      
      const validId = createUserId('user_123');
      expect(validId).toBe('user_123');
    });

    it('createEmail validates format correctly', () => {
      expect(() => createEmail('invalid-email')).toThrow('Invalid email format');
      expect(() => createEmail('test@')).toThrow('Invalid email format');
      expect(() => createEmail('@example.com')).toThrow('Invalid email format');
      expect(() => createEmail('test@example')).toThrow('Invalid email format');
      expect(() => createEmail('valid@example.com')).not.toThrow();
      
      const validEmail = createEmail('test@example.com');
      expect(validEmail).toBe('test@example.com');
    });

    it('handles edge cases in email validation', () => {
      const edgeCases = [
        'test+tag@example.com', // Should be valid
        'test.name@example.co.uk', // Should be valid
        'test_name@sub.example.com', // Should be valid
        'a@b.co', // Should be valid (minimal)
      ];

      edgeCases.forEach(email => {
        expect(() => createEmail(email)).not.toThrow();
      });
    });
  });

  describe('Permission System', () => {
    it('hasPermission works with exact matches', () => {
      const userPermissions = ['read:profile', 'write:profile'] as const;
      
      expect(hasPermission(userPermissions, 'read:profile')).toBe(true);
      expect(hasPermission(userPermissions, 'write:profile')).toBe(true);
      expect(hasPermission(userPermissions, 'admin:system')).toBe(false);
      expect(hasPermission(userPermissions, 'delete:user')).toBe(false);
    });

    it('hasPermission works with super permissions', () => {
      const adminPermissions = ['super:all'] as const;
      
      expect(hasPermission(adminPermissions, 'admin:system')).toBe(true);
      expect(hasPermission(adminPermissions, 'read:profile')).toBe(true);
      expect(hasPermission(adminPermissions, 'delete:user')).toBe(true);
      expect(hasPermission(adminPermissions, 'any:permission')).toBe(true);
    });

    it('handles empty permissions array', () => {
      const noPermissions = [] as const;
      
      expect(hasPermission(noPermissions, 'read:profile')).toBe(false);
      expect(hasPermission(noPermissions, 'admin:system')).toBe(false);
    });

    it('is case sensitive', () => {
      const userPermissions = ['READ:PROFILE'] as const;
      
      expect(hasPermission(userPermissions, 'read:profile')).toBe(false);
      expect(hasPermission(userPermissions, 'READ:PROFILE')).toBe(true);
    });
  });

  describe('Input Sanitization', () => {
    it('blocks XSS attempts', () => {
      securityTestHelpers.xssAttempts.forEach(maliciousInput => {
        const result = sanitizeUserInput(maliciousInput);
        expect(result.success).toBe(false);
        expect(result.error).toContain('malicious');
      });
    });

    it('allows safe content', () => {
      securityTestHelpers.safeInputs.forEach(safeInput => {
        const result = sanitizeUserInput(safeInput);
        expect(result.success).toBe(true);
        expect(result.data).toBe(safeInput.trim());
      });
    });

    it('trims whitespace from safe inputs', () => {
      const inputWithWhitespace = '  Hello World  ';
      const result = sanitizeUserInput(inputWithWhitespace);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('Hello World');
    });

    it('handles empty and whitespace-only inputs', () => {
      expect(sanitizeUserInput('').success).toBe(true);
      expect(sanitizeUserInput('   ').data).toBe('');
      expect(sanitizeUserInput('\\t\\n').data).toBe('');
    });

    it('detects complex XSS attempts', () => {
      const complexXSS = [
        '<img src="x" onerror="alert(1)">',
        '<svg><script>alert(1)</script></svg>',
        'javascript:void(0)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<object data="javascript:alert(1)"></object>'
      ];

      complexXSS.forEach(maliciousInput => {
        const result = sanitizeUserInput(maliciousInput);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Test Data Factory', () => {
    it('creates valid mock users', () => {
      const user = TestDataFactory.createMockUser();
      
      expect(user.id).toBeTruthy();
      expect(user.email).toBeTruthy();
      expect(user.name).toBeTruthy();
      expect(user.role).toBe('user');
      expect(Array.isArray(user.permissions)).toBe(true);
      expect(user.accountStatus).toBe('active');
    });

    it('allows user overrides', () => {
      const customUser = TestDataFactory.createMockUser({
        name: 'Custom User',
        role: 'admin',
        mfaEnabled: true
      });
      
      expect(customUser.name).toBe('Custom User');
      expect(customUser.role).toBe('admin');
      expect(customUser.mfaEnabled).toBe(true);
      // Other properties should remain default
      expect(customUser.accountStatus).toBe('active');
    });

    it('creates valid mock sessions', () => {
      const session = TestDataFactory.createMockSession();
      
      expect(session.id).toBeTruthy();
      expect(session.accessToken).toBeTruthy();
      expect(session.refreshToken).toBeTruthy();
      expect(session.csrfToken).toBeTruthy();
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('creates valid auth states', () => {
      const authenticatedState = TestDataFactory.createMockAuthState('authenticated');
      expect(authenticatedState.type).toBe('authenticated');
      expect(authenticatedState.user).toBeTruthy();
      expect(authenticatedState.session).toBeTruthy();

      const unauthenticatedState = TestDataFactory.createMockAuthState('unauthenticated');
      expect(unauthenticatedState.type).toBe('unauthenticated');
      expect(unauthenticatedState).not.toHaveProperty('user');
    });

    it('creates realistic security errors', () => {
      const invalidCredsError = TestDataFactory.createMockSecurityError('invalid_credentials');
      expect(invalidCredsError.type).toBe('invalid_credentials');
      expect(invalidCredsError.attempts).toBe(2);
      expect(invalidCredsError.maxAttempts).toBe(5);

      const rateLimitError = TestDataFactory.createMockSecurityError('rate_limited');
      expect(rateLimitError.type).toBe('rate_limited');
      expect(rateLimitError.retryAfter).toBeInstanceOf(Date);
      expect(rateLimitError.retryAfter.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Performance Validation', () => {
    it('permission checks are fast', () => {
      const permissions = ['read:profile', 'write:profile', 'admin:users'] as const;
      const startTime = performance.now();
      
      // Perform many permission checks
      for (let i = 0; i < 10000; i++) {
        hasPermission(permissions, 'read:profile');
        hasPermission(permissions, 'admin:system');
        hasPermission(permissions, 'write:profile');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should be very fast (under 50ms for 30k checks)
      expect(duration).toBeLessThan(50);
    });

    it('input sanitization is reasonably fast', () => {
      const testInput = 'This is a normal input string with some content';
      const startTime = performance.now();
      
      // Perform many sanitization checks
      for (let i = 0; i < 1000; i++) {
        sanitizeUserInput(testInput);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should be fast (under 100ms for 1000 checks)
      expect(duration).toBeLessThan(100);
    });
  });
});
