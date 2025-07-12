
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Navigate } from 'react-router-dom';
import { AdvancedBiofeedbackDashboard } from '@/components/premium-pro/AdvancedBiofeedbackDashboard';
import { EnhancedSleepStories } from '@/components/premium-pro/EnhancedSleepStories';
import GroupChallengesSystem from '@/components/premium-pro/GroupChallengesSystem';

const PremiumProPage: React.FC = () => {
  const { currentTier } = useFeatureAccess();

  // Redirect if not Premium Pro user
  if (!['premium_pro', 'premium_plus'].includes(currentTier)) {
    return <Navigate to="/subscription" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Premium Pro Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Advanced biofeedback integration, enhanced sleep stories, and community challenges
              designed for serious meditation practitioners.
            </p>
          </div>

          <Tabs defaultValue="biofeedback" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="biofeedback">Biofeedback</TabsTrigger>
              <TabsTrigger value="sleep">Sleep Stories</TabsTrigger>
              <TabsTrigger value="challenges">Group Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="biofeedback">
              <AdvancedBiofeedbackDashboard />
            </TabsContent>

            <TabsContent value="sleep">
              <EnhancedSleepStories />
            </TabsContent>

            <TabsContent value="challenges">
              <GroupChallengesSystem />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default PremiumProPage;
