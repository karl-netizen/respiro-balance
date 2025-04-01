
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { MeditationSession } from './MeditationSessionCard';
import { useBiometricData } from '@/hooks/useBiometricData';
import { useUserPreferences } from '@/context';
import BiometricDisplay from './BiometricDisplay';
import { getBiometricDataFromDevices, calculateBiometricChange } from '@/components/morning-ritual/utils';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete: (sessionId: string) => void;
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
  const { addBiometricData, biometricData } = useBiometricData();
  
  // Initialize biometrics when play is first pressed
  useEffect(() => {
    if (isPlaying && !sessionStarted) {
      setSessionStarted(true);
      
      // Get initial biometric readings
      const initial = getBiometricDataFromDevices(preferences.connectedDevices);
      setInitialBiometrics(initial);
      
      // Record the initial biometrics
      if (preferences.hasWearableDevice) {
        addBiometricData(initial);
      }
    }
  }, [isPlaying, sessionStarted, preferences, addBiometricData]);
  
  // Update current biometrics periodically during meditation
  useEffect(() => {
    let biometricInterval: NodeJS.Timeout;
    
    if (isPlaying && sessionStarted) {
      // Update biometrics every 10 seconds
      biometricInterval = setInterval(() => {
        const newBiometrics = { ...initialBiometrics };
        
        // For a meditation session, typically:
        // - Heart rate decreases
        // - HRV increases
        // - Respiratory rate decreases
        // - Stress score decreases
        const progress = 1 - (timeRemaining / (session.duration * 60));
        
        // Simulate biometric changes as meditation progresses
        newBiometrics.heart_rate = Math.max(
          initialBiometrics.heart_rate - Math.floor(initialBiometrics.heart_rate * 0.15 * progress),
          60
        );
        
        newBiometrics.hrv = Math.min(
          initialBiometrics.hrv + Math.floor(initialBiometrics.hrv * 0.3 * progress),
          100
        );
        
        newBiometrics.respiratory_rate = Math.max(
          initialBiometrics.respiratory_rate - Math.floor(initialBiometrics.respiratory_rate * 0.25 * progress),
          8
        );
        
        newBiometrics.stress_score = Math.max(
          initialBiometrics.stress_score - Math.floor(initialBiometrics.stress_score * 0.4 * progress),
          20
        );
        
        setCurrentBiometrics(newBiometrics);
        
        // Calculate the change between initial and current
        const changes = calculateBiometricChange(initialBiometrics, newBiometrics);
        setBiometricChange(changes);
      }, 10000);
    }
    
    return () => clearInterval(biometricInterval);
  }, [isPlaying, sessionStarted, initialBiometrics, timeRemaining, session.duration]);

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            
            // Record final biometrics when session completes
            if (preferences.hasWearableDevice && currentBiometrics) {
              addBiometricData(currentBiometrics);
            }
            
            onComplete(session.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, session.id, onComplete, preferences, currentBiometrics, addBiometricData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full bg-secondary h-2 rounded-full">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(timeRemaining / (session.duration * 60)) * 100}%` }}
              />
            </div>
            
            <div className="text-3xl font-mono">
              {formatTime(timeRemaining)}
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleReset}
                disabled={isPlaying && timeRemaining === session.duration * 60}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-foreground/70" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Only show biometrics if session has started */}
      {sessionStarted && (
        <div className="grid gap-6 md:grid-cols-2">
          {initialBiometrics && (
            <BiometricDisplay 
              biometricData={initialBiometrics} 
              isInitial={true} 
            />
          )}
          
          {currentBiometrics && (
            <BiometricDisplay 
              biometricData={currentBiometrics}
              showChange={true}
              change={biometricChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MeditationSessionPlayer;
