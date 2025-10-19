// Subscription Feature Module
// Consolidated from: components/{subscription, payment, pricing, premium, premium-plus, premium-pro}

// Store
export { useSubscriptionStore } from './store/subscriptionStore';
export type { SubscriptionTier, BillingCycle, SubscriptionStatus } from './store/subscriptionStore';

// Management Components - Consolidated from components/subscription
export { SubscriptionProvider } from './components/management/SubscriptionProvider';
export { SubscriptionManagement } from './components/management/SubscriptionManagement';
export { SubscriptionStatus } from './components/management/SubscriptionStatus';
export { SubscriptionStatusDashboard } from './components/management/SubscriptionStatusDashboard';
export { SubscriptionMonitor } from './components/management/SubscriptionMonitor';
export { BillingHistory } from './components/management/BillingHistory';
export { default as SubscriptionFAQs } from './components/management/SubscriptionFAQs';

// Pricing Components
export { default as PricingMatrix } from '@/components/pricing/PricingMatrix';
export { default as SubscriptionPlanComparison } from './components/management/SubscriptionPlanComparison';
export { SubscriptionCard } from './components/management/SubscriptionCard';

// Payment & Checkout - Named exports
export { CheckoutDialog } from './components/management/CheckoutDialog';
export { default as CheckoutFlow } from './components/management/CheckoutFlow';
export { PaymentButton } from '@/components/payment/PaymentButton';
export { EnhancedPaymentButton } from '@/components/payment/EnhancedPaymentButton';
export { PaymentCard } from '@/components/payment/PaymentCard';

// Gates & Banners - Named exports
export { SubscriptionGate } from './components/management/SubscriptionGate';
export { FeatureGate } from './components/management/FeatureGate';
export { default as SubscriptionBanner } from './components/management/SubscriptionBanner';
export { SubscriptionBadge } from './components/management/SubscriptionBadge';
export { UpgradePromptDialog } from './components/management/UpgradePromptDialog';

// Usage Tracking - Named exports
export { SessionCounterWidget } from './components/management/SessionCounterWidget';
export { MeditationMinutesDisplay } from './components/management/MeditationMinutesDisplay';
export { ExportButton } from './components/management/ExportButton';

// Premium Features - Mixed exports
export { default as BiofeedbackCoaching } from '@/components/premium-plus/BiofeedbackCoaching';
export { default as ExpertDirectory } from '@/components/premium-plus/ExpertDirectory';
export { ExpertSessionPlatform } from '@/components/premium-plus/ExpertSessionPlatform';
export { default as SessionBooking } from '@/components/premium-plus/SessionBooking';
export { FamilySharingSystem } from '@/components/premium-plus/FamilySharingSystem';
export { default as MasterclassSystem } from '@/components/premium-plus/MasterclassSystem';
export { default as WhiteLabelCustomization } from '@/components/premium-plus/WhiteLabelCustomization';
export { default as ComprehensiveWellnessDashboard } from '@/components/premium-plus/ComprehensiveWellnessDashboard';
export { AIPersonalizationEngine } from '@/components/premium-plus/AIPersonalizationEngine';
export { AdvancedBiofeedbackDashboard } from '@/components/premium-pro/AdvancedBiofeedbackDashboard';
export { EnhancedSleepStories } from '@/components/premium-pro/EnhancedSleepStories';
export { default as GroupChallengesSystem } from '@/components/premium-pro/GroupChallengesSystem';

// Utilities  
export * from '@/lib/payment/stripe';

// Hooks
export { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
export { useSubscription } from '@/hooks/useSubscription';
