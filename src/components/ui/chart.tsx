
import React, { createContext, useContext, ReactNode } from 'react';

// Define the types for the chart configuration
export interface ChartConfig {
  [key: string]: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}

// Create a context to hold the chart configuration
const ChartContext = createContext<ChartConfig | undefined>(undefined);

export interface ChartContainerProps {
  children: ReactNode;
  className?: string;
  config: ChartConfig;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  className = '',
  config
}) => {
  return (
    <ChartContext.Provider value={config}>
      <div 
        className={className}
        style={Object.entries(config).reduce((styles, [key, value]) => ({
          ...styles,
          [`--color-${key}`]: value.theme.light
        }), {})}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
};

// Custom tooltip component that uses the chart config
export const ChartTooltipContent: React.FC<any> = (props) => {
  const { active, payload, label } = props;
  const config = useContext(ChartContext);
  
  if (!active || !payload || !payload.length || !config) {
    return null;
  }
  
  return (
    <div className="bg-popover/95 border rounded-md shadow-md p-2 text-sm">
      <p className="font-medium mb-1">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any) => {
          const dataKey = entry.dataKey;
          const color = config[dataKey]?.theme.light || entry.color;
          const displayName = config[dataKey]?.label || dataKey;
          
          return (
            <div key={dataKey} className="flex items-center">
              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: color }}></div>
              <span className="mr-2">{displayName}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ChartLegendContent: React.FC<any> = (props) => {
  const { payload } = props;
  const config = useContext(ChartContext);
  
  if (!payload || !payload.length || !config) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-2">
      {payload.map((entry: any) => {
        const dataKey = entry.dataKey;
        const color = config[dataKey]?.theme.light || entry.color;
        const displayName = config[dataKey]?.label || dataKey;
        
        return (
          <div key={dataKey} className="flex items-center">
            <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
            <span className="text-xs">{displayName}</span>
          </div>
        );
      })}
    </div>
  );
};

// Export the ChartTooltip for direct use
export const ChartTooltip = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-popover/95 border rounded-md shadow-md p-2">
      {children}
    </div>
  );
};

// Removed the duplicate export that was causing the error
