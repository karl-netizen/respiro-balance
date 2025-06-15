
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the types for the subscription data
interface SubscriptionData {
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  tier: string;
}

interface SubscriptionCardProps {
  title: string;
  description: string;
  features: string[];
  price: number;
  interval?: 'month' | 'year';
  highlighted?: boolean;
  subscription?: SubscriptionData;
  onSubscribe: () => void;
  onManage?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  description,
  features,
  price,
  interval = 'month',
  highlighted = false,
  subscription,
  onSubscribe,
  onManage
}) => {
  const isActive = subscription?.status === 'active';
  const isCurrentPlan = isActive && subscription?.tier === title.toLowerCase();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`flex flex-col h-full transition-all duration-300 border-2 hover:shadow-lg hover:scale-105 hover:border-primary/50 cursor-pointer ${
      highlighted ? 'border-primary shadow-lg scale-105' : 'border-gray-200 hover:border-primary'
    } ${isCurrentPlan ? 'ring-2 ring-primary ring-opacity-50' : ''}`}>
      <CardHeader className={`${highlighted ? 'bg-primary/5' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          {highlighted && <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">Popular</span>}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{interval}</span>
        </div>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-500 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan && subscription && (
          <div className="mt-4 p-3 bg-muted/40 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">
              {subscription.status === 'active' ? 'Active subscription' : 'Subscription status: ' + subscription.status}
            </p>
            {subscription.current_period_end && (
              <p className="text-xs text-muted-foreground">
                {subscription.cancel_at_period_end 
                  ? `Cancels on ${formatDate(subscription.current_period_end)}` 
                  : `Renews on ${formatDate(subscription.current_period_end)}`}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isCurrentPlan ? (
          <Button 
            onClick={onManage} 
            variant="outline" 
            className="w-full border-2 border-gray-300 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            Manage Subscription
          </Button>
        ) : (
          <Button 
            onClick={onSubscribe} 
            variant="outline"
            className="w-full border-2 border-gray-300 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            {isActive ? 'Change Plan' : 'Subscribe'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
