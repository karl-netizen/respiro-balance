
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
  
  const handleSubscribe = async (tier: 'free' | 'premium' | 'premium-pro' | 'premium-plus') => {
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
      
      if (tier === 'premium-pro') {
        toast.info("Premium Pro Available Soon", {
          description: "Premium Pro features will be available soon. Contact us for early access."
        });
        window.open("mailto:sales@respirobalance.com?subject=Premium Pro Early Access", "_blank");
        return;
      }
      
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

  const currentTier = isPremium ? (subscriptionData?.tier || 'premium') : 'free';

  // Calculate annual pricing with different discount percentages
  const getAnnualPrice = (monthlyPrice: number, discountPercent: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * (1 - discountPercent / 100) * 100) / 100;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Free Plan */}
        <SubscriptionCard
          title="Free"
          description="Essential meditation basics"
          features={[
            "3 Core Sessions - Essential meditation basics",
            "Basic Breathing Techniques - 3 fundamental patterns",
            "Simple Progress Tracking - Basic streaks only",
            "Weekly Session Limit - Up to 2 sessions per week",
            "Ads between sessions",
            "Community access (view announcements only)",
            "No offline access"
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
          description="Comprehensive meditation toolkit"
          features={[
            "14 Meditation Sessions - Comprehensive guided library",
            "Advanced Breathing Techniques - All patterns and customizations",
            "Unlimited Sessions - No weekly limits or restrictions",
            "Full Progress Analytics - Detailed insights and trends",
            "Ad-Free Experience - No interruptions",
            "Offline Mode - Download and use anywhere",
            "Community Access - Join discussions and share progress",
            "Sleep Stories - 5 exclusive bedtime stories",
            "Mood Tracking - Daily check-ins with meditation correlation",
            "Focus Mode - Advanced Pomodoro timer with analytics"
          ]}
          price={11.97}
          subscription={currentTier === 'premium' ? {
            status: 'active',
            tier: 'premium',
            current_period_end: subscriptionData?.subscription_period_end || '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium')}
          onManage={handleManageSubscription}
        />

        {/* Premium Pro Plan */}
        <SubscriptionCard
          title="Premium Pro"
          description="Advanced features + biofeedback"
          features={[
            "Everything in Premium, plus:",
            "18 Meditation Sessions - Extended library with variety",
            "Advanced Habit Tracking - Detailed streaks and rewards",
            "Basic Biofeedback Integration - Heart rate monitoring",
            "Sleep Stories Library - 15+ exclusive stories",
            "Group Challenges - Join community meditation challenges",
            "Email Support - 48-hour response time",
            "Custom Breathing Patterns - Create your own techniques",
            "Advanced Progress Metrics - Detailed wellness insights"
          ]}
          price={19.97}
          highlighted={true}
          subscription={currentTier === 'premium-pro' ? {
            status: 'active',
            tier: 'premium-pro',
            current_period_end: subscriptionData?.subscription_period_end || '',
            cancel_at_period_end: false
          } : undefined}
          onSubscribe={() => handleSubscribe('premium-pro')}
          onManage={handleManageSubscription}
        />

        {/* Premium Plus Plan */}
        <SubscriptionCard
          title="Premium Plus"
          description="Complete platform with AI & biofeedback coaching"
          features={[
            "Everything in Premium Pro, plus:",
            "Complete Library - All 50+ sessions + monthly new releases",
            "Advanced Biofeedback Coaching - Real-time guidance and insights",
            "AI-Powered Personalization - Custom meditation plans generated monthly",
            "Family Sharing - Up to 4 accounts included",
            "Exclusive Masterclasses - Monthly expert-led sessions",
            "Priority Support - 24-hour response time",
            "White-label Experience - Customize app branding",
            "Comprehensive Wellness Dashboard - Full health integration"
          ]}
          price={29.97}
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
      
      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          All plans include access to our mobile app and web platform. Premium plans
          can be canceled at any time. Annual plans save 32-40% compared to monthly.
          For enterprise solutions or custom pricing, please contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;
