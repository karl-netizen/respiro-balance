
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFlowProps {
  onCancel: () => void;
  onComplete: () => void;
}

const CheckoutFlow = ({ onCancel, onComplete }: CheckoutFlowProps) => {
  const [step, setStep] = useState<'summary' | 'payment' | 'processing' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const { startPremiumCheckout } = useSubscriptionContext();
  const { user } = useAuth();

  const handleContinueToPayment = () => {
    setStep('payment');
  };
  
  const handleBack = () => {
    if (step === 'payment') {
      setStep('summary');
    } else {
      onCancel();
    }
  };
  
  const handleProcessPayment = async () => {
    setIsLoading(true);
    setStep('processing');
    
    try {
      // In a real implementation, this would redirect to Stripe
      // For now, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setStep('success');
      
      // In a real implementation, we would call the startPremiumCheckout function
      // and redirect to the Stripe checkout page
      // const checkoutUrl = await startPremiumCheckout();
      // window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
      setStep('payment');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleComplete = () => {
    // Update the subscription status in context
    // In a real implementation, this would happen after the user returns from Stripe
    onComplete();
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8 w-8 mr-2"
            onClick={handleBack}
            disabled={step === 'processing' || step === 'success'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>
            {step === 'summary' && 'Checkout - Plan Summary'}
            {step === 'payment' && 'Checkout - Payment Method'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Successful'}
          </CardTitle>
        </div>
        {step === 'summary' && (
          <CardDescription>
            Review your subscription details before proceeding to payment
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {step === 'summary' && (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Premium Plan</span>
                <span className="font-medium">$9.99/month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Billed monthly. Cancel anytime.
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Unlimited meditation minutes</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Advanced meditation techniques</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Full biometric integration</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Offline access to meditation content</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>$9.99/month</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <Label>Payment Method</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="Name on card" 
                      defaultValue={user?.email?.split('@')[0] || ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveCard" />
                    <Label htmlFor="saveCard">Save card for future payments</Label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>$9.99/month</span>
              </div>
            </div>
          </div>
        )}
        
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-center text-lg">
              Processing your payment...
            </p>
            <p className="text-center text-muted-foreground mt-2">
              Please don't close this window.
            </p>
          </div>
        )}
        
        {step === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Payment Successful!</h3>
            <p className="text-center text-muted-foreground mb-6">
              Thank you for upgrading to Premium. Your subscription is now active.
            </p>
            <div className="bg-muted rounded-lg p-4 w-full max-w-sm">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Plan:</span>
                  <span className="font-medium">Premium Monthly</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Amount:</span>
                  <span className="font-medium">$9.99/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Next billing date:</span>
                  <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step === 'summary' && (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleContinueToPayment}>
              Continue to Payment
            </Button>
          </>
        )}
        
        {step === 'payment' && (
          <>
            <Button variant="outline" onClick={() => setStep('summary')}>
              Back
            </Button>
            <Button 
              onClick={handleProcessPayment}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Complete Payment'}
            </Button>
          </>
        )}
        
        {step === 'success' && (
          <Button className="w-full" onClick={handleComplete}>
            Start Using Premium Features
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CheckoutFlow;
