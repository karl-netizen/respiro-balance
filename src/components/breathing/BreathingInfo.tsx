
import React from 'react';
import { cn } from "@/lib/utils";

interface BreathingInfoProps {
  techniqueId: string;
  voiceEnabled: boolean;
}

const BreathingInfo: React.FC<BreathingInfoProps> = ({ techniqueId, voiceEnabled }) => {
  // Get technique-specific information
  const getTechniqueInfo = () => {
    switch (techniqueId) {
      case 'box':
        return {
          name: 'Box Breathing',
          description: 'A powerful technique used by Navy SEALs to calm the mind and reduce stress.',
          pattern: 'Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)',
          benefits: [
            'Reduces anxiety and stress',
            'Improves concentration and performance',
            'Helps regulate emotions'
          ],
          color: 'text-blue-700'
        };
      case '478':
        return {
          name: '4-7-8 Breathing',
          description: 'Developed by Dr. Andrew Weil, this technique helps calm the nervous system.',
          pattern: 'Inhale (4s) → Hold (7s) → Exhale (8s)',
          benefits: [
            'Promotes better sleep',
            'Reduces anxiety and stress',
            'Helps control cravings and impulses'
          ],
          color: 'text-indigo-700'
        };
      case 'coherent':
        return {
          name: 'Coherent Breathing',
          description: 'Balances your parasympathetic nervous system through rhythmic breathing.',
          pattern: 'Inhale (5s) → Exhale (5s)',
          benefits: [
            'Improves heart rate variability',
            'Enhances immune function',
            'Creates mental and emotional balance'
          ],
          color: 'text-teal-700'
        };
      case 'alternate':
        return {
          name: 'Alternate Nostril Breathing',
          description: 'An ancient yogic breath control practice that balances the hemispheres of the brain.',
          pattern: 'Inhale (4s) → Hold (4s) → Exhale (4s) → Rest (2s)',
          benefits: [
            'Balances left and right brain hemispheres',
            'Improves focus and mental clarity',
            'Reduces stress and anxiety'
          ],
          color: 'text-purple-700'
        };
      default:
        return {
          name: 'Breathing Technique',
          description: 'Follow the animation and sync your breath with the timer.',
          pattern: '',
          benefits: [],
          color: 'text-primary'
        };
    }
  };

  const info = getTechniqueInfo();

  return (
    <div className="w-full mt-4">
      <div className="bg-card border rounded-lg p-4">
        <h3 className={cn("font-bold mb-2", info.color)}>{info.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
        
        <h4 className="font-medium text-sm mb-1">Pattern:</h4>
        <p className="text-sm mb-4 bg-secondary/30 p-2 rounded-md font-mono">{info.pattern}</p>
        
        {info.benefits.length > 0 && (
          <>
            <h4 className="font-medium text-sm mb-1">Benefits:</h4>
            <ul className="text-sm list-disc list-inside text-muted-foreground">
              {info.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            {voiceEnabled ? 
              "Voice guidance is enabled. You'll hear cues for each breath phase." : 
              "Voice guidance is disabled. Turn on audio cues for a guided experience."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingInfo;
