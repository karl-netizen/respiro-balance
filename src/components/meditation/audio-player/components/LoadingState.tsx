
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="animate-pulse text-primary">Loading audio...</div>
    </div>
  );
};

export default LoadingState;
