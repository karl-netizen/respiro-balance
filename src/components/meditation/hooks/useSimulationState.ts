
import { useState } from 'react';

export const useSimulationState = () => {
  const [simulationRunning, setSimulationRunning] = useState(true);
  
  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };
  
  return {
    simulationRunning,
    toggleSimulation
  };
};
