
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to the existing Meditate page
const MeditationPage = () => {
  return <Navigate to="/meditation" replace />;
};

export default MeditationPage;
