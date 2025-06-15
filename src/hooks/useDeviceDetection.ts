
import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  brandSpacing: 'mobile' | 'tablet' | 'desktop';
  touchCapable: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'landscape',
        screenSize: 'lg',
        brandSpacing: 'desktop',
        touchCapable: false,
        deviceType: 'desktop',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    
    let screenSize: DeviceInfo['screenSize'] = 'sm';
    if (width >= 1536) screenSize = '2xl';
    else if (width >= 1280) screenSize = 'xl';
    else if (width >= 1024) screenSize = 'lg';
    else if (width >= 768) screenSize = 'md';
    
    const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let deviceType: DeviceInfo['deviceType'] = 'desktop';
    if (isMobile) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';
    
    let brandSpacing: DeviceInfo['brandSpacing'] = 'desktop';
    if (isMobile) brandSpacing = 'mobile';
    else if (isTablet) brandSpacing = 'tablet';
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      orientation,
      screenSize,
      brandSpacing,
      touchCapable,
      deviceType,
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let screenSize: DeviceInfo['screenSize'] = 'sm';
      if (width >= 1536) screenSize = '2xl';
      else if (width >= 1280) screenSize = 'xl';
      else if (width >= 1024) screenSize = 'lg';
      else if (width >= 768) screenSize = 'md';

      const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      let deviceType: DeviceInfo['deviceType'] = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      let brandSpacing: DeviceInfo['brandSpacing'] = 'desktop';
      if (isMobile) brandSpacing = 'mobile';
      else if (isTablet) brandSpacing = 'tablet';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize,
        brandSpacing,
        touchCapable,
        deviceType,
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
