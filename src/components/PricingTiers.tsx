
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentButton } from '@/components/payment';

const PricingTiers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <section id="pricing" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our 
            mobile app and web platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="flex flex-col border-border">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <CardDescription className="mt-2">
                Get started with basic meditation and mindfulness
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature>Basic meditation sessions</PricingFeature>
                <PricingFeature>60 minutes of meditation per month</PricingFeature>
                <PricingFeature>Simple progress tracking</PricingFeature>
                <PricingFeature>3 morning ritual templates</PricingFeature>
                <PricingFeature>Basic breathing exercises</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Tier */}
          <Card className="flex flex-col relative border-primary before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-primary/5">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <div className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <CardDescription className="mt-2">
                Unlock the full potential of your mindfulness journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature highlighted>All features in Free plan</PricingFeature>
                <PricingFeature highlighted>Unlimited meditation minutes</PricingFeature>
                <PricingFeature highlighted>Advanced meditation techniques</PricingFeature>
                <PricingFeature highlighted>Full biometric integration</PricingFeature>
                <PricingFeature highlighted>Personalized recommendations</PricingFeature>
                <PricingFeature highlighted>Detailed progress analytics</PricingFeature>
                <PricingFeature highlighted>Custom morning rituals</PricingFeature>
                <PricingFeature highlighted>Offline download access</PricingFeature>
                <PricingFeature highlighted>Priority support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <PaymentButton className="w-full">
                Upgrade Now
              </PaymentButton>
            </CardFooter>
          </Card>
          
          {/* Team Tier */}
          <Card className="flex flex-col border-border">
            <CardHeader>
              <CardTitle className="text-xl">Team</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <CardDescription className="mt-2">
                Perfect for small teams and organizations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature>All features in Premium plan</PricingFeature>
                <PricingFeature>5 team member accounts</PricingFeature>
                <PricingFeature>Team progress dashboard</PricingFeature>
                <PricingFeature>Group challenges and goals</PricingFeature>
                <PricingFeature>Admin controls</PricingFeature>
                <PricingFeature>Team analytics</PricingFeature>
                <PricingFeature>Custom onboarding</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "mailto:sales@respirobalance.com?subject=Team Plan Inquiry"}
              >
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All plans include access to our mobile app and web platform. Premium plan
            can be canceled at any time. For enterprise solutions or custom
            pricing, please contact our sales team.
          </p>
        </div>
      </div>
    </section>
  );
};

interface PricingFeatureProps {
  children: React.ReactNode;
  highlighted?: boolean;
}

const PricingFeature = ({ children, highlighted = false }: PricingFeatureProps) => (
  <li className={`flex items-start ${highlighted ? 'text-primary font-medium' : ''}`}>
    <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${highlighted ? 'text-primary' : 'text-green-500'}`} />
    <span>{children}</span>
  </li>
);

export default PricingTiers;
