
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkLifeBalanceSection from '@/components/work-life-balance';

const WorkLifeBalance = () => {
  const location = useLocation();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Handle scrolling to specific sections based on URL hash
  useEffect(() => {
    if (location.hash) {
      // Remove the # from the hash to get the target section id
      const targetId = location.hash.replace('#', '');
      
      // Small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Scroll to the target element
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // If no hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-grow">
        <div ref={sectionRef} className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Work-Life Balance</h1>
          <WorkLifeBalanceSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkLifeBalance;
