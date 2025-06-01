
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Activity, Settings, Headphones, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeditationAnalytics } from '@/components/meditation/analytics/MeditationAnalytics';
import { BiometricIntegration } from '@/components/meditation/biometrics/BiometricIntegration';
import { SessionPersonalization } from '@/components/meditation/sessions/SessionPersonalization';
import MeditationSessionView from '@/components/meditation/MeditationSessionView';

const MeditateAdvanced = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/meditation')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Meditation
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Advanced Meditation</h1>
                <p className="text-muted-foreground mt-2">
                  Deep insights, biometric integration, and personalized experiences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Focus: 85
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                Calm: 78
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="biometrics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Biometrics
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Personalization
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Session
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <MeditationAnalytics timeframe="week" />
          </TabsContent>

          <TabsContent value="biometrics">
            <BiometricIntegration />
          </TabsContent>

          <TabsContent value="personalization">
            <SessionPersonalization />
          </TabsContent>

          <TabsContent value="session">
            <MeditationSessionView sessionId="advanced-session" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MeditateAdvanced;
