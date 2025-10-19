import React from 'react';
import { Check, X, AlertTriangle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Type definitions
interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  buttonText: string;
  buttonStyle: 'free' | 'premium' | 'pro' | 'plus';
  color: string;
}

interface FeatureValue {
  text: string;
  type: 'included' | 'not-included' | 'limited' | 'upgrade';
}

interface Feature {
  name: string;
  free: FeatureValue;
  standard: FeatureValue;
  premium: FeatureValue;
}

interface FeatureCategory {
  title: string;
  features: Feature[];
}

interface PricingMatrixProps {
  onPlanSelect?: (plan: string) => void;
  className?: string;
}

// Feature icon component
const FeatureIcon: React.FC<{ type: FeatureValue['type'] }> = ({ type }) => {
  switch (type) {
    case 'included':
      return <Check className="h-4 w-4 text-green-500 flex-shrink-0" />;
    case 'not-included':
      return <X className="h-4 w-4 text-red-500 flex-shrink-0" />;
    case 'limited':
      return <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />;
    case 'upgrade':
      return <ArrowUp className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    default:
      return null;
  }
};

// Feature cell component
const FeatureCell: React.FC<{ 
  feature: FeatureValue; 
  planColor: string;
  isHighlighted?: boolean;
}> = ({ feature, planColor, isHighlighted = false }) => {
  return (
    <div className={cn(
      "flex items-start gap-2 p-4 min-h-[60px]",
      isHighlighted && "bg-primary/5"
    )}>
      <FeatureIcon type={feature.type} />
      <span className={cn(
        "text-sm leading-relaxed",
        feature.type === 'not-included' && "text-muted-foreground",
        feature.type === 'included' && "text-foreground font-medium",
        feature.type === 'limited' && "text-foreground",
        feature.type === 'upgrade' && "text-blue-600 font-medium"
      )}>
        {feature.text}
      </span>
    </div>
  );
};

