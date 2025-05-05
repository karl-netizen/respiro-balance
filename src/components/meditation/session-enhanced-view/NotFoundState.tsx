
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>
      
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Session Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The meditation session you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/meditate')}>
          Return to Meditation Library
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
