
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useFeatureAccess } from './useFeatureAccess';

export interface PaywallTrigger {
  id: string;
  type: 'feature_limit' | 'session_limit' | 'premium_feature' | 'usage_milestone';
  condition: (userData: any) => boolean;
  priority: number;
  title: string;
  description: string;
  cta: string;
  socialProof?: string;
}

export interface ConversionEvent {
  event: string;
  userId: string;
  timestamp: Date;
  context: Record<string, any>;
}

export const useConversionOptimization = () => {
  const { user } = useAuth();
  const { currentTier } = useFeatureAccess();
  const [conversionEvents, setConversionEvents] = useState<ConversionEvent[]>([]);
  const [activePaywall, setActivePaywall] = useState<PaywallTrigger | null>(null);
  const [userBehaviorData, setUserBehaviorData] = useState<any>({});

  // Paywall triggers with smart conditions
  const paywallTriggers: PaywallTrigger[] = [
    {
      id: 'session_limit',
      type: 'session_limit',
      condition: (data) => data.sessionsThisWeek >= 3 && currentTier === 'free',
      priority: 1,
      title: 'Continue Your Journey',
      description: 'You\'ve completed 3 sessions this week! Upgrade to continue unlimited sessions.',
      cta: 'Unlock Unlimited Sessions',
      socialProof: '87% of users who upgrade at this point achieve their wellness goals'
    },
    {
      id: 'premium_feature',
      type: 'premium_feature',
      condition: (data) => data.premiumFeatureAttempts >= 2,
      priority: 2,
      title: 'Unlock Advanced Features',
      description: 'You\'ve tried premium features twice. Ready to unlock your full potential?',
      cta: 'Upgrade to Premium',
      socialProof: 'Join 10,000+ users who transformed their wellness journey'
    },
    {
      id: 'usage_milestone',
      type: 'usage_milestone',
      condition: (data) => data.totalSessions >= 10 && currentTier === 'free',
      priority: 3,
      title: 'You\'re Making Great Progress!',
      description: '10 sessions completed! Premium users see 3x better results.',
      cta: 'Accelerate Your Progress',
      socialProof: 'Users who upgrade after 10 sessions report 40% better stress reduction'
    }
  ];

  // Track conversion events
  const trackEvent = (event: string, context: Record<string, any> = {}) => {
    if (!user) return;

    const conversionEvent: ConversionEvent = {
      event,
      userId: user.id,
      timestamp: new Date(),
      context
    };

    setConversionEvents(prev => [...prev, conversionEvent]);
    
    // Update behavior data
    setUserBehaviorData(prev => ({
      ...prev,
      [event]: (prev[event] || 0) + 1,
      lastActivity: new Date()
    }));

    console.log('Conversion event tracked:', event, context);
  };

  // Check if paywall should be shown
  const checkPaywallTriggers = () => {
    if (currentTier !== 'free') return;

    const mockUserData = {
      sessionsThisWeek: userBehaviorData.session_complete || 0,
      premiumFeatureAttempts: userBehaviorData.premium_feature_attempt || 0,
      totalSessions: userBehaviorData.session_complete || 0,
      ...userBehaviorData
    };

    const triggeredPaywall = paywallTriggers
      .filter(trigger => trigger.condition(mockUserData))
      .sort((a, b) => a.priority - b.priority)[0];

    if (triggeredPaywall && activePaywall?.id !== triggeredPaywall.id) {
      setActivePaywall(triggeredPaywall);
      trackEvent('paywall_shown', { trigger: triggeredPaywall.id });
    }
  };

  // A/B test variants
  const getPaywallVariant = (triggerId: string) => {
    const variants = {
      session_limit: [
        { title: 'Continue Your Journey', cta: 'Unlock Unlimited' },
        { title: 'You\'re On Fire! 🔥', cta: 'Keep Going Premium' },
        { title: 'Don\'t Stop Now!', cta: 'Upgrade & Continue' }
      ],
      premium_feature: [
        { title: 'Ready for More?', cta: 'Go Premium' },
        { title: 'Unlock Your Potential', cta: 'Upgrade Now' },
        { title: 'Join Premium Users', cta: 'Get Full Access' }
      ]
    };

    const triggerVariants = variants[triggerId as keyof typeof variants] || [];
    const variantIndex = Math.floor(Math.random() * triggerVariants.length);
    return triggerVariants[variantIndex] || { title: 'Upgrade', cta: 'Go Premium' };
  };

  // Dismiss paywall
  const dismissPaywall = () => {
    if (activePaywall) {
      trackEvent('paywall_dismissed', { trigger: activePaywall.id });
      setActivePaywall(null);
    }
  };

  // Handle upgrade
  const handleUpgrade = (tier: string) => {
    if (activePaywall) {
      trackEvent('paywall_converted', { trigger: activePaywall.id, tier });
      setActivePaywall(null);
    }
  };

  // Check triggers on behavior changes
  useEffect(() => {
    checkPaywallTriggers();
  }, [userBehaviorData, currentTier]);

  return {
    activePaywall,
    trackEvent,
    dismissPaywall,
    handleUpgrade,
    getPaywallVariant,
    conversionEvents,
    userBehaviorData
  };
};
