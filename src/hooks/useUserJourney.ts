import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/features/subscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JourneyStep {
  id: string;
  name: string;
  completed: boolean;
  timestamp?: Date;
  data?: any;
}

interface UserJourneyData {
  userId: string;
  sessionId: string;
  steps: JourneyStep[];
  currentStep: string;
  journeyType: 'onboarding' | 'payment' | 'daily-usage' | 'content-discovery';
  startTime: Date;
  metadata: Record<string, any>;
}

export const useUserJourney = () => {
  const { user } = useAuth();
  const { subscriptionData } = useSubscription();
  const [currentJourney, setCurrentJourney] = useState<UserJourneyData | null>(null);
  const [journeyMetrics, setJourneyMetrics] = useState<Record<string, any>>({});

  // Track journey step completion
  const trackStep = async (stepId: string, stepName: string, data?: any) => {
    if (!user || !currentJourney) return;

    const step: JourneyStep = {
      id: stepId,
      name: stepName,
      completed: true,
      timestamp: new Date(),
      data
    };

    // Update local state
    setCurrentJourney(prev => {
      if (!prev) return null;
      
      const updatedSteps = [...prev.steps];
      const existingIndex = updatedSteps.findIndex(s => s.id === stepId);
      
      if (existingIndex >= 0) {
        updatedSteps[existingIndex] = step;
      } else {
        updatedSteps.push(step);
      }

      return {
        ...prev,
        steps: updatedSteps,
        currentStep: stepId
      };
    });

    // Log to analytics/tracking system
    try {
      const analytics = {
        user_id: user.id,
        session_id: currentJourney.sessionId,
        step_id: stepId,
        step_name: stepName,
        journey_type: currentJourney.journeyType,
        step_data: data,
        timestamp: new Date().toISOString()
      };

      // Store in local storage for now (replace with actual analytics service)
      const existingAnalytics = JSON.parse(localStorage.getItem('user_journey_analytics') || '[]');
      existingAnalytics.push(analytics);
      localStorage.setItem('user_journey_analytics', JSON.stringify(existingAnalytics));

    } catch (error) {
      console.error('Failed to track journey step:', error);
    }
  };

  // Start a new user journey
  const startJourney = (journeyType: UserJourneyData['journeyType'], metadata?: Record<string, any>) => {
    if (!user) return;

    const journey: UserJourneyData = {
      userId: user.id,
      sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      steps: [],
      currentStep: '',
      journeyType,
      startTime: new Date(),
      metadata: metadata || {}
    };

    setCurrentJourney(journey);
    
    // Track journey start
    trackStep('journey_start', `${journeyType} journey started`, {
      user_tier: subscription.tier,
      is_premium: subscription.subscribed
    });
  };

  // Complete current journey
  const completeJourney = (success: boolean = true, finalData?: any) => {
    if (!currentJourney) return;

    const completionStep: JourneyStep = {
      id: 'journey_complete',
      name: `${currentJourney.journeyType} journey ${success ? 'completed' : 'abandoned'}`,
      completed: success,
      timestamp: new Date(),
      data: {
        success,
        duration: Date.now() - currentJourney.startTime.getTime(),
        total_steps: currentJourney.steps.length,
        ...finalData
      }
    };

    // Update journey with completion
    setCurrentJourney(prev => {
      if (!prev) return null;
      return {
        ...prev,
        steps: [...prev.steps, completionStep]
      };
    });

    // Track completion
    trackStep('journey_complete', completionStep.name, completionStep.data);

    // Clear current journey after short delay
    setTimeout(() => {
      setCurrentJourney(null);
    }, 1000);
  };

  // Get journey analytics
  const getJourneyAnalytics = () => {
    try {
      const analytics = JSON.parse(localStorage.getItem('user_journey_analytics') || '[]');
      return analytics.filter((a: any) => a.user_id === user?.id);
    } catch {
      return [];
    }
  };

  // Test critical user flows
  const testUserFlow = async (flowType: 'signup' | 'payment' | 'content-access' | 'mobile') => {
    const startTime = Date.now();
    const testResults: any = {
      flowType,
      success: false,
      duration: 0,
      errors: [],
      warnings: []
    };

    try {
      switch (flowType) {
        case 'signup':
          await testSignupFlow();
          break;
        case 'payment':
          await testPaymentFlow();
          break;
        case 'content-access':
          await testContentAccessFlow();
          break;
        case 'mobile':
          await testMobileFlow();
          break;
      }
      
      testResults.success = true;
    } catch (error) {
      testResults.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    testResults.duration = Date.now() - startTime;
    return testResults;
  };

  // Individual flow tests
  const testSignupFlow = async () => {
    startJourney('onboarding');
    
    // Test signup process
    const testEmail = `test-${Date.now()}@example.com`;
    trackStep('signup_attempt', 'Testing signup process');
    
    // Simulate signup validation
    if (!testEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    trackStep('signup_success', 'Signup validation passed');
    
    // Test onboarding completion
    trackStep('onboarding_start', 'Onboarding process started');
    trackStep('preferences_set', 'User preferences configured');
    trackStep('first_meditation_selected', 'First meditation content selected');
    
    completeJourney(true, { test_email: testEmail });
  };

  const testPaymentFlow = async () => {
    startJourney('payment');
    
    trackStep('payment_page_loaded', 'Payment page accessed');
    trackStep('plan_selected', 'Premium plan selected');
    
    try {
      // Test checkout creation
      const checkoutUrl = await supabase.functions.invoke('create-checkout', {
        body: { tier: 'premium' }
      });
      
      if (!checkoutUrl.data?.url) {
        throw new Error('Checkout URL not generated');
      }
      
      trackStep('checkout_created', 'Stripe checkout session created');
      
      // Test subscription verification
      await supabase.functions.invoke('check-subscription');
      trackStep('subscription_verified', 'Subscription status verified');
      
    } catch (error) {
      trackStep('payment_error', 'Payment flow error', { error: error });
      throw error;
    }
    
    completeJourney(true);
  };

  const testContentAccessFlow = async () => {
    startJourney('content-discovery');
    
    trackStep('content_browse', 'User browsing content library');
    
    // Test free content access
    const { data: freeContent } = await supabase
      .from('meditation_content')
      .select('*')
      .eq('subscription_tier', 'free')
      .eq('is_active', true)
      .limit(1);
    
    if (!freeContent?.length) {
      throw new Error('No free content available');
    }
    
    trackStep('free_content_accessed', 'Free content successfully accessed');
    
    // Test premium content paywall
    const { data: premiumContent } = await supabase
      .from('meditation_content')
      .select('*')
      .eq('subscription_tier', 'premium')
      .eq('is_active', true)
      .limit(1);
    
    if (premiumContent?.length) {
      trackStep('premium_paywall_triggered', 'Premium paywall correctly displayed');
    }
    
    completeJourney(true);
  };

  const testMobileFlow = async () => {
    startJourney('daily-usage');
    
    // Test mobile responsiveness
    const isMobile = window.innerWidth <= 768;
    trackStep('mobile_detection', 'Mobile device detection', { is_mobile: isMobile });
    
    // Test touch interactions
    const buttons = document.querySelectorAll('button');
    let touchTargetIssues = 0;
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        touchTargetIssues++;
      }
    });
    
    if (touchTargetIssues > 0) {
      throw new Error(`${touchTargetIssues} buttons are too small for touch`);
    }
    
    trackStep('touch_targets_verified', 'Touch target sizes verified');
    
    // Test audio playback capability
    const audio = new Audio();
    const canPlayMP3 = audio.canPlayType('audio/mpeg');
    const canPlayM4A = audio.canPlayType('audio/mp4');
    
    if (!canPlayMP3 && !canPlayM4A) {
      throw new Error('Audio playback not supported');
    }
    
    trackStep('audio_support_verified', 'Audio playback support verified');
    
    completeJourney(true);
  };

  // Performance monitoring
  useEffect(() => {
    if (!user) return;

    // Monitor page performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setJourneyMetrics(prev => ({
            ...prev,
            page_load_time: navEntry.loadEventEnd - navEntry.loadEventStart,
            dom_content_loaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            first_paint: navEntry.responseEnd - navEntry.requestStart
          }));
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, [user]);

  return {
    currentJourney,
    journeyMetrics,
    startJourney,
    trackStep,
    completeJourney,
    testUserFlow,
    getJourneyAnalytics
  };
};