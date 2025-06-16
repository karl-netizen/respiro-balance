
import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ResponsiveChartProps {
  children: React.ReactElement;
  width?: string | number;
  height?: number;
  className?: string;
}

export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  children,
  width = "100%",
  height = 300,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default ResponsiveChart;
