
import React from 'react';
import { MorningRitual } from '@/context/types';
import { Sunrise } from 'lucide-react';

interface QuickStatsProps {
  rituals: MorningRitual[];
  completedToday: number;
  scheduleOptimization?: {
    feasibilityScore: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({
  rituals,
  completedToday,
  scheduleOptimization
}) => {
  const hasRituals = rituals.length > 0;

  if (!hasRituals) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Sunrise className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm text-gray-600">Total Morning Rituals</p>
            <p className="text-2xl font-bold text-gray-800">{rituals.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Today</p>
            <p className="text-2xl font-bold text-gray-800">{completedToday}</p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            🔥
          </div>
          <div>
            <p className="text-sm text-gray-600">Best Streak</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.max(...rituals.map(r => r.streak || 0), 0)} days
            </p>
          </div>
        </div>
      </div>
      {scheduleOptimization && (
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              %
            </div>
            <div>
              <p className="text-sm text-gray-600">Schedule Score</p>
              <p className="text-2xl font-bold text-gray-800">{scheduleOptimization.feasibilityScore}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
