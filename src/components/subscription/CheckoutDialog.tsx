import { useState } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useModuleStore } from '@/store/moduleStore';
import { stripeService } from '@/lib/payment/stripe';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  tier: 'standard' | 'premium';
  cycle: 'monthly' | 'annual';
}

export function CheckoutDialog({
  open,
  onClose,
  tier,
  cycle
}: CheckoutDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPricing, upgradeTier } = useSubscriptionStore();
  const { setSubscriptionTier, activateModule } = useModuleStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const amount = getPricing(tier, cycle);
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Basic validation
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
        setError('Please enter a valid card number');
        setIsProcessing(false);
        return;
      }

      if (!expiry || !expiry.includes('/')) {
        setError('Please enter a valid expiry date');
        setIsProcessing(false);
        return;
      }

      if (!cvc || cvc.length < 3) {
        setError('Please enter a valid CVC');
        setIsProcessing(false);
        return;
      }

      if (!cardholderName || cardholderName.trim().length === 0) {
        setError('Please enter cardholder name');
        setIsProcessing(false);
        return;
      }

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        tier,
        cycle
      );

      if (paymentIntent.status === 'succeeded') {
        // Upgrade subscription
        await upgradeTier(tier, cycle);
        
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

        // Show success toast
        toast({
          title: 'Payment Successful!',
          description: `Welcome to ${tierName}! Your account has been upgraded.`,
        });
        
        // Close dialog
        onClose();
        
        // Redirect to dashboard with success indicator
        navigate('/dashboard?upgraded=true');
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Upgrade</DialogTitle>
          <DialogDescription>
            Subscribe to Respiro Balance {tierName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{tierName} Plan</span>
              <Badge>{cycle}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {cycle === 'annual' 
                ? 'Billed annually. Cancel anytime.' 
                : 'Billed monthly. Cancel anytime.'}
            </p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  disabled={isProcessing}
                  required
                />
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={isProcessing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                disabled={isProcessing}
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
