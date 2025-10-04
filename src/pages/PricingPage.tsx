import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSubscriptionStore, BillingCycle, SubscriptionTier } from '@/store/subscriptionStore';
import { Check, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import { CheckoutDialog } from '@/components/subscription/CheckoutDialog';

export default function PricingPage() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const { tier: currentTier, getPricing } = useSubscriptionStore();

  const billingCycle: BillingCycle = isAnnual ? 'annual' : 'monthly';

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setSelectedTier(tier);
  };

  const plans = [
    {
      tier: 'free' as SubscriptionTier,
      name: 'Free',
      description: 'Get started with basic meditation',
      price: 0,
      annualPrice: 0,
      features: [
        '5 sessions per month',
        'Basic meditation content',
        'Mood tracking',
        'Progress stats',
        'Community access (view only)'
      ],
      cta: 'Current Plan',
      highlighted: false
    },
    {
      tier: 'standard' as SubscriptionTier,
      name: 'Standard',
      description: 'Perfect for regular practitioners',
      price: 6.99,
      annualPrice: 59.99,
      annualSavings: 30,
      features: [
        '40 sessions per month',
        'All meditation content',
        'Biofeedback integration',
        'Advanced progress tracking',
        'Full community access',
        'Priority content updates'
      ],
      cta: 'Upgrade to Standard',
      highlighted: true,
      badge: 'Most Popular'
    },
    {
      tier: 'premium' as SubscriptionTier,
      name: 'Premium',
      description: 'Complete wellness experience',
      price: 12.99,
      annualPrice: 119.99,
      annualSavings: 25,
      features: [
        'Unlimited sessions',
        'All Standard features',
        'All power modules unlocked',
        'Focus Mode',
        'Morning Rituals',
        'Social Hub',
        'Work-Life Balance',
        'Priority support',
        'Early access to new features'
      ],
      cta: 'Upgrade to Premium',
      highlighted: false,
      badge: 'Best Value'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Invest in your wellness journey
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Annual
              <Badge variant="secondary" className="ml-2">Save up to 30%</Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = currentTier === plan.tier;
            const displayPrice = isAnnual ? plan.annualPrice : plan.price;
            const monthlyEquivalent = isAnnual && plan.annualPrice > 0 
              ? (plan.annualPrice / 12).toFixed(2) 
              : null;

            return (
              <Card 
                key={plan.tier}
                className={`relative ${
                  plan.highlighted 
                    ? 'border-2 border-primary shadow-lg scale-105' 
                    : isCurrentPlan 
                    ? 'border-2 border-primary/50'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1">
                      {plan.badge === 'Best Value' && <Zap className="w-3 h-3 mr-1" />}
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ${displayPrice.toFixed(2)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {monthlyEquivalent && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${monthlyEquivalent}/month billed annually
                      </p>
                    )}
                    {isAnnual && plan.annualSavings && (
                      <Badge variant="secondary" className="mt-2">
                        Save {plan.annualSavings}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    disabled={isCurrentPlan}
                    onClick={() => handleSelectPlan(plan.tier)}
                  >
                    {isCurrentPlan ? 'Current Plan' : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What happens when I reach my session limit?</AccordionTrigger>
              <AccordionContent>
                When you reach your monthly session limit, you'll be prompted to upgrade your plan. 
                Your progress and data remain saved, and you can continue using the app once you upgrade 
                or wait until your sessions reset on the 1st of the next month.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I change plans anytime?</AccordionTrigger>
              <AccordionContent>
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, 
                while downgrades will apply at the end of your current billing period to ensure you get 
                the full value of your current subscription.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What are power modules?</AccordionTrigger>
              <AccordionContent>
                Power modules are premium features that enhance your wellness journey. They include:
                Focus Mode for productivity, Morning Rituals for starting your day, Social Hub for 
                community engagement, and Work-Life Balance tools. Premium subscribers get access to 
                all modules automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How does biofeedback integration work?</AccordionTrigger>
              <AccordionContent>
                Biofeedback integration is available on Standard and Premium plans. Connect your 
                compatible wearable device to track real-time physiological data during meditation 
                sessions, including heart rate variability, breathing patterns, and stress levels.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a money-back guarantee?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied 
                with your subscription, contact our support team within 30 days for a full refund.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. 
                All payments are processed securely through Stripe.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Checkout Dialog */}
      {selectedTier && selectedTier !== 'free' && (
        <CheckoutDialog
          open={true}
          onClose={() => setSelectedTier(null)}
          tier={selectedTier}
          cycle={billingCycle}
        />
      )}
    </div>
  );
}
