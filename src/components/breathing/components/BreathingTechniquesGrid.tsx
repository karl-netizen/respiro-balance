
import React from 'react';
import TechniqueCard from './TechniqueCard';

interface BreathingTechniquesGridProps {
  selectedTechnique: string | null;
  techniqueRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>;
  onTechniqueSelect: (technique: string) => void;
}

const BreathingTechniquesGrid: React.FC<BreathingTechniquesGridProps> = ({
  selectedTechnique,
  techniqueRefs,
  onTechniqueSelect
}) => {
  const techniqueData = [
    {
      id: 'box',
      title: 'Box Breathing',
      subtitle: 'Equal inhale, hold, exhale, hold pattern',
      description: 'A technique used by Navy SEALs to calm the nervous system. Inhale for 4, hold for 4, exhale for 4, hold for 4.'
    },
    {
      id: '478',
      title: '4-7-8 Breathing',
      subtitle: 'Deep relaxation breathing pattern',
      description: 'Developed by Dr. Andrew Weil, this technique helps reduce anxiety. Inhale for 4, hold for 7, exhale for 8.'
    },
    {
      id: 'coherent',
      title: 'Coherent Breathing',
      subtitle: 'Balance your nervous system',
      description: 'Breathe at a rate of about 5-7 breaths per minute. Equal inhale and exhale duration to improve heart rate variability.'
    },
    {
      id: 'alternate',
      title: 'Alternate Nostril',
      subtitle: 'Balance left and right brain',
      description: 'A yogic breathing practice that helps balance the left and right hemispheres of the brain. Breathe through alternate nostrils in a specific pattern.'
    }
  ];

  // Always show all techniques when on the techniques tab
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {techniqueData.map(technique => (
        <TechniqueCard
          key={technique.id}
          technique={technique.id}
          isSelected={selectedTechnique === technique.id}
          title={technique.title}
          subtitle={technique.subtitle}
          description={technique.description}
          forwardedRef={(el) => techniqueRefs.current[technique.id] = el}
          onClick={() => onTechniqueSelect(technique.id)}
        />
      ))}
    </div>
  );
};

export default BreathingTechniquesGrid;
