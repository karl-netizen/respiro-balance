import React from 'react';
import { UserJourneyTesting } from '@/components/testing/UserJourneyTesting';
import { UserJourneyOptimization } from '@/components/testing/UserJourneyOptimization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const UserJourneyTestingPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
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