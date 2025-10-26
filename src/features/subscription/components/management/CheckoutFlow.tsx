import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { trackSubscriptionStarted } from '@/lib/analytics/analytics';

interface CheckoutFlowProps {
  onCancel: () => void;
  onComplete: () => void;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ onCancel }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { startPremiumCheckout } = useSubscriptionContext();
  
  const handleProceedToPayment = () => {
    setStep('payment');
  };
  
  const handleCompletePayment = async () => {
    setIsProcessing(true);

    // Track checkout started
    trackSubscriptionStarted('premium', 'monthly');

    try {
      // Redirect to Stripe checkout
      const checkoutUrl = await startPremiumCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" onClick={onCancel} className="p-0 mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Upgrade to Premium</CardTitle>
            <CardDescription>Complete your subscription</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
              1
            </div>
            <span className="ml-2 text-sm">Account Details</span>
          </div>
          <div className="h-px bg-border flex-grow mx-4" />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
              2
            </div>
            <span className="ml-2 text-sm">Payment</span>
          </div>
          <div className="h-px bg-border flex-grow mx-4" />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
              3
            </div>
            <span className="ml-2 text-sm">Confirmation</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {step === 'details' && (
          <div className="space-y-4">
            <h3 className="font-medium">Review Plan Details</h3>
            <div className="bg-secondary/50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Premium Plan</span>
                <span className="font-medium">$12.99/month</span>
              </div>
              <div className="text-muted-foreground text-sm">
                <p>✓ Unlimited meditation sessions</p>
                <p>✓ Advanced breathing exercises</p>
                <p>✓ Comprehensive analytics</p>
                <p>✓ 14-day free trial</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="space-y-1">
                <Label htmlFor="email">Your email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
            </div>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Credit or Debit Card</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                You'll be directed to our secure payment processor to complete your purchase.
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {step === 'details' && (
          <div className="w-full flex justify-end">
            <Button onClick={handleProceedToPayment}>Continue to Payment</Button>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setStep('details')}>
              Back
            </Button>
            <Button onClick={handleCompletePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Complete Purchase'
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CheckoutFlow;
