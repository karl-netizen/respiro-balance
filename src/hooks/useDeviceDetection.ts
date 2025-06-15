
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
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initialize with current window dimensions if available
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < BREAKPOINTS.md;
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;
      
      let screenSize: DeviceInfo['screenSize'] = 'sm';
      if (width >= BREAKPOINTS['2xl']) screenSize = '2xl';
      else if (width >= BREAKPOINTS.xl) screenSize = 'xl';
      else if (width >= BREAKPOINTS.lg) screenSize = 'lg';
      else if (width >= BREAKPOINTS.md) screenSize = 'md';
      else screenSize = 'sm';
      
      const orientation = height > width ? 'portrait' : 'landscape';
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
    }
    
    // Fallback for SSR
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
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      console.log('Device detection - Window dimensions:', { width, height });
      
      // Determine device type based on width
      const isMobile = width < BREAKPOINTS.md; // < 768px
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg; // 768px - 1023px
      const isDesktop = width >= BREAKPOINTS.lg; // >= 1024px

      console.log('Device detection - Device types:', { isMobile, isTablet, isDesktop });
      
      // Determine screen size
      let screenSize: DeviceInfo['screenSize'] = 'sm';
      if (width >= BREAKPOINTS['2xl']) screenSize = '2xl';
      else if (width >= BREAKPOINTS.xl) screenSize = 'xl';
      else if (width >= BREAKPOINTS.lg) screenSize = 'lg';
      else if (width >= BREAKPOINTS.md) screenSize = 'md';
      else screenSize = 'sm';

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

      const newDeviceInfo = {
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize,
        brandSpacing,
        touchCapable,
        deviceType,
      };

      console.log('Device detection - Final device info:', newDeviceInfo);

      setDeviceInfo(newDeviceInfo);
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
