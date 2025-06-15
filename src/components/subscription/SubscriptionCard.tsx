
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
    <Card className={`flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 bg-white dark:bg-gray-800 ${
      highlighted ? 'relative border-respiro-dark before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-respiro-dark/5' : ''
    } ${isCurrentPlan ? 'ring-2 ring-respiro-dark ring-opacity-50' : ''}`}>
      {highlighted && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
          <div className="bg-respiro-dark text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </div>
        </div>
      )}
      
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">${price}</span>
          <span className="text-muted-foreground ml-2 dark:text-gray-300">/{interval}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className={`flex items-start ${
              highlighted ? 'text-respiro-dark font-medium dark:text-respiro-light' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                  highlighted ? 'text-respiro-dark dark:text-respiro-light' : 'text-green-500'
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{feature}</span>
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
            className="w-full text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker font-medium transition-all duration-200 hover:scale-105"
          >
            Manage Subscription
          </Button>
        ) : (
          <Button 
            onClick={onSubscribe} 
            className={`w-full font-medium transition-all duration-200 hover:scale-105 ${
              highlighted 
                ? 'bg-respiro-dark hover:bg-respiro-darker text-white' 
                : 'text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker'
            }`}
          >
            {isActive ? 'Change Plan' : (price === 0 ? 'Start Free Plan' : (highlighted ? 'Upgrade to Premium' : 'Coming Soon'))}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
