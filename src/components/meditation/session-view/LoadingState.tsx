
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading meditation session...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
