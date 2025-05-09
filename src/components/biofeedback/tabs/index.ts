
export { default as HeartRateTab } from './HeartRateTab';
export { default as StressTab } from './StressTab';

// Export the expected prop types for these components
export interface HeartRateTabProps {
  biometricData: any; // Using any for simplicity, but should be properly typed
}

export interface StressTabProps {
  biometricData: any; // Using any for simplicity, but should be properly typed  
}
