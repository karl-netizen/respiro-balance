
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  audioUrl?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ audioUrl }) => {
  return (
    <div className="text-center p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
      <p className="mb-2">Failed to load audio. The audio file may not be accessible.</p>
      {audioUrl && (
        <div className="mb-3 text-xs break-all text-gray-500">
          <span className="font-medium">Audio URL:</span><br />
          {audioUrl}
        </div>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
