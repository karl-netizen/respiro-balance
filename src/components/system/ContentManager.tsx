
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Upload, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  instructor: string;
  audio_url?: string;
  image_url?: string;
  premium_tier: string;
  tags: string[];
  is_active: boolean;
}

export const ContentManager: React.FC = () => {
  const [content, setContent] = useState<MeditationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<MeditationContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async (formData: FormData) => {
    try {
      const contentData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        duration: parseInt(formData.get('duration') as string) * 60, // Convert minutes to seconds
        category: formData.get('category') as string,
        difficulty: formData.get('difficulty') as string,
        instructor: formData.get('instructor') as string,
        premium_tier: formData.get('premium_tier') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        is_active: formData.get('is_active') === 'true',
      };

      let error;
      if (editingContent) {
        ({ error } = await supabase
          .from('meditation_content')
          .update(contentData)
          .eq('id', editingContent.id));
      } else {
        ({ error } = await supabase
          .from('meditation_content')
          .insert([contentData]));
      }

      if (error) throw error;

      toast.success(editingContent ? 'Content updated!' : 'Content created!');
      setIsDialogOpen(false);
      setEditingContent(null);
      loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('meditation_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Content deleted!');
      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'premium-pro': return 'bg-purple-100 text-purple-800';
      case 'premium-plus': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage meditation sessions, audio content, and library organization
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingContent(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingContent ? 'Edit Content' : 'Add New Content'}
                  </DialogTitle>
                  <DialogDescription>
                    Create or edit meditation session content
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSaveContent(formData);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingContent?.title}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        name="instructor"
                        defaultValue={editingContent?.instructor}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingContent?.description}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        defaultValue={editingContent ? Math.floor(editingContent.duration / 60) : ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue={editingContent?.category}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="focus">Focus</SelectItem>
                          <SelectItem value="sleep">Sleep</SelectItem>
                          <SelectItem value="stress">Stress Relief</SelectItem>
                          <SelectItem value="breathing">Breathing</SelectItem>
                          <SelectItem value="body-scan">Body Scan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select name="difficulty" defaultValue={editingContent?.difficulty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="premium_tier">Premium Tier</Label>
                      <Select name="premium_tier" defaultValue={editingContent?.premium_tier}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="premium-pro">Premium Pro</SelectItem>
                          <SelectItem value="premium-plus">Premium Plus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="is_active">Status</Label>
                      <Select name="is_active" defaultValue={editingContent?.is_active ? 'true' : 'false'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      defaultValue={editingContent?.tags?.join(', ')}
                      placeholder="meditation, relaxation, morning"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingContent ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading content...</div>
          ) : (
            <div className="space-y-4">
              {content.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge className={getTierColor(item.premium_tier)}>
                          {item.premium_tier}
                        </Badge>
                        {!item.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.instructor}</span>
                        <span>{formatDuration(item.duration)}</span>
                        <span>{item.category}</span>
                        <span>{item.difficulty}</span>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingContent(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {content.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No content available. Create your first meditation session!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
