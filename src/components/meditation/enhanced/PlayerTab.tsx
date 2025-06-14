
import React from 'react';
import { PlayerTabProps } from './types';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const PlayerTab: React.FC<PlayerTabProps> = ({
  selectedSession,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  progress,
  setProgress,
  onSessionComplete,
  formatTime
}) => {
  if (!selectedSession) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No session selected. Choose a session from the library to start.</p>
      </div>
    );
  }

  const totalDuration = selectedSession.duration * 60;
  const progressPercentage = (currentTime / totalDuration) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, totalDuration));
    setCurrentTime(newTime);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{selectedSession.title}</h2>
        <p className="text-gray-600">with {selectedSession.instructor}</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-8">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleSeek(-30)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            
            <button
              onClick={() => handleSeek(30)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 leading-relaxed">{selectedSession.description}</p>
      </div>
    </div>
  );
};

export default PlayerTab;
