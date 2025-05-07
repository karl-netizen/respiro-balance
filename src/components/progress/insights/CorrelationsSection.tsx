
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MeditationStats } from '../types/meditationStats';
import { BiometricData } from "@/components/meditation/types/BiometricTypes";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface CorrelationsSectionProps {
  meditationStats: MeditationStats;
  biometricData?: BiometricData[];
}

const CorrelationsSection: React.FC<CorrelationsSectionProps> = ({ meditationStats, biometricData }) => {
  // Generate correlation data (mocked)
  const generateCorrelationData = () => {
    return Array.from({ length: 30 }, (_, i) => {
      const hadMeditation = i % 3 === 0;
      const focusScore = hadMeditation 
        ? 75 + Math.floor(Math.random() * 15) 
        : 55 + Math.floor(Math.random() * 20);
      const stressScore = hadMeditation
        ? 30 + Math.floor(Math.random() * 20)
        : 50 + Math.floor(Math.random() * 30);
        
      return {
        day: `Day ${i + 1}`,
        meditation: hadMeditation ? 1 : 0,
        focus: focusScore,
        stress: stressScore
      };
    });
  };
  
  const correlationData = generateCorrelationData();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meditation and Wellbeing Correlations</CardTitle>
          <CardDescription>
            See how your meditation practice correlates with focus and stress levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mt-2">
            <ChartContainer 
              className="w-full h-full" 
              config={{
                focus: { 
                  label: "Focus Score", 
                  theme: { light: "#3b82f6", dark: "#60a5fa" } 
                },
                stress: { 
                  label: "Stress Level", 
                  theme: { light: "#ef4444", dark: "#f87171" } 
                },
                meditation: {
                  label: "Meditation",
                  theme: { light: "#10b981", dark: "#34d399" }
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={correlationData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="var(--color-focus)" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    name="Focus Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="var(--color-stress)" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    name="Stress Level"
                  />
                  <Line 
                    type="step" 
                    dataKey="meditation" 
                    stroke="var(--color-meditation)" 
                    strokeWidth={1.5} 
                    dot={false}
                    strokeDasharray="3 3"
                    name="Meditation Day"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Focus Impact</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Days with meditation</span>
                  <span className="font-medium">{meditationStats.focusCorrelation.withMeditation}%</span>
                </div>
                <div className="h-2 bg-background overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${meditationStats.focusCorrelation.withMeditation}%` }} 
                  />
                </div>
                
                <div className="flex justify-between text-sm mt-3">
                  <span>Days without meditation</span>
                  <span className="font-medium">{meditationStats.focusCorrelation.withoutMeditation}%</span>
                </div>
                <div className="h-2 bg-background overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-blue-300"
                    style={{ width: `${meditationStats.focusCorrelation.withoutMeditation}%` }} 
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Mood Impact</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Days with meditation</span>
                  <span className="font-medium">{meditationStats.moodCorrelation.withMeditation}%</span>
                </div>
                <div className="h-2 bg-background overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${meditationStats.moodCorrelation.withMeditation}%` }} 
                  />
                </div>
                
                <div className="flex justify-between text-sm mt-3">
                  <span>Days without meditation</span>
                  <span className="font-medium">{meditationStats.moodCorrelation.withoutMeditation}%</span>
                </div>
                <div className="h-2 bg-background overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-green-300"
                    style={{ width: `${meditationStats.moodCorrelation.withoutMeditation}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationsSection;
