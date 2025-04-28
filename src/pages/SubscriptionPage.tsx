
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
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const { user, isLoading } = useAuth();
  const { isPremium, tierName } = useSubscriptionContext();
  const [showCheckout, setShowCheckout] = useState(false);
  
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
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/settings" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
        </div>
        
        {showCheckout ? (
          <CheckoutFlow 
            onCancel={handleCheckoutCancel} 
            onComplete={handleCheckoutComplete} 
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Subscription Options</h1>
              <p className="text-muted-foreground">
                Choose the plan that fits your meditation journey
              </p>
            </div>
            
            <SubscriptionPlanComparison onSelectPremium={handleSelectPremium} />
            
            <div className="mt-12">
              <SubscriptionFAQs />
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
