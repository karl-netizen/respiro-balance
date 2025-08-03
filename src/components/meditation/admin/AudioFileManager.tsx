import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Download, Music, CloudUpload, FileAudio, Plus, Search, Filter, Play } from 'lucide-react';
import { uploadMeditationAudio, deleteMeditationAudio, fetchMeditationAudioFiles, getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AudioUpload } from '@/components/meditation/AudioUpload';
import { RobustAudioPlayer } from '@/components/meditation/RobustAudioPlayer';
import { useAudioUpload } from '@/hooks/useAudioUpload';

interface AudioFile {
  id: string;
  meditation_content_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  duration_seconds: number;
  upload_status: string;
  created_at: string;
  meditation_content?: {
    title: string;
    description: string;
  };
}

interface LegacyAudioFile {
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

const AudioFileManager: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [legacyFiles, setLegacyFiles] = useState<LegacyAudioFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deleteAudio } = useAudioUpload();

  useEffect(() => {
    loadAudioFiles();
    loadLegacyFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the enhanced audio loading function
      const { loadMeditationAudio } = await import('@/lib/meditationAudioIntegration');
      const audioData = await loadMeditationAudio();
      
      setAudioFiles(audioData || []);
      setError(null);
    } catch (networkError) {
      console.error('Network error loading audio files:', networkError);
      setError('Network error. Please check your connection and try again.');
      
      // Try to load cached data as fallback
      const cached = localStorage.getItem('cached_audio_files');
      if (cached) {
        setAudioFiles(JSON.parse(cached));
        toast.info('Showing cached audio files (offline mode)');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLegacyFiles = async () => {
    try {
      const files = await fetchMeditationAudioFiles();
      const audioFileObjects: LegacyAudioFile[] = files.map((filename) => ({
        name: filename,
        size: 0,
        url: getMeditationAudioUrl(filename),
        uploadedAt: new Date().toISOString()
      }));
      setLegacyFiles(audioFileObjects);
    } catch (error) {
      console.error('Error loading legacy audio files:', error);
    }
  };

  const handleCreateContent = async (audioFile: AudioFile) => {
    try {
      const contentTitle = audioFile.file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      
      const { error } = await supabase
        .from('meditation_content')
        .insert({
          title: contentTitle,
          description: `Meditation session created from uploaded audio: ${audioFile.file_name}`,
          duration: audioFile.duration_seconds || 600,
          category: 'Mindfulness',
          difficulty_level: 'beginner',
          subscription_tier: 'free',
          audio_file_path: audioFile.file_path,
          instructor: 'Custom Content',
          tags: ['custom', 'uploaded'],
          is_featured: false,
          is_active: true,
          has_audio: true,
          audio_duration: audioFile.duration_seconds,
          audio_file_size: audioFile.file_size
        });

      if (error) {
        console.error('Error creating content:', error);
        toast.error('Failed to create meditation content');
        return;
      }

      // Update the audio record to link it to the content
      const { error: updateError } = await supabase
        .from('meditation_audio')
        .update({ meditation_content_id: audioFile.id })
        .eq('id', audioFile.id);

      if (updateError) {
        console.error('Error linking audio to content:', updateError);
      }

      toast.success(`Created meditation content: "${contentTitle}"`);
      toast.info('Your content is now available in the meditation library!');
      await loadAudioFiles();
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create meditation content');
    }
  };

  const handleDeleteAudioFile = async (audioFile: AudioFile) => {
    try {
      const success = await deleteAudio(audioFile.id, audioFile.file_path);
      if (success) {
        await loadAudioFiles();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Delete failed. Please try again.');
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', file.name, file.type, file.size);
    
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create user-specific folder structure for RLS policies
      const filename = `user_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('Uploading with filename:', filename);
      
      const url = await uploadMeditationAudio(file, filename);
      console.log('Upload result:', url);
      
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
    console.log('Drag over detected');
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag enter detected');
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag leave detected');
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop detected!');
    setDragActive(false);

    if (uploading) {
      toast.error('Please wait for current upload to complete');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.length, files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    if (files.length === 0) {
      toast.error('No files detected');
      return;
    }

    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      console.log('Processing dropped audio file:', audioFile.name, audioFile.type);
      toast.info(`Processing ${audioFile.name}...`);
      await handleFileUpload(audioFile);
    } else {
      console.log('No audio files found in drop. File types:', files.map(f => f.type));
      toast.error('Please drop an audio file (MP3, WAV, M4A, etc.)');
    }
  }, [uploading, handleFileUpload]);

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
                     Supports MP3, WAV, MP4, M4A, AAC formats (max 100MB)
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
          {loading ? (
            <div className="text-center py-8">
              <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileAudio className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <p className="text-muted-foreground">Loading audio files...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="rounded-full bg-destructive/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileAudio className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-destructive mb-2">{error}</p>
              <Button 
                variant="outline" 
                onClick={loadAudioFiles}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : audioFiles.length === 0 ? (
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
            <div>
              {/* Search and Filter Controls */}
              <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audio files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowUploadForm(!showUploadForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Upload
              </Button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="mb-6">
                <AudioUpload
                  meditationContentId="temp-id"
                  onUploadComplete={(data) => {
                    setShowUploadForm(false);
                    loadAudioFiles();
                    toast.success('Audio uploaded successfully!');
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              {audioFiles
                .filter(file => 
                  !searchTerm || 
                  file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  file.meditation_content?.title?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .filter(file => 
                  filterStatus === 'all' || file.upload_status === filterStatus
                )
                .map((file) => (
                <div key={file.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileAudio className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{file.file_name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <Badge 
                            variant={file.upload_status === 'completed' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {file.file_type.toUpperCase()} • {file.upload_status}
                          </Badge>
                          <span>{formatFileSize(file.file_size)}</span>
                          {file.duration_seconds && (
                            <span>{Math.floor(file.duration_seconds / 60)}:{(file.duration_seconds % 60).toString().padStart(2, '0')}</span>
                          )}
                          <span>Uploaded {formatDate(file.created_at)}</span>
                        </div>
                        {file.meditation_content && (
                          <p className="text-xs text-primary mt-1">
                            Linked to: {file.meditation_content.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!file.meditation_content && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateContent(file)}
                          className="text-primary hover:text-primary"
                          title="Create meditation content from this audio"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Content
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAudioFile(file)}
                        className="text-destructive hover:text-destructive"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Audio Player */}
                  {file.upload_status === 'completed' && (
                    <RobustAudioPlayer
                      audioFile={{
                        id: file.id,
                        file_name: file.file_name,
                        audio_url: file.file_path,
                        title: file.meditation_content?.title || file.file_name
                      }}
                      showDownload={true}
                      className="mt-3"
                    />
                  )}
                </div>
              ))}
            </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioFileManager;
