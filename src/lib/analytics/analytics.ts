// Analytics Service for Respiro Balance
// Supports Google Analytics with extensibility for other providers

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

class AnalyticsService {
  private initialized = false;
  private userId: string | null = null;

  initialize() {
    if (this.initialized) return;
    
    // Check for consent before initializing
    const consent = this.getConsent();
    if (consent === 'denied') {
      console.log('Analytics disabled - user declined consent');
      return;
    }

    this.initialized = true;
    console.log('Analytics initialized');
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    if (userId && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.initialized) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event, {
        ...properties,
        user_id: this.userId
      });
    }

    // Console log in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event, properties);
    }
  }

  page(path: string, title?: string) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title
      });
    }
  }

  private getConsent(): 'granted' | 'denied' | null {
    return localStorage.getItem('analytics_consent') as 'granted' | 'denied' | null;
  }

  grantConsent() {
    localStorage.setItem('analytics_consent', 'granted');
    this.initialize();
  }

  denyConsent() {
    localStorage.setItem('analytics_consent', 'denied');
    this.initialized = false;
  }
}

export const analytics = new AnalyticsService();

// ============================================
// Meditation Session Events
// ============================================

export function trackSessionStarted(data: {
  sessionId: string;
  sessionType: string;
  category: string;
  duration: number;
  isPremium: boolean;
}) {
  analytics.track('meditation_session_started', {
    session_id: data.sessionId,
    session_type: data.sessionType,
    category: data.category,
    duration_minutes: data.duration,
    is_premium: data.isPremium
  });
}

export function trackSessionCompleted(data: {
  sessionId: string;
  sessionType: string;
  category: string;
  duration: number;
  completionRate: number;
  rating?: number;
}) {
  analytics.track('meditation_session_completed', {
    session_id: data.sessionId,
    session_type: data.sessionType,
    category: data.category,
    duration_minutes: data.duration,
    completion_rate: data.completionRate,
    rating: data.rating
  });
}

export function trackSessionAbandoned(data: {
  sessionId: string;
  duration: number;
  completionRate: number;
  reason?: string;
}) {
  analytics.track('meditation_session_abandoned', {
    session_id: data.sessionId,
    duration_seconds: data.duration,
    completion_rate: data.completionRate,
    reason: data.reason || 'user_exited'
  });
}

// ============================================
// Focus Mode Events
// ============================================

export function trackPomodoroStarted(duration: number, sessionType: 'work' | 'break') {
  analytics.track('pomodoro_started', {
    duration_minutes: duration,
    session_type: sessionType
  });
}

export function trackPomodoroCompleted(duration: number, interruptionCount: number) {
  analytics.track('pomodoro_completed', {
    duration_minutes: duration,
    interruption_count: interruptionCount
  });
}

// ============================================
// Breathing Exercise Events
// ============================================

export function trackBreathingStarted(technique: string, duration: number) {
  analytics.track('breathing_exercise_started', {
    technique,
    duration_minutes: duration
  });
}

export function trackBreathingCompleted(technique: string, duration: number, cycles: number) {
  analytics.track('breathing_exercise_completed', {
    technique,
    duration_seconds: duration,
    cycles_completed: cycles
  });
}

// ============================================
// Subscription Events
// ============================================

export function trackSubscriptionViewed(tier: string) {
  analytics.track('subscription_viewed', {
    tier
  });
}

export function trackSubscriptionStarted(tier: string, billingCycle: 'monthly' | 'annual') {
  analytics.track('subscription_checkout_started', {
    tier,
    billing_cycle: billingCycle
  });
}

export function trackSubscriptionCompleted(tier: string, billingCycle: string, price: number) {
  analytics.track('subscription_completed', {
    tier,
    billing_cycle: billingCycle,
    price,
    currency: 'USD'
  });
}

export function trackSubscriptionCancelled(tier: string, reason?: string) {
  analytics.track('subscription_cancelled', {
    tier,
    reason
  });
}

// ============================================
// Onboarding Events
// ============================================

export function trackOnboardingStarted() {
  analytics.track('onboarding_started');
}

export function trackOnboardingStepCompleted(step: number, stepName: string) {
  analytics.track('onboarding_step_completed', {
    step,
    step_name: stepName
  });
}

export function trackOnboardingCompleted(answers: Record<string, any>) {
  analytics.track('onboarding_completed', {
    stress_level: answers.stressLevel,
    work_environment: answers.workEnvironment,
    meditation_experience: answers.meditationExperience,
    goals: answers.goals
  });
}

// ============================================
// User Events
// ============================================

export function trackUserSignUp(method: string, tier?: string) {
  analytics.track('user_signed_up', {
    method,
    subscription_tier: tier || 'free'
  });
}

export function trackUserLogin(method: string) {
  analytics.track('user_logged_in', {
    method
  });
}

// ============================================
// Feature Usage Events
// ============================================

export function trackFeatureUsed(featureName: string, details?: Record<string, any>) {
  analytics.track('feature_used', {
    feature: featureName,
    ...details
  });
}

export function trackError(error: string, context?: string) {
  analytics.track('error_occurred', {
    error_message: error,
    context
  });
}
