// Advanced biofeedback types for future enhancements
export interface AdvancedSensorData {
  // Existing core metrics
  heartRate?: number;
  hrv?: number;
  stressLevel?: number;
  
  // Advanced physiological sensors (future)
  bloodOxygen?: number; // SpO2 percentage
  bodyTemperature?: number; // Celsius
  glucoseLevel?: number; // mg/dL (future CGM integration)
  hydrationLevel?: number; // Percentage (future hydration sensors)
  
  // Environmental monitoring
  airQuality?: {
    aqi: number; // Air Quality Index
    pm25: number; // PM2.5 particles
    humidity: number; // Percentage
    temperature: number; // Ambient temperature
  };
  
  // Posture and form analysis
  postureData?: {
    spinalAlignment: number; // 0-100 score
    shoulderPosition: 'optimal' | 'forward' | 'elevated';
    headPosition: 'neutral' | 'forward' | 'tilted';
    stabilityScore: number; // 0-100
  };
  
  // Light and sound analysis
  environmentalFactors?: {
    lightExposure: number; // Lux
    soundLevel: number; // Decibels
    soundFrequency?: number[]; // Frequency analysis
  };
  
  timestamp: string;
}

export interface AIInsight {
  type: 'pattern' | 'prediction' | 'recommendation' | 'warning';
  confidence: number; // 0-1
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'health' | 'performance' | 'environment' | 'behavior';
  evidence?: string[];
  recommendations?: string[];
}

export interface PredictiveModel {
  stressForecasting: {
    nextHourRisk: number; // 0-1 probability
    peakStressTime: string; // Predicted time
    triggerFactors: string[];
  };
  
  optimalTimingPrediction: {
    bestMeditationWindow: string; // Time range
    focusOpportunity: number; // 0-1 score
    energyLevel: number; // 0-100
  };
  
  healthTrends: {
    hrvTrend: 'improving' | 'stable' | 'declining';
    stressResilienceScore: number; // 0-100
    recoveryCapacity: number; // 0-100
  };
}

export interface ClinicalMetrics {
  // Medical-grade tracking
  clinicalAccuracy: boolean;
  fdaApproved: boolean;
  medicalDeviceClass?: 'I' | 'II' | 'III';
  
  // Therapeutic applications
  anxietyManagement?: {
    baselineAnxiety: number;
    currentLevel: number;
    sessionImprovement: number;
    weeklyTrend: 'improving' | 'stable' | 'concerning';
  };
  
  cardiacRehab?: {
    restingHR: number;
    targetZone: [number, number];
    recoveryRate: number;
    exerciseCapacity: number;
  };
  
  painManagement?: {
    painLevel: number; // 1-10 scale
    painResponse: number; // Response to meditation
    triggerFactors: string[];
  };
  
  sleepHealth?: {
    sleepQuality: number; // 0-100
    deepSleepPercentage: number;
    remSleepPercentage: number;
    sleepEfficiency: number;
  };
}

export interface ProfessionalDashboard {
  patientId: string;
  providerId: string;
  accessLevel: 'basic' | 'full' | 'clinical';
  
  summaryMetrics: {
    complianceRate: number; // 0-100
    overallImprovement: number; // Percentage
    riskFactors: string[];
    treatmentGoals: string[];
  };
  
  clinicalNotes: {
    date: string;
    note: string;
    provider: string;
    category: 'observation' | 'recommendation' | 'concern' | 'milestone';
  }[];
}
