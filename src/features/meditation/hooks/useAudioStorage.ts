import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AudioFile } from '../types/meditation.types';

export const useAudioStorage = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.storage
        .from('meditation-audio')
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) throw error;

      const rawAudioFiles = await Promise.all(
        (data || []).map(async (file) => {
          const { data: signedUrl } = await supabase.storage
            .from('meditation-audio')
            .createSignedUrl(file.name, 60 * 60 * 24); // 24 hours

          return {
            name: file.name,
            url: signedUrl?.signedUrl || '',
            size: file.metadata?.size || 0
          };
        })
      );

      setAudioFiles(rawAudioFiles.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: file.url,
        size: file.size,
        type: 'audio/unknown',
        uploadDate: new Date(),
        isProcessing: false
      })));
      console.log('✅ Loaded audio files from Supabase:', rawAudioFiles.length);
    } catch (error) {
      console.error('Failed to fetch audio files:', error);
      const errorMessage = 'Failed to load audio files from storage';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // No external dependencies needed

  const uploadAudioFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('meditation-audio')
        .upload(fileName, file);

      if (error) throw error;

      toast.success('Audio file uploaded successfully');
      await fetchAudioFiles(); // Refresh the list
    } catch (error) {
      console.error('Failed to upload audio file:', error);
      const errorMessage = 'Failed to upload audio file';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAudioFiles]);

  useEffect(() => {
    fetchAudioFiles();
  }, [fetchAudioFiles]);

  return {
    audioFiles,
    loading,
    error,
    fetchAudioFiles,
    uploadAudioFile
  };
};