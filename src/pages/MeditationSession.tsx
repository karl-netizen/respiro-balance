
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meditationSessions } from '@/data/meditationSessions';
import MeditationSessionPlayer from '@/components/meditation/MeditationSessionPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';

const MeditationSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const { hasExceededUsageLimit, isPremium } = useSubscriptionContext();
  const { startSession, completeSession } = useMeditationSessions();
  const [sessionDbId, setSessionDbId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!sessionId) {
      navigate('/meditate');
      return;
    }
    
    const foundSession = meditationSessions.find(s => s.id === sessionId);
    if (!foundSession) {
      toast.error('Meditation session not found');
      navigate('/meditate');
      return;
    }
    
    setSession(foundSession);
  }, [sessionId, navigate]);
  
  const handleSessionStart = async () => {
    if (hasExceededUsageLimit && !isPremium) {
      toast.error('You have reached your monthly meditation limit. Please upgrade to continue.');
      return;
    }
    
    try {
      const dbSessionId = await startSession({
        sessionType: session.category,
        duration: session.duration
      });
      
      if (dbSessionId) {
        setSessionDbId(dbSessionId);
        toast.success('Session started');
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('Failed to start session');
    }
  };
  
  const handleSessionComplete = async () => {
    if (!sessionDbId) return;
    
    try {
      await completeSession(sessionDbId);
      toast.success('Session completed! Great job!');
    } catch (error) {
      console.error('Failed to complete session:', error);
      toast.error('Failed to record session completion');
    }
  };
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <main className="container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{session.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="text-sm">{session.duration} min</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    <span className="text-sm">{session.instructor}</span>
                  </div>
                  <Badge variant="outline">{session.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{session.description}</p>
                
                <MeditationSessionPlayer
                  session={session}
                  onStart={handleSessionStart}
                  onComplete={handleSessionComplete}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/meditate')}>
                  Return to Library
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {session.benefits?.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                      <span>{benefit}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                        <span>Reduces stress and anxiety</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                        <span>Improves focus and concentration</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                        <span>Promotes emotional well-being</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeditationSession;
