
import React, { useRef, useEffect } from 'react';
import { useMobileGestures } from '@/components/meditation/hooks/useMobileGestures';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { Play, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MobileGestureControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
  onVolumeChange: (delta: number) => void;
  enableGestures?: boolean;
}

export const MobileGestureControls: React.FC<MobileGestureControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBack,
  onVolumeChange,
  enableGestures = true
}) => {
  const { vibrate, deviceMotion } = useMobileFeatures();
  const previousMotion = useRef({ x: 0, y: 0, z: 0 });
  const gestureThreshold = 15; // Acceleration threshold for gesture detection
  const lastGestureTime = useRef(0);
  const gestureDebounce = 1000; // 1 second between gestures

  // Gesture detection based on device motion
  useEffect(() => {
    if (!enableGestures) return;

    const now = Date.now();
    if (now - lastGestureTime.current < gestureDebounce) return;

    const deltaX = Math.abs(deviceMotion.x - previousMotion.current.x);
    const deltaY = Math.abs(deviceMotion.y - previousMotion.current.y);
    const deltaZ = Math.abs(deviceMotion.z - previousMotion.current.z);

    // Shake gesture (any direction)
    if (deltaX > gestureThreshold || deltaY > gestureThreshold || deltaZ > gestureThreshold) {
      console.log('Shake gesture detected');
      vibrate(100);
      onPlayPause();
      lastGestureTime.current = now;
    }

    // Tilt left/right for skip
    if (deviceMotion.y > gestureThreshold && Math.abs(deviceMotion.x) < 5) {
      console.log('Tilt right - skip forward');
      vibrate([50, 50]);
      onSkipForward();
      lastGestureTime.current = now;
    } else if (deviceMotion.y < -gestureThreshold && Math.abs(deviceMotion.x) < 5) {
      console.log('Tilt left - skip back');
      vibrate([50, 50]);
      onSkipBack();
      lastGestureTime.current = now;
    }

    previousMotion.current = { ...deviceMotion };
  }, [deviceMotion, enableGestures, onPlayPause, onSkipForward, onSkipBack, vibrate]);

  const gestureRef = useMobileGestures({
    onSwipeLeft: () => {
      console.log('Swipe left - skip forward');
      vibrate(50);
      onSkipForward();
    },
    onSwipeRight: () => {
      console.log('Swipe right - skip back');
      vibrate(50);
      onSkipBack();
    },
    onSwipeUp: () => {
      console.log('Swipe up - volume up');
      vibrate(30);
      onVolumeChange(10);
    },
    onSwipeDown: () => {
      console.log('Swipe down - volume down');
      vibrate(30);
      onVolumeChange(-10);
    },
    onTap: () => {
      console.log('Tap - play/pause');
      vibrate(50);
      onPlayPause();
    },
    enabled: enableGestures
  });

  if (!enableGestures) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-dashed border-2 border-blue-200">
      <CardContent className="p-4">
        <div
          ref={gestureRef}
          className="min-h-[120px] flex flex-col items-center justify-center space-y-3 touch-none"
        >
          <h3 className="text-lg font-semibold text-blue-800 text-center">
            Gesture Control Zone
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto">
                <Play className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-blue-700">Tap or Shake to Play/Pause</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto">
                <SkipForward className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-purple-700">Swipe Left to Skip</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto">
                <SkipBack className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-green-700">Swipe Right to Go Back</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto">
                <Volume2 className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-orange-700">Swipe Up/Down for Volume</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 text-center mt-3">
            Current: {isPlaying ? 'Playing' : 'Paused'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
