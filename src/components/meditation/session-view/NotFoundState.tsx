
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The meditation session you're looking for could not be found.
          </p>
          <Button onClick={() => navigate('/meditate')}>Return to Meditations</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundState;
