
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsTab: React.FC = () => {
  // Mock analytics data
  const heartRateData = [
    { time: '00:00', value: 72 },
    { time: '00:05', value: 75 },
    { time: '00:10', value: 68 },
    { time: '00:15', value: 70 },
    { time: '00:20', value: 74 },
    { time: '00:25', value: 69 },
    { time: '00:30', value: 71 }
  ];

  const stressData = [
    { time: '00:00', value: 45 },
    { time: '00:05', value: 42 },
    { time: '00:10', value: 38 },
    { time: '00:15', value: 35 },
    { time: '00:20', value: 32 },
    { time: '00:25', value: 28 },
    { time: '00:30', value: 25 }
  ];

  return (
    <div className="space-y-6">
      {/* Time Period Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Data & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">74 BPM</div>
              <div className="text-sm text-muted-foreground">Average Heart Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">42 ms</div>
              <div className="text-sm text-muted-foreground">Average HRV</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">18%</div>
              <div className="text-sm text-muted-foreground">Stress Reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Heart Rate (BPM)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stress Management Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Stress Level Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Stress Level (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Optimal Practice Window</h4>
              <p className="text-blue-700 text-sm">
                Your HRV is 23% higher during 7-9 AM sessions. Schedule important meditation then for better results.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Recovery Optimization</h4>
              <p className="text-green-700 text-sm">
                20-minute sessions show 40% better recovery. Extend your current 12-minute average to improve stress recovery.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Pattern Recognition</h4>
              <p className="text-purple-700 text-sm">
                Stress peaks Tuesday afternoons consistently. Try 10-minute Tuesday lunch meditation for 85% stress reduction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
