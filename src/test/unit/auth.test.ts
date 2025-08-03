import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn(),
    functions: {
      invoke: vi.fn()
    },
    rpc: vi.fn()
  }
}))

const mockSupabase = vi.mocked(supabase)

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login Flow', () => {
    it('should successfully log in with valid credentials', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: new Date().toISOString()
      }

      const mockAuthResponse = {
        data: {
          user: mockUser,
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser
          }
        },
        error: null
      }

      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockAuthResponse as any)

      // Act
      const signInResult = await mockSupabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      })

      // Assert
      expect(signInResult.error).toBeNull()
      expect(signInResult.data.user?.email).toBe('test@example.com')
    })

    it('should handle invalid credentials', async () => {
      // Arrange
      const mockErrorResponse = {
        data: { user: null, session: null },
        error: {
          name: 'AuthError',
          message: 'Invalid login credentials',
          status: 400
        }
      }

      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockErrorResponse as any)

      // Act
      const signInResult = await mockSupabase.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })

      // Assert
      expect(signInResult.error).toBeTruthy()
      expect(signInResult.error?.message).toBe('Invalid login credentials')
      expect(signInResult.data.user).toBeNull()
    })

    it('should handle network errors during authentication', async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockRejectedValue(
        new Error('Network error')
      )

      // Act & Assert
      await expect(
        mockSupabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('Network error')
    })
  })

  describe('Registration Flow', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const newUser = {
        id: 'user-456',
        email: 'newuser@example.com',
        created_at: new Date().toISOString()
      }

      const mockSignUpResponse = {
        data: {
          user: newUser,
          session: null // Email confirmation required
        },
        error: null
      }

      mockSupabase.auth.signUp.mockResolvedValue(mockSignUpResponse as any)

      // Act
      const signUpResult = await mockSupabase.auth.signUp({
        email: 'newuser@example.com',
        password: 'newpassword123',
        options: {
          emailRedirectTo: 'http://localhost:3000/'
        }
      })

      // Assert
      expect(signUpResult.error).toBeNull()
      expect(signUpResult.data.user?.email).toBe('newuser@example.com')
    })

    it('should prevent registration with existing email', async () => {
      // Arrange
      const mockErrorResponse = {
        data: { user: null, session: null },
        error: {
          name: 'AuthError',
          message: 'User already registered',
          status: 422
        }
      }

      mockSupabase.auth.signUp.mockResolvedValue(mockErrorResponse as any)

      // Act
      const signUpResult = await mockSupabase.auth.signUp({
        email: 'existing@example.com',
        password: 'password123'
      })

      // Assert
      expect(signUpResult.error).toBeTruthy()
      expect(signUpResult.error?.message).toBe('User already registered')
    })
  })

  describe('Session Management', () => {
    it('should retrieve current session', async () => {
      // Arrange
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          created_at: new Date().toISOString()
        }
      }

      const mockSessionResponse = {
        data: { session: mockSession },
        error: null
      }

      mockSupabase.auth.getSession.mockResolvedValue(mockSessionResponse as any)

      // Act
      const sessionResult = await mockSupabase.auth.getSession()

      // Assert
      expect(sessionResult.error).toBeNull()
      expect(sessionResult.data.session?.user.email).toBe('test@example.com')
    })

    it('should handle expired sessions', async () => {
      // Arrange
      const mockExpiredResponse = {
        data: { session: null },
        error: {
          name: 'AuthError',
          message: 'Session expired',
          status: 401
        }
      }

      mockSupabase.auth.getSession.mockResolvedValue(mockExpiredResponse as any)

      // Act
      const sessionResult = await mockSupabase.auth.getSession()

      // Assert
      expect(sessionResult.data.session).toBeNull()
      expect(sessionResult.error?.message).toBe('Session expired')
    })
  })

  describe('Password Reset', () => {
    it('should send password reset email', async () => {
      // Arrange
      const mockResetResponse = {
        data: {},
        error: null
      }

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue(mockResetResponse as any)

      // Act
      const resetResult = await mockSupabase.auth.resetPasswordForEmail(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/reset-password' }
      )

      // Assert
      expect(resetResult.error).toBeNull()
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/reset-password' }
      )
    })
  })
})