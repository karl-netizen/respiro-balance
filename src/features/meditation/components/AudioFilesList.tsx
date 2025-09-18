import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Headphones } from 'lucide-react';
import { AudioFile } from '../types/meditation.types';

interface AudioFilesListProps {
  audioFiles: AudioFile[];
  loading: boolean;
  onPlayAudio?: (file: AudioFile) => void;
}

export const AudioFilesList: React.FC<AudioFilesListProps> = ({
  audioFiles,
  loading,
  onPlayAudio
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          Audio Files from Storage
        </CardTitle>
        <CardDescription>
          {loading ? 'Loading audio files...' : `${audioFiles.length} audio files available`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : audioFiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {audioFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Play className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{file.name.replace(/\.[^/.]+$/, "")}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onPlayAudio?.(file)}
                >
                  Play
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No audio files found in storage bucket
          </p>
        )}
      </CardContent>
    </Card>
  );
};