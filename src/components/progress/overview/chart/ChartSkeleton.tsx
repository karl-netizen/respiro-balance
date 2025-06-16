
import React from 'react';

export const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded flex-1" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
        </div>
      ))}
    </div>
  </div>
);
