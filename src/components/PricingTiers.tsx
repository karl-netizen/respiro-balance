import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentButton } from '@/components/payment';
import { toast } from 'sonner';

const PricingTiers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  
  const handleGetStarted = () => {
    setIsLoading(true);
    
    try {
      toast.success("Free plan selected!", {
        description: "Welcome to Respiro Balance"
      });
      
      navigate('/onboarding');
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const getPricing = (monthlyPrice: number, discountPercent: number) => {
    if (monthlyPrice === 0) return { 
      price: 0, 
      period: 'month', 
      savings: 0, 
      monthlyEquivalent: 0,
      savingsAmount: 0 
    };
    
    const annualPrice = Math.round(monthlyPrice * 12 * (1 - discountPercent / 100) * 100) / 100;
    const monthlyEquivalent = Math.round((annualPrice / 12) * 100) / 100;
    const savingsAmount = Math.round((monthlyPrice * 12 - annualPrice) * 100) / 100;
    
    return isAnnual 
      ? { 
          price: annualPrice, 
          period: 'year', 
          savings: discountPercent,
          monthlyEquivalent,
          savingsAmount
        } 
      : { 
          price: monthlyPrice, 
          period: 'month', 
          savings: 0,
          monthlyEquivalent: monthlyPrice,
          savingsAmount: 0
        };
  };
  
  return (
    <section id="pricing" className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Simple, Transparent Pricing</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-gray-700 dark:text-gray-300 mb-8">
            Choose the plan that fits your meditation journey. All plans include access to our 
            mobile app and web platform.
          </p>
          
          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={togglePricing}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-respiro-dark focus:ring-offset-2 dark:bg-gray-700"
              style={{ backgroundColor: isAnnual ? '#1a365d' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Save up to 40%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Free Tier */}
          <Card className="flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Free</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">/month</span>
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Essential meditation basics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature included={false}>3 Beginner Sessions Only</PricingFeature>
                <PricingFeature included={false}>1 session per day (max 7/week)</PricingFeature>
                <PricingFeature included={false}>5-10 minute sessions only</PricingFeature>
                <PricingFeature included={false}>Box Breathing only</PricingFeature>
                <PricingFeature included={false}>Weekly streak count only</PricingFeature>
                <PricingFeature included={false}>No mood tracking</PricingFeature>
                <PricingFeature included={false}>30-60 second ads between sessions</PricingFeature>
                <PricingFeature included={false}>Internet required for all content</PricingFeature>
                <PricingFeature included={false}>Single device only</PricingFeature>
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
          <Card className="flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getPricing(11.97, 32).price}
                </span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">
                  /{getPricing(11.97, 32).period}
                </span>
                {isAnnual && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      That's ${getPricing(11.97, 32).monthlyEquivalent}/month
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save {getPricing(11.97, 32).savings}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save ${getPricing(11.97, 32).savingsAmount}/year
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Comprehensive meditation toolkit
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <PricingFeature included highlighted>20 Sessions</PricingFeature>
                <PricingFeature included highlighted>5 sessions per day</PricingFeature>
                <PricingFeature included highlighted>5-30 minute sessions</PricingFeature>
                <PricingFeature included highlighted>3 Proven Patterns + Guided Instructions</PricingFeature>
                <PricingFeature included highlighted>Monthly insights + basic charts</PricingFeature>
                <PricingFeature included highlighted>Daily mood check-ins</PricingFeature>
                <PricingFeature included highlighted>Completely ad-free experience</PricingFeature>
                <PricingFeature included highlighted>Download up to 5 sessions</PricingFeature>
                <PricingFeature included highlighted>Sync across 3 devices</PricingFeature>
                <PricingFeature included highlighted>5 sleep stories + nature sounds</PricingFeature>
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
          
          {/* Premium Pro Tier */}
          <Card className="flex flex-col relative border-respiro-dark before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-respiro-dark/5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <div className="bg-respiro-dark text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium Pro</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getPricing(29.97, 35).price}
                </span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">
                  /{getPricing(29.97, 35).period}
                </span>
                {isAnnual && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      That's ${getPricing(29.97, 35).monthlyEquivalent}/month
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save {getPricing(29.97, 35).savings}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save ${getPricing(29.97, 35).savingsAmount}/year
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Advanced features + biofeedback
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-3 text-sm font-medium text-respiro-dark">Everything in Premium, plus:</div>
              <ul className="space-y-2">
                <PricingFeature included highlighted>50 Sessions</PricingFeature>
                <PricingFeature included highlighted>Unlimited daily sessions</PricingFeature>
                <PricingFeature included highlighted>5-60 minute sessions</PricingFeature>
                <PricingFeature included highlighted>All Patterns + Custom Timing</PricingFeature>
                <PricingFeature included highlighted>Advanced wellness tracking + trends</PricingFeature>
                <PricingFeature included highlighted>Mood + sleep + energy tracking</PricingFeature>
                <PricingFeature included highlighted>Heart rate + stress monitoring</PricingFeature>
                <PricingFeature included highlighted>Download up to 20 sessions</PricingFeature>
                <PricingFeature included highlighted>15 sleep stories + sleep courses</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-respiro-dark hover:bg-respiro-darker text-white font-medium transition-all duration-200 hover:scale-105"
                onClick={() => {
                  toast.info("Premium Pro Available Soon", {
                    description: "Premium Pro features will be available soon. Contact us for early access."
                  });
                  window.open("mailto:sales@respirobalance.com?subject=Premium Pro Early Access", "_blank");
                }}
              >
                Choose Premium Pro
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plus Tier */}
          <Card className="flex flex-col relative border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/3">
              <div className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Limited Beta
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium Plus</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getPricing(47.97, 40).price}
                </span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">
                  /{getPricing(47.97, 40).period}
                </span>
                {isAnnual && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      That's ${getPricing(47.97, 40).monthlyEquivalent}/month
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save {getPricing(47.97, 40).savings}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save ${getPricing(47.97, 40).savingsAmount}/year
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                Complete platform with AI & biofeedback coaching
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-3 text-sm font-medium text-respiro-dark">Everything in Premium Pro, plus:</div>
              <ul className="space-y-2">
                <PricingFeature included>100+ Sessions + Smart Playlists</PricingFeature>
                <PricingFeature included>Unlimited + Session recommendations</PricingFeature>
                <PricingFeature included>Any length + favorite session bookmarks</PricingFeature>
                <PricingFeature included>All Patterns + Advanced Customization</PricingFeature>
                <PricingFeature included>Comprehensive dashboard + smart insights</PricingFeature>
                <PricingFeature included>Full wellness pattern analysis</PricingFeature>
                <PricingFeature included>Heart rate + stress + HRV coaching</PricingFeature>
                <PricingFeature included>Download entire library</PricingFeature>
                <PricingFeature included>Family plan for up to 6 members</PricingFeature>
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
                  window.open("mailto:sales@respirobalance.com?subject=Premium Plus Early Access", "_blank");
                }}
              >
                Get Premium Plus
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            All plans include access to our mobile app and web platform. Premium plans
            can be canceled at any time. Annual plans save 32-40% compared to monthly.
            For enterprise solutions or custom pricing, please contact our sales team.
          </p>
        </div>
      </div>
    </section>
  );
};

const PricingFeature = ({ children, included = true, highlighted = false }: { 
  children: React.ReactNode; 
  included?: boolean; 
  highlighted?: boolean;
}) => (
  <li className={`flex items-start ${highlighted ? 'text-respiro-dark font-medium dark:text-respiro-light' : 'text-gray-700 dark:text-gray-300'}`}>
    {included ? (
      <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${highlighted ? 'text-respiro-dark dark:text-respiro-light' : 'text-green-500'}`} />
    ) : (
      <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
    )}
    <span>{children}</span>
  </li>
);

export default PricingTiers;
