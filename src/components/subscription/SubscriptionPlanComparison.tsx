
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';

interface FeatureItemProps {
  feature: string;
  available: boolean;
  isPremium: boolean;
}

const FeatureItem = ({ feature, available, isPremium }: FeatureItemProps) => (
  <div className="flex items-center py-2 border-b border-border last:border-0">
    <div className="w-6 h-6 flex items-center justify-center mr-3">
      {available ? (
        <Check className={`h-5 w-5 ${isPremium ? 'text-primary' : 'text-green-500'}`} />
      ) : (
        <X className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
    <span className={isPremium && available ? 'font-medium' : ''}>{feature}</span>
  </div>
);

interface PlanProps {
  type: 'free' | 'premium';
  onSelect: () => void;
  isPremium: boolean;
}

const SubscriptionPlanComparison = ({
  onSelectPremium
}: {
  onSelectPremium: () => void
}) => {
  const { isPremium, tierName } = useSubscriptionContext();
  
  const freeFeatures = [
    { feature: 'Basic meditation sessions', available: true },
    { feature: 'Limited meditation minutes (60/month)', available: true },
    { feature: 'Basic progress tracking', available: true },
    { feature: 'Three meditation categories', available: true },
    { feature: 'Community support', available: true },
    { feature: 'Unlimited meditation minutes', available: false },
    { feature: 'Advanced meditation techniques', available: false },
    { feature: 'Full biometric integration', available: false },
    { feature: 'Offline access', available: false },
    { feature: 'Personalized recommendations', available: false }
  ];
  
  const premiumFeatures = [
    { feature: 'Basic meditation sessions', available: true },
    { feature: 'Limited meditation minutes (60/month)', available: true },
    { feature: 'Basic progress tracking', available: true },
    { feature: 'Three meditation categories', available: true },
    { feature: 'Community support', available: true },
    { feature: 'Unlimited meditation minutes', available: true },
    { feature: 'Advanced meditation techniques', available: true },
    { feature: 'Full biometric integration', available: true },
    { feature: 'Offline access', available: true },
    { feature: 'Personalized recommendations', available: true }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Free Plan */}
      <Card>
        <CardHeader className="text-center pb-2">
          <h3 className="text-xl font-bold">Free Plan</h3>
          <p className="text-muted-foreground">Get started with mindfulness</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>
          
          <div className="space-y-1">
            {freeFeatures.map((item, index) => (
              <FeatureItem 
                key={index} 
                feature={item.feature} 
                available={item.available} 
                isPremium={false} 
              />
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={true}
          >
            {isPremium ? 'Downgrade (Contact Support)' : 'Current Plan'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Premium Plan */}
      <Card className={`border-primary ${!isPremium ? 'shadow-md' : ''}`}>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            {isPremium && (
              <div className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                Current Plan
              </div>
            )}
            {!isPremium && (
              <div className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                Recommended
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold">Premium Plan</h3>
          <p className="text-muted-foreground">Unlock your full potential</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">$9.99</span>
            <span className="text-muted-foreground"> /month</span>
          </div>
          
          <div className="space-y-1">
            {premiumFeatures.map((item, index) => (
              <FeatureItem 
                key={index} 
                feature={item.feature} 
                available={item.available} 
                isPremium={true} 
              />
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant={isPremium ? "outline" : "default"} 
            className="w-full" 
            onClick={onSelectPremium}
          >
            {isPremium ? 'Manage Subscription' : 'Upgrade Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPlanComparison;
