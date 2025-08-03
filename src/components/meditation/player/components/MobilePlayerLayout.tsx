
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MobilePlayerControls } from './MobilePlayerControls';
import { MobileProgressDisplay } from './MobileProgressDisplay';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface MobilePlayerLayoutProps {
  title: string;
  description?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  progress: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleMute: () => void;
  onVolumeChange: (values: number[]) => void;
  onSeek?: (value: number[]) => void;
  formatTime: (time: number) => string;
  children?: React.ReactNode;
}

export const MobilePlayerLayout: React.FC<MobilePlayerLayoutProps> = ({
  title,
  description,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  progress,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onToggleMute,
  onVolumeChange,
  onSeek,
  formatTime,
  children
}) => {
  const { deviceType } = useDeviceDetection();

  if (deviceType === 'mobile') {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-gradient-to-br from-respiro-light/20 to-respiro-default/20 border-2 border-respiro-default shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Session info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-respiro-dark">{title}</h3>
              {description && (
                <p className="text-sm text-respiro-text/80">{description}</p>
              )}
            </div>

            {/* Progress display */}
            <MobileProgressDisplay
              currentTime={currentTime}
              duration={duration}
              progress={progress}
              formatTime={formatTime}
              onSeek={onSeek}
            />

            {/* Player controls */}
            <MobilePlayerControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              onPlayPause={onPlayPause}
              onSkipBack={onSkipBack}
              onSkipForward={onSkipForward}
              onToggleMute={onToggleMute}
              onVolumeChange={onVolumeChange}
            />

            {/* Additional content */}
            {children}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop layout
  return (
    <Card className="w-full border-2 border-respiro-default shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-respiro-dark">{title}</h3>
              {description && (
                <p className="text-sm text-respiro-text/80">{description}</p>
              )}
            </div>
          </div>

          <MobileProgressDisplay
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            formatTime={formatTime}
            onSeek={onSeek}
          />

          <MobilePlayerControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onPlayPause={onPlayPause}
            onSkipBack={onSkipBack}
            onSkipForward={onSkipForward}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />

          {children}
        </div>
      </CardContent>
    </Card>
  );
};
