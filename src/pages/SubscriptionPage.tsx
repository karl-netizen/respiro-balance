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
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const SubscriptionPage = () => {
  const { user, isLoading } = useAuth();
  const { isPremium, tierName } = useSubscriptionContext();
  const { canGoBack, goBack } = useNavigationHistory();
  const { deviceType, brandSpacing } = useDeviceDetection();
  const [showCheckout, setShowCheckout] = useState(false);
  
  console.log('SubscriptionPage - Device type:', deviceType, 'Brand spacing:', brandSpacing);
  
  // Redirect if not logged in
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  const handleSelectPremium = () => {
    if (isPremium) {
      // If already premium, go to account settings
      window.location.href = '/account?tab=subscription';
    } else {
      // Start checkout flow
      setShowCheckout(true);
    }
  };
  
  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };
  
  const handleCheckoutComplete = () => {
    // This would normally be handled by Stripe webhook
    // For now, we'll just update the UI and redirect
    toast.success('Welcome to Premium!', {
      description: 'Your subscription has been activated successfully.'
    });
    
    // Redirect to dashboard after short delay
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
          spacing={deviceType === 'mobile' ? 'normal' : 'loose'}
          className="py-8"
        >
          {canGoBack && (
            <div className={`mb-6 ${deviceType === 'mobile' ? 'mb-4' : 'mb-8'}`}>
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
              <div className={`mb-8 text-center ${deviceType === 'mobile' ? 'mb-6' : 'mb-12'}`}>
                <h1 className={`font-bold mb-2 brand-heading ${
                  deviceType === 'mobile' ? 'text-2xl' : 
                  deviceType === 'tablet' ? 'text-3xl' : 'text-4xl'
                }`}>
                  Subscription Options
                </h1>
                <p className={`text-muted-foreground brand-body ${
                  deviceType === 'mobile' ? 'text-sm px-4' : 'text-base max-w-2xl mx-auto'
                }`}>
                  Choose the plan that fits your meditation journey
                </p>
              </div>
              
              <div className={deviceType === 'mobile' ? 'mb-8' : 'mb-12'}>
                <SubscriptionPlanComparison onSelectPremium={handleSelectPremium} />
              </div>
              
              <div className={deviceType === 'mobile' ? 'mt-8' : 'mt-16'}>
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
