
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

export const useChartConfiguration = () => {
  const { deviceType } = useDeviceDetection();
  
  const getResponsiveConfig = () => {
    const isMobile = deviceType === 'mobile';
    const isSmallMobile = isMobile && window.innerWidth < 380;
    
    return {
      height: isMobile ? (isSmallMobile ? 180 : 220) : 280,
      margin: isMobile 
        ? { top: 5, right: 8, left: 0, bottom: isSmallMobile ? 40 : 30 }
        : { top: 10, right: 15, left: 5, bottom: 25 },
      barSize: isMobile ? (isSmallMobile ? 12 : 18) : 24,
      fontSize: isMobile ? (isSmallMobile ? 9 : 11) : 12,
      tickAngle: isMobile ? -45 : 0,
      showReferenceLine: !isSmallMobile
    };
  };

  const getFilteredData = (data: any[]) => {
    if (deviceType === 'mobile' && window.innerWidth < 380) {
      return data.filter((_, index) => index % 2 === 0);
    }
    return data;
  };

  return { getResponsiveConfig, getFilteredData };
};
