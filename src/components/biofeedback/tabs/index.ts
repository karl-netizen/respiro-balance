
export { default as HeartRateTab } from './HeartRateTab';
export { default as StressTab } from './StressTab';

// Export the expected prop types for these components
export interface HeartRateTabProps {
  biometricData: {
    id: string;
    user_id: string;
    current: number;
    resting?: number;
    history: number[];
  };
}

export interface StressTabProps {
  biometricData: {
    id: string;
    user_id: string;
    current: number;
    history: number[];
  };
}
