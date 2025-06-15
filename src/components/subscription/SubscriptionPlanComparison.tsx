import React from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { NoOverlapGrid } from '@/components/responsive/NoOverlapGrid';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface SubscriptionPlanComparisonProps {
  onSelectPremium?: () => void;
}

const SubscriptionPlanComparison: React.FC<SubscriptionPlanComparisonProps> = ({
  onSelectPremium
}) => {
  const { user } = useAuth();
  const { deviceType } = useDeviceDetection();
  const { 
    isPremium, 
    subscriptionData, 
    startPremiumCheckout, 
    manageSubscription 
  } = useSubscription();
  
  console.log('SubscriptionPlanComparison - Device type:', deviceType);
  
  const handleSubscribe = async (tier: 'free' | 'premium' | 'premium-plus') => {
    if (!user && tier !== 'free') {
      toast.error("Please sign in to subscribe", {
        description: "You need to have an account to subscribe to a plan."
      });
      return;
    }
    
    try {
      // Handle free plan
      if (tier === 'free') {
        toast.success("Free plan selected!", {
          description: "Welcome to Respiro Balance"
        });
        // Navigate to onboarding or dashboard
        window.location.href = '/onboarding';
        return;
      }
      
      // Handle premium plan
      if (tier === 'premium') {
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
      
      // Handle premium plus (coming soon)
      if (tier === 'premium-plus') {
        toast.info("Premium Plus Available Soon", {
          description: "Premium Plus features will be available soon. Contact us for early access."
        });
        window.open("mailto:sales@respirobalance.com?subject=Premium Plus Early Access", "_blank");
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

  // Grid configuration based on device type - force desktop to use 3 columns
  const gridColumns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const gridGap = deviceType === 'mobile' ? 'md' : deviceType === 'tablet' ? 'lg' : 'xl';

  console.log('Grid configuration:', { gridColumns, gridGap, deviceType });

  return (
    <div>
      <NoOverlapGrid
        columns={gridColumns}
        gap={gridGap}
        className="max-w-6xl mx-auto"
      >
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
          onSubscribe={() => handleSubscribe('free')}
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
      </NoOverlapGrid>
      
      <div className={`text-center ${deviceType === 'mobile' ? 'mt-8' : 'mt-16'}`}>
        <p className={`text-sm text-muted-foreground mx-auto text-gray-700 dark:text-gray-300 ${
          deviceType === 'mobile' ? 'px-4' : 'max-w-2xl'
        }`}>
          All plans include access to our mobile app and web platform. Premium plans
          can be canceled at any time. For enterprise solutions or custom
          pricing, please contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;
