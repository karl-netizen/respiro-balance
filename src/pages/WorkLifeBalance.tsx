
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkLifeBalanceSection from '@/components/work-life-balance';

const WorkLifeBalance = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Work-Life Balance</h1>
          <WorkLifeBalanceSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkLifeBalance;
