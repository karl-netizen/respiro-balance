
import React from 'react';

interface TimerProps {
  remainingTime: number;
}

const Timer: React.FC<TimerProps> = ({ remainingTime }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-3xl font-mono mb-8 text-white drop-shadow-md font-semibold">
      {formatTime(remainingTime)}
    </div>
  );
};

export default Timer;
