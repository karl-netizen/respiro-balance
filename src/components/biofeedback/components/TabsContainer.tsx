
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface TabsContainerProps {
  data: BiometricData;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  if (!data.brainwaves) return null;
  
  return (
    <div className="mt-4">
      <div className="col-span-full bg-card rounded-md p-3 shadow-sm">
        <h3 className="text-lg font-medium mb-1">Brainwaves</h3>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <p className="text-sm">Alpha</p>
            <p className="text-xl font-bold">{data.brainwaves.alpha.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm">Beta</p>
            <p className="text-xl font-bold">{data.brainwaves.beta.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm">Delta</p>
            <p className="text-xl font-bold">{data.brainwaves.delta.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm">Gamma</p>
            <p className="text-xl font-bold">{data.brainwaves.gamma.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm">Theta</p>
            <p className="text-xl font-bold">{data.brainwaves.theta.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
