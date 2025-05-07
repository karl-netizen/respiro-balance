
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMeditationStats } from './useMeditationStats';

const CorrelationsTab: React.FC = () => {
  const { meditationStats } = useMeditationStats();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meditation and Wellbeing Correlations</CardTitle>
          <CardDescription>
            Discover how your meditation practice impacts your overall wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Mood Impact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">With meditation:</p>
                    <div className="flex items-center mt-1">
                      <div className="h-3 bg-green-500 rounded-full" style={{ width: `${meditationStats.moodCorrelation.withMeditation}%` }}></div>
                      <span className="ml-2">{meditationStats.moodCorrelation.withMeditation}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Without meditation:</p>
                    <div className="flex items-center mt-1">
                      <div className="h-3 bg-orange-400 rounded-full" style={{ width: `${meditationStats.moodCorrelation.withoutMeditation}%` }}></div>
                      <span className="ml-2">{meditationStats.moodCorrelation.withoutMeditation}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Focus Impact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">With meditation:</p>
                    <div className="flex items-center mt-1">
                      <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${meditationStats.focusCorrelation.withMeditation}%` }}></div>
                      <span className="ml-2">{meditationStats.focusCorrelation.withMeditation}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Without meditation:</p>
                    <div className="flex items-center mt-1">
                      <div className="h-3 bg-slate-400 rounded-full" style={{ width: `${meditationStats.focusCorrelation.withoutMeditation}%` }}></div>
                      <span className="ml-2">{meditationStats.focusCorrelation.withoutMeditation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-muted-foreground p-4 bg-muted/20 rounded-lg">
              <p>Connect biometric devices to see more detailed correlations between your meditation practice and health metrics.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationsTab;
