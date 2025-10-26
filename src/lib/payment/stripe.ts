import { SubscriptionTier, BillingCycle } from '@/store/subscriptionStore';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'failed';
}

export interface PaymentMethod {
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

/**
 * Mock Stripe service for demo purposes
 * In production, this would integrate with actual Stripe API
 */
export class MockStripeService {
  /**
   * Simulates creating a payment intent
   */
  async createPaymentIntent(
    amount: number,
    _tier: SubscriptionTier,
    _cycle: BillingCycle
  ): Promise<PaymentIntent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Always succeed for demo
    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      status: 'succeeded'
    };
  }

  /**
   * Simulates processing a payment
   */
  async processPayment(
    cardNumber: string,
    expiry: string,
    cvc: string,
    cardholderName: string,
    amount: number,
    tier: SubscriptionTier,
    cycle: BillingCycle
  ): Promise<{ success: boolean; paymentIntent?: PaymentIntent; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Basic validation
    if (!cardNumber || cardNumber.length < 13) {
      return { success: false, error: 'Invalid card number' };
    }
    
    if (!expiry || !expiry.includes('/')) {
      return { success: false, error: 'Invalid expiry date' };
    }
    
    if (!cvc || cvc.length < 3) {
      return { success: false, error: 'Invalid CVC' };
    }
    
    if (!cardholderName || cardholderName.trim().length === 0) {
      return { success: false, error: 'Cardholder name is required' };
    }
    
    // Create payment intent
    const paymentIntent = await this.createPaymentIntent(amount, tier, cycle);
    
    return {
      success: true,
      paymentIntent
    };
  }

  /**
   * Simulates creating a subscription
   */
  async createSubscription(
    _customerId: string,
    _priceId: string
  ): Promise<{ subscriptionId: string; status: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      subscriptionId: `sub_${Date.now()}`,
      status: 'active'
    };
  }

  /**
   * Simulates canceling a subscription
   */
  async cancelSubscription(_subscriptionId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  /**
   * Simulates getting payment method
   */
  async getPaymentMethod(): Promise<PaymentMethod> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025
    };
  }

  /**
   * Simulates updating payment method
   */
  async updatePaymentMethod(
    cardNumber: string,
    _expiry: string,
    _cvc: string
  ): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic validation
    if (!cardNumber || cardNumber.length < 13) {
      return { success: false, error: 'Invalid card number' };
    }
    
    return { success: true };
  }

  /**
   * Mock billing history
   */
  async getBillingHistory(): Promise<BillingHistoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        date: new Date(2025, 2, 1).toISOString(),
        amount: 6.99,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: '2',
        date: new Date(2025, 1, 1).toISOString(),
        amount: 6.99,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: '3',
        date: new Date(2025, 0, 1).toISOString(),
        amount: 6.99,
        status: 'paid',
        invoiceUrl: '#'
      }
    ];
  }
}

export const mockStripeService = new MockStripeService();
export const stripeService = mockStripeService;
