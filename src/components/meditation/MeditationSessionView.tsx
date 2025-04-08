
import React from 'react';
import { Button } from "@/components/ui/button";
import { MeditationSession } from './MeditationSessionCard';
import { SessionRatingDialog } from "@/components/meditation";
import MeditationSessionPlayer from './MeditationSessionPlayer';
import { getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';

interface MeditationSessionViewProps {
  selectedSession: MeditationSession;
  onBackToLibrary: () => void;
  handleToggleFavorite: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  showRatingDialog: boolean;
  setShowRatingDialog: (show: boolean) => void;
  handleSubmitRating: (sessionId: string, rating: number, feedback: string) => void;
}

const MeditationSessionView: React.FC<MeditationSessionViewProps> = ({
  selectedSession,
  onBackToLibrary,
  handleToggleFavorite,
  isFavorite,
  showRatingDialog,
  setShowRatingDialog,
  handleSubmitRating
}) => {
  // Handle session completion
  const handleSessionComplete = () => {
    if (handleSubmitRating) {
      setShowRatingDialog(true);
    }
  };

  return (
    <section className="py-12 px-6" id="player">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBackToLibrary}
            className="mb-4"
          >
            ← Back to Library
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{selectedSession.title}</h2>
              <p className="text-foreground/70 mt-2">{selectedSession.description}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleToggleFavorite(selectedSession)}
            >
              {isFavorite(selectedSession.id) ? (
                <span className="text-red-500">❤</span>
              ) : (
                <span>♡</span>
              )}
            </Button>
          </div>
        </div>
        
        <MeditationSessionPlayer 
          session={selectedSession} 
          onComplete={handleSessionComplete}
        />
        
        {showRatingDialog && selectedSession && (
          <SessionRatingDialog
            isOpen={showRatingDialog}
            onClose={() => setShowRatingDialog(false)}
            sessionId={selectedSession.id}
            sessionTitle={selectedSession.title}
            onSubmitRating={handleSubmitRating}
          />
        )}
      </div>
    </section>
  );
};

export default MeditationSessionView;
