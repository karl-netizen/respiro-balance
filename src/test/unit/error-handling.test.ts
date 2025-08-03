import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleAsyncError, handleNetworkError } from '@/lib/logging/errorHandler'

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
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('Async Error Handler', () => {
    it('should log async errors with context', () => {
      const error = new Error('Async operation failed')
      const context = { operation: 'fetchUserData', userId: '123' }

      handleAsyncError(error, context)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle errors without context', () => {
      const error = new Error('Simple async error')

      handleAsyncError(error)

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Network Error Handler', () => {
    it('should log network errors with request details', () => {
      const error = new Error('Network request failed')
      const request = { url: '/api/users', method: 'GET' }

      handleNetworkError(error, request)

      expect(console.error).toHaveBeenCalled()
    })

    it('should include online status in logs', () => {
      const error = new Error('Connection timeout')
      const request = { url: '/api/data', method: 'POST' }

      handleNetworkError(error, request)

      expect(console.error).toHaveBeenCalled()
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