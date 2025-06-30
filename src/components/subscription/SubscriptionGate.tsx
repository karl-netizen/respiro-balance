import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';

interface SubscriptionGateProps {
  children: ReactNode;
  feature: string;
  tier?: 'premium' | 'team';
  showPreview?: boolean;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  feature,
  tier = 'premium',
  showPreview = false
}) => {
  const { isPremium, startPremiumCheckout } = useSubscriptionContext();

  const handleUpgrade = async () => {
    try {
      if (startPremiumCheckout) {
        await startPremiumCheckout();
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
    }
  };

  // Allow access if user has premium or higher
  const hasAccess = isPremium;

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {showPreview && (
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      )}
      
      <Card className={`${showPreview ? 'absolute inset-0 bg-white/95 backdrop-blur-sm' : ''}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full w-fit">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Premium Feature
          </CardTitle>
          <CardDescription>
            Unlock {feature} with a premium subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Required
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground text-center">
            <p>This feature is available with a premium subscription.</p>
            <p>Upgrade now to unlock advanced capabilities and enhanced productivity tools.</p>
          </div>

          <div className="pt-4">
            <Button onClick={handleUpgrade} className="w-full" size="lg">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
