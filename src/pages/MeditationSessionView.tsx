
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Calendar, Award, Heart } from "lucide-react";
import { 
  MeditationSessionPlayer, 
  SessionRatingDialog, 
  BiometricDisplay 
} from "@/components/meditation";
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useToast } from '@/components/ui/use-toast';

const MeditationSessionView = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { meditationSessions } = useMeditationSessions();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(false);
  
  // Find the session by ID
  const session = sessionId ? 
    meditationSessions.find(s => s.id === sessionId) : 
    undefined;
  
  useEffect(() => {
    if (!session && sessionId) {
      toast({
        title: "Session not found",
        description: `No meditation session with ID ${sessionId} was found.`,
        variant: "destructive"
      });
      navigate('/meditate');
    }
  }, [session, sessionId, navigate, toast]);
  
  const handleSessionComplete = () => {
    setIsRatingDialogOpen(true);
    // Additional logic for session completion if needed
  };
  
  const handleRatingSubmit = (rating: number, feedback: string) => {
    toast({
      title: "Thanks for your feedback!",
      description: `You rated this session ${rating} stars.`
    });
    setIsRatingDialogOpen(false);
  };
  
  const toggleBiometrics = () => {
    setShowBiometrics(prev => !prev);
  };
  
  if (!session) {
    return null; // Return null while checking for the session
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex items-center text-foreground/70 hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">{session.title}</h1>
            <p className="text-foreground/70 max-w-2xl mb-6">{session.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-foreground/70">
                <Clock className="mr-2 h-4 w-4" />
                <span>{session.duration} minutes</span>
              </div>
              <div className="flex items-center text-foreground/70">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{session.category}</span>
              </div>
              <div className="flex items-center text-foreground/70">
                <Award className="mr-2 h-4 w-4" />
                <span>{session.level}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MeditationSessionPlayer 
                session={session} 
                onComplete={handleSessionComplete} 
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {session.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                <p className="text-foreground/70 mb-4">{session.additionalInfo}</p>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={toggleBiometrics}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {showBiometrics ? "Hide Biometrics" : "Show Biometrics"}
                </Button>
              </div>
            </div>
          </div>
          
          {showBiometrics && (
            <div className="mt-8">
              <BiometricDisplay sessionData={session} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <SessionRatingDialog 
        isOpen={isRatingDialogOpen} 
        onClose={() => setIsRatingDialogOpen(false)} 
        onRatingSubmit={handleRatingSubmit}
        sessionId={session.id}
      />
    </div>
  );
};

export default MeditationSessionView;
