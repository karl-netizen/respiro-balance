
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeditationStats } from './useMeditationStats';
import { WellbeingCorrelationCard } from './index';
import { ShareableReport } from './index';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar
} from 'recharts';

const CorrelationsTab = () => {
  const { meditationStats } = useMeditationStats();
  const [activeTab, setActiveTab] = useState('focus');
  
  // Prepare data for charts
  const focusData = [
    { name: 'Mon', withMeditation: 78, withoutMeditation: 62 },
    { name: 'Tue', withMeditation: 82, withoutMeditation: 65 },
    { name: 'Wed', withMeditation: 85, withoutMeditation: 68 },
    { name: 'Thu', withMeditation: 80, withoutMeditation: 64 },
    { name: 'Fri', withMeditation: 77, withoutMeditation: 61 },
    { name: 'Sat', withMeditation: 84, withoutMeditation: 67 },
    { name: 'Sun', withMeditation: 88, withoutMeditation: 70 },
  ];
  
  const stressData = [
    { name: 'Mon', withMeditation: 42, withoutMeditation: 65 },
    { name: 'Tue', withMeditation: 38, withoutMeditation: 62 },
    { name: 'Wed', withMeditation: 35, withoutMeditation: 58 },
    { name: 'Thu', withMeditation: 40, withoutMeditation: 63 },
    { name: 'Fri', withMeditation: 45, withoutMeditation: 68 },
    { name: 'Sat', withMeditation: 36, withoutMeditation: 60 },
    { name: 'Sun', withMeditation: 32, withoutMeditation: 55 },
  ];
  
  const moodData = [
    { name: 'Mon', withMeditation: 75, withoutMeditation: 60 },
    { name: 'Tue', withMeditation: 78, withoutMeditation: 62 },
    { name: 'Wed', withMeditation: 80, withoutMeditation: 65 },
    { name: 'Thu', withMeditation: 82, withoutMeditation: 63 },
    { name: 'Fri', withMeditation: 79, withoutMeditation: 61 },
    { name: 'Sat', withMeditation: 85, withoutMeditation: 68 },
    { name: 'Sun', withMeditation: 88, withoutMeditation: 70 },
  ];
  
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WellbeingCorrelationCard
          metricName="Focus"
          withMeditation={meditationStats.focusCorrelation.withMeditation}
          withoutMeditation={meditationStats.focusCorrelation.withoutMeditation}
          icon="brain"
          description="Improvement in concentration and attention"
        />
        <WellbeingCorrelationCard
          metricName="Stress"
          withMeditation={42}
          withoutMeditation={65}
          icon="activity"
          description="Reduction in perceived stress levels"
        />
        <WellbeingCorrelationCard
          metricName="Mood"
          withMeditation={meditationStats.moodCorrelation.withMeditation}
          withoutMeditation={meditationStats.moodCorrelation.withoutMeditation}
          icon="heart"
          description="Improvement in overall emotional wellbeing"
        />
      </div>
      
      <Tabs defaultValue="focus" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="stress">Stress</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
        </TabsList>
        
        <TabsContent value="focus" className="mt-0">
          <div className="bg-card border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Focus Correlation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={focusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="withMeditation" 
                    stroke="#6366f1" 
                    name="With Meditation"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="withoutMeditation" 
                    stroke="#94a3b8"
                    name="Without Meditation" 
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This chart shows the correlation between your meditation practice and focus scores over time.
              Days with meditation consistently show higher focus scores compared to days without meditation.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="stress" className="mt-0">
          <div className="bg-card border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Stress Correlation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="withMeditation" 
                    fill="#10b981" 
                    name="With Meditation"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="withoutMeditation" 
                    fill="#f43f5e"
                    name="Without Meditation" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This chart illustrates how your stress levels compare on days with meditation versus days without.
              Lower stress levels are consistently observed on days when you meditate.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="mood" className="mt-0">
          <div className="bg-card border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Mood Correlation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={moodData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="withMeditation" 
                    stroke="#8b5cf6" 
                    name="With Meditation"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="withoutMeditation" 
                    stroke="#94a3b8"
                    name="Without Meditation" 
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This chart displays the relationship between meditation and your reported mood scores.
              A consistent pattern of improved mood can be seen on days when you practice meditation.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <ShareableReport />
    </div>
  );
};

export default CorrelationsTab;
