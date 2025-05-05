
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SessionHeaderProps {
  session: MeditationSession;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ session }) => {
  return (
    <CardHeader className="bg-gray-800 text-white border-b border-gray-700">
      <CardTitle className="text-2xl text-white">{session.title}</CardTitle>
      <CardDescription className="text-gray-300">{session.description}</CardDescription>
    </CardHeader>
  );
};

export default SessionHeader;
