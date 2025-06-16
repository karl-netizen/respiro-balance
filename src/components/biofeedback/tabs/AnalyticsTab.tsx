
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDataSet, setCurrentDataSet] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock analytics data with fewer points for mobile
  const generateData = (baseValue: number, variance: number) => {
    const points = isMobile ? 7 : 12;
    return Array.from({ length: points }, (_, i) => ({
      time: isMobile ? 
        `${String(i * 5).padStart(2, '0')}:00` : 
        `${String(i * 2).padStart(2, '0')}:${String((i % 2) * 30).padStart(2, '0')}`,
      value: baseValue + Math.sin(i * 0.5) * variance + (Math.random() - 0.5) * (variance * 0.3)
    }));
  };

  const dataSets = [
    {
      name: 'Heart Rate',
      data: generateData(72, 8),
      color: '#ef4444',
      unit: 'BPM'
    },
    {
      name: 'Stress Level',
      data: generateData(35, 12),
      color: '#f97316',
      unit: '%'
    },
    {
      name: 'HRV',
      data: generateData(45, 10),
      color: '#3b82f6',
      unit: 'ms'
    }
  ];

  const nextDataSet = () => {
    setCurrentDataSet((prev) => (prev + 1) % dataSets.length);
  };

  const prevDataSet = () => {
    setCurrentDataSet((prev) => (prev - 1 + dataSets.length) % dataSets.length);
  };

  // Responsive chart configuration
  const chartHeight = isMobile ? 200 : 300;
  const fontSize = isMobile ? 10 : 12;

  const renderChart = (data: any[], color: string, name: string) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data}
        margin={{ 
          top: 5, 
          right: isMobile ? 5 : 30, 
          left: isMobile ? 5 : 20, 
          bottom: isMobile ? 20 : 5 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
        <XAxis 
          dataKey="time" 
          fontSize={fontSize}
          tick={{ fontSize }}
          interval={isMobile ? 1 : 0}
          height={isMobile ? 40 : 50}
        />
        <YAxis 
          fontSize={fontSize}
          tick={{ fontSize }}
          width={isMobile ? 35 : 50}
        />
        <Tooltip 
          contentStyle={{
            fontSize: isMobile ? '12px' : '14px',
            padding: isMobile ? '8px' : '12px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          formatter={(value: any) => [
            typeof value === 'number' ? value.toFixed(1) : value,
            name
          ]}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={isMobile ? 2.5 : 3}
          name={name}
          dot={false}
          activeDot={{ 
            r: isMobile ? 5 : 6, 
            strokeWidth: 0,
            fill: color
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">74</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg Heart Rate</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">42</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg HRV (ms)</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">18%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Stress Reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg flex items-center justify-between">
            <span>
              {isMobile ? dataSets[currentDataSet].name : 'Biometric Trends'}
            </span>
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevDataSet}
                  className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">
                  {currentDataSet + 1}/{dataSets.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextDataSet}
                  className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div style={{ height: chartHeight }} className="w-full touch-manipulation">
            {isMobile ? (
              renderChart(
                dataSets[currentDataSet].data,
                dataSets[currentDataSet].color,
                dataSets[currentDataSet].name
              )
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={dataSets[0].data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    fontSize={fontSize}
                    tick={{ fontSize }}
                  />
                  <YAxis 
                    fontSize={fontSize}
                    tick={{ fontSize }}
                  />
                  <Tooltip 
                    contentStyle={{
                      fontSize: '14px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  {dataSets.map((dataset, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey="value"
                      data={dataset.data}
                      stroke={dataset.color}
                      strokeWidth={2}
                      name={dataset.name}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {/* Mobile Data Navigation Dots */}
          {isMobile && (
            <div className="flex justify-center mt-4 space-x-2">
              {dataSets.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    index === currentDataSet ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentDataSet(index)}
                >
                  <span className="sr-only">Go to chart {index + 1}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-green-800 text-sm sm:text-base">Improving Trend</h4>
                <p className="text-xs sm:text-sm text-green-700">
                  Your stress levels have decreased by 18% over the past week.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-blue-800 text-sm sm:text-base">Optimal Session Time</h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  Your best meditation sessions occur between 9-11 AM.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-purple-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-purple-800 text-sm sm:text-base">Recovery Pattern</h4>
                <p className="text-xs sm:text-sm text-purple-700">
                  Your HRV recovery is strongest after 15-minute sessions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
