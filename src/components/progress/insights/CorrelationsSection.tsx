import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeditationStats } from '../useMeditationStats';
import { BiometricData } from '@/types/supabase';
import { ComparisonTab, RealtimeDataTab, WellbeingTab } from './tabs';

interface CorrelationsSectionProps {
  biometricData: BiometricData[];
  meditationStats: MeditationStats;
}

const CorrelationsSection: React.FC<CorrelationsSectionProps> = ({ 
  biometricData = [],
  meditationStats 
}) => {
  const [activeTab, setActiveTab] = useState('comparison');
  
  // Sample correlation data (in a real app, this would come from analyzing actual user data)
  const correlationData = [
    { name: 'Focus', meditation: 65, nonMeditation: 40 },
    { name: 'Stress', meditation: 35, nonMeditation: 70 },
    { name: 'Sleep', meditation: 75, nonMeditation: 50 },
    { name: 'Mood', meditation: 80, nonMeditation: 55 },
    { name: 'Productivity', meditation: 70, nonMeditation: 45 },
  ];
  
  // Sample well-being score based on meditation consistency
  const wellbeingScore = meditationStats.streak > 5 ? 75 : meditationStats.streak > 2 ? 60 : 45;

  // Generate real-time biometric visualization data
  const getBiometricTrends = () => {
    // If we have actual biometric data, use it
    if (biometricData && biometricData.length > 0) {
      return biometricData.map(data => ({
        date: new Date(data.recorded_at).toLocaleDateString(),
        heartRate: data.heart_rate || 0,
        hrv: data.hrv || 0,
        stress: data.stress_score || 0,
      }));
    }
    
    // Otherwise use sample data
    return [
      { date: 'Mon', heartRate: 72, hrv: 65, stress: 40, meditation: true },
      { date: 'Tue', heartRate: 68, hrv: 70, stress: 35, meditation: true },
      { date: 'Wed', heartRate: 70, hrv: 68, stress: 38, meditation: true },
      { date: 'Thu', heartRate: 82, hrv: 55, stress: 60, meditation: false },
      { date: 'Fri', heartRate: 76, hrv: 60, stress: 50, meditation: true },
      { date: 'Sat', heartRate: 74, hrv: 62, stress: 45, meditation: true },
      { date: 'Sun', heartRate: 85, hrv: 52, stress: 65, meditation: false },
    ];
  };

  const biometricTrends = getBiometricTrends();
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
          <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="mt-0">
          <ComparisonTab correlationData={correlationData} />
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-0">
          <RealtimeDataTab biometricTrends={biometricTrends} />
        </TabsContent>
        
        <TabsContent value="wellbeing" className="mt-0">
          <WellbeingTab wellbeingScore={wellbeingScore} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrelationsSection;
