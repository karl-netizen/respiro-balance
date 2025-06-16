
import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [touchCapable, setTouchCapable] = useState(false);
  const [brandSpacing, setBrandSpacing] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setTouchCapable(hasTouchScreen);
      
      if (width < 768) {
        setDeviceType('mobile');
        setBrandSpacing('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
        setBrandSpacing('tablet');
      } else {
        setDeviceType('desktop');
        setBrandSpacing('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return { 
    deviceType, 
    touchCapable, 
    brandSpacing 
  };
};
