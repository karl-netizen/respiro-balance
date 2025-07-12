
import React from 'react';
import Header from '@/components/Header';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityAudit } from '@/components/system/SecurityAudit';
import { ContentManager } from '@/components/system/ContentManager';
import { ErrorTracker } from '@/components/system/ErrorTracker';
import { EmailVerification } from '@/components/system/EmailVerification';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const SystemDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // For now, allow access to authenticated users
  // In production, you'd check for admin role
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              System Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Monitor and manage critical infrastructure components for launch readiness.
            </p>
          </div>

          <Tabs defaultValue="security" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="security">Security Audit</TabsTrigger>
              <TabsTrigger value="content">Content Manager</TabsTrigger>
              <TabsTrigger value="errors">Error Tracking</TabsTrigger>
              <TabsTrigger value="email">Email System</TabsTrigger>
            </TabsList>

            <TabsContent value="security">
              <SecurityAudit />
            </TabsContent>

            <TabsContent value="content">
              <ContentManager />
            </TabsContent>

            <TabsContent value="errors">
              <ErrorTracker />
            </TabsContent>

            <TabsContent value="email">
              <EmailVerification />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default SystemDashboardPage;
