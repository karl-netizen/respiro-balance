
import { getBiometricDataFromDevices } from '@/components/morning-ritual/utils';
import { BluetoothDevice } from '@/context/types';

export const getInitialBiometricData = (connectedDevices: BluetoothDevice[]) => {
  return getBiometricDataFromDevices(connectedDevices);
};

export const simulateBreathingImprovements = (
  initialData: any, 
  progress: number
) => {
  const newBiometrics = { ...initialData };
  
  newBiometrics.heart_rate = Math.max(
    initialData.heart_rate - Math.floor(initialData.heart_rate * 0.15 * progress),
    60
  );
  
  newBiometrics.hrv = Math.min(
    initialData.hrv + Math.floor(initialData.hrv * 0.3 * progress),
    100
  );
  
  newBiometrics.respiratory_rate = Math.max(
    initialData.respiratory_rate - Math.floor(initialData.respiratory_rate * 0.25 * progress),
    8
  );
  
  newBiometrics.stress_score = Math.max(
    initialData.stress_score - Math.floor(initialData.stress_score * 0.4 * progress),
    20
  );
  
  return newBiometrics;
};
