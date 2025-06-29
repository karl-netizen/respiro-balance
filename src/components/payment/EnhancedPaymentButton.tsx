
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedPaymentButtonProps {
  tier: string;
  priceId: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const EnhancedPaymentButton: React.FC<EnhancedPaymentButtonProps> = ({
  tier,
  priceId,
  children,
  className,
  variant = 'default'
}) => {
  const { createCheckoutSession, isLoading } = usePaymentSystem();

  const handleClick = async () => {
    try {
      toast.info('Redirecting to secure checkout...', {
        description: 'Please wait while we prepare your payment session.'
      });

      const checkoutUrl = await createCheckoutSession(tier, priceId);
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('Checkout Error', {
          description: 'Unable to create checkout session. Please try again.'
        });
      }
    } catch (error) {
      console.error('Payment button error:', error);
      toast.error('Payment Error', {
        description: 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children}
        </>
      )}
    </Button>
  );
};
