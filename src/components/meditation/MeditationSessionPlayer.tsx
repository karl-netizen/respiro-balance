
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from './MeditationSessionCard';
import { useUserPreferences } from '@/context';
import { useBiometricData } from '@/hooks/useBiometricData';
import { getBiometricDataFromDevices } from '@/components/morning-ritual/utils';
import { toast } from "sonner";
import PlayerControls from './PlayerControls';
import BiometricTracker from './BiometricTracker';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete?: (sessionId: string) => void;
}

const MeditationSessionPlayer: React.FC<MeditationSessionPlayerProps> = ({ 
  session,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(session.duration * 60); // in seconds
  const [volume, setVolume] = useState(70);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [initialBiometrics, setInitialBiometrics] = useState<any>(null);
  const [currentBiometrics, setCurrentBiometrics] = useState<any>(null);
  const [biometricChange, setBiometricChange] = useState<any>(null);
  
  const { preferences } = useUserPreferences();
  const { addBiometricData } = useBiometricData();
  
  const getInitialBiometrics = () => {
    return getBiometricDataFromDevices(preferences.connectedDevices);
  };
  
  useEffect(() => {
    if (isPlaying && !sessionStarted) {
      setSessionStarted(true);
      
      const initial = getInitialBiometrics();
      setInitialBiometrics(initial);
      
      if (preferences.hasWearableDevice) {
        addBiometricData(initial);
      }
    }
  }, [isPlaying, sessionStarted, preferences, addBiometricData]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            
            if (preferences.hasWearableDevice && currentBiometrics) {
              addBiometricData(currentBiometrics);
            }
            
            if (onComplete) {
              onComplete(session.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, session.id, onComplete, preferences, currentBiometrics, addBiometricData]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(session.duration * 60);
    setSessionStarted(false);
    setCurrentBiometrics(null);
    setBiometricChange(null);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="pt-6">
          <PlayerControls 
            isPlaying={isPlaying}
            timeRemaining={timeRemaining}
            totalDuration={session.duration}
            volume={volume}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onVolumeChange={handleVolumeChange}
          />
        </CardContent>
      </Card>
      
      <BiometricTracker 
        isPlaying={isPlaying}
        sessionStarted={sessionStarted}
        timeRemaining={timeRemaining}
        sessionDuration={session.duration}
        initialBiometrics={initialBiometrics}
        setInitialBiometrics={setInitialBiometrics}
        currentBiometrics={currentBiometrics}
        setCurrentBiometrics={setCurrentBiometrics}
        biometricChange={biometricChange}
        setBiometricChange={setBiometricChange}
        getInitialBiometrics={getInitialBiometrics}
      />
    </div>
  );
};

export default MeditationSessionPlayer;
