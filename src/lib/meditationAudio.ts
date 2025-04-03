
import { supabase } from './supabase';
import { toast } from 'sonner';

const BUCKET_NAME = 'meditation-audio';

/**
 * Initializes the meditation audio bucket in Supabase if it doesn't exist
 */
export const initMeditationAudioBucket = async () => {
  try {
    // Get existing buckets
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking for meditation audio bucket:', getBucketsError);
      return false;
    }
    
    // Check if our bucket already exists
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 50000000, // 50MB limit
      });
      
      if (createBucketError) {
        console.error('Error creating meditation audio bucket:', createBucketError);
        return false;
      }
      
      console.log('Meditation audio bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error initializing meditation audio bucket:', error);
    return false;
  }
};

/**
 * Uploads an audio file to the Supabase storage bucket
 */
export const uploadMeditationAudio = async (file: File, fileName: string): Promise<string | null> => {
  try {
    // Ensure the bucket exists
    await initMeditationAudioBucket();
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      toast.error('Failed to upload audio file');
      console.error('Error uploading audio file:', error);
      return null;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    toast.success('Audio file uploaded successfully');
    return publicUrlData.publicUrl;
  } catch (error) {
    toast.error('Something went wrong with the upload');
    console.error('Unexpected error uploading audio file:', error);
    return null;
  }
};

/**
 * Fetches the public URL for a meditation audio file
 */
export const getMeditationAudioUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Deletes a meditation audio file from storage
 */
export const deleteMeditationAudio = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      toast.error('Failed to delete audio file');
      console.error('Error deleting audio file:', error);
      return false;
    }
    
    toast.success('Audio file deleted successfully');
    return true;
  } catch (error) {
    toast.error('Something went wrong while deleting the file');
    console.error('Unexpected error deleting audio file:', error);
    return false;
  }
};
