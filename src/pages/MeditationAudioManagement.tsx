
import React from 'react';
import AudioFileManager from '@/components/meditation/admin/AudioFileManager';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MeditationAudioManagement = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
              Upload and manage audio files for your meditation sessions
            </p>
          </div>
          
          <AudioFileManager />
        </div>
      </main>
    </div>
  );
};

export default MeditationAudioManagement;
