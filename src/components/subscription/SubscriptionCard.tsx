
import React from 'react';
import { useSubscriptionContext } from '../../hooks/useSubscriptionContext';
import { Button } from '../ui/button';

export interface SubscriptionCardProps {
  // Add any props if needed
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = () => {
  const { 
    isSubscribed, 
    tierName, 
    subscriptionData, 
    startPremiumCheckout, 
    manageSubscription 
  } = useSubscriptionContext();

  // Fix the type issues by properly handling return values
  const handleStartCheckout = async () => {
    try {
      if (startPremiumCheckout) {
        await startPremiumCheckout();
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      if (manageSubscription) {
        await manageSubscription();
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Subscription</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Current Plan</span>
          <span className="text-lg font-bold">{tierName}</span>
        </div>
        
        {isSubscribed && subscriptionData && (
          <div className="text-sm text-muted-foreground">
            {subscriptionData.status === 'active' ? (
              <p>
                Your subscription is active until{' '}
                {new Date(subscriptionData.current_period_end).toLocaleDateString()}
              </p>
            ) : (
              <p>
                Your subscription status: {subscriptionData.status}
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {!isSubscribed ? (
          <Button 
            className="w-full bg-primary text-primary-foreground"
            onClick={handleStartCheckout}
          >
            Upgrade to Premium
          </Button>
        ) : (
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleManageSubscription}
          >
            Manage Subscription
          </Button>
        )}
        
        {!isSubscribed && (
          <p className="text-sm text-muted-foreground text-center">
            Unlock unlimited meditation minutes, personalized insights, and more.
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
