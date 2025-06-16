
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabsContainerProps {
  data: any;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate mock historical data for demonstration
  const generateHistoricalData = () => {
    const now = Date.now();
    const dataCount = isMobile ? 10 : 20; // Fewer points on mobile
    return Array.from({ length: dataCount }, (_, i) => ({
      time: new Date(now - (dataCount - 1 - i) * 60000).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      heartRate: (data?.heartRate || 72) + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 4,
      stress: (data?.stress || 25) + Math.cos(i * 0.3) * 15 + (Math.random() - 0.5) * 8,
      coherence: ((data?.coherence || 0.8) + Math.sin(i * 0.4) * 0.2) * 100
    }));
  };

  const chartData = generateHistoricalData();
  const chartHeight = isMobile ? 200 : 300;

  // Chart configurations for mobile navigation
  const charts = [
    {
      title: 'Heart Rate',
      dataKey: 'heartRate',
      color: '#ef4444',
      unit: 'BPM'
    },
    {
      title: 'Stress Level',
      dataKey: 'stress',
      color: '#f97316',
      unit: '%'
    },
    {
      title: 'Coherence',
      dataKey: 'coherence',
      color: '#22c55e',
      unit: '%'
    }
  ];

  const nextChart = () => {
    setCurrentChartIndex((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentChartIndex((prev) => (prev - 1 + charts.length) % charts.length);
  };

  const renderChart = (dataKey: string, color: string, name: string) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={chartData}
        margin={{ 
          top: 5, 
          right: isMobile ? 5 : 30, 
          left: isMobile ? 5 : 20, 
          bottom: isMobile ? 20 : 5 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          fontSize={isMobile ? 10 : 12}
          tick={{ fontSize: isMobile ? 10 : 12 }}
          interval={isMobile ? 2 : 1}
        />
        <YAxis 
          fontSize={isMobile ? 10 : 12}
          tick={{ fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 30 : 40}
        />
        <Tooltip 
          contentStyle={{
            fontSize: isMobile ? '12px' : '14px',
            padding: isMobile ? '8px' : '12px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={isMobile ? 2 : 2}
          name={name}
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Tabs defaultValue="realtime" className="w-full">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} mb-4`}>
        <TabsTrigger value="realtime" className="text-xs sm:text-sm min-h-[44px]">
          Real-time
        </TabsTrigger>
        <TabsTrigger value="trends" className="text-xs sm:text-sm min-h-[44px]">
          Trends
        </TabsTrigger>
        {!isMobile && (
          <TabsTrigger value="insights" className="text-xs sm:text-sm min-h-[44px]">
            Insights
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="realtime" className="space-y-4">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-sm sm:text-base flex items-center justify-between">
              <span>Live Heart Rate Variability</span>
              {isMobile && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevChart}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs">
                    {currentChartIndex + 1}/{charts.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextChart}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div style={{ height: chartHeight }} className="w-full">
              {isMobile ? (
                renderChart(
                  charts[currentChartIndex].dataKey,
                  charts[currentChartIndex].color,
                  charts[currentChartIndex].title
                )
              ) : (
                renderChart('heartRate', '#ef4444', 'Heart Rate')
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-sm sm:text-base">Stress & Coherence Trends</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div style={{ height: chartHeight }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ 
                    top: 5, 
                    right: isMobile ? 5 : 30, 
                    left: isMobile ? 5 : 20, 
                    bottom: isMobile ? 20 : 5 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    fontSize={isMobile ? 10 : 12}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    interval={isMobile ? 2 : 1}
                  />
                  <YAxis 
                    fontSize={isMobile ? 10 : 12}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip 
                    contentStyle={{
                      fontSize: isMobile ? '12px' : '14px',
                      padding: isMobile ? '8px' : '12px',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="#f97316" 
                    strokeWidth={isMobile ? 2 : 2}
                    name="Stress Level"
                    dot={false}
                    activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="coherence" 
                    stroke="#22c55e" 
                    strokeWidth={isMobile ? 2 : 2}
                    name="Coherence"
                    dot={false}
                    activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="insights" className="space-y-4">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-sm sm:text-base">Biometric Insights</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="h-4 w-4 sm:h-5 sm:w-5 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-green-800 text-sm sm:text-base">Optimal Recovery State</h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    Your current heart rate variability indicates excellent recovery readiness.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-blue-800 text-sm sm:text-base">Stress Management</h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Low stress levels detected. Great time for focused work or meditation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
