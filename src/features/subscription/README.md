# Subscription Feature Module

Consolidated subscription, payment, and premium features into a single cohesive module.

## Structure

```
src/features/subscription/
├── components/
│   ├── management/      # Subscription management UI
│   ├── pricing/         # Pricing displays
│   ├── payment/         # Payment processing
│   ├── checkout/        # Checkout flows
│   ├── gates/           # Feature gates & restrictions
│   └── premium-features/# Premium tier features
├── hooks/               # Subscription hooks
├── lib/                 # Utilities (Stripe, etc.)
├── store/               # Zustand subscription store
├── types/               # TypeScript types
└── index.ts             # Public API
```

## Migration from Old Structure

**Before** (7 separate locations):
- `src/components/subscription/`
- `src/components/payment/`
- `src/components/pricing/`
- `src/components/premium/`
- `src/components/premium-plus/`
- `src/components/premium-pro/`
- `src/store/subscriptionStore.ts`

**After** (1 feature module):
- `src/features/subscription/`

## Usage

Import from the feature module:

```typescript
import {
  useSubscriptionStore,
  SubscriptionProvider,
  SubscriptionGate,
  PricingMatrix,
} from '@/features/subscription';
```

## Components by Category

### Management
- `SubscriptionProvider` - Context provider
- `SubscriptionManagement` - Main management UI
- `SubscriptionStatus` - Status display
- `SubscriptionMonitor` - Usage monitoring
- `BillingHistory` - Billing records

### Pricing & Plans
- `PricingMatrix` - Tier comparison
- `SubscriptionPlanComparison` - Plan details
- `SubscriptionCard` - Individual plan card

### Payment & Checkout
- `CheckoutDialog` - Checkout modal
- `CheckoutFlow` - Multi-step checkout
- `PaymentButton` - Payment CTA
- `PaymentCard` - Payment method display

### Gates & Restrictions
- `SubscriptionGate` - Component-level gate
- `FeatureGate` - Feature access control
- `SubscriptionBanner` - Upgrade prompts
- `UpgradePromptDialog` - Modal upgrade prompt

### Usage Tracking
- `SessionCounterWidget` - Session limits
- `MeditationMinutesDisplay` - Usage display
- `ExportButton` - Premium export feature

### Premium Features
- `BiofeedbackCoaching` - Premium Plus
- `ExpertDirectory` - Premium Plus
- `SessionBooking` - Premium Plus
- `FamilySharingSystem` - Premium Plus
- `MasterclassSystem` - Premium Plus
- `WhiteLabelCustomization` - Premium Plus
- `AIPersonalizationEngine` - Premium Plus
- `AdvancedBiofeedbackDashboard` - Premium Pro
- `EnhancedSleepStories` - Premium Pro
- `GroupChallengesSystem` - Premium Pro
