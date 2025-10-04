/**
 * Health Data Types & Schema for Biofeedback Lite
 */

export interface HealthDataPoint {
  id: string;
  timestamp: Date;
  value: number;
  unit: string;
  source: 'apple_health' | 'google_fit' | 'manual';
}

export interface BiofeedbackMetrics {
  restingHeartRate: HealthDataPoint | null;
  heartRateVariability: HealthDataPoint | null;
  stressScore: number | null; // Calculated from HR + HRV
}

export interface SessionInsight {
  sessionId: string;
  sessionType: 'meditation' | 'breathing' | 'focus';
  duration: number; // minutes
  timestamp: Date;
  
  // Pre-session metrics
  preSessionHR: number | null;
  preSessionHRV: number | null;
  preSessionStress: number | null;
  
  // Post-session metrics (captured ~5 min after)
  postSessionHR: number | null;
  postSessionHRV: number | null;
  postSessionStress: number | null;
  
  // Calculated impact
  hrChange: number | null; // BPM change
  hrvChange: number | null; // % change
  stressReduction: number | null; // % reduction
  
  // AI-generated insight
  insightText: string;
  impactRating: 'low' | 'moderate' | 'high' | 'excellent';
}

export interface WeeklyReport {
  weekStartDate: Date;
  weekEndDate: Date;
  totalSessions: number;
  totalMinutes: number;
  
  // Aggregate metrics
  avgRestingHR: number;
  avgHRV: number;
  avgStressLevel: number;
  
  // Week-over-week changes
  restingHRChange: number; // % change from previous week
  hrvImprovement: number; // % improvement
  stressReduction: number; // % reduction
  
  // Best session
  bestSession: SessionInsight | null;
  
  // Recommendations
  recommendations: string[];
}
