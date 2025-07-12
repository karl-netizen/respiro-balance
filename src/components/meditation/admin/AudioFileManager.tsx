import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Download, Music, CloudUpload, FileAudio } from 'lucide-react';
import { uploadMeditationAudio, deleteMeditationAudio, fetchMeditationAudioFiles, getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AudioFile {
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

const AudioFileManager: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      const files = await fetchMeditationAudioFiles();
      // Transform string[] to AudioFile[] with actual data
      const audioFileObjects: AudioFile[] = files.map((filename) => ({
        name: filename,
        size: 0, // We'll fetch actual size later if needed
        url: getMeditationAudioUrl(filename),
        uploadedAt: new Date().toISOString()
      }));
      setAudioFiles(audioFileObjects);
    } catch (error) {
      console.error('Error loading audio files:', error);
      toast.error('Failed to load audio files');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const filename = `${Date.now()}_${file.name}`;
      const url = await uploadMeditationAudio(file, filename);
      
      if (url) {
        await loadAudioFiles();
        toast.success('Audio file uploaded successfully!');
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      const success = await deleteMeditationAudio(filename);
      if (success) {
        await loadAudioFiles();
        toast.success('File deleted successfully!');
      } else {
        toast.error('Delete failed. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Delete failed. Please try again.');
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      await handleFileUpload(audioFile);
    } else {
      toast.error('Please drop an audio file');
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Audio File Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Drag and Drop Upload Area */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-primary/50",
                uploading && "opacity-50 pointer-events-none"
              )}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-muted p-4">
                  <CloudUpload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {dragActive ? 'Drop your audio file here' : 'Drag & drop audio files'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Supports MP3, WAV, M4A, OGG formats (max 50MB)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Browse Files'}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Uploaded Audio Files ({audioFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audioFiles.length === 0 ? (
            <div className="text-center py-8">
              <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileAudio className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No audio files uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your first meditation audio file above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {audioFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileAudio className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          Audio File
                        </Badge>
                        <span>Uploaded {formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.name)}
                      className="text-destructive hover:text-destructive"
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioFileManager;
