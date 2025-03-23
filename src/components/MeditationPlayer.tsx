
import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

const MeditationPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes in seconds
  const [volume, setVolume] = useState(80);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) {
          clearInterval(timer);
          setIsPlaying(false);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, duration]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const resetProgress = () => {
    setProgress(0);
    setIsPlaying(false);
  };
  
  const skipForward = () => {
    setProgress((prev) => Math.min(prev + 30, duration));
  };
  
  const skipBackward = () => {
    setProgress((prev) => Math.max(prev - 30, 0));
  };
  
  return (
    <div className="glassmorphism-card p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Respiro Matutinum</h3>
          <p className="text-sm text-foreground/70">Guided by Maria Aurelia • 10 min</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-mindflow-light flex items-center justify-center">
          <span className="text-mindflow-dark font-medium">10m</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-foreground/70">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={skipBackward}
            className="p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:bg-mindflow-dark transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            onClick={skipForward}
            className="p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Volume2 size={16} className="text-foreground/70" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(values) => setVolume(values[0])}
            className="w-32"
          />
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-secondary/50 rounded-lg">
        <p className="text-sm text-foreground/70">
          "Begin by finding a comfortable seated position and allow your breath to flow naturally. Notice the rhythm of your inhale and exhale..."
        </p>
      </div>
    </div>
  );
};

export default MeditationPlayer;
