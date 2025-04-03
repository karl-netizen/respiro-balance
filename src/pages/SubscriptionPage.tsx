
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymentCard } from '@/components/payment';
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
  
  const premiumFeatures = [
    { text: 'Unlimited meditation minutes' },
    { text: 'Advanced meditation techniques' },
    { text: 'Personalized recommendations' },
    { text: 'Biometric integration' },
    { text: 'Advanced analytics' },
    { text: 'Offline access' },
  ];
  
  const teamFeatures = [
    { text: 'Everything in Premium' },
    { text: '5 team member accounts' },
    { text: 'Team progress dashboard' },
    { text: 'Group challenges & goals' },
    { text: 'Admin controls' },
    { text: 'Team analytics' },
  ];
  
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
          <h1 className="text-3xl font-bold mb-2">Subscription Options</h1>
          <p className="text-muted-foreground">
            Choose the plan that fits your meditation journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <PaymentCard
            title="Premium"
            price="$9"
            description="Unlock the full potential of your mindfulness journey"
            features={premiumFeatures}
            popular={true}
          />
          
          <PaymentCard
            title="Team"
            price="$49"
            description="Perfect for small teams and organizations"
            features={teamFeatures}
            buttonText="Contact Sales"
          />
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground text-center">
          <p>All plans include access to our mobile app and web platform. Premium subscription can be canceled at any time.</p>
          <p className="mt-2">For enterprise solutions or custom pricing, please contact our sales team.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
