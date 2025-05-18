
import React from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionPlanComparisonProps {
  onSelectPremium?: () => void;
}

const SubscriptionPlanComparison: React.FC<SubscriptionPlanComparisonProps> = ({
  onSelectPremium
}) => {
  const { user } = useAuth();
  const { 
    isPremium, 
    subscriptionData, 
    startPremiumCheckout, 
    manageSubscription 
  } = useSubscription();
  
  const handleSubscribe = async (tier: 'premium') => {
    if (!user) {
      toast.error("Please sign in to subscribe", {
        description: "You need to have an account to subscribe to a plan."
      });
      return;
    }
    
    try {
      // If user has their own function, use that
      if (onSelectPremium) {
        onSelectPremium();
        return;
      }
      
      // Otherwise use our function which will redirect to checkout
      if (tier === 'premium') {
        const checkoutUrl = await startPremiumCheckout();
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("Failed to get checkout URL");
        }
      }
    } catch (error) {
      toast.error("Checkout failed", {
        description: "There was an error starting the checkout process. Please try again."
      });
      console.error("Checkout error:", error);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      const portalUrl = await manageSubscription();
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to get portal URL");
      }
    } catch (error) {
      toast.error("Failed to open subscription management", {
        description: "There was an error accessing your subscription. Please try again."
      });
      console.error("Portal error:", error);
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <SubscriptionCard
          title="Free"
          description="Get started with the basics"
          features={[
            "60 minutes of guided meditation per month",
            "Basic breathing exercises",
            "Simple tracking tools",
            "Daily reminders",
            "Limited analytics"
          ]}
          price={0}
          subscription={!isPremium ? {
            status: 'active',
            tier: 'free',
            current_period_end: '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => {}}
        />

        {/* Premium Plan */}
        <SubscriptionCard
          title="Premium"
          description="Unlock the full experience"
          features={[
            "Unlimited meditation sessions",
            "Advanced breathing exercises",
            "Comprehensive analytics",
            "Personalized recommendations",
            "Priority support",
            "Biofeedback integration"
          ]}
          price={9.99}
          highlighted={true}
          subscription={isPremium ? {
            status: 'active',
            tier: 'premium',
            current_period_end: subscriptionData?.subscription_period_end || '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium')}
          onManage={handleManageSubscription}
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All plans include a 14-day free trial. Cancel anytime.</p>
        <p className="mt-1">Need special pricing for your team? <a href="/contact" className="underline">Contact us</a></p>
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;
