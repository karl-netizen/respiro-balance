
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if not logged in
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }
  
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
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing details
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subscription card */}
          <div className="md:col-span-1">
            <SubscriptionCard />
          </div>
          
          {/* Pricing comparison */}
          <div className="md:col-span-1">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Premium Benefits</h2>
              
              <ul className="space-y-3">
                <PremiumBenefit 
                  title="Unlimited Meditation" 
                  description="No more monthly limits on meditation minutes" 
                />
                <PremiumBenefit 
                  title="Advanced Techniques" 
                  description="Access to our full library of specialized techniques" 
                />
                <PremiumBenefit 
                  title="Personalized Recommendations" 
                  description="AI-powered suggestions tailored to your preferences" 
                />
                <PremiumBenefit 
                  title="Biometric Integration" 
                  description="Connect with your wearable devices for deeper insights" 
                />
                <PremiumBenefit 
                  title="Advanced Analytics" 
                  description="Detailed progress tracking and performance metrics" 
                />
                <PremiumBenefit 
                  title="Offline Access" 
                  description="Download sessions for use without internet connection" 
                />
              </ul>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>All subscriptions automatically renew. Cancel anytime from your account settings.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Premium benefit component
const PremiumBenefit = ({ title, description }: { title: string; description: string }) => (
  <li className="flex">
    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6">
      <Check className="h-5 w-5 text-primary" />
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </li>
);

// Import Check icon
import { Check } from 'lucide-react';

export default SubscriptionPage;
