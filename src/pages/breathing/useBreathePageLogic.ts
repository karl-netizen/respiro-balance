
import { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export const useBreathePageLogic = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'exercises';
  const initialTechnique = searchParams.get('technique');
  const [activeTab, setActiveTab] = useState(initialTab);
  
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

  return {
    activeTab,
    initialTechnique,
    techniqueRefs,
    searchParams,
    handleTabChange,
    handleTechniqueSelect,
    handleTabClick
  };
};
