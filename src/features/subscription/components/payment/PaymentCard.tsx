
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import PaymentButton from './PaymentButton';

interface PaymentFeature {
  text: string;
}

interface PaymentCardProps {
  title: string;
  price: string;
  description: string;
  features: PaymentFeature[];
  buttonText?: string;
  popular?: boolean;
}

/**
 * A card that displays payment information and a button to proceed to payment
 */
export const PaymentCard = ({
  title,
  price,
  description,
  features,
  buttonText = 'Upgrade Now',
  popular = false,
}: PaymentCardProps) => {
  return (
    <Card className={`flex flex-col ${popular ? 'border-primary shadow-md relative' : ''}`}>
      {popular && (
        <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
          Popular Choice
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">/month</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <PaymentButton className="w-full" variant={popular ? 'default' : 'outline'}>
          {buttonText}
        </PaymentButton>
      </CardFooter>
    </Card>
  );
};

export default PaymentCard;
