
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Activity, Smile, Frown, Meh } from 'lucide-react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface StressTabProps {
  biometricData: BiometricData;
}

const StressTab: React.FC<StressTabProps> = ({ biometricData }) => {
  const stressScore = biometricData.stress_score || 50;
  
  // Get stress level category
  const getStressLevel = (score: number): string => {
    if (score < 30) return "Low";
    if (score < 60) return "Moderate";
    return "High";
  };
  
  // Get stress icon based on level
  const getStressIcon = (score: number) => {
    if (score < 30) return <Smile className="h-6 w-6 text-green-500" />;
    if (score < 60) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };
  
  // Get stress color based on level
  const getStressColor = (score: number): string => {
    if (score < 30) return "bg-green-500";
    if (score < 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Get indication text based on stress level
  const getIndicationText = (score: number): string => {
    if (score < 30) return "Your stress levels are low, indicating good stress management.";
    if (score < 60) return "Your stress levels are moderate, typical for daily activities.";
    return "Your stress levels are high. Consider taking a break or practicing mindfulness.";
  };

  return (
    <div className="space-y-6">
      {/* Stress Meter */}
      <div className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {getStressIcon(stressScore)}
            </div>
            <div className="text-3xl font-bold">{stressScore}</div>
            <div className="text-sm font-medium text-muted-foreground">
              Stress Score
            </div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                Low
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-100">
                Moderate
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-100">
                High
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full">
            <div 
              className={`h-full rounded-full ${getStressColor(stressScore)} transition-all duration-500`}
              style={{ width: `${stressScore}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Current Reading */}
      <div className="border rounded-md p-4">
        <h4 className="text-sm font-medium mb-2">Current Reading</h4>
        <p className="text-sm text-muted-foreground mb-3">{getIndicationText(stressScore)}</p>
        
        <div className="space-y-3">
          {/* HRV as stress indicator */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>HRV (Stress Indicator)</span>
              <span>{biometricData.hrv || 50} ms</span>
            </div>
            <Progress 
              value={Math.min(100, ((biometricData.hrv || 50) / 100) * 100)} 
              className="h-1"
            />
          </div>
          
          {/* Heart Rate */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Heart Rate</span>
              <span>{biometricData.heart_rate || 70} bpm</span>
            </div>
            <Progress 
              value={Math.min(100, ((biometricData.heart_rate || 70) / 160) * 100)} 
              className="h-1"
            />
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-2 text-sm">
          {stressScore >= 60 && (
            <>
              <li className="flex items-start">
                <span className="mr-2 bg-primary/20 p-1 rounded">•</span>
                <span>Try a quick 5-minute breathing exercise</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 bg-primary/20 p-1 rounded">•</span>
                <span>Step away from screens for at least 15 minutes</span>
              </li>
            </>
          )}
          
          {stressScore >= 30 && (
            <li className="flex items-start">
              <span className="mr-2 bg-primary/20 p-1 rounded">•</span>
              <span>Schedule a short meditation session</span>
            </li>
          )}
          
          <li className="flex items-start">
            <span className="mr-2 bg-primary/20 p-1 rounded">•</span>
            <span>Stay hydrated and maintain regular breaks</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StressTab;
