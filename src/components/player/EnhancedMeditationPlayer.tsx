import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  BookOpen,
  Settings,
  Maximize,
  Minimize,
  Clock,
  Headphones,
  Waves,
  Wind,
  TreePine,
  Zap
} from 'lucide-react';

interface SessionData {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  description: string;
  instructions: string[];
  backgroundSounds: string[];
  biometricData?: {
    heartRate?: number;
    breathingRate?: number;
    stressLevel?: number;
  };
}

interface EnhancedMeditationPlayerProps {
  session: SessionData;
  onComplete: () => void;
  onClose: () => void;
}

const EnhancedMeditationPlayer: React.FC<EnhancedMeditationPlayerProps> = ({
  session,
  onComplete,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [selectedBackgroundSound, setSelectedBackgroundSound] = useState('none');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  // Calculate progress
  const progress = (currentTime / (session.duration * 60)) * 100;
  const remainingTime = Math.max(0, (session.duration * 60) - currentTime);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio controls
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= session.duration * 60) {
            onComplete();
            return session.duration * 60;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(prev + 15, session.duration * 60));
  };

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(prev - 15, 0));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * (session.duration * 60);
    setCurrentTime(newTime);
  };

  // Instruction progression
  useEffect(() => {
    const instructionInterval = (session.duration * 60) / session.instructions.length;
    const instructionIndex = Math.floor(currentTime / instructionInterval);
    setCurrentInstruction(Math.min(instructionIndex, session.instructions.length - 1));
  }, [currentTime, session.instructions.length, session.duration]);

  // Background sounds
  const backgroundSounds = [
    { id: 'none', label: 'None', icon: VolumeX },
    { id: 'rain', label: 'Rain', icon: Waves },
    { id: 'wind', label: 'Wind', icon: Wind },
    { id: 'forest', label: 'Forest', icon: TreePine },
    { id: 'white-noise', label: 'White Noise', icon: Zap }
  ];

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'max-w-2xl mx-auto'}`}>
      <Card className={`${isFullscreen ? 'h-full rounded-none' : ''} overflow-hidden`}>
        <CardContent className={`p-0 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{session.title}</h2>
                  <p className="text-sm text-muted-foreground">with {session.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>
            </div>

            {/* Progress and Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <span className="text-muted-foreground">
                  -{formatTime(remainingTime)}
                </span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <Slider
                  value={[progress]}
                  onValueChange={handleSeek}
                  max={100}
                  step={1}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${isFullscreen ? 'flex-1 flex' : ''} p-6`}>
            <div className={`${isFullscreen ? 'flex-1' : ''} space-y-6`}>
              {/* Current Instruction */}
              {showInstructions && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInstruction}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="bg-muted/30 rounded-lg p-6">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <Badge variant="secondary">
                          Step {currentInstruction + 1} of {session.instructions.length}
                        </Badge>
                      </div>
                      <p className="text-lg text-foreground leading-relaxed">
                        {session.instructions[currentInstruction]}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Biometric Display */}
              {session.biometricData && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500 mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Heart Rate</div>
                    <div className="text-lg font-semibold">
                      {session.biometricData.heartRate || '--'} BPM
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Waves className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Breathing</div>
                    <div className="text-lg font-semibold">
                      {session.biometricData.breathingRate || '--'} /min
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Stress</div>
                    <div className="text-lg font-semibold">
                      {session.biometricData.stressLevel || '--'}%
                    </div>
                  </div>
                </div>
              )}

              {/* Session Notes */}
              {showNotes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Session Notes</label>
                  <Textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="How are you feeling? Any insights or observations..."
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>

            {/* Settings Panel */}
            {isFullscreen && (
              <div className="w-80 border-l border-border p-6 space-y-6">
                <h3 className="font-semibold text-foreground">Session Settings</h3>
                
                {/* Background Sounds */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Background Sounds</label>
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundSounds.map((sound) => {
                      const Icon = sound.icon;
                      return (
                        <Button
                          key={sound.id}
                          variant={selectedBackgroundSound === sound.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedBackgroundSound(sound.id)}
                          className="flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {sound.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Playback Speed */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Playback Speed</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[0.75, 1, 1.25, 1.5].map((speed) => (
                      <Button
                        key={speed}
                        variant={playbackSpeed === speed ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full justify-start"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {showInstructions ? 'Hide' : 'Show'} Instructions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNotes(!showNotes)}
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {showNotes ? 'Hide' : 'Show'} Notes
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="border-t border-border p-6">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={skipBackward}>
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={skipForward}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume and Secondary Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  className="w-20"
                />
              </div>

              <div className="flex items-center gap-2">
                {!isFullscreen && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotes(!showNotes)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInstructions(!showInstructions)}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {session.duration} min
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMeditationPlayer;