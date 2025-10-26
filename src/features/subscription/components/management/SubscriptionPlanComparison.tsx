
import React from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
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
  } = useSubscriptionContext();
  
  const handleSubscribe = async (tier: 'free' | 'standard' | 'premium') => {
    if (!user && tier !== 'free') {
      toast.error("Please sign in to subscribe", {
        description: "You need to have an account to subscribe to a plan."
      });
      return;
    }
    
    try {
      if (tier === 'free') {
        toast.success("Free plan selected!", {
          description: "Welcome to Respiro Balance"
        });
        window.location.href = '/onboarding';
        return;
      }
      
      if (tier === 'standard' || tier === 'premium') {
        if (onSelectPremium) {
          onSelectPremium();
          return;
        }
        
        const checkoutUrl = await startPremiumCheckout();
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("Failed to get checkout URL");
        }
        return;
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

  const currentTier = isPremium ? (subscriptionData?.tier || 'premium') : 'free';

  // Calculate annual pricing with different discount percentages
  const _getAnnualPrice = (monthlyPrice: number, discountPercent: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * (1 - discountPercent / 100) * 100) / 100;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Free Plan */}
        <SubscriptionCard
          title="Free"
          description="Essential meditation basics"
          features={[
            "✓ 3 Beginner Sessions Only",
            "✓ 1 session per day (max 7/week)",
            "✓ 5-10 minute sessions only",
            "✓ Box Breathing only",
            "✓ Weekly streak count only",
            "✓ 1 sleep story",
            "✗ No mood tracking",
            "✗ 30-60 second ads between sessions",
            "✗ Internet required for all content",
            "✗ Single device only",
            "✗ No focus tools"
          ]}
          price={0}
          subscription={currentTier === 'free' ? {
            status: 'active',
            tier: 'free',
            current_period_end: '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('free')}
        />

        {/* Standard Plan */}
        <SubscriptionCard
          title="Standard"
          description="Comprehensive meditation toolkit"
          features={[
            "✓ 20 Sessions",
            "✓ 5 sessions per day",
            "✓ 5-30 minute sessions",
            "✓ 3 Proven Patterns + Guided Instructions",
            "✓ Monthly insights + basic charts",
            "✓ Daily mood check-ins",
            "✓ Completely ad-free experience",
            "✓ Download up to 5 sessions",
            "✓ Sync across 3 devices",
            "✓ 5 sleep stories + nature sounds",
            "✓ Community forum + email (72h response)"
          ]}
          price={9}
          subscription={currentTier === 'standard' ? {
            status: 'active',
            tier: 'standard',
            current_period_end: '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('standard')}
          onManage={handleManageSubscription}
        />

        {/* Premium Plan */}
        <SubscriptionCard
          title="Premium"
          description="Advanced features + biofeedback"
          features={[
            "Everything in Standard, plus:",
            "✓ 50 Sessions",
            "✓ Unlimited daily sessions", 
            "✓ 5-60 minute sessions",
            "✓ All Patterns + Custom Timing",
            "✓ Advanced wellness tracking + trends",
            "✓ Mood + sleep + energy tracking",
            "✓ Heart rate + stress monitoring",
            "✓ Download up to 20 sessions",
            "✓ 15 sleep stories + sleep courses",
            "✓ Share with 1 family member",
            "✓ Priority email support (24h response)"
          ]}
          price={13}
          highlighted={true}
          subscription={currentTier === 'premium' ? {
            status: 'active',
            tier: 'premium',
            current_period_end: '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium')}
          onManage={handleManageSubscription}
        />
      </div>
      
      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          All plans include access to our mobile app and web platform. Paid plans
          can be canceled at any time. Annual plans save 32-35% compared to monthly.
          For enterprise solutions or custom pricing, please contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;
