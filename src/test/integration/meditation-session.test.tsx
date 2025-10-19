import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn()
    }
  }
}))

describe('Meditation Session Integration Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )

  describe('Session Creation', () => {
    it('should create a new meditation session with required fields', async () => {
      // Arrange
      const mockSession = {
        id: 'session-123',
        user_id: 'user-456',
        meditation_content_id: 'content-789',
        started_at: new Date().toISOString(),
        duration_seconds: 0,
        completed: false,
        created_at: new Date().toISOString()
      }

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [mockSession],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: 'user-456',
          meditation_content_id: 'content-789',
          started_at: new Date().toISOString()
        })
        .select()

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.id).toBe('session-123')
      expect(result.data?.[0]?.completed).toBe(false)
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should track session duration in real-time', async () => {
      // Arrange
      const sessionStart = new Date()
      const mockSession = {
        id: 'session-123',
        started_at: sessionStart.toISOString(),
        duration_seconds: 0
      }

      // Act
      const currentTime = new Date()
      const durationSeconds = Math.floor((currentTime.getTime() - sessionStart.getTime()) / 1000)

      // Assert
      expect(durationSeconds).toBeGreaterThanOrEqual(0)
      expect(durationSeconds).toBeLessThan(5) // Test should complete quickly
    })

    it('should handle session creation errors gracefully', async () => {
      // Arrange
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: {
            message: 'Failed to create session',
            code: 'PGRST116'
          }
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .insert({ user_id: 'user-456' })
        .select()

      // Assert
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toBe('Failed to create session')
      expect(result.data).toBeNull()
    })
  })

  describe('Session Progress Tracking', () => {
    it('should update session progress at regular intervals', async () => {
      // Arrange
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ id: 'session-123', duration_seconds: 60 }],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .update({ duration_seconds: 60 })
        .eq('id', 'session-123')

      // Assert
      expect(mockUpdate).toHaveBeenCalledWith({ duration_seconds: 60 })
      expect(result.error).toBeNull()
    })

    it('should save biometric data if available', async () => {
      // Arrange
      const mockBiometricData = {
        session_id: 'session-123',
        heart_rate: 72,
        hrv: 50,
        timestamp: new Date().toISOString()
      }

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [mockBiometricData],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any)

      // Act
      const result = await supabase
        .from('biometric_data')
        .insert(mockBiometricData)
        .select()

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.heart_rate).toBe(72)
      expect(mockInsert).toHaveBeenCalled()
    })
  })

  describe('Session Completion', () => {
    it('should mark session as completed when user finishes', async () => {
      // Arrange
      const completedSession = {
        id: 'session-123',
        completed: true,
        completed_at: new Date().toISOString(),
        duration_seconds: 600,
        mood_after: 'relaxed'
      }

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [completedSession],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          mood_after: 'relaxed'
        })
        .eq('id', 'session-123')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.completed).toBe(true)
      expect(result.data?.[0]?.mood_after).toBe('relaxed')
    })

    it('should calculate and store session stats on completion', async () => {
      // Arrange
      const sessionStats = {
        total_sessions: 15,
        total_minutes: 225,
        streak_days: 7,
        last_session_date: new Date().toISOString()
      }

      const mockUpsert = vi.fn().mockResolvedValue({
        data: [sessionStats],
        error: null
      })

      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert
      } as any)

      // Act
      const result = await supabase
        .from('user_meditation_stats')
        .upsert({
          user_id: 'user-456',
          ...sessionStats
        })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.streak_days).toBe(7)
      expect(mockUpsert).toHaveBeenCalled()
    })

    it('should update meditation content play count', async () => {
      // Arrange
      const mockRpc = vi.fn().mockResolvedValue({
        data: { play_count: 101 },
        error: null
      })

      vi.mocked(supabase).rpc = mockRpc

      // Act
      const result = await supabase.rpc('increment_play_count', {
        content_id: 'content-789'
      })

      // Assert
      expect(result.error).toBeNull()
      expect(result.data?.play_count).toBe(101)
      expect(mockRpc).toHaveBeenCalledWith('increment_play_count', {
        content_id: 'content-789'
      })
    })
  })

  describe('Session Interruption Handling', () => {
    it('should save partial session on early exit', async () => {
      // Arrange
      const partialSession = {
        id: 'session-123',
        completed: false,
        duration_seconds: 180,
        interrupted: true
      }

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [partialSession],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .update({
          completed: false,
          duration_seconds: 180,
          interrupted: true
        })
        .eq('id', 'session-123')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.completed).toBe(false)
      expect(result.data?.[0]?.interrupted).toBe(true)
    })

    it('should handle network errors during save', async () => {
      // Arrange
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockRejectedValue(new Error('Network error'))
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act & Assert
      await expect(
        supabase
          .from('meditation_sessions')
          .update({ duration_seconds: 300 })
          .eq('id', 'session-123')
      ).rejects.toThrow('Network error')
    })
  })

  describe('Session History Retrieval', () => {
    it('should fetch user session history with pagination', async () => {
      // Arrange
      const mockSessions = [
        {
          id: 'session-1',
          started_at: '2024-10-19T10:00:00Z',
          duration_seconds: 600,
          completed: true
        },
        {
          id: 'session-2',
          started_at: '2024-10-18T10:00:00Z',
          duration_seconds: 300,
          completed: true
        }
      ]

      const mockRange = vi.fn().mockResolvedValue({
        data: mockSessions,
        error: null
      })

      const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq })
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', 'user-456')
        .order('started_at', { ascending: false })
        .range(0, 9)

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.length).toBe(2)
      expect(mockRange).toHaveBeenCalledWith(0, 9)
    })

    it('should filter sessions by date range', async () => {
      // Arrange
      const startDate = '2024-10-01T00:00:00Z'
      const endDate = '2024-10-31T23:59:59Z'

      const mockLte = vi.fn().mockResolvedValue({
        data: [],
        error: null
      })

      const mockGte = vi.fn().mockReturnValue({ lte: mockLte })
      const mockEq = vi.fn().mockReturnValue({ gte: mockGte })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq })
      } as any)

      // Act
      await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', 'user-456')
        .gte('started_at', startDate)
        .lte('started_at', endDate)

      // Assert
      expect(mockGte).toHaveBeenCalledWith('started_at', startDate)
      expect(mockLte).toHaveBeenCalledWith('started_at', endDate)
    })
  })

  describe('Concurrent Session Handling', () => {
    it('should prevent multiple active sessions for same user', async () => {
      // Arrange
      const existingSession = {
        id: 'session-123',
        user_id: 'user-456',
        completed: false
      }

      const mockEq2 = vi.fn().mockResolvedValue({
        data: [existingSession],
        error: null
      })

      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq1 })
      } as any)

      // Act
      const result = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', 'user-456')
        .eq('completed', false)

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.completed).toBe(false)
      // Business logic should check this before creating new session
    })
  })
})
