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
  
  const handleSubscribe = async (tier: 'premium' | 'premium-plus') => {
    if (!user) {
      toast.error("Please sign in to subscribe", {
        description: "You need to have an account to subscribe to a plan."
      });
      return;
    }
    
    try {
      // If user has their own function, use that
      if (onSelectPremium && tier === 'premium') {
        onSelectPremium();
        return;
      }
      
      // Otherwise use our function which will redirect to checkout
      const checkoutUrl = await startPremiumCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to get checkout URL");
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

  // Determine current user's tier
  const currentTier = isPremium ? (subscriptionData?.tier || 'premium') : 'free';

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <SubscriptionCard
          title="Free"
          description="Essential meditation and breathing basics"
          features={[
            "5 Core Sessions - Essential meditation and quick breaks",
            "Basic Breathing Techniques - 3 fundamental patterns",
            "Simple Progress Tracking - Basic analytics and streaks",
            "Community Access - Join discussions and view content",
            "Weekly Session Limit - Up to 3 sessions per week"
          ]}
          price={0}
          subscription={currentTier === 'free' ? {
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
          description="Comprehensive meditation and breathing toolkit"
          features={[
            "14 Meditation Sessions - Comprehensive guided library",
            "Advanced Breathing Techniques - All patterns and customizations",
            "Unlimited Sessions - No weekly limits or restrictions",
            "Full Progress Analytics - Detailed insights and trends",
            "Social Features - Complete community engagement",
            "Focus Mode - Advanced Pomodoro timer with analytics"
          ]}
          price={7.99}
          highlighted={true}
          subscription={currentTier === 'premium' ? {
            status: 'active',
            tier: 'premium',
            current_period_end: subscriptionData?.subscription_period_end || '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium')}
          onManage={handleManageSubscription}
        />

        {/* Premium Plus Plan */}
        <SubscriptionCard
          title="Premium Plus"
          description="Complete platform access with AI insights"
          features={[
            "Complete Library - All 22 sessions including exclusive content",
            "Biofeedback Integration - Real-time heart rate monitoring",
            "Advanced Analytics - AI-powered insights and recommendations",
            "Priority Support - Enhanced customer service",
            "Early Access - First access to new features and content",
            "Social Hub Premium - Advanced community features"
          ]}
          price={12.99}
          subscription={currentTier === 'premium-plus' ? {
            status: 'active',
            tier: 'premium-plus',
            current_period_end: subscriptionData?.subscription_period_end || '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium-plus')}
          onManage={handleManageSubscription}
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All plans include access to our mobile app and web platform. Premium plans can be canceled anytime.</p>
        <p className="mt-1">Need special pricing for your team? <a href="/contact" className="underline">Contact us</a></p>
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;
