
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Trash2, Play, Pause, RefreshCw, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchMeditationAudioFiles,
  uploadMeditationAudio,
  deleteMeditationAudio,
  getMeditationAudioUrl
} from '@/lib/meditationAudioIntegration';

const AudioFileManager = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Only allow authenticated users (you could add admin check here)
  const canManage = !!user;
  
  useEffect(() => {
    loadAudioFiles();
  }, []);
  
  const loadAudioFiles = async () => {
    setLoading(true);
    try {
      const audioFiles = await fetchMeditationAudioFiles();
      setFiles(audioFiles);
    } catch (error) {
      console.error('Error loading audio files:', error);
      toast.error('Failed to load audio files');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size exceeds 50MB limit');
        return;
      }
      
      setSelectedFile(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !canManage) return;
    
    setUploading(true);
    
    try {
      // Create a safe filename
      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const safeName = selectedFile.name
        .split('.')[0]
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase();
      const fileName = `${safeName}-${timestamp}.${fileExt}`;
      
      const result = await uploadMeditationAudio(selectedFile, fileName);
      
      if (result) {
        await loadAudioFiles(); // Refresh the list
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (fileName: string) => {
    if (!canManage) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    if (!confirmed) return;
    
    const success = await deleteMeditationAudio(fileName);
    if (success) {
      await loadAudioFiles(); // Refresh the list
    }
  };
  
  const handlePlayPause = (fileName: string) => {
    if (playingFile === fileName) {
      setPlayingFile(null);
    } else {
      setPlayingFile(fileName);
      // You could implement actual audio playback here
      setTimeout(() => setPlayingFile(null), 3000); // Auto-stop for demo
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  if (!canManage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>You need to be logged in to manage audio files.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Audio File Manager
          </CardTitle>
          <CardDescription>
            Upload and manage meditation audio files stored in Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload New Audio File</h3>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="min-w-[120px]"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Files List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Current Audio Files</h3>
              <Button variant="outline" size="sm" onClick={loadAudioFiles} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading audio files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No audio files found</p>
                <p className="text-sm text-muted-foreground">Upload some meditation audio files to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {getMeditationAudioUrl(fileName)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Audio</Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayPause(fileName)}
                      >
                        {playingFile === fileName ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(fileName)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioFileManager;
