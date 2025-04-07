
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, HeartPulse, TrendingDown, TrendingUp } from 'lucide-react';

export interface BiometricData {
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  sessionId?: string;
  timestamp?: string;
}

export interface BiometricChange {
  heart_rate?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  hrv?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  respiratory_rate?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  stress_score?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export interface BiometricDisplayProps {
  biometricData: BiometricData;
  sessionId?: string;
  isInitial?: boolean;
  showChange?: boolean;
  change?: BiometricChange;
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ 
  biometricData, 
  sessionId,
  isInitial = false,
  showChange = false,
  change 
}) => {
  if (!biometricData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Biometric Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No biometric data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const renderChangeIndicator = (value?: number, direction?: 'up' | 'down' | 'stable', percentage?: number) => {
    if (!showChange || !value || !direction || !percentage) return null;
    
    return (
      <div className="flex items-center text-xs">
        {direction === 'up' ? (
          <TrendingUp className={`h-3 w-3 mr-1 ${direction === 'up' && value < 0 ? 'text-green-500' : 'text-red-500'}`} />
        ) : direction === 'down' ? (
          <TrendingDown className={`h-3 w-3 mr-1 ${direction === 'down' && value > 0 ? 'text-red-500' : 'text-green-500'}`} />
        ) : null}
        <span className={`${
          (direction === 'up' && value < 0) || (direction === 'down' && value > 0) 
            ? 'text-green-500' 
            : 'text-red-500'
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5" />
          {isInitial ? 'Initial Biometric Data' : 'Current Biometric Data'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-sm">Heart Rate</span>
                </div>
                {change && renderChangeIndicator(
                  change.heart_rate?.value, 
                  change.heart_rate?.direction, 
                  change.heart_rate?.percentage
                )}
              </div>
              <p className="text-2xl font-bold">
                {biometricData.heart_rate || '-'} <span className="text-sm font-normal text-muted-foreground">bpm</span>
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">HRV</span>
                </div>
                {change && renderChangeIndicator(
                  change.hrv?.value, 
                  change.hrv?.direction, 
                  change.hrv?.percentage
                )}
              </div>
              <p className="text-2xl font-bold">
                {biometricData.hrv || '-'} <span className="text-sm font-normal text-muted-foreground">ms</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">Respiratory Rate</span>
                </div>
                {change && renderChangeIndicator(
                  change.respiratory_rate?.value, 
                  change.respiratory_rate?.direction, 
                  change.respiratory_rate?.percentage
                )}
              </div>
              <p className="text-2xl font-bold">
                {biometricData.respiratory_rate || '-'} <span className="text-sm font-normal text-muted-foreground">bpm</span>
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="text-sm">Stress Score</span>
                </div>
                {change && renderChangeIndicator(
                  change.stress_score?.value, 
                  change.stress_score?.direction, 
                  change.stress_score?.percentage
                )}
              </div>
              <p className="text-2xl font-bold">
                {biometricData.stress_score || '-'} <span className="text-sm font-normal text-muted-foreground">pts</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiometricDisplay;
