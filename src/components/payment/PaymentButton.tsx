
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { redirectToStripePayment, openStripePaymentInNewTab } from '@/lib/stripePayment';

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
  const handleClick = () => {
    if (openInNewTab) {
      openStripePaymentInNewTab();
    } else {
      redirectToStripePayment();
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
      {openInNewTab && <ExternalLink className="ml-2 h-4 w-4" />}
    </Button>
  );
};

export default PaymentButton;
