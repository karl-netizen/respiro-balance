import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleAsyncError, handleNetworkError } from '@/lib/logging/errorHandler'
import { logger } from '@/lib/logging/logger'

// Mock the logger
vi.mock('@/lib/logging/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

// Simple mock component for testing
const createErrorComponent = (shouldThrow: boolean) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return 'No error'
}

describe('Error Handling System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Async Error Handler', () => {
    it('should log async errors with context', () => {
      const error = new Error('Async operation failed')
      const context = { operation: 'fetchUserData', userId: '123' }

      handleAsyncError(error, context)

      expect(logger.error).toHaveBeenCalledWith(
        'Async Operation Failed',
        error,
        expect.objectContaining({
          component: 'AsyncErrorHandler',
          feature: 'errorHandling',
          operation: 'fetchUserData',
          userId: '123'
        })
      )
    })

    it('should handle errors without context', () => {
      const error = new Error('Simple async error')

      handleAsyncError(error)

      expect(logger.error).toHaveBeenCalledWith(
        'Async Operation Failed',
        error,
        expect.objectContaining({
          component: 'AsyncErrorHandler',
          feature: 'errorHandling'
        })
      )
    })
  })

  describe('Network Error Handler', () => {
    it('should log network errors with request details', () => {
      const error = new Error('Network request failed')
      const request = { url: '/api/users', method: 'GET' }

      handleNetworkError(error, request)

      expect(logger.error).toHaveBeenCalledWith(
        'Network Request Failed',
        error,
        expect.objectContaining({
          component: 'NetworkErrorHandler',
          feature: 'network',
          url: '/api/users',
          method: 'GET',
          isOnline: expect.any(Boolean)
        })
      )
    })

    it('should include online status in logs', () => {
      const error = new Error('Connection timeout')
      const request = { url: '/api/data', method: 'POST' }

      handleNetworkError(error, request)

      expect(logger.error).toHaveBeenCalledWith(
        'Network Request Failed',
        error,
        expect.objectContaining({
          isOnline: expect.any(Boolean)
        })
      )
    })
  })

  describe('Error Component Testing', () => {
    it('should handle components that throw errors', () => {
      expect(() => createErrorComponent(true)).toThrow('Test error')
    })

    it('should handle components that work normally', () => {
      expect(createErrorComponent(false)).toBe('No error')
    })
  })
})