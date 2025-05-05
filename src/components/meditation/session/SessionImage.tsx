
import React from 'react';
import { MeditationSession } from '@/types/meditation';

interface SessionImageProps {
  session: MeditationSession;
}

const SessionImage: React.FC<SessionImageProps> = ({ session }) => {
  // Default fallback icon if no image
  const defaultIcon = session.icon || '🧘';
  
  // Handle image error by showing the default icon
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement?.classList.add('fallback-active');
  };

  return (
    <div 
      className="h-48 bg-respiro-dark rounded-md flex items-center justify-center relative overflow-hidden border-2 border-white"
    >
      {session.image_url && (
        <img 
          src={session.image_url} 
          alt={session.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      )}
      <div className={`absolute inset-0 flex items-center justify-center ${session.image_url ? 'hidden fallback' : ''}`}>
        <div className="text-6xl bg-respiro-dark bg-opacity-70 p-4 rounded-full">{defaultIcon}</div>
      </div>
    </div>
  );
};

export default SessionImage;
