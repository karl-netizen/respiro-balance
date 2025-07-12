
import React from 'react';
import { Helmet } from 'react-helmet';
import RitualHero from '@/components/morning-ritual/RitualHero';

const MorningRitualHeader: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Morning Ritual Builder | MindFlow</title>
        <meta name="description" content="Create and manage your personalized morning rituals for a mindful start to each day" />
      </Helmet>
      <RitualHero />
    </>
  );
};

export default MorningRitualHeader;
