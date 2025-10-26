
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { openStripePaymentInNewTab } from '@/lib/stripePayment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentButtonProps extends Omit<ButtonProps, 'onClick'> {
  openInNewTab?: boolean;
  children?: React.ReactNode;
}

/**
 * A button that directs users to the Stripe payment page
 */
export const PaymentButton = ({
  openInNewTab = false,
  children = 'Upgrade to Premium',
  ...props
}: PaymentButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      if (openInNewTab) {
        await openStripePaymentInNewTab();
      } else {
        // First navigate to subscription page which has a proper checkout flow
        navigate('/subscription');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing error", {
        description: "There was an issue initiating the payment process. Please try again."
      });
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {children}
          {openInNewTab && <ExternalLink className="ml-2 h-4 w-4" />}
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
