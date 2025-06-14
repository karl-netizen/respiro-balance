
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AccountGeneralSettings from '@/components/settings/AccountGeneralSettings';
import AccountPreferencesSettings from '@/components/settings/AccountPreferencesSettings';
import AccountNotificationSettings from '@/components/settings/AccountNotificationSettings';
import AccountSecuritySettings from '@/components/settings/AccountSecuritySettings';
import AccountSubscriptionSettings from '@/components/settings/AccountSubscriptionSettings';
import { User, Settings, Bell, Shield, Crown } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences, security, and subscription settings.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Subscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <AccountGeneralSettings />
          </TabsContent>

          <TabsContent value="preferences">
            <AccountPreferencesSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <AccountNotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <AccountSecuritySettings />
          </TabsContent>

          <TabsContent value="subscription">
            <AccountSubscriptionSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
