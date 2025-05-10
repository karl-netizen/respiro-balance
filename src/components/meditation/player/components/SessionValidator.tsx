
import React from 'react';
import { MeditationSession } from '@/types/meditation';

interface SessionValidatorProps {
  session: MeditationSession;
  children: (validatedSession: MeditationSession) => React.ReactNode;
}

const SessionValidator: React.FC<SessionValidatorProps> = ({ session, children }) => {
  // Ensure session has valid properties for rendering
  const validatedSession = {
    ...session,
    // Use default values for critical properties if they're missing
    image_url: session.image_url || '/images/meditations/default-meditation.jpg',
    icon: session.icon || '🧘'
  };

  return <>{children(validatedSession)}</>;
};

export default SessionValidator;
