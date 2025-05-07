
import React, { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreathingVisualizer from '@/components/breathing/BreathingVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Wind } from 'lucide-react';

const Breathe = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'exercises';
  const initialTechnique = searchParams.get('technique');
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const techniqueRefs = useRef<{[key: string]: HTMLDivElement | null}>({
    'box': null,
    '478': null,
    'coherent': null,
    'alternate': null
  });
  
  // Handle URL parameters and tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    const technique = searchParams.get('technique');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    // If a technique is specified, scroll to it after a small delay
    if (technique && techniqueRefs.current[technique] && tab === 'techniques') {
      setTimeout(() => {
        techniqueRefs.current[technique]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [searchParams]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL when tab changes
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    
    // Remove technique parameter if changing away from techniques tab
    if (value !== 'techniques') {
      newParams.delete('technique');
    }
    
    setSearchParams(newParams);
  };
  
  const handleTechniqueSelect = (technique: string) => {
    // Update URL when technique changes
    const newParams = new URLSearchParams(searchParams);
    newParams.set('technique', technique);
    if (activeTab !== 'techniques') {
      newParams.set('tab', 'techniques');
      setActiveTab('techniques');
    }
    setSearchParams(newParams);
    
    // Scroll to the selected technique
    setTimeout(() => {
      techniqueRefs.current[technique]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  // Reset technique when switching to techniques tab
  const handleTabClick = (tab: string) => {
    if (tab === 'techniques') {
      // If we're already on the techniques tab with a technique selected,
      // clear the technique parameter to show all techniques
      if (activeTab === 'techniques' && searchParams.has('technique')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('technique');
        setSearchParams(newParams);
      }
    }
    handleTabChange(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Breathing Exercises</h1>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Mindful breathing exercises to reduce stress and increase focus
          </p>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="exercises" onClick={() => handleTabClick('exercises')}>
                <Wind className="mr-2 h-4 w-4" />
                Breathing Exercises
              </TabsTrigger>
              <TabsTrigger value="techniques" onClick={() => handleTabClick('techniques')}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Only show the techniques if no specific one is selected, or show only the selected one */}
                {(!searchParams.get('technique') || searchParams.get('technique') === 'box') && (
                  <Card 
                    ref={el => techniqueRefs.current['box'] = el}
                    className={`cursor-pointer transition-all ${searchParams.get('technique') === 'box' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleTechniqueSelect('box')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Wind className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">Box Breathing</h3>
                          <p className="text-muted-foreground">Equal inhale, hold, exhale, hold pattern</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        A technique used by Navy SEALs to calm the nervous system. 
                        Inhale for 4, hold for 4, exhale for 4, hold for 4.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {(!searchParams.get('technique') || searchParams.get('technique') === '478') && (
                  <Card 
                    ref={el => techniqueRefs.current['478'] = el}
                    className={`cursor-pointer transition-all ${searchParams.get('technique') === '478' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleTechniqueSelect('478')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Wind className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">4-7-8 Breathing</h3>
                          <p className="text-muted-foreground">Deep relaxation breathing pattern</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        Developed by Dr. Andrew Weil, this technique helps reduce anxiety.
                        Inhale for 4, hold for 7, exhale for 8.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {(!searchParams.get('technique') || searchParams.get('technique') === 'coherent') && (
                  <Card 
                    ref={el => techniqueRefs.current['coherent'] = el}
                    className={`cursor-pointer transition-all ${searchParams.get('technique') === 'coherent' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleTechniqueSelect('coherent')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Wind className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">Coherent Breathing</h3>
                          <p className="text-muted-foreground">Balance your nervous system</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        Breathe at a rate of about 5-7 breaths per minute.
                        Equal inhale and exhale duration to improve heart rate variability.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {(!searchParams.get('technique') || searchParams.get('technique') === 'alternate') && (
                  <Card 
                    ref={el => techniqueRefs.current['alternate'] = el}
                    className={`cursor-pointer transition-all ${searchParams.get('technique') === 'alternate' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleTechniqueSelect('alternate')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Wind className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">Alternate Nostril</h3>
                          <p className="text-muted-foreground">Balance left and right brain</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        A yogic breathing practice that helps balance the left and right hemispheres of the brain.
                        Breathe through alternate nostrils in a specific pattern.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Breathe;
