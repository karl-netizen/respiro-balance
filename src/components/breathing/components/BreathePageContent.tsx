
import React from 'react';
import { Wind } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BreathingVisualizer from '@/components/breathing/BreathingVisualizer';
import BreathingTechniquesGrid from './BreathingTechniquesGrid';

interface BreathePageContentProps {
  activeTab: string;
  initialTechnique: string | null;
  techniqueRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>;
  searchParams: URLSearchParams;
  onTabClick: (tab: string) => void;
  onTechniqueSelect: (technique: string) => void;
}

const BreathePageContent: React.FC<BreathePageContentProps> = ({
  activeTab,
  initialTechnique,
  techniqueRefs,
  searchParams,
  onTabClick,
  onTechniqueSelect
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Breathing Exercises</h1>
      <p className="text-lg text-center text-muted-foreground mb-8">
        Mindful breathing exercises to reduce stress and increase focus
      </p>
      
      <Tabs value={activeTab} onValueChange={(value) => onTabClick(value)} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="exercises" onClick={() => onTabClick('exercises')}>
            <Wind className="mr-2 h-4 w-4" />
            Breathing Exercises
          </TabsTrigger>
          <TabsTrigger value="techniques" onClick={() => onTabClick('techniques')}>
            <Wind className="mr-2 h-4 w-4" />
            Breathing Techniques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-8">
          <BreathingVisualizer 
            selectedTechnique={initialTechnique || undefined} 
          />
        </TabsContent>
        
        <TabsContent value="techniques" className="space-y-8">
          <BreathingTechniquesGrid 
            selectedTechnique={searchParams.get('technique')}
            techniqueRefs={techniqueRefs}
            onTechniqueSelect={onTechniqueSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BreathePageContent;
