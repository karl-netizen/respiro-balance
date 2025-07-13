import React from 'react';
import { UserJourneyTesting } from '@/components/testing/UserJourneyTesting';
import { UserJourneyOptimization } from '@/components/testing/UserJourneyOptimization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDemoMode } from '@/hooks/useDemoMode';

const UserJourneyTestingPage: React.FC = () => {
  const { isDemoMode } = useDemoMode();

  // Allow access in demo mode or for authenticated users
  if (!isDemoMode) {
    // For now, allow access without authentication for testing purposes
    // You can add authentication check back later if needed
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="testing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testing">Journey Testing</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="testing">
            <UserJourneyTesting />
          </TabsContent>

          <TabsContent value="optimization">
            <UserJourneyOptimization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserJourneyTestingPage;
