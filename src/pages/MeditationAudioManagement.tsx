
import React from 'react';
import AudioFileManager from '@/components/meditation/admin/AudioFileManager';
import { AudioManagementDashboard } from '@/components/admin/AudioManagementDashboard';
import { ArrowLeft, Music, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const MeditationAudioManagement = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/meditation')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meditation Library
            </Button>
            
            <h1 className="text-3xl font-bold">Meditation Audio Management</h1>
            <p className="text-muted-foreground mt-2">
              Complete audio management system with MP4 support for your meditation content
            </p>
          </div>
          
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="manager" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                File Manager
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <AudioManagementDashboard />
            </TabsContent>
            
            <TabsContent value="manager">
              <AudioFileManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MeditationAudioManagement;
