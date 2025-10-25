import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Play, Pause, Volume2 } from 'lucide-react';
import { useAudioUpload } from '@/hooks/useAudioUpload';

interface AudioUploadProps {
  meditationContentId: string;
  onUploadComplete: (audioData: any) => void;
  className?: string;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  meditationContentId,
  onUploadComplete,
  className
}) => {
  const { uploadAudio, isUploading, uploadProgress } = useAudioUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadAudio(selectedFile, meditationContentId);
    if (result) {
      onUploadComplete(result);
      handleClear();
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setIsPlaying(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePreview = () => {
    if (!previewUrl) return;

    const mediaElement = selectedFile?.type.includes('video/') ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.pause();
      setIsPlaying(false);
    } else {
      mediaElement.play();
      setIsPlaying(true);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes('mp4')) return '🎬';
    if (type.includes('mp3')) return '🎵';
    if (type.includes('wav')) return '🎶';
    if (type.includes('m4a')) return '🎵';
    if (type.includes('aac')) return '🎵';
    return '🎵';
  };

  const isVideoFile = selectedFile?.type.includes('video/') || selectedFile?.type.includes('mp4');

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Upload Meditation Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="audio-file">Select Audio File</Label>
          <div className="flex items-center gap-4">
            <Input
              id="audio-file"
              type="file"
              accept=".mp3,.wav,.mp4,.m4a,.aac,audio/*,video/mp4"
              onChange={handleFileSelect}
              ref={fileInputRef}
              disabled={isUploading}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Supported formats: MP3, WAV, MP4, M4A, AAC (Max: 100MB)
          </p>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="p-4 bg-secondary/10 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileTypeIcon(selectedFile.type)}</span>
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={togglePreview}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Media Preview */}
            {previewUrl && (
              <div className="space-y-2">
                {isVideoFile ? (
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full max-h-48 rounded-md"
                    controls
                  />
                ) : (
                  <audio
                    ref={audioRef}
                    src={previewUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full"
                    controls
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload Progress</span>
              <span>{uploadProgress.progress}%</span>
            </div>
            <Progress value={uploadProgress.progress} className="w-full" />
            <p className="text-xs text-muted-foreground capitalize">
              Status: {uploadProgress.stage}
            </p>
          </div>
        )}

        {/* Upload Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isUploading || !selectedFile}
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="min-w-[120px]"
          >
            {isUploading ? 'Uploading...' : 'Upload Audio'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};