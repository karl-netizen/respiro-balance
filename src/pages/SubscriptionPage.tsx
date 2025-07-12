
import React, { useState } from 'react';
import Header from '@/components/Header';

import { PaymentCard } from '@/components/payment';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import SubscriptionPlanComparison from '@/components/subscription/SubscriptionPlanComparison';
import SubscriptionFAQs from '@/components/subscription/SubscriptionFAQs';
import CheckoutFlow from '@/components/subscription/CheckoutFlow';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { useNavigationHistory } from '@/context/NavigationHistoryProvider';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const { user, isLoading } = useAuth();
  const { isPremium, tierName } = useSubscriptionContext();
  const { canGoBack, goBack } = useNavigationHistory();
  const [showCheckout, setShowCheckout] = useState(false);
  
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  const handleSelectPremium = () => {
    if (isPremium) {
      window.location.href = '/account?tab=subscription';
    } else {
      setShowCheckout(true);
    }
  };
  
  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };
  
  const handleCheckoutComplete = () => {
    toast.success('Welcome to Premium!', {
      description: 'Your subscription has been activated successfully.'
    });
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {canGoBack && (
            <div className="mb-8">
              <Button variant="ghost" onClick={goBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Previous Page
              </Button>
            </div>
          )}
          
          {showCheckout ? (
            <CheckoutFlow 
              onCancel={handleCheckoutCancel} 
              onComplete={handleCheckoutComplete} 
            />
          ) : (
            <>
              <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Subscription Options
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the plan that fits your meditation journey
                </p>
              </div>
              
              <div className="mb-12">
                <SubscriptionPlanComparison onSelectPremium={handleSelectPremium} />
              </div>
              
              <div className="mt-16">
                <SubscriptionFAQs />
              </div>
            </>
          )}
        </div>
      </main>
      
      
    </div>
  );
};

export default SubscriptionPage;
