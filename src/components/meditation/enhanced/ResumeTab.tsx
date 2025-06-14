
import React from 'react';
import { ResumeTabProps } from './types';

const ResumeTab: React.FC<ResumeTabProps> = ({
  sessions,
  onSessionSelect,
  formatTime,
  getDifficultyColor,
  getCategoryIcon
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Continue Your Practice</h2>
        <p className="text-gray-600 mb-6">Pick up where you left off or start a new session.</p>
        
        <div className="space-y-4">
          {sessions.slice(0, 3).map(session => (
            <div
              key={session.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onSessionSelect(session)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(session.category)}
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-600">with {session.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{formatTime(session.duration * 60)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTab;
