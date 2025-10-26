

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


import AccountSubscriptionSettings from '@/components/settings/AccountSubscriptionSettings';
import { SubscriptionCard } from '@/features/subscription';
import MeditationHistoryList from '@/components/meditation/MeditationHistoryList';

const Account = () => {
  const navigate = useNavigate();
  
  // Define subscription plan details
  const subscriptionPlan = {
    title: "Free Plan",
    description: "Basic access to meditation content",
    features: [
      "10 meditation sessions per month",
      "Basic analytics",
      "Mobile access"
    ],
    price: 0,
    interval: "month" as const
  };

  // Handler for subscription button
  const handleSubscribe = () => {
    navigate('/subscription');
  };
  
  return (
    <>
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Account</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
        
        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubscriptionCard 
                title={subscriptionPlan.title}
                description={subscriptionPlan.description}
                features={subscriptionPlan.features}
                price={subscriptionPlan.price}
                interval={subscriptionPlan.interval}
                onSubscribe={handleSubscribe}
              />
              <AccountSubscriptionSettings />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Meditation History</h2>
              <MeditationHistoryList />
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
              <p className="text-muted-foreground">
                Profile settings will be implemented in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
    </>
  );
};

export default Account;
