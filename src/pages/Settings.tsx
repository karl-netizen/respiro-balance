
import React from 'react';
import Header from '@/components/Header';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AccountGeneralSettings from '@/components/settings/AccountGeneralSettings';
import AccountNotificationSettings from '@/components/settings/AccountNotificationSettings';
import AccountPreferencesSettings from '@/components/settings/AccountPreferencesSettings';
import AccountSecuritySettings from '@/components/settings/AccountSecuritySettings';
import AccountSubscriptionSettings from '@/components/settings/AccountSubscriptionSettings';

const Settings = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
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
            <AccountSubscriptionSettings />
          </TabsContent>
        </Tabs>
      </main>
      
      
    </div>
  );
};

export default Settings;
