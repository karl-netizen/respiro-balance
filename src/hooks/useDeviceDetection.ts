
import { useState, useEffect } from 'react';

interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  touchCapable: boolean;
  screenSize: {
    width: number;
    height: number;
  };
  brandSpacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export const useDeviceDetection = (): DeviceDetection => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    touchCapable: false,
    screenSize: { width: window.innerWidth, height: window.innerHeight },
    brandSpacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '2rem'
    }
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        touchCapable,
        screenSize: { width, height },
        brandSpacing: {
          small: isMobile ? '0.25rem' : '0.5rem',
          medium: isMobile ? '0.5rem' : '1rem',
          large: isMobile ? '1rem' : '2rem'
        }
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};
