
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  LoadingState,
  NotFoundState,
  SessionMetadata,
  SessionDetails,
  SessionSidebar,
  useEnhancedSession
} from './session-enhanced-view';

export const EnhancedMeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, isLoading, handleSessionComplete } = useEnhancedSession(sessionId);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!session) {
    return <NotFoundState />;
  }
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
      <SessionMetadata session={session} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <SessionDetails session={session} handleSessionComplete={handleSessionComplete} />
        <SessionSidebar session={session} />
      </div>
    </div>
  );
};

export default EnhancedMeditationSessionView;
