
import React from 'react';
import { BalanceMeterCard } from './BalanceMeterCard';
import { BreakRemindersCard } from './BreakRemindersCard';
import { FocusModeCard } from './FocusModeCard';
import BiofeedbackCard from '@/components/biofeedback/BiofeedbackCard';

const WorkLifeBalanceSection = () => {
  return (
    <div className="space-y-12">
      {/* Main balance section - no specific ID needed */}
      <section className="mb-10">
        <BalanceMeterCard />
      </section>

      {/* Break reminders section with ID matching the navigation hash */}
      <section id="breaks" className="mb-10 pt-6">
        <h2 className="text-2xl font-semibold mb-6">Break Reminders</h2>
        <BreakRemindersCard />
      </section>

      {/* Focus mode section with ID matching the navigation hash */}
      <section id="focus" className="mb-10 pt-6">
        <h2 className="text-2xl font-semibold mb-6">Focus Mode</h2>
        <FocusModeCard />
      </section>

      {/* Biofeedback section with ID matching the navigation hash */}
      <section id="biofeedback" className="mb-10 pt-6">
        <h2 className="text-2xl font-semibold mb-6">Biofeedback Integration</h2>
        <BiofeedbackCard />
      </section>
    </div>
  );
};

export default WorkLifeBalanceSection;
