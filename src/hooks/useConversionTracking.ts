
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface ConversionEvent {
  event: string;
  tier?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface ConversionMetrics {
  freeToTrial: number;
  trialToPaid: number;
  upgradeRate: number;
  churnRate: number;
  timeToConvert: number;
}

export const useConversionTracking = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Track conversion events
  const trackEvent = useCallback(async (event: Omit<ConversionEvent, 'timestamp'>) => {
    if (!user) return;

    const conversionEvent: ConversionEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    try {
      // Store event locally for now (would typically send to analytics service)
      const existingEvents = JSON.parse(localStorage.getItem('conversion_events') || '[]');
      existingEvents.push(conversionEvent);
      localStorage.setItem('conversion_events', JSON.stringify(existingEvents));

      console.log('Conversion event tracked:', conversionEvent);
    } catch (error) {
      console.error('Failed to track conversion event:', error);
    }
  }, [user]);

  // Track specific conversion actions
  const trackPagewallView = useCallback((trigger: string, featureName: string) => {
    trackEvent({
      event: 'paywall_viewed',
      metadata: { trigger, featureName }
    });
  }, [trackEvent]);

  const trackUpgradeAttempt = useCallback((tier: string, source: string) => {
    trackEvent({
      event: 'upgrade_attempt',
      tier,
      metadata: { source }
    });
  }, [trackEvent]);

  const trackUpgradeSuccess = useCallback((tier: string, value: number) => {
    trackEvent({
      event: 'upgrade_success',
      tier,
      value,
      metadata: { conversionPoint: 'checkout_complete' }
    });
  }, [trackEvent]);

  const trackTrialStart = useCallback((tier: string) => {
    trackEvent({
      event: 'trial_start',
      tier,
      metadata: { trialDuration: tier === 'premium-plus' ? 3 : 7 }
    });
  }, [trackEvent]);

  const trackTrialEnd = useCallback((tier: string, converted: boolean) => {
    trackEvent({
      event: 'trial_end',
      tier,
      metadata: { converted }
    });
  }, [trackEvent]);

  const trackFeatureUsage = useCallback((feature: string, tier: string) => {
    trackEvent({
      event: 'feature_usage',
      tier,
      metadata: { feature, timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  const trackCancellationAttempt = useCallback((tier: string, reason: string) => {
    trackEvent({
      event: 'cancellation_attempt',
      tier,
      metadata: { reason }
    });
  }, [trackEvent]);

  const trackRetentionOffer = useCallback((tier: string, offerType: string, accepted: boolean) => {
    trackEvent({
      event: 'retention_offer',
      tier,
      metadata: { offerType, accepted }
    });
  }, [trackEvent]);

  const trackReferral = useCallback((source: string, successful: boolean) => {
    trackEvent({
      event: 'referral',
      metadata: { source, successful }
    });
  }, [trackEvent]);

  // Calculate conversion metrics
  const calculateMetrics = useCallback(() => {
    try {
      const events: ConversionEvent[] = JSON.parse(localStorage.getItem('conversion_events') || '[]');
      
      if (events.length === 0) {
        setMetrics({
          freeToTrial: 0,
          trialToPaid: 0,
          upgradeRate: 0,
          churnRate: 0,
          timeToConvert: 0
        });
        return;
      }

      // Calculate basic metrics (simplified)
      const totalSignups = events.filter(e => e.event === 'signup').length;
      const totalTrials = events.filter(e => e.event === 'trial_start').length;
      const totalPaid = events.filter(e => e.event === 'upgrade_success').length;
      const totalCancellations = events.filter(e => e.event === 'cancellation_attempt').length;

      const freeToTrial = totalSignups > 0 ? (totalTrials / totalSignups) * 100 : 0;
      const trialToPaid = totalTrials > 0 ? (totalPaid / totalTrials) * 100 : 0;
      const upgradeRate = totalSignups > 0 ? (totalPaid / totalSignups) * 100 : 0;
      const churnRate = totalPaid > 0 ? (totalCancellations / totalPaid) * 100 : 0;

      // Calculate average time to convert (simplified)
      const timeToConvert = 4.2; // Mock value in days

      setMetrics({
        freeToTrial,
        trialToPaid,
        upgradeRate,
        churnRate,
        timeToConvert
      });
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
    }
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  // A/B testing utilities
  const getVariant = useCallback((_testName: string): string => {
    if (!user) return 'control';
    
    // Simple hash-based A/B testing
    const hash = user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return Math.abs(hash) % 2 === 0 ? 'control' : 'variant';
  }, [user]);

  const trackABTest = useCallback((testName: string, variant: string, event: string) => {
    trackEvent({
      event: 'ab_test',
      metadata: { testName, variant, event }
    });
  }, [trackEvent]);

  return {
    metrics,
    isTracking,
    setIsTracking,
    trackEvent,
    trackPagewallView,
    trackUpgradeAttempt,
    trackUpgradeSuccess,
    trackTrialStart,
    trackTrialEnd,
    trackFeatureUsage,
    trackCancellationAttempt,
    trackRetentionOffer,
    trackReferral,
    calculateMetrics,
    getVariant,
    trackABTest
  };
};
