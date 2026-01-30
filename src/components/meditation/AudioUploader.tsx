
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, RefreshCw, CheckCircle, XCircle, AlertCircle, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AudioUploaderProps {
  onAudioUploaded: (audioUrl: string) => void;
  existingAudioUrl?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  onAudioUploaded, 
  existingAudioUrl 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(!!existingAudioUrl);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'anonymous' | 'error'>('checking');
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    error?: string;
    details?: any;
    publicUrl?: string;
  } | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Auth check error:', error);
          setAuthStatus('error');
        } else if (user) {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('anonymous');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthStatus('error');
      }
    };
    
    checkAuth();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Enhanced file validation
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/mp4'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload an audio file (MP3, WAV, M4A, OGG).');
        setUploadResult({
          success: false,
          error: 'Invalid file type. Please upload an audio file (MP3, WAV, M4A, OGG).'
        });
        return;
      }

      // File size validation (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast.error('File too large. Please upload a file smaller than 50MB.');
        setUploadResult({
          success: false,
          error: 'File too large. Please upload a file smaller than 50MB.'
        });
        return;
      }
      
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadResult(null);
    }
  };

  const uploadAudioFile = async (file: File) => {
    try {
      console.log('Starting file upload:', file.name, file.type, file.size);
      
      // Generate a unique filename
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `user_${timestamp}_${sanitizedFileName}`;
      
      console.log('Uploading with filename:', uniqueFileName);
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meditation-audio')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log('File uploaded successfully:', uploadData);
      
      // Generate signed URL (bucket is private for security)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('meditation-audio')
        .createSignedUrl(uniqueFileName, 3600); // 1 hour expiry
      
      if (signedUrlError) {
        throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
      }
      
      const signedUrl = signedUrlData.signedUrl;
      console.log('Generated signed URL:', signedUrl);
      
      return {
        success: true,
        publicUrl: signedUrl,
        message: 'File uploaded successfully!'
      };
      
    } catch (error: any) {
      console.error('Upload process failed:', error);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);
    
    const result = await uploadAudioFile(selectedFile);
    
    setUploadResult(result);
    setIsUploading(false);
    
    if (result.success) {
      setUploadSuccess(true);
      onAudioUploaded(result.publicUrl!);
      toast.success(result.message);
    } else {
      toast.error(`Upload failed: ${result.error}`);
    }
  };

  const renderAuthStatus = () => {
    switch (authStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Checking authentication...
          </div>
        );
      case 'authenticated':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <UserCheck className="h-4 w-4" />
            Authenticated - Ready to upload
          </div>
        );
      case 'anonymous':
        return (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            Not authenticated - Upload may fail
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            Authentication error
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderAuthStatus()}
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="max-w-xs"
        />
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          variant="outline"
        >
          {isUploading ? (
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
      
      {uploadResult && (
        <div className={`rounded-md p-3 ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {uploadResult.success ? (
            <div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle className="h-4 w-4" />
                Upload successful!
              </div>
              {uploadResult.publicUrl && (
                <p className="text-sm text-green-600 mt-1 break-all">
                  URL: {uploadResult.publicUrl}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-red-700 font-medium">
                <XCircle className="h-4 w-4" />
                Upload failed: {uploadResult.error}
              </div>
              {uploadResult.details && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">Technical Details</summary>
                  <pre className="text-xs text-red-500 mt-1 overflow-auto">
                    {JSON.stringify(uploadResult.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
      
      {(uploadSuccess || existingAudioUrl) && !uploadResult && (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="mr-2 h-4 w-4" />
          {selectedFile ? 'File uploaded successfully' : 'Audio file already uploaded'}
        </div>
      )}
      
      {existingAudioUrl && (
        <div className="rounded-md bg-muted p-2 overflow-hidden text-sm">
          <p className="font-medium">Current audio file:</p>
          <a 
            href={existingAudioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block"
          >
            {existingAudioUrl.split('/').pop()}
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
