
import { DateRange } from "react-day-picker";

export interface ClientData {
  id: string;
  name: string;
  progress: number;
  lastActive: string;
  stress: "low" | "moderate" | "high";
  joinDate: string;
  streak: number;
  goals: string[];
  email?: string;
  phone?: string;
  biometricData?: BiometricData;
  sessions?: MeditationSessionData[];
}

export interface BiometricData {
  heartRate: number[];
  stressScore: number[];
  breathingRate?: number[];
  sleepQuality?: number[];
}

export interface MeditationSessionData {
  id: string;
  name: string;
  date: string;
  duration: number;
  completed: boolean;
  biometricsBefore?: {
    heartRate?: number;
    stressScore?: number;
  };
  biometricsAfter?: {
    heartRate?: number;
    stressScore?: number;
  };
}

export interface TeamMetricsChartProps {
  timeRange: string;
  dateRange?: DateRange;
}

export interface ReportConfig {
  reportType: string;
  timeRange: string;
  format: string;
  recipients?: string[];
  scheduledDelivery?: boolean;
  deliveryFrequency?: string;
}

export interface SecuritySettings {
  dataVisibility: "self" | "team" | "department" | "organization";
  biometricAccess: boolean;
  anonymizedReporting: boolean;
  dataRetention: "30days" | "90days" | "1year" | "3years" | "indefinite";
}
