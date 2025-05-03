
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SessionHeaderProps {
  session: MeditationSession;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ session }) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl">{session.title}</CardTitle>
      <CardDescription>{session.description}</CardDescription>
    </CardHeader>
  );
};

export default SessionHeader;
