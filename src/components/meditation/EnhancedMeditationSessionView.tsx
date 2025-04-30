
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, User, Tag, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import MeditationAudioPlayer from './MeditationAudioPlayer';
import { MeditationSession } from '@/types/meditation';

// Updated to use the central MeditationSession type
interface MeditationSessionData extends MeditationSession {
  isFeatured?: boolean;
}

export const EnhancedMeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<MeditationSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        navigate('/meditate');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // This is a mock implementation - in a real app you would fetch from an API
        const mockSession: MeditationSessionData = {
          id: sessionId,
          title: "Mindful Breathing",
          description: "A guided session focused on mindful breathing techniques.",
          duration: 15,
          audio_url: "/meditations/mindful-breathing.mp3",
          image_url: "/images/meditation-background.jpg",
          category: "guided",
          session_type: "guided",
          tags: ["breathing", "beginner", "relaxation"],
          level: "beginner",
          instructor: "Sarah Johnson",
          isFeatured: true
        };
        
        setSession(mockSession);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load meditation session');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId, navigate]);
  
  const handleSessionComplete = () => {
    toast.success('Meditation session completed! Great job!');
    // Here you could track completion, update stats, etc.
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Session Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The meditation session you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/meditate')}>
            Return to Meditation Library
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatDuration(session.duration)}
          </span>
        </div>
        
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {session.instructor}
          </span>
        </div>
        
        {session.category && (
          <Badge variant="outline" className="font-normal">
            {session.category}
          </Badge>
        )}
        
        {session.isFeatured && (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Award className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">{session.description}</p>
              
              {session.tags && session.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {session.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {session.audio_url ? (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Meditation Audio</h3>
                <MeditationAudioPlayer 
                  audioUrl={session.audio_url} 
                  onComplete={handleSessionComplete}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">
                  This meditation session doesn't have audio yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              {session.image_url ? (
                <img 
                  src={session.image_url} 
                  alt={session.title} 
                  className="w-full h-auto rounded-md mb-4"
                />
              ) : (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p>{formatDuration(session.duration)}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Instructor</h3>
                  <p>{session.instructor}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Category</h3>
                  <p>{session.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMeditationSessionView;
