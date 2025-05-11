
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountGeneralSettings from '@/components/settings/AccountGeneralSettings';
import AccountNotificationSettings from '@/components/settings/AccountNotificationSettings';
import AccountPreferencesSettings from '@/components/settings/AccountPreferencesSettings';
import AccountSecuritySettings from '@/components/settings/AccountSecuritySettings';
import AccountSubscriptionSettings from '@/components/settings/AccountSubscriptionSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/context';

const SettingsPage: React.FC = () => {
  const { preferences } = useUserPreferences();
  
  // Fixed to use includes for subscription tier check
  const isPremiumOrEnterprise = ["premium", "enterprise"].includes(preferences.subscriptionTier);
  const subscriptionTier = preferences.subscriptionTier || 'free';

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <AccountGeneralSettings />
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <AccountPreferencesSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <AccountNotificationSettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <AccountSecuritySettings />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <AccountSubscriptionSettings 
              subscriptionTier={subscriptionTier}
              isPremium={isPremiumOrEnterprise}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
};

export default SettingsPage;
