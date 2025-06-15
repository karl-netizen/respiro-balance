
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

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    screenSize: 'lg',
    brandSpacing: 'desktop',
    touchCapable: false,
    deviceType: 'desktop',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine screen size
      let screenSize: DeviceInfo['screenSize'] = 'sm';
      if (width >= BREAKPOINTS['2xl']) screenSize = '2xl';
      else if (width >= BREAKPOINTS.xl) screenSize = 'xl';
      else if (width >= BREAKPOINTS.lg) screenSize = 'lg';
      else if (width >= BREAKPOINTS.md) screenSize = 'md';
      else screenSize = 'sm';

      // Determine device type
      const isMobile = width < BREAKPOINTS.md;
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;

      // Determine orientation
      const orientation = height > width ? 'portrait' : 'landscape';

      // Check touch capability
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Determine device type for cleaner logic
      let deviceType: DeviceInfo['deviceType'] = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      // Determine brand spacing scale
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

    // Initial check
    updateDeviceInfo();

    // Add resize listener
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};
