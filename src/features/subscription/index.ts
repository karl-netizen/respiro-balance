// Subscription Feature Module
// Consolidated from: components/{subscription, payment, pricing, premium, premium-plus, premium-pro}

// Store
export { useSubscriptionStore } from './store/subscriptionStore';
export type { SubscriptionTier, BillingCycle, SubscriptionStatus } from './store/subscriptionStore';

// Re-export from old locations (temporary - until fully migrated)
// Management Components - Named exports
export { SubscriptionProvider } from '@/components/subscription/SubscriptionProvider';
export { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';
export { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
export { SubscriptionStatusDashboard } from '@/components/subscription/SubscriptionStatusDashboard';
export { SubscriptionMonitor } from '@/components/subscription/SubscriptionMonitor';
export { BillingHistory } from '@/components/subscription/BillingHistory';
export { default as SubscriptionFAQs } from '@/components/subscription/SubscriptionFAQs';

// Pricing Components
export { default as PricingMatrix } from '@/components/pricing/PricingMatrix';
export { default as SubscriptionPlanComparison } from '@/components/subscription/SubscriptionPlanComparison';
export { SubscriptionCard } from '@/components/subscription/SubscriptionCard';

// Payment & Checkout - Named exports
export { CheckoutDialog } from '@/components/subscription/CheckoutDialog';
export { default as CheckoutFlow } from '@/components/subscription/CheckoutFlow';
export { PaymentButton } from '@/components/payment/PaymentButton';
export { EnhancedPaymentButton } from '@/components/payment/EnhancedPaymentButton';
export { PaymentCard } from '@/components/payment/PaymentCard';

// Gates & Banners - Named exports
export { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
export { FeatureGate } from '@/components/subscription/FeatureGate';
export { default as SubscriptionBanner } from '@/components/subscription/SubscriptionBanner';
export { SubscriptionBadge } from '@/components/subscription/SubscriptionBadge';
export { UpgradePromptDialog } from '@/components/subscription/UpgradePromptDialog';

// Usage Tracking - Named exports
export { SessionCounterWidget } from '@/components/subscription/SessionCounterWidget';
export { MeditationMinutesDisplay } from '@/components/subscription/MeditationMinutesDisplay';
export { ExportButton } from '@/components/subscription/ExportButton';

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
