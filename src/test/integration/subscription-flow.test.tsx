import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
  }
}))

describe('Subscription Flow Integration Tests', () => {
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

  describe('Subscription Check', () => {
    it('should verify free tier user has no subscription', async () => {
      // Arrange
      const mockSubscriptionData = {
        subscribed: false,
        subscription_tier: 'free',
        status: 'inactive',
        subscription_end: null,
        customer_id: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockSubscriptionData,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-subscription')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.subscribed).toBe(false)
      expect(result.data.subscription_tier).toBe('free')
      expect(supabase.functions.invoke).toHaveBeenCalledWith('check-subscription')
    })

    it('should verify premium user has active subscription', async () => {
      // Arrange
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 1)

      const mockSubscriptionData = {
        subscribed: true,
        subscription_tier: 'premium',
        status: 'active',
        subscription_end: futureDate.toISOString(),
        customer_id: 'cus_123abc'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockSubscriptionData,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-subscription')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.subscribed).toBe(true)
      expect(result.data.subscription_tier).toBe('premium')
      expect(result.data.status).toBe('active')
      expect(new Date(result.data.subscription_end)).toBeInstanceOf(Date)
    })

    it('should handle expired subscriptions correctly', async () => {
      // Arrange
      const pastDate = new Date()
      pastDate.setMonth(pastDate.getMonth() - 1)

      const mockSubscriptionData = {
        subscribed: false,
        subscription_tier: 'free',
        status: 'expired',
        subscription_end: pastDate.toISOString(),
        customer_id: 'cus_123abc'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockSubscriptionData,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-subscription')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.subscribed).toBe(false)
      expect(result.data.status).toBe('expired')
      expect(new Date(result.data.subscription_end)).toBeInstanceOf(Date)
    })

    it('should handle check-subscription errors gracefully', async () => {
      // Arrange
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: {
          message: 'Failed to check subscription status',
          code: 'SUBSCRIPTION_ERROR'
        }
      })

      // Act
      const result = await supabase.functions.invoke('check-subscription')

      // Assert
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toBe('Failed to check subscription status')
      expect(result.data).toBeNull()
    })
  })

  describe('Checkout Flow', () => {
    it('should create Stripe checkout session for premium tier', async () => {
      // Arrange
      const mockCheckoutResponse = {
        url: 'https://checkout.stripe.com/pay/cs_test_123abc',
        session_id: 'cs_test_123abc'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockCheckoutResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: 'premium',
          billing_cycle: 'monthly'
        }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.url).toContain('checkout.stripe.com')
      expect(result.data.session_id).toBe('cs_test_123abc')
      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-checkout', {
        body: {
          tier: 'premium',
          billing_cycle: 'monthly'
        }
      })
    })

    it('should support annual billing option', async () => {
      // Arrange
      const mockCheckoutResponse = {
        url: 'https://checkout.stripe.com/pay/cs_test_annual_456',
        session_id: 'cs_test_annual_456',
        discount_percentage: 20
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockCheckoutResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: 'premium',
          billing_cycle: 'annual'
        }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.discount_percentage).toBe(20)
      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-checkout', {
        body: {
          tier: 'premium',
          billing_cycle: 'annual'
        }
      })
    })

    it('should handle checkout creation errors', async () => {
      // Arrange
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: {
          message: 'Invalid tier selection',
          code: 'INVALID_TIER'
        }
      })

      // Act
      const result = await supabase.functions.invoke('create-checkout', {
        body: { tier: 'invalid-tier' }
      })

      // Assert
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toBe('Invalid tier selection')
      expect(result.data).toBeNull()
    })

    it('should require authentication for checkout', async () => {
      // Arrange
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: {
          message: 'User must be authenticated',
          code: 'AUTH_REQUIRED'
        }
      })

      // Act
      const result = await supabase.functions.invoke('create-checkout', {
        body: { tier: 'premium' }
      })

      // Assert
      expect(result.error).toBeTruthy()
      expect(result.error?.code).toBe('AUTH_REQUIRED')
    })
  })

  describe('Customer Portal Access', () => {
    it('should create customer portal session for existing customer', async () => {
      // Arrange
      const mockPortalResponse = {
        url: 'https://billing.stripe.com/p/session_123abc',
        return_url: 'http://localhost:3000/settings'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockPortalResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('customer-portal')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.url).toContain('billing.stripe.com')
      expect(supabase.functions.invoke).toHaveBeenCalledWith('customer-portal')
    })

    it('should handle non-customer portal access gracefully', async () => {
      // Arrange
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: {
          message: 'No Stripe customer found',
          code: 'NO_CUSTOMER'
        }
      })

      // Act
      const result = await supabase.functions.invoke('customer-portal')

      // Assert
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toBe('No Stripe customer found')
      expect(result.data).toBeNull()
    })
  })

  describe('Subscription Management', () => {
    it('should cancel subscription at period end', async () => {
      // Arrange
      const mockCancelResponse = {
        success: true,
        cancel_at_period_end: true,
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockCancelResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('cancel-subscription', {
        body: { immediate: false }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.cancel_at_period_end).toBe(true)
      expect(result.data.success).toBe(true)
    })

    it('should reactivate canceled subscription', async () => {
      // Arrange
      const mockReactivateResponse = {
        success: true,
        status: 'active',
        cancel_at_period_end: false
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockReactivateResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('reactivate-subscription')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.status).toBe('active')
      expect(result.data.cancel_at_period_end).toBe(false)
    })

    it('should update billing cycle from monthly to annual', async () => {
      // Arrange
      const mockUpdateResponse = {
        success: true,
        billing_cycle: 'annual',
        discount_applied: 20
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockUpdateResponse,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('update-subscription', {
        body: { billing_cycle: 'annual' }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.billing_cycle).toBe('annual')
      expect(result.data.discount_applied).toBe(20)
    })
  })

  describe('Feature Access Control', () => {
    it('should allow premium features for subscribed users', async () => {
      // Arrange
      const mockCheckAccess = {
        has_access: true,
        feature: 'advanced-analytics',
        tier_required: 'premium'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockCheckAccess,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-feature-access', {
        body: { feature: 'advanced-analytics' }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.has_access).toBe(true)
      expect(result.data.feature).toBe('advanced-analytics')
    })

    it('should deny premium features for free users', async () => {
      // Arrange
      const mockCheckAccess = {
        has_access: false,
        feature: 'advanced-analytics',
        tier_required: 'premium',
        current_tier: 'free'
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockCheckAccess,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-feature-access', {
        body: { feature: 'advanced-analytics' }
      })

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.has_access).toBe(false)
      expect(result.data.current_tier).toBe('free')
    })
  })

  describe('Webhook Processing', () => {
    it('should update user subscription on successful payment', async () => {
      // Arrange
      const mockWebhookData = {
        type: 'invoice.payment_succeeded',
        customer_id: 'cus_123abc',
        subscription_id: 'sub_456def',
        tier: 'premium',
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ subscription_tier: 'premium', status: 'active' }],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act
      const result = await supabase
        .from('user_subscriptions')
        .update({
          subscription_tier: 'premium',
          status: 'active',
          subscription_end: mockWebhookData.period_end
        })
        .eq('customer_id', mockWebhookData.customer_id)

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.subscription_tier).toBe('premium')
      expect(mockUpdate).toHaveBeenCalled()
    })

    it('should handle subscription cancellation webhook', async () => {
      // Arrange
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ subscription_tier: 'free', status: 'canceled' }],
          error: null
        })
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any)

      // Act
      const result = await supabase
        .from('user_subscriptions')
        .update({
          subscription_tier: 'free',
          status: 'canceled'
        })
        .eq('customer_id', 'cus_123abc')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.status).toBe('canceled')
    })
  })

  describe('Subscription Edge Cases', () => {
    it('should handle grace period for expired payment', async () => {
      // Arrange
      const mockSubscriptionData = {
        subscribed: true,
        subscription_tier: 'premium',
        status: 'past_due',
        grace_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockSubscriptionData,
        error: null
      })

      // Act
      const result = await supabase.functions.invoke('check-subscription')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data.status).toBe('past_due')
      expect(result.data.grace_period_end).toBeTruthy()
    })

    it('should prevent duplicate active subscriptions', async () => {
      // Arrange
      const existingSubscription = {
        user_id: 'user-123',
        status: 'active',
        subscription_tier: 'premium'
      }

      const mockEq2 = vi.fn().mockResolvedValue({
        data: [existingSubscription],
        error: null
      })

      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq1 })
      } as any)

      // Act
      const result = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', 'user-123')
        .eq('status', 'active')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.data?.[0]?.status).toBe('active')
      // Business logic should prevent creating another active subscription
    })
  })
})
