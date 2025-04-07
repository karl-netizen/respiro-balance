
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const AUDIO_BUCKET_NAME = 'meditation-audio';

const AudioFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  
  // Only allow admins to upload files
  const isAdmin = user?.app_metadata?.role === 'admin';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('audio/')) {
        toast.error('Please select an audio file (MP3, WAV, etc.)');
        return;
      }
      
      // Validate file size (20MB max)
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error('File size exceeds 20MB limit');
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !isAdmin) return;
    
    try {
      setUploading(true);
      setProgress(0);
      
      // Create a safe filename
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${file.name.split('.')[0].replace(/\W+/g, '-').toLowerCase()}-${timestamp}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { error } = await supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .getPublicUrl(fileName);
        
      toast.success('Audio file uploaded successfully', {
        description: `File name: ${fileName}`
      });
      
      // Clear the file input
      setFile(null);
      
      // Simulate progress for UX (since we can't track real progress)
      let simulatedProgress = 0;
      const interval = setInterval(() => {
        simulatedProgress += 10;
        setProgress(Math.min(simulatedProgress, 100));
        if (simulatedProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
      
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message
      });
      console.error('Error uploading audio file:', error);
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };
  
  if (!isAdmin) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Meditation Audio</CardTitle>
        <CardDescription>Add new audio files to your meditation library</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input 
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          
          {uploading && progress > 0 && (
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {progress}% uploaded
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AudioFileUploader;
