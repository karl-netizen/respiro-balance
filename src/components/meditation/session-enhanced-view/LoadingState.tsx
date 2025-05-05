
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoadingState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/meditate')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>
      
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg mb-4" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
