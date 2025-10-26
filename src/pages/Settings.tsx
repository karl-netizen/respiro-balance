

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCcw } from 'lucide-react';
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
  
  const handleResetOnboarding = () => {
    if (confirm('Are you sure you want to reset onboarding? This will restart the welcome flow.')) {
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('user_goal');
      localStorage.removeItem('welcome_shown');
      window.location.href = '/onboarding';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      
      
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
        
        <Separator className="my-8" />
        
        {/* Developer Tools */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Developer Tools</CardTitle>
            <CardDescription>
              Testing and debugging utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Reset Onboarding</p>
                <p className="text-sm text-muted-foreground">
                  Clear onboarding progress and restart the welcome flow
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleResetOnboarding}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      
    </div>
  );
};

export default Settings;