const PricingMatrix: React.FC<PricingMatrixProps> = ({ 
  onPlanSelect,
  className 
}) => {
  // Pricing plans data
  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Essential meditation basics',
      buttonText: 'Get Started',
      buttonStyle: 'free',
      color: 'gray'
    },
    {
      name: 'Standard',
      price: '$6.99',
      period: '/month',
      description: 'Comprehensive meditation toolkit',
      popular: true,
      buttonText: 'Start Standard',
      buttonStyle: 'premium',
      color: 'teal'
    },
    {
      name: 'Premium',
      price: '$12.99',
      period: '/month',
      description: 'Advanced features + biofeedback',
      buttonText: 'Upgrade to Premium',
      buttonStyle: 'pro',
      color: 'blue'
    }
  ];

  // Feature categories and data
  const featureCategories: FeatureCategory[] = [
    {
      title: 'CORE SESSIONS & ACCESS',
      features: [
        {
          name: 'Meditation Library Access',
          free: { text: '3 Beginner Sessions Only', type: 'limited' },
          standard: { text: '20 Sessions', type: 'included' },
          premium: { text: '50 Sessions', type: 'included' }
        },
        {
          name: 'Daily Session Allowance',
          free: { text: '1 session per day (max 7/week)', type: 'limited' },
          standard: { text: '5 sessions per day', type: 'included' },
          premium: { text: 'Unlimited daily sessions', type: 'included' }
        },
        {
          name: 'Session Length Options',
          free: { text: '5-10 minute sessions only', type: 'limited' },
          standard: { text: '5-30 minute sessions', type: 'included' },
          premium: { text: '5-60 minute sessions', type: 'included' }
        }
      ]
    },
    {
      title: 'BREATHING & TECHNIQUES',
      features: [
        {
          name: 'Breathing Patterns Available',
          free: { text: 'Box Breathing only', type: 'limited' },
          standard: { text: '3 Proven Patterns + Guided Instructions', type: 'included' },
          premium: { text: 'All Patterns + Custom Timing', type: 'included' }
        },
        {
          name: 'Breathing Technique Customization',
          free: { text: '✗ Fixed settings', type: 'not-included' },
          standard: { text: '✓ Adjust basic timing', type: 'included' },
          premium: { text: '✓ Save custom sequences', type: 'included' }
        }
      ]
    },
    {
      title: 'TRACKING & INSIGHTS',
      features: [
        {
          name: 'Progress Analytics',
          free: { text: 'Weekly streak count only', type: 'limited' },
          standard: { text: 'Monthly insights + basic charts', type: 'included' },
          premium: { text: 'Advanced wellness tracking + trends', type: 'included' }
        },
        {
          name: 'Mood & Wellness Tracking',
          free: { text: '✗ No mood tracking', type: 'not-included' },
          standard: { text: '✓ Daily mood check-ins', type: 'included' },
          premium: { text: '✓ Mood + sleep + energy tracking', type: 'included' }
        },
        {
          name: 'Biofeedback Integration',
          free: { text: '✗ No biofeedback', type: 'not-included' },
          standard: { text: '✗ No biofeedback', type: 'not-included' },
          premium: { text: '✓ Heart rate + stress monitoring', type: 'included' }
        },
        {
          name: 'Data Export & Sharing',
          free: { text: '✗ No data export', type: 'not-included' },
          standard: { text: 'Basic stats sharing', type: 'included' },
          premium: { text: 'Full CSV export', type: 'included' }
        }
      ]
    },
    {
      title: 'APP EXPERIENCE',
      features: [
        {
          name: 'Advertisements',
          free: { text: '30-60 second ads between sessions', type: 'not-included' },
          standard: { text: '✓ Completely ad-free experience', type: 'included' },
          premium: { text: '✓ Completely ad-free experience', type: 'included' }
        },
        {
          name: 'Offline Access',
          free: { text: '✗ Internet required for all content', type: 'not-included' },
          standard: { text: '✓ Download up to 5 sessions', type: 'included' },
          premium: { text: '✓ Download up to 20 sessions', type: 'included' }
        },
        {
          name: 'Device Synchronization',
          free: { text: 'Single device only', type: 'limited' },
          standard: { text: 'Sync across 3 devices', type: 'included' },
          premium: { text: 'Sync across 3 devices', type: 'included' }
        }
      ]
    },
    {
      title: 'PREMIUM CONTENT & FEATURES',
      features: [
        {
          name: 'Sleep Stories & Content',
          free: { text: '1 sleep story', type: 'limited' },
          standard: { text: '5 sleep stories + nature sounds', type: 'included' },
          premium: { text: '15 sleep stories + sleep courses', type: 'included' }
        },
        {
          name: 'Focus & Productivity Tools',
          free: { text: '✗ No focus tools', type: 'not-included' },
          standard: { text: '✓ Basic Pomodoro timer', type: 'included' },
          premium: { text: '✓ Advanced focus tracking + break reminders', type: 'included' }
        },
        {
          name: 'Community & Social',
          free: { text: 'View-only community feed', type: 'limited' },
          standard: { text: '✓ Join discussions + buddy system', type: 'included' },
          premium: { text: '✓ Weekly group challenges + leaderboards', type: 'included' }
        },
        {
          name: 'Premium Content Access',
          free: { text: '✗ Basic content only', type: 'not-included' },
          standard: { text: '✓ Weekly new content releases', type: 'included' },
          premium: { text: '✓ Expert-led courses + workshops', type: 'included' }
        }
      ]
    },
    {
      title: 'SUPPORT & SHARING',
      features: [
        {
          name: 'Customer Support',
          free: { text: 'FAQ & help articles only', type: 'limited' },
          standard: { text: 'Community forum + email (72h response)', type: 'included' },
          premium: { text: 'Priority email support (24h response)', type: 'included' }
        },
        {
          name: 'Account Sharing',
          free: { text: 'Single user only', type: 'limited' },
          standard: { text: 'Single user only', type: 'limited' },
          premium: { text: '✓ Share with 1 family member', type: 'included' }
        },
        {
          name: 'Customization Features',
          free: { text: '✗ Basic app experience', type: 'not-included' },
          standard: { text: '✗ Standard theme only', type: 'not-included' },
          premium: { text: '✓ Dark mode + theme options', type: 'included' }
        },
        {
          name: 'Early Access & Beta',
          free: { text: '✗ Standard releases only', type: 'not-included' },
          standard: { text: '✗ Standard releases only', type: 'not-included' },
          premium: { text: '✓ Early access to new features', type: 'included' }
        }
      ]
    }
  ];

  const getButtonVariant = (buttonStyle: PricingPlan['buttonStyle']) => {
    switch (buttonStyle) {
      case 'free':
        return 'outline';
      case 'premium':
        return 'default';
      case 'pro':
        return 'secondary';
      case 'plus':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getButtonClassName = (buttonStyle: PricingPlan['buttonStyle']) => {
    switch (buttonStyle) {
      case 'free':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300';
      case 'premium':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
      case 'pro':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-0';
      case 'plus':
        return 'bg-purple-600 hover:bg-purple-700 text-white border-0';
      default:
        return '';
    }
  };

  const getPlanHeaderClass = (planStyle: PricingPlan['buttonStyle'], popular?: boolean) => {
    const baseClass = "relative p-6 rounded-t-lg border-b";
    
    if (popular) {
      return cn(baseClass, "bg-primary/5 border-primary/20");
    }
    
    switch (planStyle) {
      case 'free':
        return cn(baseClass, "bg-gray-50 border-gray-200");
      case 'premium':
        return cn(baseClass, "bg-primary/10 border-primary/20");
      case 'pro':
        return cn(baseClass, "bg-blue-50 border-blue-200");
      case 'plus':
        return cn(baseClass, "bg-purple-50 border-purple-200");
      default:
        return cn(baseClass, "bg-gray-50 border-gray-200");
    }
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
          Choose Your Meditation Journey
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Compare our comprehensive feature matrix to find the perfect plan for your wellness goals
        </p>
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="block lg:hidden space-y-6">
        {plans.map((plan, planIndex) => (
          <div key={plan.name} className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
            {/* Mobile Plan Header */}
            <div className={getPlanHeaderClass(plan.buttonStyle, plan.popular)}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <Button
                  className={cn("w-full min-h-[44px]", getButtonClassName(plan.buttonStyle))}
                  variant={getButtonVariant(plan.buttonStyle)}
                  onClick={() => onPlanSelect?.(plan.name.toLowerCase())}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="divide-y divide-border">
              {featureCategories.map((category) => (
                <div key={category.title}>
                  <div className="bg-muted/50 p-3">
                    <h4 className="font-semibold text-foreground text-sm tracking-wide">
                      {category.title}
                    </h4>
                  </div>
                  {category.features.map((feature) => {
                    const planFeature = planIndex === 0 ? feature.free : 
                                      planIndex === 1 ? feature.standard : feature.premium;
                    return (
                      <div key={feature.name} className="p-4 border-b border-border last:border-b-0">
                        <div className="font-medium text-sm text-foreground mb-2">
                          {feature.name}
                        </div>
                         <div className="flex items-start gap-2">
                          <FeatureIcon type={planFeature.type} />
                          <span className={cn(
                            "text-sm leading-relaxed",
                            planFeature.type === 'not-included' && "text-muted-foreground",
                            planFeature.type === 'included' && "text-foreground font-medium",
                            planFeature.type === 'limited' && "text-foreground",
                            planFeature.type === 'upgrade' && "text-blue-600 font-medium"
                          )}>
                            {planFeature.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet View - Horizontal Scroll Table */}
      <div className="hidden lg:block relative w-full overflow-x-auto">
        <div className="min-w-[1000px] bg-card rounded-lg shadow-lg border border-border">
          
          {/* Plan Headers */}
          <div className="grid grid-cols-3 border-b border-border">
            {plans.map((plan, index) => (
              <div key={plan.name} className={getPlanHeaderClass(plan.buttonStyle, plan.popular)}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <Button
                    className={cn("w-full min-h-[44px]", getButtonClassName(plan.buttonStyle))}
                    variant={getButtonVariant(plan.buttonStyle)}
                    onClick={() => onPlanSelect?.(plan.name.toLowerCase())}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Categories and Rows */}
          <div className="divide-y divide-border">
            {featureCategories.map((category, categoryIndex) => (
              <div key={category.title}>
                {/* Category Header */}
                <div className="grid grid-cols-3 bg-muted/50">
                  <div className="col-span-3 p-4">
                    <h4 className="font-semibold text-foreground text-sm tracking-wide">
                      {category.title}
                    </h4>
                  </div>
                </div>
                
                {/* Category Features */}
                {category.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.name} 
                    className="grid grid-cols-3 hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
                  >
                    {/* Feature Name */}
                    <div className="p-4 border-r border-border bg-muted/20">
                      <span className="font-medium text-sm text-foreground">
                        {feature.name}
                      </span>
                    </div>
                    
                    {/* Plan Features */}
                    <FeatureCell 
                      feature={feature.free} 
                      planColor="gray"
                    />
                    <FeatureCell 
                      feature={feature.standard} 
                      planColor="teal"
                      isHighlighted={plans[1].popular}
                    />
                    <FeatureCell 
                      feature={feature.premium} 
                      planColor="blue"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer CTAs */}
          <div className="grid grid-cols-3 p-6 bg-muted/20 rounded-b-lg border-t border-border">
            {plans.map((plan) => (
              <div key={plan.name} className="px-4">
                <Button
                  className={cn("w-full min-h-[44px]", getButtonClassName(plan.buttonStyle))}
                  variant={getButtonVariant(plan.buttonStyle)}
                  onClick={() => onPlanSelect?.(plan.name.toLowerCase())}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          All plans include 30-day money-back guarantee • Cancel anytime • Secure payment processing
        </p>
      </div>
    </div>
  );
};

export default PricingMatrix;