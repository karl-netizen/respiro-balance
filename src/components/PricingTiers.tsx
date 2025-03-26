
import { Check, Users, Building, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const tiers = [
  {
    id: 'free',
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
    style: 'border-gray-200'
  },
  {
    id: 'pro',
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
    style: 'border-primary'
  },
  {
    id: 'team',
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
    style: 'border-gray-200'
  },
  {
    id: 'enterprise',
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
    style: 'border-gray-200'
  },
];

const PricingTiers = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleSelectTier = (tierId: string) => {
    updatePreferences({ 
      subscriptionTier: tierId === 'free' 
        ? 'Free' 
        : tierId === 'pro' 
          ? 'Pro' 
          : tierId === 'team' 
            ? 'Team' 
            : 'Enterprise'
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
              
              <div className={cn(
                "glassmorphism-card border-2 h-full flex flex-col",
                tier.id === preferences.subscriptionTier?.toLowerCase() 
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
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 pt-0">
                  <Button 
                    className={cn(
                      "w-full", 
                      tier.id === preferences.subscriptionTier?.toLowerCase()
                        ? "bg-secondary text-primary border border-primary"
                        : tier.popular 
                          ? "bg-primary hover:bg-mindflow-dark" 
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => handleSelectTier(tier.id)}
                  >
                    {tier.id === preferences.subscriptionTier?.toLowerCase()
                      ? "Current Plan"
                      : tier.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
