import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Play, Pause, Square } from 'lucide-react';
import { toast } from 'sonner';

interface AudioUploadSectionProps {
  onFileUploaded?: (file: File) => void;
}

const AudioUploadSection: React.FC<AudioUploadSectionProps> = ({ 
  onFileUploaded 
}) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file (.mp3, .wav, .m4a, etc.)');
      return;
    }

    // Clean up previous URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    onFileUploaded?.(file);
    toast.success(`Audio file "${file.name}" uploaded successfully!`);
  }, [audioUrl, onFileUploaded]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !audioUrl) {
      toast.error('Please select an audio file first!');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying, audioUrl]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload & Play Your Audio File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button 
          onClick={triggerFileInput}
          variant="outline"
          className="w-full border-dashed"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Audio File
        </Button>
        
        {audioFile && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-sm">
                ✅ {audioFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            
            {/* HTML5 Audio Element */}
            <audio 
              ref={audioRef}
              src={audioUrl || undefined}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onEnded={handleAudioEnded}
              className="w-full"
              controls
            />
            
            {/* Custom Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={togglePlayPause}
                size="sm"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-1" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-1" /> Play</>
                )}
              </Button>
              
              <Button 
                onClick={stopAudio}
                size="sm"
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioUploadSection;