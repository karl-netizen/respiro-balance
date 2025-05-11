
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentButton } from '@/components/payment';
import { toast } from 'sonner';

const PricingTiers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGetStarted = () => {
    setIsLoading(true);
    
    try {
      if (user) {
        navigate('/dashboard');
      } else {
        // Show toast and redirect to dashboard for demo purposes
        toast.info("Demo Mode", {
          description: "Bypassing login for demonstration"
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 500); // Small delay to show loading state
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    } finally {
      // If navigation doesn't happen within 2 seconds, reset loading state
      setTimeout(() => setIsLoading(false), 2000);
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
          <Card className="flex flex-col border-border shadow-md hover:shadow-lg transition-all duration-200">
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
                className="w-full text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker font-medium"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Starting...</span>
                  </>
                ) : (
                  "Start Free Plan"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Tier */}
          <Card className="flex flex-col relative border-respiro-dark before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-respiro-dark/5 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <div className="bg-respiro-dark text-white text-xs font-medium px-3 py-1 rounded-full">
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
              <PaymentButton className="w-full bg-respiro-dark hover:bg-respiro-darker text-white font-medium">
                Upgrade Now
              </PaymentButton>
            </CardFooter>
          </Card>
          
          {/* Team Tier */}
          <Card className="flex flex-col border-border shadow-md hover:shadow-lg transition-all duration-200">
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
                className="w-full text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker font-medium"
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
  <li className={`flex items-start ${highlighted ? 'text-respiro-dark font-medium' : ''}`}>
    <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${highlighted ? 'text-respiro-dark' : 'text-green-500'}`} />
    <span>{children}</span>
  </li>
);

export default PricingTiers;
