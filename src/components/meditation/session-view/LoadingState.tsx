
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MobileLoadingState } from '@/components/ui/mobile-loading-states';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 flex justify-center items-center">
        <MobileLoadingState 
          variant="spinner" 
          title="Loading meditation session..." 
        />
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
