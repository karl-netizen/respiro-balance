import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedAudioPlayer } from '@/components/meditation/EnhancedAudioPlayer';
import { 
  Music, 
  Search, 
  BarChart,
  Clock,
  HardDrive,
  PlayCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAudioUpload } from '@/hooks/useAudioUpload';
import { toast } from 'sonner';

interface AudioStats {
  totalFiles: number;
  totalSize: number;
  totalDuration: number;
  completedUploads: number;
  pendingUploads: number;
  failedUploads: number;
  mp4Files: number;
  mp3Files: number;
  otherFormats: number;
}

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

export const AudioManagementDashboard: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [audioStats, setAudioStats] = useState<AudioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'mp4' | 'mp3' | 'other'>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { deleteAudio } = useAudioUpload();

  useEffect(() => {
    loadAudioData();
  }, []);

  const loadAudioData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meditation_audio')
        .select(`
          *,
          meditation_content (
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAudioFiles(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading audio data:', error);
      toast.error('Failed to load audio data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (files: AudioFile[]) => {
    const stats: AudioStats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.file_size, 0),
      totalDuration: files.reduce((sum, file) => sum + (file.duration_seconds || 0), 0),
      completedUploads: files.filter(f => f.upload_status === 'completed').length,
      pendingUploads: files.filter(f => f.upload_status === 'pending').length,
      failedUploads: files.filter(f => f.upload_status === 'failed').length,
      mp4Files: files.filter(f => f.file_type === 'mp4').length,
      mp3Files: files.filter(f => f.file_type === 'mp3').length,
      otherFormats: files.filter(f => !['mp4', 'mp3'].includes(f.file_type)).length
    };
    setAudioStats(stats);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    const confirmDelete = confirm(`Delete ${selectedFiles.length} selected files?`);
    if (!confirmDelete) return;

    const deletePromises = selectedFiles.map(async (fileId) => {
      const file = audioFiles.find(f => f.id === fileId);
      if (file) {
        return deleteAudio(file.id, file.file_path);
      }
      return false;
    });

    try {
      await Promise.all(deletePromises);
      setSelectedFiles([]);
      await loadAudioData();
      toast.success(`Deleted ${selectedFiles.length} files successfully`);
    } catch (error) {
      toast.error('Some files failed to delete');
    }
  };

  const filteredFiles = audioFiles
    .filter(file => {
      if (filterStatus !== 'all' && file.upload_status !== filterStatus) return false;
      if (filterType !== 'all') {
        if (filterType === 'mp4' && file.file_type !== 'mp4') return false;
        if (filterType === 'mp3' && file.file_type !== 'mp3') return false;
        if (filterType === 'other' && ['mp4', 'mp3'].includes(file.file_type)) return false;
      }
      if (searchTerm && !file.file_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Music className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
          <p>Loading audio management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {audioStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{audioStats.totalFiles}</p>
                </div>
                <Music className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Storage</p>
                  <p className="text-2xl font-bold">{formatFileSize(audioStats.totalSize)}</p>
                </div>
                <HardDrive className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                  <p className="text-2xl font-bold">{formatDuration(audioStats.totalDuration)}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MP4 Files</p>
                  <p className="text-2xl font-bold">{audioStats.mp4Files}</p>
                  <p className="text-xs text-muted-foreground">
                    {audioStats.mp3Files} MP3 • {audioStats.otherFormats} Other
                  </p>
                </div>
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Status Overview */}
      {audioStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Upload Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Completed</p>
                  <p className="text-sm text-green-700">{audioStats.completedUploads} files</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">Pending</p>
                  <p className="text-sm text-yellow-700">{audioStats.pendingUploads} files</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Failed</p>
                  <p className="text-sm text-red-700">{audioStats.failedUploads} files</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Audio File Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="mp4">MP4 Files</option>
                <option value="mp3">MP3 Files</option>
                <option value="other">Other Formats</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedFiles.length} files selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          )}

          {/* File List */}
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles([...selectedFiles, file.id]);
                        } else {
                          setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                        }
                      }}
                      className="rounded"
                    />
                    <div>
                      <h4 className="font-medium">{file.file_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant={file.upload_status === 'completed' ? 'default' : 'secondary'}>
                          {file.file_type.toUpperCase()} • {file.upload_status}
                        </Badge>
                        <span>{formatFileSize(file.file_size)}</span>
                        {file.duration_seconds && (
                          <span>{formatDuration(file.duration_seconds)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Player for completed files */}
                {file.upload_status === 'completed' && (
                  <EnhancedAudioPlayer
                    audioPath={file.file_path}
                    title={file.file_name}
                    duration={file.duration_seconds}
                    showDownload={true}
                  />
                )}
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8">
              <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No audio files found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};