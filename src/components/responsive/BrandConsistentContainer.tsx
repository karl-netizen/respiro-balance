
import React from 'react';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface BrandConsistentContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'small' | 'medium' | 'large';
}

export const BrandConsistentContainer: React.FC<BrandConsistentContainerProps> = ({
  children,
  className = '',
  spacing = 'medium'
}) => {
  const deviceInfo = useDeviceDetection();
  
  // Get spacing value based on device and spacing prop
  const getSpacing = () => {
    const spacingMap = {
      small: deviceInfo.brandSpacing.small,
      medium: deviceInfo.brandSpacing.medium,
      large: deviceInfo.brandSpacing.large
    };
    return spacingMap[spacing];
  };

  const containerStyle = {
    padding: getSpacing(),
    transition: 'all 0.3s ease',
  };

  return (
    <div 
      className={`brand-consistent-container ${className}`}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default BrandConsistentContainer;
