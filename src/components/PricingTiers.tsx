import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { PaymentButton } from '@/components/payment';
import { toast } from 'sonner';

const PricingTiers = () => {
  const navigate = useNavigate();
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                {/* Core Sessions & Access */}
                <PricingFeature included={true}>3 Beginner Sessions Only</PricingFeature>
                <PricingFeature included={true}>1 session per day (max 7/week)</PricingFeature>
                <PricingFeature included={true}>5-10 minute sessions only</PricingFeature>
                <PricingFeature included={true}>Box Breathing only</PricingFeature>
                
                {/* Tracking & Insights */}
                <PricingFeature included={true}>Weekly streak count only</PricingFeature>
                <PricingFeature included={false}>No mood tracking</PricingFeature>
                
                {/* App Experience */}
                <PricingFeature included={false}>30-60 second ads between sessions</PricingFeature>
                <PricingFeature included={false}>Internet required for all content</PricingFeature>
                <PricingFeature included={false}>Single device only</PricingFeature>
                
                {/* Premium Content & Features */}
                <PricingFeature included={true}>1 sleep story</PricingFeature>
                <PricingFeature included={false}>No focus tools</PricingFeature>
                
                {/* Community & Social */}
                <PricingFeature included={false}>View-only community feed</PricingFeature>
                
                {/* Support & Sharing */}
                <PricingFeature included={false}>FAQ & help articles only</PricingFeature>
                <PricingFeature included={false}>Single user only</PricingFeature>
                <PricingFeature included={false}>Basic app experience</PricingFeature>
                <PricingFeature included={false}>Standard releases only</PricingFeature>
                <PricingFeature included={false}>No data export</PricingFeature>
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
          
          {/* Standard Tier */}
          <Card className="flex flex-col border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Standard</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getPricing(9, 32).price}
                </span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">
                  /{getPricing(9, 32).period}
                </span>
                {isAnnual && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      That's ${getPricing(9, 32).monthlyEquivalent}/month
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save {getPricing(9, 32).savings}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save ${getPricing(9, 32).savingsAmount}/year
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
                {/* Core Sessions & Access */}
                <PricingFeature included>20 Sessions</PricingFeature>
                <PricingFeature included>5 sessions per day</PricingFeature>
                <PricingFeature included>5-30 minute sessions</PricingFeature>
                <PricingFeature included>3 Proven Patterns + Guided Instructions</PricingFeature>
                
                {/* Tracking & Insights */}
                <PricingFeature included>Monthly insights + basic charts</PricingFeature>
                <PricingFeature included>Daily mood check-ins</PricingFeature>
                
                {/* App Experience */}
                <PricingFeature included>Completely ad-free experience</PricingFeature>
                <PricingFeature included>Download up to 5 sessions</PricingFeature>
                <PricingFeature included>Sync across 3 devices</PricingFeature>
                
                {/* Premium Content & Features */}
                <PricingFeature included>5 sleep stories + nature sounds</PricingFeature>
                <PricingFeature included>Basic Pomodoro timer</PricingFeature>
                <PricingFeature included>Weekly new content releases</PricingFeature>
                
                {/* Community & Social */}
                <PricingFeature included>Join discussions + buddy system</PricingFeature>
                
                {/* Support & Sharing */}
                <PricingFeature included>Community forum + email (72h response)</PricingFeature>
                <PricingFeature included={false}>Single user only</PricingFeature>
                <PricingFeature included={false}>Standard theme only</PricingFeature>
                <PricingFeature included={false}>Standard releases only</PricingFeature>
                <PricingFeature included={false}>Basic stats sharing</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <PaymentButton 
                className="w-full bg-respiro-dark hover:bg-respiro-darker text-white font-medium transition-all duration-200 hover:scale-105"
                openInNewTab={false}
              >
                Upgrade to Standard
              </PaymentButton>
            </CardFooter>
          </Card>
          
          {/* Premium Tier */}
          <Card className="flex flex-col relative border-respiro-dark before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-respiro-dark/5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-white hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/80">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <div className="bg-respiro-dark text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getPricing(13, 35).price}
                </span>
                <span className="text-muted-foreground ml-2 dark:text-gray-300">
                  /{getPricing(13, 35).period}
                </span>
                {isAnnual && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      That's ${getPricing(13, 35).monthlyEquivalent}/month
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save {getPricing(13, 35).savings}%
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        Save ${getPricing(13, 35).savingsAmount}/year
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
              <div className="mb-3 text-sm font-medium text-respiro-dark">Everything in Standard, plus:</div>
              <ul className="space-y-2">
                {/* Core Sessions & Access */}
                <PricingFeature included>50 Sessions</PricingFeature>
                <PricingFeature included>Unlimited daily sessions</PricingFeature>
                <PricingFeature included>5-60 minute sessions</PricingFeature>
                <PricingFeature included>All Patterns + Custom Timing</PricingFeature>
                
                {/* Tracking & Insights */}
                <PricingFeature included>Advanced wellness tracking + trends</PricingFeature>
                <PricingFeature included>Mood + sleep + energy tracking</PricingFeature>
                <PricingFeature included>Heart rate + stress monitoring</PricingFeature>
                
                {/* App Experience */}
                <PricingFeature included>Download up to 20 sessions</PricingFeature>
                
                {/* Premium Content & Features */}
                <PricingFeature included>15 sleep stories + sleep courses</PricingFeature>
                <PricingFeature included>Advanced focus tracking + break reminders</PricingFeature>
                <PricingFeature included>Expert-led courses + workshops</PricingFeature>
                
                {/* Community & Social */}
                <PricingFeature included>Weekly group challenges + leaderboards</PricingFeature>
                
                {/* Support & Sharing */}
                <PricingFeature included>Priority email support (24h response)</PricingFeature>
                <PricingFeature included>Share with 1 family member</PricingFeature>
                <PricingFeature included>Dark mode + theme options</PricingFeature>
                <PricingFeature included>Early access to new features</PricingFeature>
                <PricingFeature included>Full CSV export</PricingFeature>
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
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            All plans include access to our mobile app and web platform. Paid plans
            can be canceled at any time. Annual plans save 32-35% compared to monthly.
            For enterprise solutions or custom pricing, please contact our sales team.
          </p>
        </div>
      </div>
    </section>
  );
};

const PricingFeature = ({ children, included = true }: { 
  children: React.ReactNode; 
  included?: boolean;
}) => (
  <li className="flex items-start text-respiro-dark font-medium dark:text-respiro-light">
    {included ? (
      <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-respiro-dark dark:text-respiro-light" />
    ) : (
      <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
    )}
    <span>{children}</span>
  </li>
);

export default PricingTiers;
