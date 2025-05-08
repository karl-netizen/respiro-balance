
import React from 'react';

interface ConnectionPromptProps {
  isMonitoring: boolean;
}

export const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({ isMonitoring }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {isMonitoring ? (
        <p>Waiting for biometric data...</p>
      ) : (
        <p>Start monitoring to see biometric data</p>
      )}
    </div>
  );
};
