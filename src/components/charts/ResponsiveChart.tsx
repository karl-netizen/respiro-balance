
import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import usePerformanceOptimization from '@/hooks/usePerformanceOptimization';

interface ResponsiveChartProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
}

export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  children,
  height,
  className
}) => {
  const { deviceType } = useDeviceDetection();
  const { getChartOptimizations } = usePerformanceOptimization();
  
  const optimizations = getChartOptimizations();

  const getResponsiveHeight = () => {
    if (height) return height;
    
    switch (deviceType) {
      case 'mobile':
        return 200;
      case 'tablet':
        return 300;
      default:
        return 400;
    }
  };

  const getResponsiveMargins = () => {
    switch (deviceType) {
      case 'mobile':
        return { top: 5, right: 10, left: 10, bottom: 5 };
      case 'tablet':
        return { top: 10, right: 15, left: 15, bottom: 10 };
      default:
        return { top: 20, right: 30, left: 20, bottom: 5 };
    }
  };

  return (
    <div className={className}>
      <ResponsiveContainer 
        width="100%" 
        height={getResponsiveHeight()}
        margin={getResponsiveMargins()}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
};

// Common responsive chart components
export const ResponsiveXAxis: React.FC<any> = (props) => {
  const { deviceType } = useDeviceDetection();
  
  const getTickProps = () => {
    switch (deviceType) {
      case 'mobile':
        return { fontSize: 10, interval: 'preserveStartEnd' };
      case 'tablet':
        return { fontSize: 11, interval: 'preserveStartEnd' };
      default:
        return { fontSize: 12 };
    }
  };

  return <XAxis {...getTickProps()} {...props} />;
};

export const ResponsiveYAxis: React.FC<any> = (props) => {
  const { deviceType } = useDeviceDetection();
  
  const getTickProps = () => {
    switch (deviceType) {
      case 'mobile':
        return { fontSize: 10, width: 30 };
      case 'tablet':
        return { fontSize: 11, width: 40 };
      default:
        return { fontSize: 12, width: 50 };
    }
  };

  return <YAxis {...getTickProps()} {...props} />;
};

export const ResponsiveTooltip: React.FC<any> = (props) => {
  const { deviceType } = useDeviceDetection();
  
  const getTooltipStyle = () => {
    switch (deviceType) {
      case 'mobile':
        return { 
          fontSize: '12px',
          padding: '8px',
          maxWidth: '200px'
        };
      case 'tablet':
        return { 
          fontSize: '13px',
          padding: '10px',
          maxWidth: '250px'
        };
      default:
        return { 
          fontSize: '14px',
          padding: '12px'
        };
    }
  };

  return <Tooltip contentStyle={getTooltipStyle()} {...props} />;
};

export const ResponsiveLegend: React.FC<any> = (props) => {
  const { deviceType } = useDeviceDetection();
  
  const getLegendProps = () => {
    switch (deviceType) {
      case 'mobile':
        return { 
          iconSize: 8,
          fontSize: 10,
          wrapperStyle: { fontSize: '10px' }
        };
      case 'tablet':
        return { 
          iconSize: 10,
          fontSize: 11,
          wrapperStyle: { fontSize: '11px' }
        };
      default:
        return { 
          iconSize: 12,
          fontSize: 12
        };
    }
  };

  return <Legend {...getLegendProps()} {...props} />;
};
