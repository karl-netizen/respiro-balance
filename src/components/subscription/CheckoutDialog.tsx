import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSubscriptionStore, SubscriptionTier, BillingCycle } from '@/store/subscriptionStore';
import { useModuleStore } from '@/store/moduleStore';
import { mockStripeService } from '@/lib/payment/stripe';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Lock } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  tier,
  billingCycle
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPricing, upgradeTier } = useSubscriptionStore();
  const { setSubscriptionTier, activateModule } = useModuleStore();
  
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const amount = tier !== 'free' ? getPricing(tier, billingCycle) : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!expiry || !expiry.includes('/')) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!cvc || cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    if (!cardholderName || cardholderName.trim().length === 0) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await mockStripeService.processPayment(
        cardNumber,
        expiry,
        cvc,
        cardholderName,
        amount,
        tier as any, // Cast for mock service
        billingCycle
      );

      if (result.success) {
        // Update subscription in store
        await upgradeTier(tier as 'standard' | 'premium', billingCycle);
        
        // Update module store
        setSubscriptionTier(tier);
        
        // Auto-activate modules based on tier
        if (tier === 'standard') {
          activateModule('biofeedback');
        } else if (tier === 'premium') {
          activateModule('biofeedback');
          activateModule('focus');
          activateModule('morning_rituals');
          activateModule('social');
          activateModule('work_life_balance');
        }

        toast({
          title: 'Payment Successful!',
          description: `Welcome to ${tier.charAt(0).toUpperCase() + tier.slice(1)}! Your account has been upgraded.`,
        });

        onOpenChange(false);
        navigate('/account');
      } else {
        toast({
          title: 'Payment Failed',
          description: result.error || 'Unable to process payment. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)} and unlock premium features
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{tier}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium capitalize">{billingCycle}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${amount.toFixed(2)}</span>
                </div>

                {billingCycle === 'annual' && (
                  <p className="text-xs text-muted-foreground">
                    Billed as one payment of ${amount.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={loading}
                />
                {errors.expiry && (
                  <p className="text-sm text-destructive">{errors.expiry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  disabled={loading}
                />
                {errors.cvc && (
                  <p className="text-sm text-destructive">{errors.cvc}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                disabled={loading}
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive">{errors.cardholderName}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By completing this purchase, you agree to our Terms of Service
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
