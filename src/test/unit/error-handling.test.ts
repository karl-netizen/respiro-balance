import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@/test/utils/test-utils'
import { ProductionErrorBoundary, handleAsyncError, handleNetworkError } from '@/lib/logging/errorHandler'
import React from 'react'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('Error Handling System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('ProductionErrorBoundary', () => {
    it('should catch and display errors', () => {
      const { getByText } = render(
        <ProductionErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ProductionErrorBoundary>
      )

      expect(getByText('Something went wrong')).toBeInTheDocument()
      expect(getByText('Try Again')).toBeInTheDocument()
    })

    it('should render children when no error', () => {
      const { getByText } = render(
        <ProductionErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ProductionErrorBoundary>
      )

      expect(getByText('No error')).toBeInTheDocument()
    })

    it('should call custom error handler', () => {
      const onError = vi.fn()
      
      render(
        <ProductionErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ProductionErrorBoundary>
      )

      expect(onError).toHaveBeenCalled()
    })
  })

  describe('Async Error Handler', () => {
    it('should log async errors with context', () => {
      const error = new Error('Async operation failed')
      const context = { operation: 'fetchUserData', userId: '123' }

      handleAsyncError(error, context)

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
  })
})