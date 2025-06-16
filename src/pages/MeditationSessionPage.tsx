
import React from 'react';
import { useParams } from 'react-router-dom';
import MeditationSessionView from '@/pages/MeditationSessionView';

const MeditationSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Session not found</div>;
  }

  return <MeditationSessionView />;
};

export default MeditationSessionPage;
