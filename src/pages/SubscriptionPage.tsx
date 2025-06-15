
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { BrandConsistentContainer } from '@/components/responsive/BrandConsistentContainer';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';

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
        <BrandConsistentContainer 
          maxWidth="2xl" 
          spacing="loose"
          className="py-8"
        >
          {canGoBack && (
            <div className="mb-8">
              <TouchFriendlyButton variant="ghost" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Page
              </TouchFriendlyButton>
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
                <h1 className="text-4xl font-bold mb-4 brand-heading">
                  Subscription Options
                </h1>
                <p className="text-lg text-muted-foreground brand-body max-w-2xl mx-auto">
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
        </BrandConsistentContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
