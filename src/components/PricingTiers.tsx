
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
      toast.success("Free plan selected!", {
        description: "Welcome to Respiro Balance"
      });
      
      // For free plan, always redirect to onboarding first
      navigate('/onboarding');
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    } finally {
      // Reset loading state
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  
  return (
    <section id="pricing" className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Simple, Transparent Pricing</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Choose the plan that fits your meditation journey. All plans include access to our 
            mobile app and web platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card className="flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Free</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">/month</span>
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Essential meditation and breathing basics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature>5 Core Sessions - Essential meditation and quick breaks</PricingFeature>
                <PricingFeature>Basic Breathing Techniques - 3 fundamental patterns</PricingFeature>
                <PricingFeature>Simple Progress Tracking - Basic analytics and streaks</PricingFeature>
                <PricingFeature>Community Access - Join discussions and view content</PricingFeature>
                <PricingFeature>Weekly Session Limit - Up to 3 sessions per week</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker font-medium transition-all duration-200 hover:scale-105"
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
          <Card className="flex flex-col relative border-respiro-dark before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-respiro-dark/5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white dark:bg-gray-800">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <div className="bg-respiro-dark text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$7.99</span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">/month</span>
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Comprehensive meditation and breathing toolkit
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature highlighted>14 Meditation Sessions - Comprehensive guided library</PricingFeature>
                <PricingFeature highlighted>Advanced Breathing Techniques - All patterns and customizations</PricingFeature>
                <PricingFeature highlighted>Unlimited Sessions - No weekly limits or restrictions</PricingFeature>
                <PricingFeature highlighted>Full Progress Analytics - Detailed insights and trends</PricingFeature>
                <PricingFeature highlighted>Social Features - Complete community engagement</PricingFeature>
                <PricingFeature highlighted>Focus Mode - Advanced Pomodoro timer with analytics</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <PaymentButton 
                className="w-full bg-respiro-dark hover:bg-respiro-darker text-white font-medium transition-all duration-200 hover:scale-105"
                openInNewTab={false}
              >
                Upgrade to Premium
              </PaymentButton>
            </CardFooter>
          </Card>
          
          {/* Premium Plus Tier */}
          <Card className="flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium Plus</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$12.99</span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">/month</span>
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Complete platform access with AI insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature>Complete Library - All 22 sessions including exclusive content</PricingFeature>
                <PricingFeature>Biofeedback Integration - Real-time heart rate monitoring</PricingFeature>
                <PricingFeature>Advanced Analytics - AI-powered insights and recommendations</PricingFeature>
                <PricingFeature>Priority Support - Enhanced customer service</PricingFeature>
                <PricingFeature>Early Access - First access to new features and content</PricingFeature>
                <PricingFeature>Social Hub Premium - Advanced community features</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-white bg-respiro-dark border-respiro-dark hover:bg-respiro-darker font-medium transition-all duration-200 hover:scale-105"
                onClick={() => {
                  toast.info("Premium Plus Available Soon", {
                    description: "Premium Plus features will be available soon. Contact us for early access."
                  });
                  
                  // Email client will open in new tab
                  window.open("mailto:sales@respirobalance.com?subject=Premium Plus Early Access", "_blank");
                }}
              >
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            All plans include access to our mobile app and web platform. Premium plans
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
  <li className={`flex items-start ${highlighted ? 'text-respiro-dark font-medium dark:text-respiro-light' : 'text-gray-700 dark:text-gray-300'}`}>
    <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${highlighted ? 'text-respiro-dark dark:text-respiro-light' : 'text-green-500'}`} />
    <span>{children}</span>
  </li>
);

export default PricingTiers;
