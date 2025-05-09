
import React from 'react';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export interface SubscriptionCardProps {
  // Add any props if needed
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = () => {
  const { 
    subscriptionData, 
    isPremium, 
    tierName,
    startPremiumCheckout,
    manageSubscription
  } = useSubscriptionContext();
  
  const handleUpgrade = async () => {
    try {
      if (startPremiumCheckout) {
        const checkoutUrl = await startPremiumCheckout();
        if (checkoutUrl) window.location.href = checkoutUrl;
        return checkoutUrl || ""; // Return empty string if undefined
      }
      return "";
    } catch (error) {
      console.error('Error starting checkout:', error);
      return "";
    }
  };
  
  const handleManage = async () => {
    try {
      if (manageSubscription) {
        const portalUrl = await manageSubscription();
        if (portalUrl) window.location.href = portalUrl;
        return portalUrl || ""; // Return empty string if undefined
      }
      return "";
    } catch (error) {
      console.error('Error opening customer portal:', error);
      return "";
    }
  };
  
  // Format renewal date if available
  const renewalDate = subscriptionData?.subscription_period_end 
    ? format(new Date(subscriptionData.subscription_period_end), 'MMMM d, yyyy')
    : null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Subscription</CardTitle>
          <Badge variant={isPremium ? "default" : "outline"} className="capitalize">
            {tierName}
          </Badge>
        </div>
        <CardDescription>
          {isPremium 
            ? "You have access to all premium features"
            : "Upgrade to unlock advanced features and unlimited meditation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isPremium && renewalDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Renews on {renewalDate}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-1 gap-2">
            <FeatureItem 
              title="Basic Meditation Sessions" 
              available={true} 
              highlight={false} 
            />
            <FeatureItem 
              title="Unlimited Meditation Minutes" 
              available={isPremium} 
              highlight={!isPremium} 
            />
            <FeatureItem 
              title="Advanced Meditation Techniques" 
              available={isPremium} 
              highlight={!isPremium} 
            />
            <FeatureItem 
              title="Personalized Recommendations" 
              available={isPremium} 
              highlight={!isPremium} 
            />
            <FeatureItem 
              title="Biometric Integration" 
              available={isPremium} 
              highlight={!isPremium} 
            />
            <FeatureItem 
              title="Advanced Progress Tracking" 
              available={isPremium} 
              highlight={!isPremium} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isPremium ? (
          <Button variant="outline" className="w-full" onClick={handleManage}>
            Manage Subscription
          </Button>
        ) : (
          <Button className="w-full" onClick={handleUpgrade}>
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Feature item component
const FeatureItem = ({ 
  title, 
  available, 
  highlight 
}: { 
  title: string; 
  available: boolean; 
  highlight: boolean;
}) => (
  <div className={`flex items-center ${highlight ? 'text-primary font-medium' : ''}`}>
    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center">
      {available ? (
        <Check className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-green-500'}`} />
      ) : (
        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
      )}
    </div>
    <span className="ml-2 text-sm">{title}</span>
  </div>
);

export default SubscriptionCard;
