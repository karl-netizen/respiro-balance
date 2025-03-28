
import React from 'react';

const ProgressHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Progress</h1>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
            Track your meditation journey, monitor your improvements, and celebrate your achievements.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgressHero;
