
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MeditationSessionPlayer, 
  BiometricDisplay,
  SessionRatingDialog
} from "@/components/meditation";
import { useMeditationLibrary } from "@/hooks/useMeditationLibrary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";

const MeditationSessionView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    sessions, 
    handleToggleFavorite, 
    isFavorite,
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating
  } = useMeditationLibrary();
  
  // Find the selected session
  const selectedSession = sessionId 
    ? sessions.find(session => session.id === sessionId) 
    : null;
  
  if (!selectedSession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
            <p className="mb-6 text-muted-foreground">The meditation session you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/meditate')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meditation Library
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleBackClick = () => {
    navigate('/meditate');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => handleToggleFavorite(selectedSession.id)}
              className={isFavorite(selectedSession.id) ? "text-red-500" : ""}
            >
              <Heart 
                className={`mr-2 h-5 w-5 ${
                  isFavorite(selectedSession.id) ? "fill-red-500" : ""
                }`} 
              />
              {isFavorite(selectedSession.id) ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">{selectedSession.title}</h1>
            <p className="text-muted-foreground">{selectedSession.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {selectedSession.duration} min
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                {selectedSession.level}
              </span>
              {selectedSession.tags?.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <MeditationSessionPlayer session={selectedSession} />
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Biometric Feedback</h2>
            <BiometricDisplay sessionId={selectedSession.id} />
          </div>
        </div>
        
        {showRatingDialog && (
          <SessionRatingDialog 
            isOpen={showRatingDialog}
            onClose={() => setShowRatingDialog(false)}
            onSubmit={(rating, feedback) => handleSubmitRating(selectedSession.id, rating, feedback)}
            session={selectedSession}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MeditationSessionView;
