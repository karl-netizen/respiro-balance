
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';
import { PredictiveModel } from '@/types/advancedBiofeedback';
import { advancedBiofeedbackService } from '@/services/AdvancedBiofeedbackService';

export const PredictiveAnalytics: React.FC = () => {
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generatePredictions();
  }, []);

  const generatePredictions = async () => {
    setIsLoading(true);
    
    // Mock historical data for demonstration
    const mockHistoricalData = Array.from({ length: 20 }, (_, i) => ({
      heartRate: 70 + Math.random() * 10,
      hrv: 40 + Math.random() * 20,
      stressLevel: 20 + Math.random() * 40,
      timestamp: new Date(Date.now() - i * 86400000).toISOString()
    }));
    
    const model = advancedBiofeedbackService.generatePredictiveModel(mockHistoricalData);
    setPredictiveModel(model);
    setIsLoading(false);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return 'text-green-600';
    if (risk < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Building predictive models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictiveModel) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Stress Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Stress Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next Hour Risk</span>
            <span className={`font-bold ${getRiskColor(predictiveModel.stressForecasting.nextHourRisk)}`}>
              {Math.round(predictiveModel.stressForecasting.nextHourRisk * 100)}%
            </span>
          </div>
          <Progress 
            value={predictiveModel.stressForecasting.nextHourRisk * 100} 
            className="h-2"
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Peak Stress Expected:</span>
              <span className="font-medium">{predictiveModel.stressForecasting.peakStressTime}</span>
            </div>
            
            {predictiveModel.stressForecasting.triggerFactors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Trigger Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {predictiveModel.stressForecasting.triggerFactors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimal Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Optimal Timing Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Best Window</p>
              <p className="font-bold text-blue-600">
                {predictiveModel.optimalTimingPrediction.bestMeditationWindow}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Focus Score</p>
              <p className="font-bold text-green-600">
                {Math.round(predictiveModel.optimalTimingPrediction.focusOpportunity * 100)}%
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Energy Level</span>
              <span className="text-sm font-bold">
                {predictiveModel.optimalTimingPrediction.energyLevel}%
              </span>
            </div>
            <Progress 
              value={predictiveModel.optimalTimingPrediction.energyLevel} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Health Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span>{getTrendIcon(predictiveModel.healthTrends.hrvTrend)}</span>
                <span className="text-sm font-medium">HRV Trend</span>
              </div>
              <Badge 
                variant={predictiveModel.healthTrends.hrvTrend === 'improving' ? 'default' : 'outline'}
                className="capitalize"
              >
                {predictiveModel.healthTrends.hrvTrend}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stress Resilience</span>
                <span className="text-sm font-bold">
                  {predictiveModel.healthTrends.stressResilienceScore}/100
                </span>
              </div>
              <Progress 
                value={predictiveModel.healthTrends.stressResilienceScore} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recovery Capacity</span>
                <span className="text-sm font-bold">
                  {predictiveModel.healthTrends.recoveryCapacity}/100
                </span>
              </div>
              <Progress 
                value={predictiveModel.healthTrends.recoveryCapacity} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
