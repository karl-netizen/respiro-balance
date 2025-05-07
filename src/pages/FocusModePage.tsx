
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FocusProvider } from '@/context/FocusProvider';
import FocusMode from '@/components/focus-mode/FocusMode';
import { FocusAchievements } from '@/components/focus-mode/FocusAchievements';
import { FocusInsights } from '@/components/focus-mode/FocusInsights';

const FocusModePage: React.FC = () => {
  return (
    <FocusProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Focus Mode</h1>
            <p className="text-muted-foreground mb-6">
              Manage your focus sessions with the Pomodoro Technique
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <FocusMode />
              </div>
              
              <div>
                <FocusAchievements />
              </div>
            </div>
            
            <div className="mt-8">
              <FocusInsights />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </FocusProvider>
  );
};

export default FocusModePage;
