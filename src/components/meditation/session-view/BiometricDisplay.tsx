
import React from 'react';

interface BiometricDataProps {
  currentBiometrics: any;
  initialBiometrics: any | null;
  biometricChange: any | null;
  isPlaying: boolean;
  sessionStarted: boolean;
}

const BiometricDisplay: React.FC<BiometricDataProps> = ({
  currentBiometrics,
  biometricChange,
  isPlaying,
  sessionStarted
}) => {
  if (!sessionStarted) {
    return (
      <div className="bg-card rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-4">🧘</div>
        <h3 className="text-lg font-medium mb-2">Ready to Begin?</h3>
        <p className="text-muted-foreground mb-4">
          Press play to start your meditation session and view your biometric feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Heart Rate</span>
            <span className="text-sm font-medium">{currentBiometrics?.heart_rate || "--"} BPM</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${((currentBiometrics?.heart_rate || 70) - 50) / 100 * 100}%` }}
            />
          </div>
          {biometricChange?.heart_rate && (
            <div className={`text-xs mt-1 ${biometricChange.heart_rate < 0 ? "text-green-500" : "text-red-500"}`}>
              {biometricChange.heart_rate < 0 ? "↓" : "↑"} {Math.abs(biometricChange.heart_rate)} BPM
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Focus Score</span>
            <span className="text-sm font-medium">{currentBiometrics?.focus_score || "--"}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${currentBiometrics?.focus_score || 60}%` }}
            />
          </div>
          {biometricChange?.focus_score > 0 && (
            <div className="text-xs mt-1 text-green-500">
              ↑ {biometricChange.focus_score}%
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Calm Score</span>
            <span className="text-sm font-medium">{currentBiometrics?.calm_score || "--"}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${currentBiometrics?.calm_score || 65}%` }}
            />
          </div>
          {biometricChange?.calm_score > 0 && (
            <div className="text-xs mt-1 text-green-500">
              ↑ {biometricChange.calm_score}%
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Respiratory Rate</span>
            <span className="text-sm font-medium">{currentBiometrics?.respiratory_rate || "--"} breaths/min</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${((currentBiometrics?.respiratory_rate || 14) - 8) / 12 * 100}%` }}
            />
          </div>
        </div>
        
        <div className="pt-2 text-sm text-muted-foreground italic">
          {isPlaying ? (
            "Biometrics updating in real-time..."
          ) : sessionStarted ? (
            "Session paused. Biometrics on hold."
          ) : (
            "Start the session to see your biometric feedback."
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricDisplay;
