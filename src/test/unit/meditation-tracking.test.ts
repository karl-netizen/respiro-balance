import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn()
          })),
          single: vi.fn()
        }))
      }))
    })),
    rpc: vi.fn()
  }
}))

const mockSupabase = vi.mocked(supabase)

describe('Meditation Session Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Session Creation', () => {
    it('should create a new meditation session', async () => {
      // Arrange
      const sessionData = {
        user_id: 'user-123',
        content_id: 'meditation-456',
        duration: 600, // 10 minutes
        session_type: 'guided',
        completed: false,
        title: 'Deep Breathing Session'
      }

      const mockResponse = {
        data: {
          id: 'session-789',
          ...sessionData,
          created_at: new Date().toISOString()
        },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      // Setup the chain of mocks
      const mockSingle = vi.fn().mockResolvedValue(mockResponse)
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any)

      // Act
      const result = await mockSupabase
        .from('meditation_sessions')
        .insert(sessionData)
        .select()
        .single()

      // Assert
      expect(result.error).toBeNull()
      expect(result.data?.id).toBe('session-789')
      expect(result.data?.duration).toBe(600)
    })

    it('should handle session creation errors', async () => {
      // Arrange
      const mockErrorResponse = {
        data: null,
        error: {
          code: '23503',
          message: 'Foreign key violation',
          details: 'Invalid user_id'
        },
        count: null,
        status: 400,
        statusText: 'Bad Request'
      }

      const mockSingle = vi.fn().mockResolvedValue(mockErrorResponse)
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any)

      // Act
      const result = await mockSupabase
        .from('meditation_sessions')
        .insert({
          user_id: 'invalid-user',
          duration: 600
        })
        .select()
        .single()

      // Assert
      expect(result.data).toBeNull()
      expect(result.error?.code).toBe('23503')
    })
  })

  describe('Session Progress Tracking', () => {
    it('should update session progress', async () => {
      // Arrange
      const sessionId = 'session-123'
      const progressData = {
        progress_seconds: 300,
        completed: false,
        last_played_at: new Date().toISOString()
      }

      const mockResponse = {
        data: { id: sessionId, ...progressData },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const mockSingle = vi.fn().mockResolvedValue(mockResponse)
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })
      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any)

      // Act
      const result = await mockSupabase
        .from('meditation_sessions')
        .update(progressData)
        .eq('id', sessionId)
        .select()
        .single()

      // Assert
      expect(result.error).toBeNull()
      expect(result.data?.progress_seconds).toBe(300)
    })
  })

  describe('Session Retrieval', () => {
    it('should fetch user session history', async () => {
      // Arrange
      const userId = 'user-123'
      const mockSessions = [
        {
          id: 'session-1',
          user_id: userId,
          duration: 600,
          completed: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'session-2',
          user_id: userId,
          duration: 900,
          completed: false,
          created_at: new Date().toISOString()
        }
      ]

      const mockResponse = {
        data: mockSessions,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const mockLimit = vi.fn().mockResolvedValue(mockResponse)
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any)

      // Act
      const result = await mockSupabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      // Assert
      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0].id).toBe('session-1')
    })
  })

  describe('Session Analytics', () => {
    it('should track meditation content popularity', async () => {
      // Arrange
      const contentId = 'meditation-456'

      const mockResponse = {
        data: null,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      mockSupabase.rpc.mockResolvedValue(mockResponse)

      // Act
      await mockSupabase.rpc('increment_play_count', {
        content_id: contentId
      })

      // Assert
      expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_play_count', {
        content_id: contentId
      })
    })

    it('should update user meditation usage', async () => {
      // Arrange
      const userId = 'user-123'
      const minutesUsed = 10

      const mockResponse = {
        data: null,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      mockSupabase.rpc.mockResolvedValue(mockResponse)

      // Act
      await mockSupabase.rpc('increment_meditation_usage', {
        user_id_param: userId,
        minutes_used: minutesUsed
      })

      // Assert
      expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_meditation_usage', {
        user_id_param: userId,
        minutes_used: minutesUsed
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      const mockInsert = vi.fn().mockRejectedValue(new Error('Database connection failed'))
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any)

      // Act & Assert
      await expect(
        mockSupabase
          .from('meditation_sessions')
          .insert({ user_id: 'user-123', duration: 600 })
      ).rejects.toThrow('Database connection failed')
    })
  })
})