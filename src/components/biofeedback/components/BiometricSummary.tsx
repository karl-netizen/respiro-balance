
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface BiometricSummaryProps {
  data: BiometricData;
}

export const BiometricSummary: React.FC<BiometricSummaryProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div className="bg-card rounded-md p-3 shadow-sm">
        <h3 className="text-lg font-medium mb-1">Heart Rate</h3>
        <p className="text-3xl font-bold">{data.heart_rate} <span className="text-sm font-normal">BPM</span></p>
      </div>
      
      <div className="bg-card rounded-md p-3 shadow-sm">
        <h3 className="text-lg font-medium mb-1">Heart Rate Variability</h3>
        <p className="text-3xl font-bold">{data.hrv} <span className="text-sm font-normal">ms</span></p>
      </div>
      
      <div className="bg-card rounded-md p-3 shadow-sm">
        <h3 className="text-lg font-medium mb-1">Breathing Rate</h3>
        <p className="text-3xl font-bold">{data.breath_rate} <span className="text-sm font-normal">BPM</span></p>
      </div>
    </div>
  );
};
