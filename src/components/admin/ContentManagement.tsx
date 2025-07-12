import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Edit,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';

interface ContentUploadForm {
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty_level: string;
  subscription_tier: string;
  instructor: string;
  tags: string;
  background_music_type: string;
  transcript: string;
}

export const ContentManagement = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<ContentUploadForm>({
    title: '',
    description: '',
    duration: 0,
    category: 'Mindfulness',
    difficulty_level: 'beginner',
    subscription_tier: 'free',
    instructor: '',
    tags: '',
    background_music_type: '',
    transcript: ''
  });

  const categories = [
    'Stress Relief', 'Sleep', 'Focus', 'Breathing', 
    'Mindfulness', 'Body Scan', 'Loving Kindness', 'Energy'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Auto-detect duration if possible
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.src = url;
      
      audio.addEventListener('loadedmetadata', () => {
        setFormData(prev => ({ ...prev, duration: Math.round(audio.duration) }));
        URL.revokeObjectURL(url);
      });
    }
  };

  const uploadAudioFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `content/${fileName}`;

    const { data, error } = await supabase.storage
      .from('meditation-audio')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('meditation-audio')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to upload content');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select an audio file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload audio file
      toast.info('Uploading audio file...');
      const audioUrl = await uploadAudioFile(selectedFile);
      
      // Save content metadata
      toast.info('Saving content details...');
      const { error: insertError } = await supabase
        .from('meditation_content')
        .insert({
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          category: formData.category,
          difficulty_level: formData.difficulty_level,
          subscription_tier: formData.subscription_tier,
          audio_file_url: audioUrl,
          audio_file_path: selectedFile.name,
          instructor: formData.instructor,
          background_music_type: formData.background_music_type,
          transcript: formData.transcript,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_featured: false,
          is_active: true
        });

      if (insertError) throw insertError;

      toast.success('Content uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: 0,
        category: 'Mindfulness',
        difficulty_level: 'beginner',
        subscription_tier: 'free',
        instructor: '',
        tags: '',
        background_music_type: '',
        transcript: ''
      });
      setSelectedFile(null);
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload content. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Management</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload and manage meditation audio content for your library
        </p>
      </div>

      {/* Content Creation Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Content Creation Guide
          </CardTitle>
          <CardDescription>
            Quick guide for creating high-quality meditation content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Audio Requirements:</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Format: MP3, WAV, or AAC</li>
                <li>• Quality: 44.1kHz, 16-bit minimum</li>
                <li>• Size: Maximum 100MB</li>
                <li>• Length: 5-30 minutes recommended</li>
                <li>• Volume: Consistent levels throughout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Content Guidelines:</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Clear, calm speaking voice</li>
                <li>• Appropriate pacing and pauses</li>
                <li>• Optional background music</li>
                <li>• Include detailed description</li>
                <li>• Add relevant tags for discovery</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Meditation Scripts</CardTitle>
          <CardDescription>
            Use these scripts as templates for creating your own meditation content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                5-Minute Stress Relief Script
              </summary>
              <div className="p-4 pt-0 text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Opening (30 seconds):</strong></p>
                <p>"Welcome to this 5-minute stress relief meditation. Find a comfortable position, either sitting or lying down. Allow your eyes to gently close or soften your gaze downward."</p>
                
                <p><strong>Body Awareness (1 minute):</strong></p>
                <p>"Begin by noticing your body exactly as it is right now. Feel the weight of your body supported by whatever you're sitting or lying on. Notice any areas of tension or tightness, without trying to change anything."</p>
                
                <p><strong>Breathing (2 minutes):</strong></p>
                <p>"Now bring your attention to your breath. Notice the natural rhythm of your breathing. On your next inhale, breathe in calm and peace. On your exhale, let go of any stress or tension you're holding..."</p>
                
                <p><strong>Release & Closing (1.5 minutes):</strong></p>
                <p>"As we prepare to end this practice, take a moment to notice how you feel now compared to when we began. When you're ready, gently open your eyes and carry this sense of calm with you."</p>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                10-Minute Bedtime Meditation Script
              </summary>
              <div className="p-4 pt-0 text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Opening (1 minute):</strong></p>
                <p>"Welcome to this bedtime meditation designed to help you transition into peaceful sleep. Make yourself comfortable in your bed, allowing your body to fully relax into the mattress."</p>
                
                <p><strong>Progressive Relaxation (4 minutes):</strong></p>
                <p>"Starting with your toes, consciously relax each part of your body. Feel your toes becoming heavy and relaxed. Allow this relaxation to move up through your feet, ankles, calves..."</p>
                
                <p><strong>Gentle Breathing (3 minutes):</strong></p>
                <p>"Now focus on your breath becoming slower and deeper. With each exhale, feel yourself sinking deeper into comfort and relaxation..."</p>
                
                <p><strong>Sleep Transition (2 minutes):</strong></p>
                <p>"As your body becomes completely relaxed and your mind becomes quiet, allow yourself to drift naturally toward sleep. Trust that your body knows how to rest and restore itself."</p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
          <CardDescription>
            Add new meditation sessions to your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning Energy Meditation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="e.g., Sarah Chen"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this meditation covers and its benefits..."
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Subscription Tier</Label>
                <select
                  id="tier"
                  value={formData.subscription_tier}
                  onChange={(e) => setFormData(prev => ({ ...prev, subscription_tier: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="premium_pro">Premium Pro</option>
                  <option value="premium_plus">Premium Plus</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="600"
                  min="30"
                  max="3600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="stress, relaxation, breathing, beginner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio">Audio File *</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Click to select audio file or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MP3, WAV, or AAC • Max 100MB
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Content'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Content Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Content Sourcing Options</CardTitle>
          <CardDescription>
            Recommendations for obtaining high-quality meditation audio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Professional Recording</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hire voice actors or meditation teachers to record custom scripts using professional equipment.
              </p>
              <Badge variant="outline">High Quality</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Royalty-Free Libraries</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                License pre-recorded meditation content from providers like AudioJungle, Pond5, or meditation-specific libraries.
              </p>
              <Badge variant="outline">Quick Setup</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">AI-Generated Audio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use AI voice synthesis tools like ElevenLabs or Murf to create consistent, high-quality narration from scripts.
              </p>
              <Badge variant="outline">Cost Effective</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};