

import BreathePageContent from '@/components/breathing/components/BreathePageContent';
import { useBreathePageLogic } from './breathing/useBreathePageLogic';

const Breathe = () => {
  const {
    activeTab,
    initialTechnique,
    techniqueRefs,
    searchParams,
    handleTabClick,
    handleTechniqueSelect
  } = useBreathePageLogic();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <BreathePageContent 
          activeTab={activeTab}
          initialTechnique={initialTechnique}
          techniqueRefs={techniqueRefs}
          searchParams={searchParams}
          onTabClick={handleTabClick}
          onTechniqueSelect={handleTechniqueSelect}
        />
      </main>
    </div>
  );
};

export default Breathe;
