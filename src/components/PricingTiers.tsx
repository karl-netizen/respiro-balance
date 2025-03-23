
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: 'Respiro Essentials',
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
    name: 'Respiro Pro',
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
    name: 'Respiro Teams',
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
];

const PricingTiers = () => {
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
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
                tier.popular ? tier.style : "border-transparent hover:border-gray-200"
              )}>
                <div className="p-6 pb-0">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
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
                      tier.popular 
                        ? "bg-primary hover:bg-mindflow-dark" 
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-3">Respiro Enterprise</h3>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            For organizations with 50+ members, customize Respiro Balance to fit your company's wellness program 
            with branded experiences, detailed reporting, and dedicated support.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Contact Us For Enterprise Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
