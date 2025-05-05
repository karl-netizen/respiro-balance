
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
      <p className="mb-2">{error}</p>
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
