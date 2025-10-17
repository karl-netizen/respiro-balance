import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSubscriptionStore, BillingCycle, SubscriptionTier } from '@/features/subscription';
import { Check, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import { CheckoutDialog } from '@/features/subscription';

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
        'Basic meditation library',
        'Breathing exercises',
        'Progress tracking'
      ],
      cta: 'Current Plan',
      highlighted: false
    },
    {
      tier: 'standard' as SubscriptionTier,
      name: 'Standard',
      description: 'Perfect for regular practitioners',
      price: 6.99,
      annualPrice: 58.99,
      annualSavings: 30,
      features: [
        '40 sessions per month',
        'All meditation content',
        'Biofeedback (always active)',
        '1 power module of your choice',
        'Advanced progress tracking',
        'Full community access'
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
      annualPrice: 116.99,
      annualSavings: 25,
      features: [
        'Unlimited sessions',
        'All power modules unlocked',
        'Biofeedback (always active)',
        'Focus Mode',
        'Morning Rituals',
        'Social Hub',
        'Work-Life Balance',
        'AI Personalization',
        'Priority support'
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
          <h1 className="text-3xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Invest in your wellness journey
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : 'text-muted-foreground'}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : 'text-muted-foreground'}>
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-700 dark:text-green-400">
                Save up to 30%
              </Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
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
                  plan.tier === 'premium' 
                    ? 'border-2 border-yellow-500/50 shadow-lg scale-105' 
                    : plan.tier === 'standard'
                    ? 'border-2 border-blue-500/50 shadow-lg'
                    : isCurrentPlan 
                    ? 'border-2 border-primary/50'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className={`px-4 py-1 ${
                      plan.badge === 'Best Value' 
                        ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}>
                      {plan.badge === 'Best Value' && <Zap className="w-3 h-3 mr-1" />}
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-xl font-semibold mb-2">{plan.name}</CardTitle>
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
                      <Badge variant="secondary" className="mt-2 bg-green-500/10 text-green-700 dark:text-green-400">
                        Save {plan.annualSavings}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    className={`w-full ${
                      plan.tier === 'premium'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-950'
                        : plan.tier === 'standard'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : ''
                    }`}
                    variant={plan.highlighted || plan.tier === 'premium' ? 'default' : 'outline'}
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
          
          <Accordion type="single" collapsible className="w-full space-y-4">
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
