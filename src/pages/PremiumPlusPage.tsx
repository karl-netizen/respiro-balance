
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Navigate } from 'react-router-dom';
import { AIPersonalizationEngine } from '@/components/premium-plus/AIPersonalizationEngine';
import { FamilySharingSystem } from '@/components/premium-plus/FamilySharingSystem';
import { ExpertSessionPlatform } from '@/components/premium-plus/ExpertSessionPlatform';
import BiofeedbackCoaching from '@/components/premium-plus/BiofeedbackCoaching';
import MasterclassSystem from '@/components/premium-plus/MasterclassSystem';
import WhiteLabelCustomization from '@/components/premium-plus/WhiteLabelCustomization';
import ComprehensiveWellnessDashboard from '@/components/premium-plus/ComprehensiveWellnessDashboard';

const PremiumPlusPage: React.FC = () => {
  const { currentTier } = useFeatureAccess();

  // Redirect if not Premium Plus user
  if (currentTier !== 'premium_plus') {
    return <Navigate to="/subscription" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Premium Plus Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Access our most advanced features including AI personalization, family sharing, 
              expert sessions, and comprehensive wellness tracking.
            </p>
          </div>

          <Tabs defaultValue="ai" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="ai">AI Engine</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="experts">Experts</TabsTrigger>
              <TabsTrigger value="biofeedback">Biofeedback</TabsTrigger>
              <TabsTrigger value="masterclass">Masterclass</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="whitelabel">White-label</TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <AIPersonalizationEngine />
            </TabsContent>

            <TabsContent value="family">
              <FamilySharingSystem />
            </TabsContent>

            <TabsContent value="experts">
              <ExpertSessionPlatform />
            </TabsContent>

            <TabsContent value="biofeedback">
              <BiofeedbackCoaching />
            </TabsContent>

            <TabsContent value="masterclass">
              <MasterclassSystem />
            </TabsContent>

            <TabsContent value="wellness">
              <ComprehensiveWellnessDashboard />
            </TabsContent>

            <TabsContent value="whitelabel">
              <WhiteLabelCustomization />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default PremiumPlusPage;
