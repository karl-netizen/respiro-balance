

import { Navigate } from 'react-router-dom';

// Redirect to the existing breathing exercise page
const BreathingExercisesPage = () => {
  return <Navigate to="/breathing" replace />;
};

export default BreathingExercisesPage;
