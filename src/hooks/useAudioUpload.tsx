import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AudioUploadProgress {
  progress: number;
  stage: 'uploading' | 'processing' | 'completed' | 'error';
}

interface AudioMetadata {
  duration: number;
  bitrate?: number;
  sampleRate?: number;
}

export const useAudioUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<AudioUploadProgress>({
    progress: 0,
    stage: 'uploading'
  });

  const uploadAudio = useCallback(async (
    file: File,
    meditationContentId: string,
    metadata?: {
      title?: string;
      description?: string;
    }
  ) => {
    if (!user) {
      toast.error('Please login to upload audio');
      return null;
    }

    // Validate file type - including MP4 support
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 
      'audio/aac', 'video/mp4', 'audio/x-m4a', 'audio/mp4a-latm'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type. Please use MP3, WAV, MP4, M4A, or AAC format.');
      return null;
    }

    // Validate file size (100MB limit)
    if (file.size > 104857600) {
      toast.error('File size too large. Maximum size is 100MB.');
      return null;
    }

    setIsUploading(true);
    setUploadProgress({ progress: 0, stage: 'uploading' });

    try {
      // Generate unique filename with user folder structure
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${user.id}/${meditationContentId}/${Date.now()}_${sanitizedName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meditation-audio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      setUploadProgress({ progress: 50, stage: 'processing' });

      // Get audio metadata
      const audioMetadata = await getAudioMetadata(file);

      // Save to database
      const { data: audioRecord, error: dbError } = await supabase
        .from('meditation_audio')
        .insert({
          meditation_content_id: meditationContentId,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: fileExt,
          duration_seconds: audioMetadata.duration,
          bitrate: audioMetadata.bitrate,
          sample_rate: audioMetadata.sampleRate,
          upload_status: 'completed',
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Clean up uploaded file
        await supabase.storage
          .from('meditation-audio')
          .remove([uploadData.path]);
        throw dbError;
      }

      setUploadProgress({ progress: 100, stage: 'completed' });
      toast.success('Audio uploaded successfully!');

      return audioRecord;

    } catch (error: any) {
      console.error('Audio upload error:', error);
      setUploadProgress({ progress: 0, stage: 'error' });
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const deleteAudio = useCallback(async (audioId: string, filePath: string) => {
    try {
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('meditation-audio')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('meditation_audio')
        .delete()
        .eq('id', audioId);

      if (dbError) {
        console.error('Database delete error:', dbError);
        throw dbError;
      }

      toast.success('Audio deleted successfully!');
      return true;

    } catch (error: any) {
      console.error('Audio delete error:', error);
      toast.error(`Delete failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, []);

  const getAudioUrl = useCallback(async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('meditation-audio')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error generating audio URL:', error);
      return null;
    }
  }, []);

  return {
    uploadAudio,
    deleteAudio,
    getAudioUrl,
    isUploading,
    uploadProgress
  };
};

// Helper function to extract audio metadata
const getAudioMetadata = (file: File): Promise<AudioMetadata> => {
  return new Promise((resolve) => {
    // Create audio element for MP3, M4A, AAC
    if (file.type.includes('audio/') && !file.type.includes('video/')) {
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve({
          duration: Math.round(audio.duration || 0),
          bitrate: undefined, // Would need additional library for precise values
          sampleRate: undefined
        });
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve({ duration: 0 });
      });
      
      audio.src = url;
    } 
    // Handle MP4 video files (audio extraction)
    else if (file.type.includes('video/mp4') || file.type.includes('audio/mp4')) {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve({
          duration: Math.round(video.duration || 0),
          bitrate: undefined,
          sampleRate: undefined
        });
      });
      
      video.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve({ duration: 0 });
      });
      
      video.src = url;
    } else {
      // Fallback for unknown types
      resolve({ duration: 0 });
    }
  });
};