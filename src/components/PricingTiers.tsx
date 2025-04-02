
import { Check, Users, Building, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/context";
import { SubscriptionTier } from '@/context/types';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

// Helper function to determine if a feature is available based on user's subscription
const isFeatureAvailable = (
  userTier: SubscriptionTier,
  planId: SubscriptionTier,
  isDemoMode: boolean = false
): boolean => {
  // In demo mode, all features are available for testing
  if (isDemoMode) return true;
  
  // If user has the current plan or higher, feature is available
  const tiers = ['free', 'premium', 'team', 'enterprise'];
  const userTierIndex = tiers.indexOf(userTier);
  const planTierIndex = tiers.indexOf(planId);
  
  return userTierIndex >= planTierIndex;
};

const tiers = [
  {
    id: 'free' as const,
    name: 'Respiro Essentials',
    icon: <div className="p-2 rounded-full bg-secondary w-10 h-10 flex items-center justify-center text-foreground/80"><Star size={20} /></div>,
    price: 'Free',
    description: 'Basic breathing meditation for beginners',
    features: [
      '5-10 basic breathing sessions',
      'Simple mood tracking',
      'Basic progress statistics',
      'Session durations (5-10 minutes)',
      'Simple breathing visualization',
      'Daily reminder feature',
    ],
    cta: 'Get Started',
    popular: false,
    style: 'border-gray-200',
    comingSoon: false
  },
  {
    id: 'premium' as const,
    name: 'Respiro Pro',
    icon: <div className="p-2 rounded-full bg-primary/20 w-10 h-10 flex items-center justify-center text-primary"><Star size={20} /></div>,
    price: '$9.99',
    period: '/month',
    description: 'Perfect for dedicated practitioners',
    features: [
      'Full library of breathing content',
      'Advanced progress analytics',
      'Extended session options (up to 30 min)',
      'Enhanced visualization experiences',
      'Personalized recommendations',
      'Offline download capability',
      'Priority content updates',
    ],
    cta: 'Start Free Trial',
    popular: true,
    style: 'border-primary',
    comingSoon: false
  },
  {
    id: 'team' as const,
    name: 'Respiro Teams',
    icon: <div className="p-2 rounded-full bg-secondary w-10 h-10 flex items-center justify-center text-foreground/80"><Users size={20} /></div>,
    price: '$49',
    period: '/month',
    description: 'Ideal for small teams up to 10 people',
    features: [
      'Up to 10 team members',
      'Team breathing dashboard',
      'Group challenges and programs',
      'Administrator management console',
      'Usage analytics for team leaders',
      'All Pro features included',
    ],
    cta: 'Contact Sales',
    popular: false,
    style: 'border-gray-200',
    comingSoon: true
  },
  {
    id: 'enterprise' as const,
    name: 'Respiro Enterprise',
    icon: <div className="p-2 rounded-full bg-secondary w-10 h-10 flex items-center justify-center text-foreground/80"><Building size={20} /></div>,
    price: '$99',
    period: '/month',
    description: 'For organizations with 50+ members',
    features: [
      'Unlimited team members',
      'Dedicated account manager',
      'Custom branding options',
      'Advanced analytics and reporting',
      'API access for custom integrations',
      'Custom content development',
      'Priority 24/7 support',
      'Integration with corporate wellness programs',
    ],
    cta: 'Contact Sales',
    popular: false,
    style: 'border-gray-200',
    comingSoon: true
  },
];

const PricingTiers = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const isDemoMode = !isSupabaseConfigured();

  const handleSelectTier = (tierId: SubscriptionTier) => {
    // If the tier is 'team' or 'enterprise' and coming soon, show a toast
    const tier = tiers.find(t => t.id === tierId);
    if (tier?.comingSoon) {
      toast.info(`${tier.name} is coming soon!`, {
        description: "This plan is not available yet. Please check back later."
      });
      return;
    }
    
    // If the tier is 'premium' and not in demo mode, we'd typically initiate a Stripe checkout
    if (tierId === 'premium' && !isDemoMode) {
      // Placeholder for Stripe integration
      toast.info("Stripe Integration", {
        description: "In production, this would open a Stripe checkout session."
      });
      
      // In a real implementation, we'd call something like:
      // initStripeCheckout(tierId)
      //   .then(url => window.location.href = url)
      //   .catch(error => toast.error("Payment Error", { description: error.message }));
      
      return;
    }
    
    // Update the user's subscription tier
    updatePreferences({ 
      subscriptionTier: tierId
    });
    
    toast.success(`Subscription Updated!`, {
      description: `Your subscription has been changed to ${tierId === 'free' ? 'Free' : tierId}.`
    });
  };

  return (
    <section className="py-16 px-6" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-secondary text-primary text-sm font-medium">
            Find Your Respiro Plan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the right tier for your breathing journey</h2>
          <p className="text-foreground/70">
            Whether you're just beginning or seeking advanced features, we have a plan to support your breath-centered wellness practice.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl",
                tier.popular ? "transform md:-translate-y-4" : ""
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              {tier.comingSoon && (
                <div className="absolute top-0 right-0 m-3 z-10">
                  <Badge variant="secondary" className="bg-secondary/80 text-foreground font-semibold">
                    Coming Soon
                  </Badge>
                </div>
              )}
              
              <Card className={cn(
                "h-full flex flex-col border-2",
                tier.id === preferences.subscriptionTier
                  ? "border-primary ring-2 ring-primary/20" 
                  : tier.popular 
                    ? tier.style 
                    : "border-transparent hover:border-gray-200"
              )}>
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    {tier.icon}
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                  </div>
                  <p className="text-foreground/70 text-sm mb-4">{tier.description}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-foreground/70 ml-1">{tier.period}</span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-grow">
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => {
                      const isAvailable = isFeatureAvailable(
                        preferences.subscriptionTier, 
                        tier.id, 
                        isDemoMode
                      );
                      
                      return (
                        <li key={feature} className={cn(
                          "flex items-start",
                          !isAvailable && !tier.comingSoon && tier.id !== 'free' && "opacity-50"
                        )}>
                          <Check size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="p-6 pt-0">
                  <Button 
                    className={cn(
                      "w-full", 
                      tier.id === preferences.subscriptionTier
                        ? "bg-secondary text-primary border border-primary"
                        : tier.popular 
                          ? "bg-primary hover:bg-primary/90" 
                          : "bg-secondary text-foreground hover:bg-secondary/80",
                      tier.comingSoon && "opacity-70 cursor-not-allowed"
                    )}
                    onClick={() => handleSelectTier(tier.id)}
                    disabled={tier.comingSoon}
                  >
                    {tier.id === preferences.subscriptionTier
                      ? "Current Plan"
                      : tier.cta}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
